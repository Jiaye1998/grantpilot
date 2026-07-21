# GrantPilot Judge Testing Guide

## Project

GrantPilot: AI CFO for Scientific R&D Portfolios

Track: Work and Productivity

## Quick Start

No dependency install is required. If the Devpost submission includes a hosted URL, open that first. If the hosted version is static, the deterministic model works directly in the browser and the optional GPT runtime can be tested locally with `server.js`.

Run:

```bash
node server.js
```

Open:

```text
http://127.0.0.1:8780/
```

If port 8780 is already in use, run:

```bash
$env:PORT="8781"
node server.js
```

Then open:

```text
http://127.0.0.1:8781/
```

## Static Demo

The app works without an OpenAI API key.

Without an API key:

1. The portfolio model still runs locally.
2. Monte Carlo simulation still runs locally.
3. Sensitivity analysis still runs locally.
4. Board Meeting Mode and Ask GrantPilot use deterministic fallback text.

This fallback is intentional so judges can test the product even without credentials.

## Expected Baseline Results

The default scenario should show approximately:

1. Current plan burn: USD 137k per month.
2. Current plan runway: 8.8 months.
3. GrantPilot balanced plan burn: USD 78k per month.
4. GrantPilot balanced plan runway: 15.4 months.
5. Reserve breach risk improves from roughly 85% to roughly 42% under stated Monte Carlo assumptions.

Small differences can occur if scenario controls are changed.

## Optional GPT Runtime

To test GPT generated memos and answers, set:

```powershell
$env:OPENAI_API_KEY="your_api_key_here"
node server.js
```

Optional model override:

```powershell
$env:OPENAI_MODEL="gpt-5.6"
node server.js
```

The app calls:

```text
POST /api/gpt
```

GPT receives structured model outputs only. It does not choose the portfolio.

## Suggested Judge Walkthrough

### 1. Start at the first screen

Look for the core decision:

```text
Stop funding everything. Fund the science that survives the runway.
```

The default scenario represents a small translational research team with USD 1.2M cash, 7 people, and 6 competing R&D projects.

### 2. Review current plan versus GrantPilot plan

Confirm that the current all project plan has short runway and high reserve breach risk.

Confirm that the GrantPilot plan extends runway while preserving a major milestone path.

### 3. Inspect the optimizer

Use the strategy selector:

1. Survival.
2. Balanced.
3. Breakthrough.

The Balanced Portfolio should recommend:

1. Fund assay automation and QC.
2. Fund AI drug screening.
3. Fund pharma partner translational pilot.
4. Pause cancer biomarker discovery.
5. Pause grant dependent neuroscience pilot.
6. Stop premature animal validation.

### 4. Stress test the scenario

Adjust the scenario inputs:

1. Cash on hand.
2. Operating reserve.
3. Wet lab scientist capacity.
4. CRO cost.
5. Animal validation scope.

Lowering available cash should make the product more conservative and can trigger an Emergency Bridge Plan.

### 5. Review real lab constraints

Check these sections:

1. Cost categories in the selected plan.
2. Capacity and bottlenecks.
3. Six R&D bets with real execution constraints.
4. What drives portfolio risk.

These sections show that GrantPilot is modeling more than a simple budget table.

### 6. Review Model Audit

The Model Audit panel explains what is computed before GPT writes.

The key boundary is:

```text
Deterministic calculations choose and stress test the portfolio first. GPT explains the computed outputs.
```

### 7. Test Ask GrantPilot

Try one of these questions:

```text
Can we keep the animal study and still reach 12 months of runway?
```

```text
What should I tell the board?
```

If an API key is configured, GPT generates the answer from structured model outputs. Otherwise, the local fallback answer appears.

### 8. Test Board Meeting Mode

Click:

```text
Generate GPT memo
```

With an API key, GPT drafts a board ready memo from the computed model outputs.

Without an API key, the deterministic fallback memo remains available.

## What To Look For

GrantPilot is strongest when evaluated as a decision workflow.

The important product claims are:

1. It helps research teams decide fund, pause, and stop.
2. It combines scientific project logic with finance style portfolio allocation.
3. It models real lab execution constraints, not only dollar budgets.
4. It stress tests uncertainty with Monte Carlo simulation.
5. It uses GPT for communication after the model computes the decision.

## Known Limitations

This is a hackathon MVP.

Current limitations:

1. Project data is embedded in the demo scenario.
2. No user authentication.
3. No persistent database.
4. No file import yet.
5. GitHub Pages static hosting can show the app, but cannot run the optional local GPT server endpoint.

The core purpose of the MVP is to demonstrate the product category and the decision flow.

## Compliance Notes

GrantPilot does not use third-party private data. The demo scenario is synthetic. The GPT memo endpoint receives structured model outputs from the app and is used for communication, not for choosing the portfolio. The project is available under the MIT License.
