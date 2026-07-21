# GrantPilot Submission Notes

Project title: GrantPilot: AI CFO for Scientific R&D Portfolios

Track: Work and Productivity

## What GrantPilot Does

GrantPilot helps scientific R&D teams decide what to fund, what to pause, what to stop, and how long their capital will last.

The demo scenario is a translational biotech / university spinout with USD 1.2M cash, 7 people, and 6 competing R&D projects.

Default result: the current all-project plan burns about USD 137k per month and reaches about 8.8 months of runway. The GrantPilot balanced plan burns about USD 78k per month and reaches about 15.4 months of runway while preserving a strong milestone path.

## How To Run

No install is required for the static fallback demo.

```bash
node server.js
```

Open:

```text
http://127.0.0.1:8780/
```

Optional GPT-5.6 runtime:

```powershell
$env:OPENAI_API_KEY="your_api_key_here"
node server.js
```

Default model: `gpt-5.6`

## What Is Computed Before GPT

GrantPilot does not ask GPT to choose the portfolio.

The app first computes:

- Month-by-month lab cashflow
- Skill-based FTE constraints
- Core facility, CRO, sequencing, microscopy, and animal facility bottlenecks
- Fund / pause / stop portfolio optimization
- Monte Carlo financing reserve breach risk
- Rerun-based sensitivity analysis

GPT-5.6 is used only after those calculations to:

- Draft Board Meeting Mode memos
- Answer Ask GrantPilot scenario questions
- Translate structured results into CFO-style recommendations

## Codex Usage

Codex was used to:

- Convert the hackathon rules and project requirements into an implementation checklist
- Build the static app, local model, optimizer, Monte Carlo simulator, sensitivity analysis, and memo surfaces
- Add GPT-5.6 runtime integration through a local server endpoint
- Refine the product based on simulated judge, scientist, and statistician review
- Keep the implementation aligned with `GRANTPILOT_REQUIREMENTS.md`

Human decisions:

- Product positioning as capital allocation software, not lab accounting
- Target customer: seed-stage biotech and translational research teams
- Default scenario and fund / pause / stop narrative
- Risk wording: stress-test reserve breach risk, not prediction of scientific success

## Judge Test Path

1. Open the app.
2. Confirm the current all-project plan shows runway around 8.8 months.
3. Confirm Balanced Portfolio recommends funding assay automation, AI drug screening, and pharma partner pilot.
4. Adjust cash down to trigger Emergency Bridge Plan.
5. Review Model Audit.
6. If API key is configured, click Generate GPT memo and Ask GrantPilot.

## Risk Definition

Financing reserve breach risk is the probability that cash falls below the USD 420k operating reserve within 24 months under stated Monte Carlo assumptions.

GrantPilot stress-tests assumptions. It does not claim to predict scientific success.

## Devpost Fields To Supply Outside The Repo

- Public demo URL.
- Public YouTube video URL for the final video.
- Main Codex `/feedback` Session ID.
- Track/category: Work and Productivity.
- Repository URL: https://github.com/Jiaye1998/grantpilot
