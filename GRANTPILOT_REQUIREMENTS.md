# GrantPilot Project Requirements

Last reviewed against official rules: 2026-07-21
Official rules source: https://openai.devpost.com/rules

## 1. Product North Star

Product name: GrantPilot

Subtitle: AI CFO for Research Teams

Hackathon title: GrantPilot: AI CFO for Scientific R&D Portfolios

One-sentence positioning:

GrantPilot helps scientific R&D teams decide what to fund, what to pause, what to stop, and how long their capital will last.

Company-grade positioning:

GrantPilot is a capital allocation platform for scientific R&D teams. It combines real lab cost modeling, skill-based staffing constraints, portfolio optimization, Monte Carlo risk simulation, sensitivity analysis, and GPT-generated board memos.

Primary customer:

Seed-stage biotech companies, translational research labs, university spinouts, and grant-funded scientific teams with limited runway and too many competing projects.

Primary user:

PI, biotech founder, head of R&D, lab manager, fractional CFO, or grant strategy lead.

## 2. Hackathon Track

Recommended track: Work and Productivity

Reason:

GrantPilot is a team productivity and decision-support tool for scientific R&D operations. It improves analytics, planning, financial prioritization, and back-office decision workflows for research teams.

Secondary fit:

Apps for Your Life is possible because it includes productivity and personal finance, but Work and Productivity is the better strategic fit.

## 3. Core Problem

Scientific teams often make project decisions using intuition, spreadsheets, and disconnected budget notes. Real lab spending is constrained by cash, grants, people, equipment, core facilities, animal work, CRO timelines, and experimental uncertainty.

The common failure mode:

- Too many promising projects are active at the same time.
- Personnel are double-booked across experiments.
- Critical lab resources become bottlenecks.
- Project budgets ignore overhead, fringe, delays, and cost overruns.
- Teams discover the runway problem too late.
- Board, investor, or grant committee updates are manually assembled.

GrantPilot should make this visible quickly and recommend a capital-efficient research plan.

## 4. Demo Story

Use one strong demo scenario:

A translational biotech / university spinout has USD 1.2M cash, 7 people, and 6 active R&D projects. The founder wants to run all six.

GrantPilot models real lab costs and finds:

- Current plan runs out of cash in about 8.8 months.
- Wet-lab scientist and animal technician capacity are overallocated.
- Animal facility capacity is the limiting resource in months 4-7.
- CRO and animal-study cost overruns are the biggest cash-shortfall drivers.

GrantPilot recommends:

- Fund 3 projects.
- Pause 2 projects.
- Stop 1 project.
- Reduce burn from about USD 137k per month to about USD 78k per month.
- Extend runway from about 8.8 months to about 15.4 months.
- Preserve a strong chance of reaching at least one meaningful scientific milestone.

The demo should show a clear before/after:

- Current plan: overcommitted team, 8.8-month runway, high cash shortfall risk.
- GrantPilot plan: focused portfolio, 15.4-month runway, lower cash shortfall risk.

## 5. MVP Scope

The MVP must include these features:

1. CFO Snapshot
   - Cash on hand
   - Monthly burn
   - Projected runway
   - Headcount / FTE load
   - Active projects
   - Funding cliff warning
   - One clear diagnosis sentence, for example: "Your lab is overcommitted: cash runs out in 9 months, and wet-lab FTE is double-booked."

2. Real Lab Cost Builder
   - Manpower
   - Consumables
   - Core facility usage
   - Equipment and maintenance
   - Animal / clinical / sample costs
   - Compute and data
   - Outsourcing / CRO
   - Overhead
   - Grant or milestone funding constraints

3. Project Portfolio View
   - 5-8 project rows for the demo
   - Each project should show cost, duration, success probability range, scientific impact, commercial potential, burn rate, required skills, milestone stage, and strategic dependency.

4. Portfolio Optimizer
   - Compare at least three strategies:
     - Survival Mode: maximize runway and reduce cash risk.
     - Balanced Portfolio: balance impact, success probability, and runway.
     - Breakthrough Bet: preserve high-risk, high-upside work.
   - Output fund / pause / stop recommendations.

5. Monte Carlo Risk Simulation
   - Simulate cost overrun, duration delay, milestone failure, grant delay, CRO cost increase, and key capacity bottlenecks.
   - Output runway distribution, cash shortfall risk, probability of major milestone, and expected portfolio value.

6. Sensitivity Analysis
   - Identify the biggest drivers of cash shortfall.
   - Identify the biggest drivers of scientific milestone success.
   - Show which assumption matters most.

7. Ask GrantPilot
   - User can ask realistic planning questions:
     - "Can we keep the animal study and still reach 12 months of runway?"
     - "What if we delay the animal study by 3 months?"
     - "Which single hire improves the portfolio most?"
     - "What should I tell the board?"

8. Board Meeting Mode
   - Generate a concise English memo:
     - What to fund
     - What to pause
     - What to stop
     - Why
     - Runway impact
     - Scientific tradeoffs
     - Key risks
     - Next 30-day action plan

## 6. Real Lab Cost Model Requirements

The model must not treat projects as one flat budget number. It should reflect realistic lab expenses.

Manpower:

- PI / founder time
- Scientist
- Postdoc
- Research associate
- Technician
- Animal technician
- Computational biologist
- Data scientist
- Lab manager
- Clinical coordinator
- Salary, benefits, and fringe multiplier
- FTE allocation per project and per month

Consumables:

- Reagents
- Antibodies
- Kits
- Cell culture
- Chemicals
- Plasticware
- Assay plates

Core facility:

- Sequencing
- Microscopy
- Flow cytometry
- Mass spectrometry
- Histology
- Imaging

Equipment:

- Instrument purchase
- Lease
- Maintenance contract
- Depreciation or monthly allocation

Animal / clinical / sample costs:

- Mouse purchase
- Animal housing
- Procedure cost
- IACUC-related costs
- Patient sample acquisition
- Biobank fees
- Clinical coordinator time

Compute and data:

- Cloud GPU
- Storage
- Bioinformatics pipeline
- Software license
- Data processing

Outsourcing:

- CRO
- Assay services
- Compound synthesis
- Toxicology
- PK/PD
- External validation

Overhead:

- University indirect cost
- Rent
- Admin
- Legal / IP
- Compliance
- Insurance

Funding constraints:

- Restricted grant funds
- Milestone-based funding
- Reimbursement delay
- Investor tranche timing
- Matching fund requirement

## 7. Scientific Reality Requirements

The product must feel like it understands real scientific execution.

Required concepts:

- Skill-based FTE constraints, not just total headcount.
- Milestone gates, so failed early experiments stop later spending.
- Project dependencies, so validation cannot start before pilot data.
- Critical resource bottlenecks, such as animal room capacity, sequencing slots, microscopy time, CRO turnaround, or reagent lead time.
- Different timing patterns for wet lab, animal, computational, and outsourced work.

Minimum demo bottleneck:

Show at least one capacity warning, such as:

"Animal facility capacity is the limiting resource in months 4-7."

## 8. Statistical Requirements

The simulation should use ranges and uncertainty, not only point estimates.

Use:

- Cost range, not only expected cost.
- Duration range, not only expected months.
- Success probability range, not only one percentage.
- Risk-level-specific cost overrun assumptions.
- Milestone-gate success/failure.
- Scenario assumptions panel.

Monte Carlo outputs:

- Expected runway
- Runway range
- Cash shortfall probability
- Probability of at least one major scientific milestone
- Expected portfolio value
- Top risk drivers

Important wording rule:

Do not claim that GrantPilot predicts scientific success. Say that it stress-tests assumptions and estimates risk under stated assumptions.

## 9. AI Requirements

GPT-5.6 should not make the financial decision directly from a vague prompt.

Correct architecture:

1. Structured data is entered or loaded.
2. Deterministic cashflow, FTE, and constraint calculations run first.
3. Monte Carlo simulation and sensitivity analysis run next.
4. GPT-5.6 explains the quantitative results and generates decision memos.
5. Ask GrantPilot answers questions using computed scenario outputs.

Key explanation for README and video:

"The LLM does not guess the portfolio decision. GrantPilot first runs structured cashflow, capacity, optimization, and Monte Carlo models. GPT-5.6 then translates those results into CFO-style recommendations and board-ready memos."

## 10. UX Requirements

The app should feel like a decision product, not a spreadsheet.

First screen:

- Clear overcommitment diagnosis
- Cash and runway
- FTE bottleneck
- Recommended action summary
- Before/after comparison

Avoid:

- Too many dense tables on the first screen
- Generic chatbot-first UI
- Unexplained financial jargon
- Medical advice framing
- Overclaiming precision

Preferred interaction:

- Dashboard-first
- Expandable cost details
- Clear fund / pause / stop labels
- Scenario comparison
- A visible Ask GrantPilot panel
- Board Meeting Mode memo output

## 11. Non-Goals

Do not build these for the hackathon MVP:

- Full accounting system
- Invoice tracking
- Payroll system
- Live grant submission platform
- Hospital or clinical decision software
- Real patient recommendation system
- External paid data integrations
- Complex multi-tenant enterprise auth
- Full procurement workflow
- Scientific literature search engine

## 12. Compliance With Hackathon Rules

Official rules source:

https://openai.devpost.com/rules

Important timeline from official rules:

- Registration Period: July 9, 2026 at 10:00am Pacific Time to July 21, 2026 at 5:00pm Pacific Time.
- Submission Period: July 13, 2026 at 9:00am Pacific Time to July 21, 2026 at 5:00pm Pacific Time.
- Judging Period: July 22, 2026 at 10:00am Pacific Time to August 5, 2026 at 5:00pm Pacific Time.
- Winners announced: on or around August 12, 2026 at 2:00pm Pacific Time.

Required project fit:

- Must be built with Codex and GPT-5.6.
- Must fit one allowed track.
- Must be capable of being installed and running consistently on its intended platform.
- Must function as shown in the video and described in the submission.
- If using third-party SDKs, APIs, or data, the team must be authorized to use them.
- If based on pre-existing work, README and commit history must clearly distinguish new hackathon work.

Required submission materials:

- Devpost project submission.
- Track/category selection.
- Text description explaining features and functionality.
- Demo video under 3 minutes.
- Demo video must include audio.
- Demo video must clearly show what was built and how Codex and GPT-5.6 were used.
- Demo video must be publicly visible on YouTube.
- Code repository URL for judging and testing.
- Repository must be public with relevant license, or private and shared with the required judging emails listed in the official rules.
- README must describe how Codex was used throughout the project.
- README must highlight where Codex accelerated development and where humans made product, engineering, and design decisions.
- Provide the /feedback Codex Session ID for the main project thread.
- Provide a working demo, website, test build, or testing instructions.
- Submission materials must be in English, or include English translation.

Judging criteria:

- Technological Implementation
- Design
- Potential Impact
- Quality of the Idea

GrantPilot must explicitly address all four.

## 13. Build Guardrails

Before adding any feature, check:

- Does this help decide what to fund, pause, or stop?
- Does this improve runway, capacity, risk, or board communication?
- Does this make the product more realistic for scientific R&D teams?
- Can it be shown clearly in a 3-minute demo?
- Does it strengthen one of the four judging criteria?
- Is it built with evidence of Codex and GPT-5.6 usage?

If the answer is mostly no, do not build it for the MVP.

## 14. Evaluation Checklist During Development

Use this checklist after each major coding step.

Product:

- The first screen communicates a clear financial/scientific decision.
- The product recommends fund / pause / stop actions.
- Real lab costs are modeled, not hidden behind a single budget number.
- Skill-based FTE constraints are visible.
- At least one scientific bottleneck is visible.
- Before/after runway impact is visible.
- AI memo is board-ready and specific.

Technical:

- Cashflow calculations are deterministic and inspectable.
- FTE capacity calculations are deterministic and inspectable.
- Optimization logic is separate from GPT text generation.
- Monte Carlo simulation uses documented assumptions.
- Sensitivity analysis is shown.
- Demo data loads without external dependencies.
- App can run consistently for judges.

Hackathon:

- README explains Codex collaboration.
- README explains GPT-5.6 usage.
- README includes setup/testing instructions.
- Demo script shows what was built.
- Demo script shows how Codex/GPT-5.6 were used.
- Demo is under 3 minutes.
- No unauthorized third-party data is required.
- Project clearly fits Work and Productivity.

## 15. 3-Minute Demo Outline

0:00-0:18

Introduce the problem: scientific teams have limited capital, too many projects, and unclear runway.

0:18-0:42

Show the current lab scenario: USD 1.2M cash, 7 people, 6 R&D projects. GrantPilot flags overcommitment.

0:42-1:10

Show real lab cost modeling: manpower, consumables, animal work, CRO, compute, overhead, and restricted funding.

1:10-1:30

Show optimization results: fund 3, pause 2, stop 1. Compare current plan vs GrantPilot plan.

1:30-1:45

Show Monte Carlo risk and sensitivity analysis: runway distribution, cash shortfall risk, top drivers.

1:45-1:58

Show Ask GrantPilot and Board Meeting Mode memo.

1:58-2:05

Close with how Codex and GPT-5.6 were used.

## 16. Final Submission Narrative

Short description:

GrantPilot is an AI CFO for scientific R&D portfolios. It helps research teams model real lab costs, identify staffing and resource bottlenecks, optimize project portfolios, stress-test runway under uncertainty, and generate board-ready decision memos.

Impact statement:

Scientific teams waste time and money when research ambition is not matched with capital discipline. GrantPilot helps PIs and biotech founders make clearer, faster, and more financially resilient R&D decisions.

Technical statement:

GrantPilot combines deterministic cashflow and capacity modeling, constraint-based portfolio selection, Monte Carlo simulation, sensitivity analysis, and GPT-5.6-generated decision memos. Codex is used throughout development to implement, test, refine, and document the product.
