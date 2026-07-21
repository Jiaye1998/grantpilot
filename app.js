const GrantPilot = (() => {
  const lab = {
    cash: 1200000,
    fixedMonthly: 18000,
    portfolioReadinessMonthly: 14000,
    operatingReserve: 420000,
    overheadRate: 0.12,
    headcount: 7,
    roles: {
      pi: { label: "PI / founder", available: 0.6, monthlyCost: 6000, contractorCost: 8000 },
      scientist: { label: "Wet-lab scientist", available: 2.0, monthlyCost: 9000, contractorCost: 12000 },
      ra: { label: "Research associate", available: 1.5, monthlyCost: 5000, contractorCost: 7000 },
      animal: { label: "Animal technician", available: 0.5, monthlyCost: 5500, contractorCost: 7500 },
      comp: { label: "Computational biologist", available: 1.0, monthlyCost: 8500, contractorCost: 11000 },
      labManager: { label: "Lab manager", available: 0.4, monthlyCost: 6000, contractorCost: 7600 },
      clinical: { label: "Clinical coordinator", available: 0.3, monthlyCost: 6000, contractorCost: 7800 }
    },
    resources: {
      animalFacility: { label: "Animal facility capacity", capacity: 40, unit: "cage-weeks/month", queueCost: 450 },
      sequencing: { label: "Sequencing slots", capacity: 22, unit: "runs/month", queueCost: 1200 },
      microscopy: { label: "Microscopy hours", capacity: 48, unit: "hours/month", queueCost: 150 },
      cro: { label: "CRO turnaround load", capacity: 55, unit: "points/month", queueCost: 600 }
    }
  };

  const SIMULATION_MONTHS = 24;
  const SNAPSHOT_HORIZON_MONTHS = 4;
  const SENSITIVITY_ITERATIONS = 650;

  const projects = [
    {
      id: "biomarker",
      name: "Cancer biomarker discovery",
      stage: "Discovery assay panel",
      duration: { low: 5, base: 6, high: 8 },
      success: { low: 0.35, base: 0.48, high: 0.58 },
      risk: "high",
      scientificImpact: 92,
      commercialPotential: 74,
      strategicDependency: "Unlocks validation study",
      monthlyDirect: {
        consumables: 3600,
        core: 3100,
        equipment: 500,
        animal: 0,
        compute: 800,
        outsourcing: 1500
      },
      roles: { pi: 0.2, scientist: 0.8, ra: 0.45, comp: 0.15 },
      resources: { sequencing: 12, microscopy: 16, cro: 10 },
      milestonePayment: 0
    },
    {
      id: "assay",
      name: "Assay automation and QC",
      stage: "Reproducibility gate",
      duration: { low: 3, base: 4, high: 5 },
      success: { low: 0.76, base: 0.84, high: 0.92 },
      risk: "low",
      scientificImpact: 63,
      commercialPotential: 58,
      strategicDependency: "Improves every downstream experiment",
      monthlyDirect: {
        consumables: 2100,
        core: 900,
        equipment: 900,
        animal: 0,
        compute: 200,
        outsourcing: 400
      },
      roles: { pi: 0.08, scientist: 0.3, ra: 0.45, labManager: 0.1 },
      resources: { microscopy: 12 },
      milestonePayment: 0
    },
    {
      id: "screening",
      name: "AI drug screening",
      stage: "Hit triage milestone",
      duration: { low: 4, base: 5, high: 7 },
      success: { low: 0.42, base: 0.57, high: 0.68 },
      risk: "medium",
      scientificImpact: 78,
      commercialPotential: 88,
      strategicDependency: "Feeds partner pilot",
      monthlyDirect: {
        consumables: 1200,
        core: 600,
        equipment: 0,
        animal: 0,
        compute: 3600,
        outsourcing: 1600
      },
      roles: { pi: 0.15, scientist: 0.38, ra: 0.2, comp: 0.75 },
      resources: { sequencing: 5, cro: 18 },
      milestonePayment: 50000
    },
    {
      id: "animal",
      name: "In vivo animal validation",
      stage: "Preclinical proof gate",
      duration: { low: 6, base: 7, high: 10 },
      success: { low: 0.3, base: 0.43, high: 0.54 },
      risk: "high",
      scientificImpact: 88,
      commercialPotential: 81,
      strategicDependency: "Should follow stronger pilot data",
      monthlyDirect: {
        consumables: 2600,
        core: 1800,
        equipment: 0,
        animal: 6800,
        compute: 500,
        outsourcing: 5300
      },
      roles: { pi: 0.24, scientist: 0.5, ra: 0.4, animal: 0.8, labManager: 0.1 },
      resources: { animalFacility: 56, microscopy: 8, cro: 42 },
      milestonePayment: 120000
    },
    {
      id: "neuro",
      name: "Grant-dependent neuroscience pilot",
      stage: "Pilot dataset",
      duration: { low: 5, base: 6, high: 8 },
      success: { low: 0.5, base: 0.61, high: 0.72 },
      risk: "medium",
      scientificImpact: 76,
      commercialPotential: 46,
      strategicDependency: "Restricted grant; reimbursement delayed",
      monthlyDirect: {
        consumables: 2300,
        core: 1200,
        equipment: 0,
        animal: 0,
        compute: 800,
        outsourcing: 700
      },
      roles: { pi: 0.12, scientist: 0.4, ra: 0.3, comp: 0.2 },
      resources: { sequencing: 10, microscopy: 10 },
      grantRestricted: true,
      reimbursementDelay: 2,
      milestonePayment: 65000
    },
    {
      id: "pharma",
      name: "Pharma partner translational pilot",
      stage: "Partner milestone",
      duration: { low: 3, base: 4, high: 6 },
      success: { low: 0.56, base: 0.68, high: 0.78 },
      risk: "medium",
      scientificImpact: 70,
      commercialPotential: 94,
      strategicDependency: "Potential non-dilutive milestone cash",
      monthlyDirect: {
        consumables: 1600,
        core: 1000,
        equipment: 0,
        animal: 0,
        compute: 500,
        outsourcing: 3900
      },
      roles: { pi: 0.24, scientist: 0.48, ra: 0.25, comp: 0.2, clinical: 0.1 },
      resources: { cro: 24 },
      milestonePayment: 180000
    }
  ];

  const state = {
    strategy: "balanced",
    rngSeed: 8221,
    scenario: {
      cash: 1200000,
      operatingReserve: 420000,
      wetlabFte: 2,
      croMultiplier: 1,
      includeAnimal: true
    }
  };

  const sensitivityCache = new Map();

  const strategies = {
    survival: {
      label: "Survival Mode",
      description: "Prioritizes runway, low bottleneck load, and near-term milestones."
    },
    balanced: {
      label: "Balanced Portfolio",
      description: "Balances scientific impact, commercial potential, execution capacity, and cash risk."
    },
    breakthrough: {
      label: "Breakthrough Bet",
      description: "Preserves high-upside projects while keeping a credible financing window."
    }
  };

  const categoryLabels = {
    manpower: "Manpower",
    consumables: "Consumables",
    core: "Core facility",
    equipment: "Equipment and maintenance",
    animal: "Animal / sample work",
    compute: "Compute and data",
    outsourcing: "Outsourcing / CRO",
    overhead: "Overhead",
    fixed: "Fixed lab operations"
  };

  function formatMoney(value) {
    if (Math.abs(value) >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (Math.abs(value) >= 1000) return `$${Math.round(value / 1000)}k`;
    return `$${Math.round(value)}`;
  }

  function formatPercent(value) {
    return `${Math.round(value * 100)}%`;
  }

  function formatMonths(value) {
    return `${value.toFixed(value < 10 ? 1 : 0)} mo`;
  }

  function formatSimulationMonth(value) {
    return value >= 24 ? "24+ mo" : `${value} mo`;
  }

  function applyScenario() {
    lab.cash = state.scenario.cash;
    lab.operatingReserve = state.scenario.operatingReserve;
    lab.roles.scientist.available = state.scenario.wetlabFte;
  }

  function activeProjects() {
    return projects.filter((project) => state.scenario.includeAnimal || project.id !== "animal");
  }

  function scenarioCategoryFactors() {
    return {
      outsourcing: state.scenario.croMultiplier
    };
  }

  function mergeFactors(base, override) {
    const merged = { ...(base || {}) };
    Object.entries(override || {}).forEach(([key, value]) => {
      merged[key] = (merged[key] || 1) * value;
    });
    return merged;
  }

  function getProject(id) {
    return projects.find((project) => project.id === id);
  }

  function projectIds() {
    return activeProjects().map((project) => project.id);
  }

  function sumObject(target, source, multiplier = 1) {
    Object.entries(source || {}).forEach(([key, value]) => {
      target[key] = (target[key] || 0) + value * multiplier;
    });
  }

  function directMonthly(project) {
    return Object.values(project.monthlyDirect).reduce((sum, value) => sum + value, 0);
  }

  function scaleObject(source, scalar) {
    return Object.fromEntries(Object.entries(source || {}).map(([key, value]) => [key, value * scalar]));
  }

  function fixedRunRate(ids) {
    return lab.fixedMonthly + (ids.length < projects.length ? lab.portfolioReadinessMonthly : 0);
  }

  function emptyBreakdown(fixed = 0) {
    return {
      manpower: 0,
      consumables: 0,
      core: 0,
      equipment: 0,
      animal: 0,
      compute: 0,
      outsourcing: 0,
      overhead: 0,
      fixed
    };
  }

  function applyCategoryFactors(direct, categoryFactors = {}) {
    const adjusted = {};
    Object.entries(direct || {}).forEach(([category, amount]) => {
      adjusted[category] = amount * (categoryFactors[category] || 1);
    });
    return adjusted;
  }

  function applyRoleFactors(roles, roleDemandMultipliers = {}) {
    const adjusted = {};
    Object.entries(roles || {}).forEach(([role, amount]) => {
      adjusted[role] = amount * (roleDemandMultipliers[role] || 1);
    });
    return adjusted;
  }

  function projectPhases(project, durationFactor = 1) {
    const phase = (name, start, duration, directScale, roleScale, resourceScale, overrides = {}) => ({
      name,
      start,
      duration: Math.max(1, Math.round(duration * durationFactor)),
      direct: overrides.direct || scaleObject(project.monthlyDirect, directScale),
      roles: overrides.roles || scaleObject(project.roles, roleScale),
      resources: overrides.resources || scaleObject(project.resources, resourceScale)
    });

    switch (project.id) {
      case "biomarker":
        return [
          phase("Assay setup", 1, 1, 0.75, 0.8, 0.45),
          phase("Panel execution", 2, 3, 1.05, 1.05, 1.0),
          phase("Sequencing and analysis", 5, 2, 1.25, 0.85, 1.25)
        ];
      case "assay":
        return [
          phase("Automation setup", 1, 1, 1.15, 1.0, 0.65),
          phase("QC repeats", 2, 2, 0.95, 1.05, 1.0),
          phase("Handoff package", 4, 1, 0.7, 0.7, 0.35)
        ];
      case "screening":
        return [
          phase("Data preparation", 1, 1, 0.7, 0.75, 0.55),
          phase("Model screen", 2, 2, 1.0, 1.0, 1.05),
          phase("Hit triage", 4, 2, 1.25, 1.05, 1.15)
        ];
      case "animal":
        return [
          phase("Protocol and IACUC prep", 1, 2, 0.45, 0.55, 0.25, {
            roles: { pi: 0.22, scientist: 0.25, animal: 0.2, labManager: 0.15 },
            resources: { cro: 12 }
          }),
          phase("In vivo cohort", 4, 4, 1.35, 1.15, 1.25, {
            direct: { consumables: 3200, core: 1400, equipment: 0, animal: 9800, compute: 350, outsourcing: 6200 },
            roles: { pi: 0.18, scientist: 0.55, ra: 0.35, animal: 0.95, labManager: 0.1 },
            resources: { animalFacility: 62, microscopy: 8, cro: 48 }
          }),
          phase("Histology and PK readout", 8, 2, 1.1, 0.75, 0.9, {
            direct: { consumables: 2200, core: 2600, equipment: 0, animal: 2400, compute: 650, outsourcing: 4200 },
            roles: { pi: 0.18, scientist: 0.45, ra: 0.35, animal: 0.25, comp: 0.18 },
            resources: { animalFacility: 24, microscopy: 24, cro: 34 }
          })
        ];
      case "neuro":
        return [
          phase("Sample prep", 1, 2, 0.85, 0.9, 0.75),
          phase("Pilot acquisition", 3, 2, 1.05, 1.0, 1.1),
          phase("Grant dataset package", 5, 2, 1.15, 0.85, 1.1)
        ];
      case "pharma":
        return [
          phase("Partner protocol lock", 1, 1, 0.75, 0.75, 0.8),
          phase("Translational run", 2, 2, 1.05, 1.0, 1.05),
          phase("Milestone package", 4, 1, 1.2, 0.9, 1.2)
        ];
      default:
        return [
          phase("Setup", 1, Math.max(1, Math.round(project.duration.base * 0.3)), 0.8, 0.8, 0.7),
          phase("Execution", 2, Math.max(1, Math.round(project.duration.base * 0.5)), 1.0, 1.0, 1.0),
          phase("Readout", project.duration.base, 1, 1.1, 0.8, 0.8)
        ];
    }
  }

  function failureGateMonth(project) {
    const gates = {
      biomarker: 4,
      assay: 3,
      screening: 4,
      animal: 7,
      neuro: 4,
      pharma: 3
    };
    return gates[project.id] || Math.max(2, Math.round(project.duration.base * 0.6));
  }

  function dependencyDelay(project, ids) {
    if (project.id !== "animal") return 0;
    const hasPreclinicalSignal = ids.includes("biomarker") || ids.includes("screening") || ids.includes("assay");
    return hasPreclinicalSignal ? 0 : 2;
  }

  function roleDemand(ids) {
    const demand = {};
    ids.map(getProject).forEach((project) => sumObject(demand, project.roles));
    return demand;
  }

  function resourceDemand(ids) {
    const demand = {};
    ids.map(getProject).forEach((project) => sumObject(demand, project.resources));
    return demand;
  }

  function manpowerMonthly(demand) {
    let total = 0;
    const rows = Object.entries(lab.roles).map(([key, role]) => {
      const required = demand[key] || 0;
      const covered = Math.min(required, role.available);
      const shortage = Math.max(0, required - role.available);
      const cost = covered * role.monthlyCost + shortage * role.contractorCost;
      total += cost;
      return {
        key,
        label: role.label,
        required,
        available: role.available,
        shortage,
        cost,
        utilization: role.available > 0 ? required / role.available : 0
      };
    });
    return { total, rows };
  }

  function resourceBottlenecks(demand) {
    return Object.entries(lab.resources)
      .map(([key, resource]) => {
        const required = demand[key] || 0;
        const utilization = required / resource.capacity;
        return {
          key,
          label: resource.label,
          required,
          capacity: resource.capacity,
          unit: resource.unit,
          utilization,
          over: Math.max(0, required - resource.capacity)
        };
      })
      .filter((row) => row.required > 0)
      .sort((a, b) => b.utilization - a.utilization);
  }

  function monthlyPortfolioPlan(ids, options = {}) {
    const months = Array.from({ length: SIMULATION_MONTHS }, (_, index) => ({
      month: index + 1,
      breakdown: emptyBreakdown(fixedRunRate(ids)),
      roles: {},
      resources: {},
      payouts: 0,
      phaseLabels: []
    }));
    const random = options.random;
    const categoryFactors = mergeFactors(scenarioCategoryFactors(), options.categoryFactors);
    const roleDemandMultipliers = options.roleDemandMultipliers || {};
    const resourceDelayKeys = options.resourceDelayKeys || {};
    const projectOutcomes = {};

    ids.map(getProject).forEach((project) => {
      const sampledDurationFactor = random
        ? sampleRange(random, project.duration.low / project.duration.base, project.duration.high / project.duration.base)
        : 1;
      const durationFactor = sampledDurationFactor * (options.durationMultiplier || 1) * ((options.projectDurationMultipliers || {})[project.id] || 1);
      const sampledSuccessProbability = random
        ? sampleRange(random, project.success.low, project.success.high)
        : project.success.base;
      const successProbability = Math.min(0.98, Math.max(0.02, sampledSuccessProbability * (options.successMultiplier || 1)));
      const success = options.forceSuccess === undefined ? (random ? random() < successProbability : true) : options.forceSuccess;
      const costFactor = (random ? riskCostFactor(project, random) : 1) * (options.costMultiplier || 1) * ((options.projectCostMultipliers || {})[project.id] || 1);
      const projectDelay = dependencyDelay(project, ids);
      const gateMonth = success ? SIMULATION_MONTHS + 1 : failureGateMonth(project);
      const phases = projectPhases(project, durationFactor);
      let finishMonth = 1;

      phases.forEach((phase) => {
        const capacityDelay = Object.entries(phase.resources || {}).reduce((delay, [key, amount]) => {
          const resource = lab.resources[key];
          if (!resource) return delay;
          const stochasticDelay = random && amount > resource.capacity ? 1 + Math.floor(random() * 2) : 0;
          return Math.max(delay, stochasticDelay + (resourceDelayKeys[key] || 0));
        }, 0);
        const start = phase.start + projectDelay + capacityDelay;
        const end = Math.min(SIMULATION_MONTHS, start + phase.duration - 1);
        finishMonth = Math.max(finishMonth, end);
        for (let month = start; month <= end; month += 1) {
          if (month > gateMonth) continue;
          const row = months[month - 1];
          const direct = applyCategoryFactors(phase.direct, categoryFactors);
          Object.entries(direct).forEach(([category, amount]) => {
            row.breakdown[category] = (row.breakdown[category] || 0) + amount * costFactor;
          });
          sumObject(row.roles, applyRoleFactors(phase.roles, roleDemandMultipliers));
          sumObject(row.resources, phase.resources);
          row.phaseLabels.push(`${project.name}: ${phase.name}`);
        }
      });

      const grantDelay = project.grantRestricted && random
        ? (random() < Math.min(0.95, 0.42 * (options.grantDelayProbabilityMultiplier || 1)) ? project.reimbursementDelay || 2 : 0)
        : project.reimbursementDelay || 0;
      const payoutMonth = finishMonth + grantDelay + (options.grantDelayExtra || 0) + 1;
      if (success && project.milestonePayment && payoutMonth <= SIMULATION_MONTHS) {
        months[payoutMonth - 1].payouts += project.milestonePayment;
      }
      projectOutcomes[project.id] = { success, successProbability, finishMonth, payoutMonth };
    });

    months.forEach((month) => {
      const manpower = manpowerMonthly(month.roles);
      month.breakdown.manpower = manpower.total;
      month.capacityPremium = 0;
      Object.entries(month.resources).forEach(([key, amount]) => {
        const resource = lab.resources[key];
        if (!resource || amount <= resource.capacity) return;
        const premium = (amount - resource.capacity) * resource.queueCost;
        month.capacityPremium += premium;
        month.breakdown.outsourcing = (month.breakdown.outsourcing || 0) + premium;
      });
      const direct = ["consumables", "core", "equipment", "animal", "compute", "outsourcing"]
        .reduce((sum, key) => sum + (month.breakdown[key] || 0), 0);
      month.breakdown.overhead = direct * lab.overheadRate;
      month.burn = Object.values(month.breakdown).reduce((sum, value) => sum + value, 0);
      month.manpowerRows = manpower.rows;
    });

    return { ids, months, projectOutcomes };
  }

  function averageBreakdownFromPlan(plan, horizon = SNAPSHOT_HORIZON_MONTHS) {
    const breakdown = emptyBreakdown(0);
    const months = plan.months.slice(0, horizon);
    months.forEach((month) => {
      Object.entries(month.breakdown).forEach(([category, amount]) => {
        breakdown[category] = (breakdown[category] || 0) + amount / months.length;
      });
    });
    return breakdown;
  }

  function peakDemandFromPlan(plan, kind) {
    const peak = {};
    plan.months.forEach((month) => {
      Object.entries(month[kind] || {}).forEach(([key, amount]) => {
        peak[key] = Math.max(peak[key] || 0, amount);
      });
    });
    return peak;
  }

  function peakResourceWindow(plan, resourceKey) {
    const activeMonths = plan.months
      .filter((month) => (month.resources[resourceKey] || 0) > 0)
      .map((month) => month.month);
    if (!activeMonths.length) return "";
    const first = Math.min(...activeMonths);
    const last = Math.max(...activeMonths);
    return first === last ? `month ${first}` : `months ${first}-${last}`;
  }

  function phaseBottleneck(plan) {
    const rows = resourceBottlenecks(peakDemandFromPlan(plan, "resources"));
    const top = rows.find((row) => row.utilization > 1) || rows[0];
    if (!top) return null;
    return {
      ...top,
      window: peakResourceWindow(plan, top.key)
    };
  }

  function costBreakdown(ids) {
    return averageBreakdownFromPlan(monthlyPortfolioPlan(ids), SNAPSHOT_HORIZON_MONTHS);
  }

  function evaluatePortfolio(ids) {
    const selected = [...ids];
    const plan = monthlyPortfolioPlan(selected);
    const demand = peakDemandFromPlan(plan, "roles");
    const resources = peakDemandFromPlan(plan, "resources");
    const manpower = manpowerMonthly(demand);
    const resourceRows = resourceBottlenecks(resources);
    const breakdown = averageBreakdownFromPlan(plan, SNAPSHOT_HORIZON_MONTHS);
    const monthlyBurn = Object.values(breakdown).reduce((sum, value) => sum + value, 0);
    const runway = lab.cash / monthlyBurn;
    const selectedProjects = selected.map(getProject);
    const successAtLeastOne = 1 - selectedProjects.reduce((product, project) => product * (1 - project.success.base), 1);
    const expectedValue = selectedProjects.reduce((sum, project) => {
      const impactValue = project.scientificImpact * 0.52 + project.commercialPotential * 0.48;
      return sum + impactValue * project.success.base;
    }, 0);
    const totalShortage = manpower.rows.reduce((sum, row) => sum + row.shortage, 0);
    const overloadScore = manpower.rows.reduce((sum, row) => sum + Math.max(0, row.utilization - 1), 0);
    const resourceOverloadScore = resourceRows.reduce((sum, row) => sum + Math.max(0, row.utilization - 1), 0);
    const highRiskCount = selectedProjects.filter((project) => project.risk === "high").length;

    return {
      ids: selected,
      projects: selectedProjects,
      plan,
      breakdown,
      roleRows: manpower.rows,
      resourceRows,
      monthlyBurn,
      runway,
      successAtLeastOne,
      expectedValue,
      totalShortage,
      overloadScore,
      resourceOverloadScore,
      highRiskCount,
      majorMilestoneChance: successAtLeastOne,
      phaseBottleneck: phaseBottleneck(plan)
    };
  }

  function allSubsets(values) {
    const subsets = [];
    const total = 1 << values.length;
    for (let mask = 1; mask < total; mask += 1) {
      const subset = [];
      values.forEach((value, index) => {
        if (mask & (1 << index)) subset.push(value);
      });
      subsets.push(subset);
    }
    return subsets;
  }

  function scorePortfolio(metrics, strategy, options = {}) {
    const targetCount = options.targetCount || 3;
    const emergencyMode = Boolean(options.emergencyMode);
    const countPenalty = Math.abs(metrics.ids.length - targetCount) * 8;
    const burnPenalty = metrics.monthlyBurn / 1800;
    const bottleneckPenalty = metrics.overloadScore * 10 + metrics.resourceOverloadScore * 11;
    const runwayGapPenalty = Math.max(0, 12 - metrics.runway) * 7;
    const maxImpact = metrics.projects.reduce((max, project) => Math.max(max, project.scientificImpact + project.commercialPotential), 0);
    const partnerBonus = metrics.ids.includes("pharma") ? 8 : 0;
    const platformBonus = metrics.ids.includes("assay") ? 8 : 0;
    const moonshotBonus = metrics.ids.includes("biomarker") ? 24 : 0;
    const prematureAnimalPenalty = metrics.ids.includes("animal") && !metrics.ids.includes("biomarker") ? 18 : 0;
    const milestoneCashBonus = metrics.projects.reduce((sum, project) => sum + (project.milestonePayment || 0), 0) / 18000;
    const hasMajorMilestone = metrics.projects.some((project) => project.scientificImpact >= 80 || project.commercialPotential >= 85);

    if (emergencyMode) {
      return metrics.runway * 10 + metrics.successAtLeastOne * 24 + platformBonus + partnerBonus * 3 + milestoneCashBonus
        - burnPenalty * 1.15 - bottleneckPenalty * 1.4 - metrics.highRiskCount * 10 - countPenalty * 4
        - (hasMajorMilestone ? 0 : 20);
    }

    if (strategy === "survival") {
      return metrics.runway * 7 + metrics.successAtLeastOne * 34 + platformBonus + partnerBonus
        - burnPenalty - bottleneckPenalty - metrics.highRiskCount * 6 - countPenalty;
    }

    if (strategy === "breakthrough") {
      return metrics.expectedValue * 1.15 + maxImpact * 0.28 + partnerBonus + moonshotBonus
        - runwayGapPenalty - bottleneckPenalty * 0.8 - countPenalty * 0.6 - prematureAnimalPenalty;
    }

    return metrics.expectedValue * 0.86 + metrics.successAtLeastOne * 25 + metrics.runway * 2.5
      + platformBonus + partnerBonus - burnPenalty * 0.75 - bottleneckPenalty - countPenalty;
  }

  function emergencyModeNeeded() {
    const current = evaluatePortfolio(projectIds());
    return current.runway < 8 || lab.cash <= lab.operatingReserve * 2.3;
  }

  function allowedFundCounts(strategy, emergencyMode) {
    const activeCount = projectIds().length;
    if (emergencyMode) return [1, 2].filter((count) => count <= activeCount);
    if (strategy === "survival") return [2, 3].filter((count) => count <= activeCount);
    if (strategy === "breakthrough") return [3, 4].filter((count) => count <= activeCount);
    return [3].filter((count) => count <= activeCount);
  }

  function optimize(strategy) {
    applyScenario();
    const emergencyMode = emergencyModeNeeded();
    const counts = allowedFundCounts(strategy, emergencyMode);
    const targetCount = emergencyMode ? Math.min(2, Math.max(...counts)) : 3;
    let best = null;
    allSubsets(projectIds()).forEach((ids) => {
      const metrics = evaluatePortfolio(ids);
      if (!counts.includes(metrics.ids.length)) return;
      const score = scorePortfolio(metrics, strategy, { emergencyMode, targetCount });
      if (!best || score > best.score) {
        metrics.emergencyMode = emergencyMode;
        metrics.modeLabel = emergencyMode ? "Emergency Bridge Plan" : strategies[strategy].label;
        best = { strategy, score, metrics, emergencyMode };
      }
    });
    return best;
  }

  function recommendations(fundedIds) {
    const funded = new Set(fundedIds);
    const stopped = [];
    const paused = [];
    activeProjects().forEach((project) => {
      if (funded.has(project.id)) return;
      const monthly = directMonthly(project);
      const bottleneck = Object.entries(project.resources || {}).some(([key, amount]) => {
        const resource = lab.resources[key];
        return resource && amount > resource.capacity * 0.85;
      });
      const weakRiskAdjustedValue = project.success.base * (project.scientificImpact + project.commercialPotential) < 74;
      if ((project.risk === "high" && monthly > 12000) || (bottleneck && weakRiskAdjustedValue)) stopped.push(project.id);
      else paused.push(project.id);
    });
    return { fund: fundedIds, pause: paused, stop: stopped };
  }

  function mulberry32(seed) {
    let value = seed;
    return function random() {
      value |= 0;
      value = value + 0x6d2b79f5 | 0;
      let t = Math.imul(value ^ value >>> 15, 1 | value);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function sampleRange(random, low, high) {
    return low + (high - low) * random();
  }

  function riskCostFactor(project, random) {
    const ranges = {
      low: [0.94, 1.12],
      medium: [0.9, 1.28],
      high: [0.86, 1.48]
    };
    const [low, high] = ranges[project.risk] || ranges.medium;
    return sampleRange(random, low, high);
  }

  function simulatePortfolio(ids, iterations = 1000, seedOffset = 0, stress = {}) {
    const random = mulberry32(state.rngSeed + seedOffset + ids.join("").length * 17);
    const runways = [];
    let reserveBreaches = 0;
    let milestones = 0;
    let totalExpectedValue = 0;

    for (let iteration = 0; iteration < iterations; iteration += 1) {
      const plan = monthlyPortfolioPlan(ids, { random, ...stress });
      let cash = lab.cash;
      let reserveBreachMonth = SIMULATION_MONTHS;
      let hitMilestone = false;
      let expectedValue = 0;

      plan.months.forEach((month) => {
        cash -= month.burn;
        cash += month.payouts;
        if (cash < lab.operatingReserve && reserveBreachMonth === SIMULATION_MONTHS) reserveBreachMonth = month.month;
      });

      Object.entries(plan.projectOutcomes).forEach(([projectId, outcome]) => {
        const project = getProject(projectId);
        if (!outcome.success) return;
        if (project.scientificImpact >= 80 || project.commercialPotential >= 85) {
          hitMilestone = true;
        }
        expectedValue += project.success.base * (project.scientificImpact * 0.52 + project.commercialPotential * 0.48);
      });

      if (stress.milestonePenalty) {
        expectedValue *= Math.max(0, 1 - stress.milestonePenalty);
      }

      runways.push(reserveBreachMonth);
      if (reserveBreachMonth < SIMULATION_MONTHS) reserveBreaches += 1;
      if (hitMilestone) milestones += 1;
      totalExpectedValue += expectedValue;
    }

    runways.sort((a, b) => a - b);
    const percentile = (p) => runways[Math.min(runways.length - 1, Math.max(0, Math.floor(runways.length * p)))];
    return {
      iterations,
      runways,
      reserveBreachRisk: reserveBreaches / iterations,
      shortfallRisk: reserveBreaches / iterations,
      operatingReserve: lab.operatingReserve,
      milestoneChance: milestones / iterations,
      expectedValue: totalExpectedValue / iterations,
      p10: percentile(0.1),
      p50: percentile(0.5),
      p90: percentile(0.9)
    };
  }

  function deterministicCashSeries(ids, months = 18) {
    const evaluated = evaluatePortfolio(ids);
    const plan = monthlyPortfolioPlan(ids, { forceSuccess: true });
    let cash = lab.cash;
    const series = [{ month: 0, cash }];
    for (let month = 1; month <= months; month += 1) {
      const monthPlan = plan.months[month - 1];
      cash -= monthPlan ? monthPlan.burn : fixedRunRate(ids);
      cash += monthPlan ? monthPlan.payouts : 0;
      series.push({ month, cash });
    }
    return { series, evaluated };
  }

  function sensitivity(metrics) {
    const cacheKey = metrics.ids.join("|");
    if (sensitivityCache.has(cacheKey)) return sensitivityCache.get(cacheKey);

    const baseline = simulatePortfolio(metrics.ids, SENSITIVITY_ITERATIONS, 501);
    const scenarios = [
      {
        label: "CRO cost overrun",
        stress: { categoryFactors: { outsourcing: 1.25 } },
        detailBase: "Outsourcing and assay service quotes +25%"
      },
      {
        label: "Animal facility delay",
        stress: { resourceDelayKeys: { animalFacility: 2 } },
        detailBase: "Animal room capacity slips by two months"
      },
      {
        label: "Wet-lab FTE load",
        stress: { roleDemandMultipliers: { scientist: 1.15, ra: 1.15 } },
        detailBase: "Scientist and RA demand +15%"
      },
      {
        label: "Grant reimbursement delay",
        stress: { grantDelayExtra: 2, grantDelayProbabilityMultiplier: 1.5 },
        detailBase: "Restricted cash arrives two months later"
      },
      {
        label: "Core facility queue",
        stress: { categoryFactors: { core: 1.2 }, resourceDelayKeys: { sequencing: 1, microscopy: 1 } },
        detailBase: "Sequencing and microscopy cost +20%"
      }
    ];

    const rows = scenarios.map((scenario, index) => {
      const scenarioSeed = 701 + index * 37;
      const scenarioBaseline = simulatePortfolio(metrics.ids, SENSITIVITY_ITERATIONS, scenarioSeed);
      const stressed = simulatePortfolio(metrics.ids, SENSITIVITY_ITERATIONS, scenarioSeed, scenario.stress);
      const rawDelta = stressed.reserveBreachRisk - scenarioBaseline.reserveBreachRisk;
      const rawMilestoneDelta = scenarioBaseline.milestoneChance - stressed.milestoneChance;
      const delta = Math.max(0, rawDelta);
      const milestoneDelta = Math.max(0, rawMilestoneDelta);
      const value = Math.max(0.005, delta + milestoneDelta * 0.35);
      const pp = Math.round(delta * 100);
      return {
        label: scenario.label,
        value,
        rawDelta,
        delta,
        milestoneDelta,
        detail: `${scenario.detailBase}; reserve risk +${pp} pp`
      };
    });
    const max = Math.max(...rows.map((row) => row.value), 0.01);
    const result = rows
      .map((row) => ({ ...row, normalized: row.value / max }))
      .sort((a, b) => b.value - a.value);
    sensitivityCache.set(cacheKey, result);
    return result;
  }

  function decisionSummary(rec) {
    return `${rec.fund.length} fund, ${rec.pause.length} pause, ${rec.stop.length} stop`;
  }

  function statusForProject(projectId, rec) {
    if (rec.fund.includes(projectId)) return "fund";
    if (rec.stop.includes(projectId)) return "stop";
    return "pause";
  }

  function names(ids) {
    return ids.map(getProject).map((project) => project.name);
  }

  function topBottleneck(metrics) {
    const overloadedRole = metrics.roleRows
      .filter((row) => row.utilization > 1)
      .sort((a, b) => b.utilization - a.utilization)[0];
    const overloadedResource = metrics.resourceRows
      .filter((row) => row.utilization > 1)
      .sort((a, b) => b.utilization - a.utilization)[0];
    if (overloadedResource && (!overloadedRole || overloadedResource.utilization >= overloadedRole.utilization)) {
      return {
        title: overloadedResource.label,
        detail: `${Math.round(overloadedResource.utilization * 100)}% of capacity`
      };
    }
    if (overloadedRole) {
      return {
        title: overloadedRole.label,
        detail: `${overloadedRole.required.toFixed(1)} FTE required vs ${overloadedRole.available.toFixed(1)} available`
      };
    }
    const busiest = metrics.roleRows.sort((a, b) => b.utilization - a.utilization)[0];
    return {
      title: busiest ? busiest.label : "No bottleneck",
      detail: busiest ? `${Math.round(busiest.utilization * 100)}% utilized` : "Capacity is within plan"
    };
  }

  function updateText(id, value) {
    const node = document.getElementById(id);
    if (node) node.textContent = value;
  }

  function syncScenarioControls() {
    const cashInput = document.getElementById("cashInput");
    const reserveInput = document.getElementById("reserveInput");
    const wetlabRange = document.getElementById("wetlabRange");
    const croRange = document.getElementById("croRange");
    const animalToggle = document.getElementById("animalToggle");
    if (cashInput) cashInput.value = state.scenario.cash;
    if (reserveInput) reserveInput.value = state.scenario.operatingReserve;
    if (wetlabRange) wetlabRange.value = state.scenario.wetlabFte;
    if (croRange) croRange.value = state.scenario.croMultiplier;
    if (animalToggle) animalToggle.checked = state.scenario.includeAnimal;
    updateText("wetlabValue", `${state.scenario.wetlabFte.toFixed(2)} FTE`);
    updateText("croValue", `${Math.round(state.scenario.croMultiplier * 100)}%`);
  }

  function readScenarioControls() {
    const cash = Number(document.getElementById("cashInput").value);
    const reserve = Number(document.getElementById("reserveInput").value);
    const wetlab = Number(document.getElementById("wetlabRange").value);
    const cro = Number(document.getElementById("croRange").value);
    const includeAnimal = document.getElementById("animalToggle").checked;
    state.scenario.cash = Number.isFinite(cash) ? cash : 1200000;
    state.scenario.operatingReserve = Number.isFinite(reserve) ? reserve : 420000;
    state.scenario.wetlabFte = Number.isFinite(wetlab) ? wetlab : 2;
    state.scenario.croMultiplier = Number.isFinite(cro) ? cro : 1;
    state.scenario.includeAnimal = includeAnimal;
    sensitivityCache.clear();
    applyScenario();
    syncScenarioControls();
    render();
  }

  function resetScenario() {
    state.scenario = {
      cash: 1200000,
      operatingReserve: 420000,
      wetlabFte: 2,
      croMultiplier: 1,
      includeAnimal: true
    };
    sensitivityCache.clear();
    applyScenario();
    syncScenarioControls();
    render();
  }

  function create(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function debounce(fn, delay = 250) {
    let timeout = null;
    return (...args) => {
      window.clearTimeout(timeout);
      timeout = window.setTimeout(() => fn(...args), delay);
    };
  }

  function sanitizeMemoHtml(html) {
    const template = document.createElement("template");
    template.innerHTML = html || "";
    const allowed = new Set(["H3", "P", "UL", "LI", "STRONG"]);
    const cleanNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE) return document.createTextNode(node.textContent || "");
      if (node.nodeType !== Node.ELEMENT_NODE) return document.createTextNode("");
      const tag = node.tagName;
      const fragment = document.createDocumentFragment();
      Array.from(node.childNodes).forEach((child) => fragment.append(cleanNode(child)));
      if (!allowed.has(tag)) return fragment;
      const clean = document.createElement(tag.toLowerCase());
      clean.append(fragment);
      return clean;
    };
    const output = document.createDocumentFragment();
    Array.from(template.content.childNodes).forEach((node) => output.append(cleanNode(node)));
    const wrapper = document.createElement("div");
    wrapper.append(output);
    return wrapper.innerHTML;
  }

  function renderWhyNotAll(currentMetrics, selectedMetrics, rec) {
    const container = document.getElementById("whyNotAllList");
    if (!container) return;
    container.innerHTML = "";
    const currentBottleneck = currentMetrics.phaseBottleneck || topBottleneck(currentMetrics);
    const animalWindow = peakResourceWindow(currentMetrics.plan, "animalFacility") || "months 4-7";
    const topRole = currentMetrics.roleRows
      .filter((row) => row.utilization > 1)
      .sort((a, b) => b.utilization - a.utilization)[0];
    const rows = [
      {
        title: "Cash discipline",
        tone: "danger",
        body: `Funding every active project burns ${formatMoney(currentMetrics.monthlyBurn)}/mo and leaves ${formatMonths(currentMetrics.runway)} runway. The selected plan cuts burn to ${formatMoney(selectedMetrics.monthlyBurn)}/mo.`
      },
      {
        title: "Execution bottleneck",
        tone: "warn",
        body: `${currentBottleneck.title || currentBottleneck.label} peaks at ${currentBottleneck.detail || `${Math.round(currentBottleneck.utilization * 100)}% capacity`} in the all-project plan.`
      },
      {
        title: "Milestone gate",
        tone: rec.stop.includes("animal") ? "danger" : "warn",
        body: !state.scenario.includeAnimal
          ? "Animal validation is outside this scenario, so the optimizer reallocates cash and FTE to non-animal milestones."
          : rec.stop.includes("animal")
          ? `Animal validation is stopped because facility demand peaks in ${animalWindow}; it should wait for stronger pilot data or partner cash.`
          : `Animal validation remains in scope, but it is treated as a gated phase rather than an always-on expense.`
      },
      {
        title: "Staffing reality",
        tone: "warn",
        body: topRole
          ? `${topRole.label} requires ${topRole.required.toFixed(1)} FTE against ${topRole.available.toFixed(1)} available in the all-project plan.`
          : "The selected plan keeps key scientific roles within available capacity."
      }
    ];
    rows.forEach((row) => {
      const node = create("div", `reason-row ${row.tone}`);
      node.append(create("strong", "", row.title), create("p", "", row.body));
      container.append(node);
    });
  }

  function renderModelAudit(metrics, simulation) {
    const container = document.getElementById("modelAuditList");
    if (!container) return;
    container.innerHTML = "";
    const rows = [
      ["Decision engine", "Deterministic optimizer chooses fund / pause / stop before any GPT text is generated."],
      ["Lab execution model", "Month-by-month phases model setup, pilot, validation, readout, FTE, core facilities, CRO and animal capacity."],
      ["Monte Carlo", `${simulation.iterations.toLocaleString()} iterations stress-test cost overruns, duration delays, milestone failure and grant reimbursement timing.`],
      ["Risk definition", `Financing reserve breach means cash falls below ${formatMoney(lab.operatingReserve)} within ${SIMULATION_MONTHS} months.`],
      ["Sensitivity", "Each driver is rerun as a stressed scenario and ranked by incremental reserve breach risk."],
      ["GPT boundary", "GPT-5.6 explains computed outputs and drafts the memo; it does not choose the portfolio."]
    ];
    rows.forEach(([title, body], index) => {
      const node = create("div", `audit-row ${index === 5 ? "warn" : ""}`);
      node.append(create("strong", "", title), create("p", "", body));
      container.append(node);
    });
    const gptStatus = document.getElementById("gptStatus");
    if (gptStatus) {
      gptStatus.textContent = "GPT-5.6 runtime uses /api/gpt when OPENAI_API_KEY is configured; otherwise GrantPilot uses deterministic local fallback text.";
    }
  }

  function renderStrategySummary(metrics, simulation, strategy, emergencyMode = false) {
    const container = document.getElementById("strategySummary");
    container.innerHTML = "";
    [
      ["Strategy", emergencyMode ? "Emergency Bridge Plan" : strategies[strategy].label],
      ["Expected runway", formatMonths(metrics.runway)],
      ["Milestone chance", formatPercent(simulation.milestoneChance)]
    ].forEach(([label, value]) => {
      const item = create("div", "mini-metric");
      item.append(create("span", "", label), create("strong", "", value));
      container.append(item);
    });
  }

  function renderCostStack(metrics) {
    const container = document.getElementById("costStack");
    container.innerHTML = "";
    const entries = Object.entries(metrics.breakdown)
      .filter(([, value]) => value > 0)
      .sort((a, b) => b[1] - a[1]);
    const max = Math.max(...entries.map(([, value]) => value));
    entries.forEach(([key, value]) => {
      const row = create("div", "cost-row");
      const label = create("strong", "", categoryLabels[key] || key);
      const track = create("div", "bar-track");
      const fill = create("div", "bar-fill");
      fill.style.width = `${Math.max(4, (value / max) * 100)}%`;
      track.append(fill);
      const amount = create("span", "row-meta", `${formatMoney(value)}/mo`);
      row.append(label, track, amount);
      container.append(row);
    });
  }

  function renderFte(metrics) {
    const container = document.getElementById("fteList");
    container.innerHTML = "";
    metrics.roleRows
      .filter((row) => row.required > 0.02)
      .sort((a, b) => b.utilization - a.utilization)
      .forEach((row) => {
        const fteRow = create("div", "fte-row");
        const label = create("strong", "", row.label);
        const track = create("div", "bar-track");
        const fill = create("div", row.utilization > 1 ? "bar-fill danger" : row.utilization > 0.85 ? "bar-fill warn" : "bar-fill");
        fill.style.width = `${Math.min(100, Math.max(4, row.utilization * 100))}%`;
        track.append(fill);
        const meta = create("span", "row-meta", `${row.required.toFixed(1)} / ${row.available.toFixed(1)} FTE`);
        fteRow.append(label, track, meta);
        container.append(fteRow);
      });

    const resource = metrics.phaseBottleneck || metrics.resourceRows.find((row) => row.utilization > 1) || metrics.resourceRows[0];
    const currentPlan = evaluatePortfolio(projectIds());
    const currentAnimal = currentPlan.resourceRows.find((row) => row.key === "animalFacility" && row.utilization > 1);
    const selectedIncludesAnimal = metrics.ids.includes("animal");
    if (!selectedIncludesAnimal && currentAnimal) {
      const animalWindow = peakResourceWindow(currentPlan.plan, "animalFacility") || "months 4-7";
      updateText("resourceWarning", `Current all-project plan overloads animal facility capacity in ${animalWindow}; the selected plan removes that gated bottleneck.`);
    } else if (resource) {
      updateText("resourceWarning", `${resource.label} peaks in ${resource.window || "the active phase"} at ${Math.round(resource.utilization * 100)}% capacity: ${Math.round(resource.required)} ${resource.unit} required vs ${resource.capacity} available.`);
    } else {
      updateText("resourceWarning", "No critical facility bottleneck in the selected plan.");
    }
  }

  function renderSensitivity(metrics) {
    const container = document.getElementById("sensitivityList");
    container.innerHTML = "";
    sensitivity(metrics).forEach((item, index) => {
      const row = create("div", "sensitivity-row");
      const label = create("strong", "", item.label);
      const track = create("div", "bar-track");
      const fill = create("div", index === 0 ? "bar-fill danger" : index === 1 ? "bar-fill warn" : "bar-fill");
      fill.style.width = `${Math.max(5, item.normalized * 100)}%`;
      track.append(fill);
      const meta = create("span", "row-meta", item.detail);
      row.append(label, track, meta);
      container.append(row);
    });
  }

  function renderProjectTable(rec) {
    const tbody = document.getElementById("projectTableBody");
    tbody.innerHTML = "";
    activeProjects().forEach((project) => {
      const status = statusForProject(project.id, rec);
      const row = document.createElement("tr");
      const projectCell = document.createElement("td");
      projectCell.append(create("span", "project-name", project.name));
      projectCell.append(create("span", "project-detail", project.strategicDependency));

      const statusCell = document.createElement("td");
      statusCell.append(create("span", `badge ${status}`, status));

      const projectPlan = monthlyPortfolioPlan([project]);
      const projectBreakdown = averageBreakdownFromPlan(projectPlan, SNAPSHOT_HORIZON_MONTHS);
      const cost = Object.values(projectBreakdown).reduce((sum, value) => sum + value, 0) - fixedRunRate([project]);
      const constraint = topProjectConstraint(project);

      row.append(
        projectCell,
        statusCell,
        create("td", "", project.stage),
        create("td", "", phaseSummary(project)),
        create("td", "", `${formatPercent(project.success.low)}-${formatPercent(project.success.high)}`),
        create("td", "", `${project.duration.low}-${project.duration.high} mo`),
        create("td", "", `${formatMoney(cost)}/mo`),
        create("td", "", constraint)
      );
      tbody.append(row);
    });
  }

  function topProjectConstraint(project) {
    const role = Object.entries(project.roles)
      .sort((a, b) => b[1] - a[1])[0];
    const resource = Object.entries(project.resources || {})
      .sort((a, b) => b[1] - a[1])[0];
    if (resource) {
      const definition = lab.resources[resource[0]];
      if (definition && resource[1] >= definition.capacity * 0.8) return definition.label;
    }
    return lab.roles[role[0]].label;
  }

  function phaseSummary(project) {
    return projectPhases(project)
      .map((phase) => {
        const end = phase.start + phase.duration - 1;
        const range = phase.start === end ? `M${phase.start}` : `M${phase.start}-${end}`;
        return `${phase.name} ${range}`;
      })
      .join("; ");
  }

  function drawCashChart(currentIds, selectedIds) {
    const canvas = document.getElementById("cashChart");
    if (!canvas) return;
    const ctx = prepareCanvas(canvas);
    const width = canvas.width;
    const height = canvas.height;
    const padding = { left: 62, right: 16, top: 18, bottom: 42 };
    ctx.clearRect(0, 0, width, height);

    const current = deterministicCashSeries(currentIds).series;
    const selected = deterministicCashSeries(selectedIds).series;
    const all = [...current, ...selected];
    const minCash = Math.min(-100000, ...all.map((point) => point.cash));
    const maxCash = Math.max(lab.cash, ...all.map((point) => point.cash));
    const x = (month) => padding.left + (month / 18) * (width - padding.left - padding.right);
    const y = (cash) => padding.top + (1 - (cash - minCash) / (maxCash - minCash)) * (height - padding.top - padding.bottom);

    drawGrid(ctx, width, height, padding, x, y, minCash, maxCash);
    drawLine(ctx, current, x, y, "#a34236", "Current");
    drawLine(ctx, selected, x, y, "#176b5f", "GrantPilot");

    ctx.fillStyle = "#17201c";
    ctx.font = "13px system-ui";
    ctx.fillText("Current plan", padding.left + 10, padding.top + 14);
    ctx.fillStyle = "#176b5f";
    ctx.fillText("GrantPilot plan", padding.left + 112, padding.top + 14);
  }

  function drawRunwayChart(simulation) {
    const canvas = document.getElementById("runwayChart");
    if (!canvas) return;
    const ctx = prepareCanvas(canvas);
    const width = canvas.width;
    const height = canvas.height;
    const padding = { left: 42, right: 18, top: 18, bottom: 36 };
    ctx.clearRect(0, 0, width, height);
    const bins = Array.from({ length: 12 }, (_, index) => ({ month: index + 8, count: 0 }));
    simulation.runways.forEach((month) => {
      const clamped = Math.min(19, Math.max(8, month));
      bins[clamped - 8].count += 1;
    });
    const max = Math.max(...bins.map((bin) => bin.count), 1);
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;
    const barGap = 4;
    const barWidth = plotWidth / bins.length - barGap;

    ctx.strokeStyle = "#d9e0dc";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, height - padding.bottom);
    ctx.lineTo(width - padding.right, height - padding.bottom);
    ctx.stroke();

    bins.forEach((bin, index) => {
      const barHeight = (bin.count / max) * plotHeight;
      const left = padding.left + index * (plotWidth / bins.length) + barGap / 2;
      const top = height - padding.bottom - barHeight;
      ctx.fillStyle = bin.month < 12 ? "#a34236" : bin.month < 15 ? "#a5671b" : "#176b5f";
      ctx.fillRect(left, top, Math.max(1, barWidth), barHeight);
      if (index % 2 === 0) {
        ctx.fillStyle = "#66736d";
        ctx.font = "12px system-ui";
        ctx.textAlign = "center";
        ctx.fillText(`${bin.month}`, left + barWidth / 2, height - 12);
      }
    });

    ctx.textAlign = "left";
    ctx.fillStyle = "#66736d";
    ctx.font = "12px system-ui";
    ctx.fillText("Runway month", padding.left, height - 12);
  }

  function prepareCanvas(canvas) {
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(320, Math.floor(rect.width * ratio));
    const height = Math.max(180, Math.floor(canvas.height * ratio));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    const ctx = canvas.getContext("2d");
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    return ctx;
  }

  function drawGrid(ctx, width, height, padding, x, y, minCash, maxCash) {
    ctx.strokeStyle = "#d9e0dc";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, height - padding.bottom);
    ctx.lineTo(width - padding.right, height - padding.bottom);
    ctx.stroke();

    ctx.fillStyle = "#66736d";
    ctx.font = "12px system-ui";
    ctx.textAlign = "right";
    [0, 0.5, 1].forEach((tick) => {
      const cash = minCash + (maxCash - minCash) * tick;
      const yy = y(cash);
      ctx.strokeStyle = "#edf1ef";
      ctx.beginPath();
      ctx.moveTo(padding.left, yy);
      ctx.lineTo(width - padding.right, yy);
      ctx.stroke();
      ctx.fillText(formatMoney(cash), padding.left - 8, yy + 4);
    });

    ctx.textAlign = "center";
    [0, 6, 12, 18].forEach((month) => {
      ctx.fillText(`${month}`, x(month), height - 14);
    });
    ctx.textAlign = "left";
    ctx.fillText("Months", padding.left, height - 14);
  }

  function drawLine(ctx, series, x, y, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    series.forEach((point, index) => {
      const xx = x(point.month);
      const yy = y(point.cash);
      if (index === 0) ctx.moveTo(xx, yy);
      else ctx.lineTo(xx, yy);
    });
    ctx.stroke();
    const last = series[series.length - 1];
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x(last.month), y(last.cash), 4, 0, Math.PI * 2);
    ctx.fill();
  }

  function buildMemo(metrics, simulation, rec, strategy) {
    const bottleneck = topBottleneck(evaluatePortfolio(projectIds()));
    const funded = names(rec.fund);
    const paused = names(rec.pause);
    const stopped = names(rec.stop);
    const current = evaluatePortfolio(projectIds());
    return `
      <h3>Recommendation</h3>
      <p>Adopt the ${metrics.emergencyMode ? "Emergency Bridge Plan" : strategies[strategy].label}. Fund ${funded.join(", ")}. Pause ${paused.join(", ") || "none"} and stop ${stopped.join(", ") || "none"} until the next financing or data gate.</p>
      <h3>Runway impact</h3>
      <ul>
        <li>Current plan burn: ${formatMoney(current.monthlyBurn)}/month with ${formatMonths(current.runway)} runway.</li>
        <li>GrantPilot plan burn: ${formatMoney(metrics.monthlyBurn)}/month with ${formatMonths(metrics.runway)} runway.</li>
        <li>Monte Carlo financing reserve breach risk under stated assumptions: ${formatPercent(simulation.reserveBreachRisk)}.</li>
      </ul>
      <h3>Scientific tradeoff</h3>
      <p>The plan protects platform-enabling work and the partner-facing milestone while avoiding premature animal validation. This keeps a credible path to a major milestone without loading scarce wet-lab and animal resources beyond capacity.</p>
      <h3>Primary risks</h3>
      <ul>
        <li>${bottleneck.title}: ${bottleneck.detail} in the current plan.</li>
        <li>Top sensitivity driver: ${sensitivity(metrics)[0].label}.</li>
        <li>GrantPilot stress-tests assumptions; it does not claim to predict scientific success.</li>
      </ul>
      <h3>Next 30 days</h3>
      <ul>
        <li>Freeze spend on stopped work and convert paused work into milestone-gated options.</li>
        <li>Lock core facility and CRO quotes for funded projects.</li>
        <li>Review wet-lab FTE allocation weekly and revisit the animal study only after stronger pilot data.</li>
      </ul>
    `;
  }

  function compactMetrics(metrics, simulation) {
    const bottleneck = metrics.phaseBottleneck || topBottleneck(metrics);
    return {
      fundedProjectIds: metrics.ids,
      monthlyBurn: Math.round(metrics.monthlyBurn),
      runwayMonths: Number(metrics.runway.toFixed(1)),
      reserveBreachRisk: Number((simulation.reserveBreachRisk || 0).toFixed(3)),
      majorMilestoneChance: Number((simulation.milestoneChance || 0).toFixed(3)),
      runwayRange: [simulation.p10, simulation.p50, simulation.p90],
      topBottleneck: bottleneck ? {
        label: bottleneck.label || bottleneck.title,
        utilization: bottleneck.utilization ? Number(bottleneck.utilization.toFixed(2)) : null,
        window: bottleneck.window || null,
        detail: bottleneck.detail || null
      } : null,
      topFteConstraints: metrics.roleRows
        .filter((row) => row.required > 0.02)
        .sort((a, b) => b.utilization - a.utilization)
        .slice(0, 4)
        .map((row) => ({
          role: row.label,
          required: Number(row.required.toFixed(2)),
          available: Number(row.available.toFixed(2)),
          utilization: Number(row.utilization.toFixed(2))
        })),
      sensitivity: sensitivity(metrics).slice(0, 5).map((row) => ({
        driver: row.label,
        reserveRiskDelta: Number(row.delta.toFixed(3)),
        detail: row.detail
      }))
    };
  }

  function gptContext(metrics, simulation, rec, strategy) {
    const currentMetrics = evaluatePortfolio(projectIds());
    const currentSimulation = simulatePortfolio(projectIds(), 800, 100);
    return {
      product: "GrantPilot",
      modelBoundary: "Deterministic cashflow, FTE, optimization, Monte Carlo, and sensitivity run before GPT writes text.",
      scenario: {
        cashOnHand: lab.cash,
        operatingReserve: lab.operatingReserve,
        wetLabScientistFte: lab.roles.scientist.available,
        croCostMultiplier: state.scenario.croMultiplier,
        animalValidationInScope: state.scenario.includeAnimal
      },
      strategy: metrics.emergencyMode ? "Emergency Bridge Plan" : strategies[strategy].label,
      recommendations: {
        fund: names(rec.fund),
        pause: names(rec.pause),
        stop: names(rec.stop)
      },
      currentPlan: compactMetrics(currentMetrics, currentSimulation),
      selectedPlan: compactMetrics(metrics, simulation),
      activeProjects: activeProjects().map((project) => ({
        id: project.id,
        name: project.name,
        stage: project.stage,
        successRange: [project.success.low, project.success.high],
        durationRangeMonths: [project.duration.low, project.duration.high],
        phasePlan: phaseSummary(project),
        strategicDependency: project.strategicDependency
      }))
    };
  }

  async function requestGpt(kind, context, question = "") {
    const response = await fetch("/api/gpt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, question, context })
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.error || `GPT request failed with ${response.status}`);
    }
    return payload;
  }

  async function generateGptMemo(metrics, simulation, rec, strategy) {
    const status = document.getElementById("gptStatus");
    const output = document.getElementById("memoOutput");
    if (status) status.textContent = "GPT-5.6 is drafting the board memo from computed model outputs...";
    try {
      const payload = await requestGpt("memo", gptContext(metrics, simulation, rec, strategy));
      if (payload.text && output) output.innerHTML = sanitizeMemoHtml(payload.text);
      if (status) status.textContent = `GPT memo generated with ${payload.model || "configured OpenAI model"}. Deterministic calculations remain local.`;
    } catch (error) {
      if (status) status.textContent = `GPT runtime unavailable: ${error.message}. Showing deterministic fallback memo.`;
    }
  }

  async function generateGptAnswer(question, metrics, simulation, rec) {
    const answer = document.getElementById("askAnswer");
    const status = document.getElementById("gptStatus");
    try {
      if (answer) answer.textContent = "GPT-5.6 is answering from the computed scenario...";
      const payload = await requestGpt("answer", gptContext(metrics, simulation, rec, state.strategy), question);
      if (answer) answer.textContent = payload.text || answerQuestion(question, metrics, simulation, rec);
      if (status) status.textContent = `Ask GrantPilot answered with ${payload.model || "configured OpenAI model"}.`;
    } catch (error) {
      if (answer) answer.textContent = answerQuestion(question, metrics, simulation, rec);
      if (status) status.textContent = `GPT runtime unavailable: ${error.message}. Showing deterministic fallback answer.`;
    }
  }

  async function checkGptStatus() {
    const status = document.getElementById("gptStatus");
    if (!status) return;
    try {
      const response = await fetch("/api/gpt/status");
      const payload = await response.json();
      status.textContent = payload.configured
        ? `GPT-5.6 runtime configured via ${payload.model}; memo and Ask use /api/gpt.`
        : `GPT-5.6 runtime not configured. Set OPENAI_API_KEY to enable /api/gpt; fallback text remains available.`;
    } catch {
      status.textContent = "GPT status endpoint unavailable. Run node server.js to enable local GPT runtime.";
    }
  }

  function answerQuestion(question, metrics, simulation, rec) {
    const lower = question.toLowerCase();
    if (!question.trim()) return "Ask a scenario question about runway, staffing, bottlenecks, or project tradeoffs.";

    if (lower.includes("animal")) {
      const ids = Array.from(new Set([...rec.fund, "animal"]));
      const withAnimal = evaluatePortfolio(ids);
      const sim = simulatePortfolio(ids, 650, 211);
      if (withAnimal.runway >= 12 && sim.reserveBreachRisk < 0.45) {
        return `Yes, but only with gating. Adding animal validation leaves ${formatMonths(withAnimal.runway)} deterministic runway and ${formatPercent(sim.reserveBreachRisk)} simulated financing reserve breach risk. Keep it behind the assay QC gate and lock facility slots before spend ramps.`;
      }
      return `Not under the current constraints. Keeping animal validation now reduces runway to ${formatMonths(withAnimal.runway)} and pushes financing reserve breach risk to ${formatPercent(sim.reserveBreachRisk)}. GrantPilot recommends delaying it until pilot data or partner cash improves the risk profile.`;
    }

    if (lower.includes("hire")) {
      const current = evaluatePortfolio(projectIds());
      const overloaded = current.roleRows
        .filter((row) => row.utilization > 1)
        .sort((a, b) => (b.utilization - 1) * b.cost - (a.utilization - 1) * a.cost)[0];
      if (!overloaded) return "The selected plan does not require an immediate hire. The better move is to reserve budget for CRO and core facility overruns.";
      return `The highest-leverage single hire is a ${overloaded.label}. The current all-project plan requires ${overloaded.required.toFixed(1)} FTE against ${overloaded.available.toFixed(1)} available, so this role is forcing delay risk and contractor spend.`;
    }

    if (lower.includes("board") || lower.includes("tell")) {
      return `Tell the board: GrantPilot recommends ${decisionSummary(rec)}. The selected plan cuts burn to ${formatMoney(metrics.monthlyBurn)}/month, extends deterministic runway to ${formatMonths(metrics.runway)}, and keeps ${formatPercent(simulation.milestoneChance)} simulated chance of at least one major milestone under stated assumptions. Financing reserve breach risk is ${formatPercent(simulation.reserveBreachRisk)}.`;
    }

    if (lower.includes("12 month") || lower.includes("12 months") || lower.includes("runway")) {
      return `The selected ${metrics.emergencyMode ? "Emergency Bridge Plan" : strategies[state.strategy].label} ${metrics.runway >= 12 ? "clears" : "does not yet clear"} the 12-month runway threshold with ${formatMonths(metrics.runway)} deterministic runway. The main watch item is ${sensitivity(metrics)[0].label}, which should be quote-locked or staged before the next board update.`;
    }

    return `GrantPilot would answer from the computed scenario: ${metrics.emergencyMode ? "Emergency Bridge Plan" : strategies[state.strategy].label} gives ${formatMonths(metrics.runway)} runway, ${formatPercent(simulation.reserveBreachRisk)} financing reserve breach risk, and ${formatPercent(simulation.milestoneChance)} chance of a major milestone. The most important risk driver is ${sensitivity(metrics)[0].label}.`;
  }

  function render() {
    applyScenario();
    const currentMetrics = evaluatePortfolio(projectIds());
    const currentSim = simulatePortfolio(projectIds(), 800, 100);
    const best = optimize(state.strategy);
    const metrics = best.metrics;
    const rec = recommendations(metrics.ids);
    const simulation = simulatePortfolio(metrics.ids, 1000, state.strategy.length * 31);
    const bottleneck = topBottleneck(currentMetrics);

    updateText("diagnosisText", `All-project plan: ${formatMonths(currentMetrics.runway)} runway, ${formatPercent(currentSim.reserveBreachRisk)} reserve breach risk, bottlenecked by ${bottleneck.title.toLowerCase()}.`);
    updateText("currentRunway", formatMonths(currentMetrics.runway));
    updateText("currentRisk", `${formatPercent(currentSim.reserveBreachRisk)} reserve breach risk`);
    updateText("optimizedRunway", formatMonths(metrics.runway));
    updateText("optimizedRisk", `${formatPercent(simulation.reserveBreachRisk)} reserve breach risk`);
    updateText("decisionCount", decisionSummary(rec));
    updateText("decisionSummary", best.emergencyMode ? "Emergency Bridge Plan" : strategies[state.strategy].label);
    updateText("cashOnHand", formatMoney(lab.cash));
    updateText("currentBurn", `${formatMoney(currentMetrics.monthlyBurn)}/mo`);
    updateText("optimizedBurn", `${formatMoney(metrics.monthlyBurn)}/mo`);
    updateText("burnDelta", `${Math.round((1 - metrics.monthlyBurn / currentMetrics.monthlyBurn) * 100)}% lower burn than current plan`);
    updateText("topBottleneck", bottleneck.title);
    updateText("bottleneckContext", bottleneck.detail);
      updateText("shortfallRisk", formatPercent(simulation.reserveBreachRisk));
      updateText("milestoneChance", formatPercent(simulation.milestoneChance));
      updateText("runwayRange", `${formatSimulationMonth(simulation.p10)}-${formatSimulationMonth(simulation.p90)}`);
    updateText("fundList", names(rec.fund).join(", "));
    updateText("pauseList", names(rec.pause).join(", ") || "None");
    updateText("stopList", names(rec.stop).join(", ") || "None");

    document.querySelectorAll(".strategy-tab").forEach((button) => {
      button.setAttribute("aria-pressed", button.dataset.strategy === state.strategy ? "true" : "false");
    });

    renderStrategySummary(metrics, simulation, state.strategy, best.emergencyMode);
    renderCostStack(metrics);
    renderFte(metrics);
    renderSensitivity(metrics);
    renderProjectTable(rec);
    renderWhyNotAll(currentMetrics, metrics, rec);
    renderModelAudit(metrics, simulation);
    drawCashChart(projectIds(), metrics.ids);
    drawRunwayChart(simulation);
    document.getElementById("memoOutput").innerHTML = buildMemo(metrics, simulation, rec, state.strategy);

    const answer = document.getElementById("askAnswer");
    if (!answer.textContent.trim()) {
      answer.textContent = answerQuestion("What should I tell the board?", metrics, simulation, rec);
    }
  }

  function initNavigationState() {
    const links = Array.from(document.querySelectorAll(".top-nav a"));
    const sections = links
      .map((link) => {
        const id = link.getAttribute("href")?.replace("#", "");
        return id ? { id, link, section: document.getElementById(id) } : null;
      })
      .filter((item) => item && item.section);

    if (!sections.length) return;

    const setActive = (id) => {
      sections.forEach((item) => {
        if (item.id === id) item.link.setAttribute("aria-current", "true");
        else item.link.removeAttribute("aria-current");
      });
    };

    setActive(sections[0].id);

    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-24% 0px -58% 0px", threshold: [0.1, 0.25, 0.5] }
    );

    sections.forEach((item) => observer.observe(item.section));
  }

  function init() {
    applyScenario();
    syncScenarioControls();
    initNavigationState();
    const debouncedScenarioUpdate = debounce(readScenarioControls, 250);
    ["cashInput", "reserveInput", "wetlabRange", "croRange", "animalToggle"].forEach((id) => {
      const node = document.getElementById(id);
      if (!node) return;
      node.addEventListener(id.endsWith("Range") ? "input" : "change", id.endsWith("Range") ? debouncedScenarioUpdate : readScenarioControls);
    });
    document.getElementById("resetScenarioBtn").addEventListener("click", resetScenario);

    document.querySelectorAll(".strategy-tab").forEach((button) => {
      button.addEventListener("click", () => {
        state.strategy = button.dataset.strategy;
        render();
      });
    });

    document.getElementById("jumpMemoBtn").addEventListener("click", () => {
      document.getElementById("boardMemo").scrollIntoView({ behavior: "smooth", block: "start" });
    });

    document.getElementById("refreshMemoBtn").addEventListener("click", () => {
      applyScenario();
      const best = optimize(state.strategy);
      const rec = recommendations(best.metrics.ids);
      const sim = simulatePortfolio(best.metrics.ids, 1000, state.strategy.length * 31);
      document.getElementById("memoOutput").innerHTML = buildMemo(best.metrics, sim, rec, state.strategy);
      generateGptMemo(best.metrics, sim, rec, state.strategy);
    });

    document.getElementById("questionButtons").addEventListener("click", (event) => {
      const button = event.target.closest("button[data-question]");
      if (!button) return;
      document.getElementById("askInput").value = button.dataset.question;
      document.getElementById("askButton").click();
    });

    document.getElementById("askButton").addEventListener("click", () => {
      applyScenario();
      const best = optimize(state.strategy);
      const rec = recommendations(best.metrics.ids);
      const sim = simulatePortfolio(best.metrics.ids, 1000, state.strategy.length * 31);
      const question = document.getElementById("askInput").value;
      document.getElementById("askAnswer").textContent = answerQuestion(question, best.metrics, sim, rec);
      generateGptAnswer(question, best.metrics, sim, rec);
    });

    window.addEventListener("resize", () => {
      window.clearTimeout(window.__grantPilotResize);
      window.__grantPilotResize = window.setTimeout(render, 120);
    });

    render();
    checkGptStatus();
  }

  return {
    lab,
    projects,
    state,
    evaluatePortfolio,
    optimize,
    recommendations,
    simulatePortfolio,
    sensitivity,
    monthlyPortfolioPlan,
    init
  };
})();

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", GrantPilot.init);
}

if (typeof module !== "undefined") {
  module.exports = GrantPilot;
}
