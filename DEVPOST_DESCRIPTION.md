# GrantPilot: AI CFO for Scientific R&D Portfolios

## Elevator Pitch

GrantPilot helps research teams decide what to fund, what to pause, what to stop, and how long their capital will last.

It brings portfolio thinking from finance into scientific R&D. Instead of treating every promising experiment as something that must continue, GrantPilot helps a lab protect runway, respect real lab capacity, and make hard tradeoffs before money runs out.

## Inspiration

This project is personal for us.

One of us comes from academic science. The other comes from statistics and finance. We kept seeing the same problem from two different worlds. In science, people are trained to chase promising ideas. In finance, people are trained to survive uncertainty by allocating scarce capital carefully.

Right now, research funding is hard to get. Grants are competitive. Investors are cautious. Labs and young biotech teams cannot afford to run every good idea at the same time. Every dollar, every scientist hour, every core facility slot, and every CRO quote matters.

GrantPilot came from a simple belief: scientific teams need a financial cockpit built for research reality. They need to know not only which projects are exciting, but which projects the lab can actually afford to execute.

## What It Does

GrantPilot models a small scientific R&D organization with limited cash, limited people, and multiple competing research projects.

The app helps users:

1. See how long the current all project plan will survive.
2. Model real lab costs such as manpower, consumables, equipment, core facilities, animal work, compute, and CRO outsourcing.
3. Detect capacity bottlenecks across wet lab scientists, research associates, computational biology, animal technicians, lab management, CRO load, sequencing, microscopy, and animal facility queues.
4. Compare portfolio strategies such as Survival, Balanced, and Breakthrough.
5. Recommend fund, pause, and stop decisions across research projects.
6. Run Monte Carlo stress tests for cost overruns, delays, milestone failure, and grant reimbursement timing.
7. Show sensitivity analysis so the team knows which assumptions matter most.
8. Generate board ready CFO memos and scenario answers from structured model outputs.

The default demo shows an overcommitted translational research team with USD 1.2M cash, 7 people, and 6 R&D bets. The current plan burns too fast. GrantPilot recommends funding the projects that protect runway and preserve milestone potential, while pausing or stopping work that overloads the lab.

## Why It Is Novel

Most lab software helps teams track experiments, inventory, compliance, or accounting.

GrantPilot is different. It treats scientific R&D as a living portfolio under uncertainty.

The product combines:

1. Scientific project logic.
2. Real lab cost structure.
3. Finance style portfolio allocation.
4. Monte Carlo risk modeling.
5. GPT generated CFO communication.

The key idea is that GPT should not guess the portfolio. GrantPilot computes the cashflow, FTE needs, bottlenecks, optimization, Monte Carlo risk, and sensitivity analysis first. GPT then explains the computed results in language a PI, founder, board member, or grant committee can use.

That separation is important. It makes the product feel more trustworthy. The model does the math first. GPT helps people understand and communicate the decision.

## How We Built It

We built GrantPilot as a lightweight web app with a local deterministic model.

The app includes:

1. A phase based cashflow model for R&D projects.
2. Skill based FTE capacity calculations.
3. Resource queue modeling for CRO, sequencing, microscopy, and animal facility constraints.
4. Portfolio scoring across runway, scientific impact, commercial potential, and execution bottlenecks.
5. Monte Carlo simulation for cost, timing, milestone, and reimbursement uncertainty.
6. Sensitivity analysis that reruns stressed scenarios and ranks risk drivers.
7. Board Meeting Mode for CFO style memo generation.
8. Ask GrantPilot for scenario questions.

The app runs without an API key using deterministic fallback text. When an OpenAI API key is available, GPT is used to generate board memos and scenario answers from the computed model outputs.

## How We Used Codex

Codex was central to the build.

We used Codex to:

1. Turn the OpenAI Build Week rules into a practical checklist.
2. Pressure test the product concept from the viewpoints of a hackathon judge, a working scientist, and a statistician.
3. Convert the concept into a focused MVP.
4. Build the local app, optimizer, Monte Carlo simulation, sensitivity analysis, model audit, and memo interface.
5. Improve the UI until the first screen told a clear decision story.
6. Keep checking whether the product was drifting away from the project requirements.

The human direction came from us. The scientific pain point, the finance framing, the target users, and the core fund, pause, stop story came from our own backgrounds and conversations.

## How We Used GPT

GrantPilot uses GPT as a communication layer, not as the decision engine.

The app first computes:

1. Cash runway.
2. Monthly burn.
3. FTE constraints.
4. Facility and CRO bottlenecks.
5. Portfolio recommendations.
6. Monte Carlo reserve breach risk.
7. Sensitivity drivers.

Then GPT takes those structured outputs and writes a CFO style memo or answers a scenario question.

This makes the GPT output useful for real meetings. A founder can ask what to tell the board. A PI can ask whether to delay an animal study. A grant lead can ask which project is most vulnerable to reimbursement delays.

## Challenges

The hardest part was making the product feel realistic without making it too complex for a short demo.

A real lab has many hidden constraints. People time is limited. Animal facilities get backed up. Core facility quotes change. Restricted grant cash may arrive late. CRO turnaround can become the real bottleneck even when cash looks fine.

We wanted to show those constraints in a way that judges could understand quickly. That is why the app focuses on a clear board ready decision first, then lets users inspect the model underneath.

## What We Are Proud Of

We are proud that GrantPilot is not just a chatbot.

It is a small decision system with real structure behind it. It forces the hard question every lab eventually faces:

Which science should we protect, and which science must wait so the team survives?

That question matters. We care about science. We also know passion alone does not keep a lab alive. GrantPilot is our attempt to help research teams keep doing meaningful science by managing scarce funding with discipline.

## Impact

GrantPilot could help:

1. University spinouts plan before applying for grants or raising seed funding.
2. Small biotech teams prepare board updates.
3. PIs understand when a project is scientifically exciting but operationally premature.
4. Lab managers identify staffing and facility bottlenecks early.
5. Grant strategy teams protect restricted funding and avoid hidden runway risk.

The broader vision is a new category of research finance software: not accounting after money is spent, but decision support before scarce money is committed.

## What Is Next

Next, we would add:

1. CSV import for real lab budgets.
2. Project templates for wet lab, computational, animal, translational, and clinical work.
3. Grant specific reimbursement rules.
4. Scenario collaboration for PI, CFO, and lab manager roles.
5. Exportable board memo and grant committee memo formats.
6. Integrations with spreadsheets and lab management systems.

Our long term goal is simple. Help more science survive the funding bottleneck.
