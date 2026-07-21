# GrantPilot

GrantPilot is an AI CFO for scientific R&D portfolios. It helps research teams model real lab costs, identify staffing and resource bottlenecks, optimize project portfolios, stress-test runway under uncertainty, and generate board-ready decision memos.

## Hackathon Fit

OpenAI Build Week track: Work and Productivity

Project title: GrantPilot: AI CFO for Scientific R&D Portfolios

Primary customer: seed-stage biotech companies, translational research labs, university spinouts, and grant-funded scientific teams with limited runway and too many competing projects.

## What The MVP Does

- Models real lab costs across manpower, consumables, core facility usage, equipment, animal/sample work, compute/data, outsourcing/CRO, overhead, and fixed lab operations.
- Computes skill-based FTE constraints for PI time, wet-lab scientists, research associates, animal technicians, computational biology, lab management, and clinical coordination.
- Uses a month-by-month experiment phase plan rather than treating each project as one flat budget number.
- Adds resource queue premiums when CRO, sequencing, microscopy, or animal facility demand exceeds available capacity.
- Lets users edit key scenario assumptions: cash on hand, operating reserve, wet-lab FTE, CRO cost, and animal-validation scope.
- Recommends fund / pause / stop actions across six R&D projects.
- Compares Survival Mode, Balanced Portfolio, and Breakthrough Bet strategies.
- Runs a deterministic cash runway comparison.
- Runs a phase-based Monte Carlo stress test for cost overrun, duration delay, milestone failure, grant reimbursement delay, and resource bottlenecks.
- Shows rerun-based sensitivity analysis for the biggest drivers of financing reserve breach risk.
- Generates a board-style CFO memo from structured model outputs, with optional GPT-5.6 runtime generation.
- Includes a Model Audit panel explaining what is computed before GPT writes.

## Run Locally

Open `index.html` in a browser, or run the local preview server:

```bash
node server.js
```

Then open:

```text
http://127.0.0.1:8780/
```

No package install is required for the current static MVP.

## Enable GPT-5.6 Runtime

The app runs without an API key. Without a key, Board Meeting Mode and Ask GrantPilot use deterministic local fallback text.

To enable GPT-5.6 for memo and answer generation:

```bash
$env:OPENAI_API_KEY="your_api_key_here"
node server.js
```

Optional model override:

```bash
$env:OPENAI_MODEL="gpt-5.6-terra"
node server.js
```

Default model: `gpt-5.6`.

Fallback models can be configured if your API account does not have access to the default model:

```bash
$env:OPENAI_FALLBACK_MODELS="gpt-5.6-terra,gpt-5.1"
node server.js
```

The server exposes:

- `GET /api/gpt/status` to show whether GPT runtime is configured.
- `POST /api/gpt` to generate Board Meeting Mode memos and Ask GrantPilot answers from structured model outputs.

## Model Architecture

GrantPilot should not let the LLM guess the financial decision directly.

The intended architecture is:

1. Structured lab and project data is entered or loaded.
2. Deterministic phase-based cashflow, FTE, resource capacity, and constraint calculations run first.
3. Monte Carlo simulation and sensitivity analysis run next.
4. GPT-5.6 explains the quantitative results and generates CFO-style recommendations and board-ready memos.
5. Ask GrantPilot answers scenario questions using computed model outputs.

Current MVP status:

- The deterministic phase model and Monte Carlo models run locally in `app.js`.
- Board Meeting Mode and Ask GrantPilot use GPT-5.6 through `server.js` when `OPENAI_API_KEY` is configured.
- If GPT runtime is not configured, the memo and Ask GrantPilot responses fall back to local deterministic text.
- GPT-5.6 receives structured outputs only; it does not choose the portfolio.

Risk definition:

- Financing reserve breach risk is the probability that cash falls below the USD 420k operating reserve within 24 months.
- GrantPilot stress-tests assumptions; it does not claim to predict scientific success.

## Codex Collaboration Notes

Codex was used to:

- Translate the OpenAI Build Week rules and GrantPilot requirements into a build checklist.
- Scope the product around a realistic scientific R&D decision workflow.
- Implement the static MVP app structure, dashboard, local portfolio model, Monte Carlo simulation, sensitivity analysis, and board memo surface.
- Keep the implementation aligned with `GRANTPILOT_REQUIREMENTS.md`.

Human product decisions:

- The product should focus on capital allocation, not lab accounting.
- The target user is a PI, biotech founder, head of R&D, lab manager, fractional CFO, or grant strategy lead.
- The main demo scenario is a translational biotech / university spinout with USD 1.2M cash, 7 people, and 6 R&D projects.
- The core recommendation should be fund 3, pause 2, and stop 1 when the lab is overcommitted.

## Compliance Checklist

See `GRANTPILOT_REQUIREMENTS.md` for the full project and hackathon checklist.

See `SUBMISSION_NOTES.md` for judge testing notes and `DEMO_SCRIPT.md` for the 3-minute video outline.

Before submission, add:

- A public or judge-accessible repository URL.
- A demo video under 3 minutes with audio.
- Clear explanation of Codex and GPT-5.6 usage.
- The main `/feedback` Codex Session ID.
- Setup and testing instructions for judges.
