const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = Number(process.env.PORT || 8780);
const host = process.env.HOST || "127.0.0.1";
const openaiModel = process.env.OPENAI_MODEL || "gpt-5.6";
const fallbackModels = (process.env.OPENAI_FALLBACK_MODELS || "gpt-5.6-terra,gpt-5.1")
  .split(",")
  .map((model) => model.trim())
  .filter(Boolean);

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml"
};

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const requested = decoded === "/" ? "/index.html" : decoded;
  const resolved = path.resolve(root, `.${requested}`);
  if (!resolved.startsWith(root)) return null;
  return resolved;
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        request.destroy();
        reject(new Error("Request body too large"));
      }
    });
    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    request.on("error", reject);
  });
}

function writeJson(response, status, payload) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

function extractResponseText(payload) {
  if (payload.output_text) return payload.output_text;
  const output = Array.isArray(payload.output) ? payload.output : [];
  return output
    .flatMap((item) => Array.isArray(item.content) ? item.content : [])
    .map((content) => content.text || content.output_text || "")
    .filter(Boolean)
    .join("\n")
    .trim();
}

function promptFor(payload) {
  const baseRules = [
    "You are GrantPilot, an AI CFO for scientific R&D portfolios.",
    "Use only the structured model outputs provided by the app.",
    "Do not choose or change fund/pause/stop decisions.",
    "Do not claim to predict scientific success.",
    "Use precise CFO language for PI, biotech founder, board, or grant committee decisions.",
    "Mention that reserve breach risk is a stress-test probability under stated assumptions."
  ].join(" ");

  if (payload.kind === "answer") {
    return `${baseRules}\nAnswer the user's scenario question in 1 concise paragraph. Be specific and include numbers from the context.`;
  }

  return `${baseRules}\nReturn a concise HTML fragment using only <h3>, <p>, <ul>, and <li>. Include Recommendation, Runway impact, Scientific tradeoff, Primary risks, and Next 30 days.`;
}

function callOpenAIModel(payload, model) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const error = new Error("OPENAI_API_KEY is not configured");
    error.status = 503;
    throw error;
  }

  const requestBody = JSON.stringify({
    model,
    input: [
      {
        role: "system",
        content: [{ type: "input_text", text: promptFor(payload) }]
      },
      {
        role: "user",
        content: [{ type: "input_text", text: JSON.stringify(payload, null, 2) }]
      }
    ],
    reasoning: { effort: "low" },
    text: { verbosity: "medium" },
    max_output_tokens: payload.kind === "answer" ? 450 : 900
  });

  return new Promise((resolve, reject) => {
    const request = https.request({
      hostname: "api.openai.com",
      path: "/v1/responses",
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody)
      }
    }, (apiResponse) => {
      let responseBody = "";
      apiResponse.on("data", (chunk) => {
        responseBody += chunk;
      });
      apiResponse.on("end", () => {
        let parsed;
        try {
          parsed = responseBody ? JSON.parse(responseBody) : {};
        } catch (error) {
          reject(new Error(`OpenAI response was not JSON: ${responseBody.slice(0, 200)}`));
          return;
        }
        if (apiResponse.statusCode < 200 || apiResponse.statusCode >= 300) {
          const error = new Error(parsed.error?.message || `OpenAI API returned ${apiResponse.statusCode}`);
          error.status = apiResponse.statusCode;
          error.model = model;
          reject(error);
          return;
        }
        resolve({
          text: extractResponseText(parsed),
          model: parsed.model || model,
          usage: parsed.usage || null
        });
      });
    });
    request.on("error", reject);
    request.write(requestBody);
    request.end();
  });
}

async function callOpenAI(payload) {
  const models = Array.from(new Set([openaiModel, ...fallbackModels]));
  let lastError = null;
  for (const model of models) {
    try {
      return await callOpenAIModel(payload, model);
    } catch (error) {
      lastError = error;
      const canFallback = error.status === 400 || error.status === 404;
      if (!canFallback) break;
    }
  }
  if (lastError) {
    lastError.message = `${lastError.message} Tried models: ${models.join(", ")}`;
  }
  throw lastError || new Error("OpenAI request failed");
}

const server = http.createServer((request, response) => {
  if (request.url === "/api/gpt/status" && request.method === "GET") {
    writeJson(response, 200, {
      configured: Boolean(process.env.OPENAI_API_KEY),
      model: openaiModel,
      fallbackModels
    });
    return;
  }

  if (request.url === "/api/gpt" && request.method === "POST") {
    readJsonBody(request)
      .then(callOpenAI)
      .then((payload) => writeJson(response, 200, payload))
      .catch((error) => writeJson(response, error.status || 500, {
        error: error.message,
        model: openaiModel
      }));
    return;
  }

  const filePath = safePath(request.url || "/");
  if (!filePath) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }
    const type = contentTypes[path.extname(filePath)] || "application/octet-stream";
    response.writeHead(200, { "Content-Type": type });
    response.end(data);
  });
});

server.listen(port, host, () => {
  console.log(`GrantPilot running at http://${host}:${port}/`);
});
