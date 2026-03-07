const params = new URLSearchParams(window.location.search);
const transferToken = params.get("token") || "";
const registryId = document.body.dataset.registry || "";

const TRANSFER_STORAGE_PREFIX = "biochar-feasibility-transfer:";
const FINAL_CREDITS_STORAGE_KEY = "biochar-feasibility-final-credits";

const registryNameEl = document.getElementById("registryName");
const methodologyLinksEl = document.getElementById("methodologyLinks");
const complianceTextEl = document.getElementById("complianceText");
const assumptionsListEl = document.getElementById("assumptionsList");

const inputAnnualBiochar = document.getElementById("inputAnnualBiochar");
const inputCarbonContent = document.getElementById("inputCarbonContent");
const inputPermanence = document.getElementById("inputPermanence");
const inputStableCarbon = document.getElementById("inputStableCarbon");
const inputProcessEmissions = document.getElementById("inputProcessEmissions");
const inputTransportEmissions = document.getElementById("inputTransportEmissions");
const inputLeakage = document.getElementById("inputLeakage");
const inputUncertaintyPct = document.getElementById("inputUncertaintyPct");
const inputBufferPct = document.getElementById("inputBufferPct");
const inputIssuance = document.getElementById("inputIssuance");
const inputAdditionalityAdj = document.getElementById("inputAdditionalityAdj");

const calcStatusEl = document.getElementById("calcStatus");
const grossCreditsEl = document.getElementById("grossCredits");
const netBeforeBufferEl = document.getElementById("netBeforeBuffer");
const finalCreditsEl = document.getElementById("finalCredits");

const sensitivityVariableEl = document.getElementById("sensitivityVariable");
const sensitivityLowEl = document.getElementById("sensitivityLow");
const sensitivityHighEl = document.getElementById("sensitivityHigh");
const sensitivityValueEl = document.getElementById("sensitivityValue");

const backBtn = document.getElementById("backToFeasibilityBtn");
const useResultBtn = document.getElementById("useResultBtn");

let breakdownChart = null;
let sensitivityChart = null;
let payload = null;

const REGISTRY_CONFIG = {
  verra: {
    name: "Verra",
    standard: "VCS",
    methodology: "VM0044",
    links: [
      { label: "Verra VM0044 (official)", url: "https://verra.org/methodologies/vm0044-methodology-for-biochar-utilization-in-soil-and-non-soil-applications/" },
      { label: "Verra VT0008 Additionality Tool", url: "https://verra.org/methodologies-tools/" },
    ],
    compliance: "This calculator follows VM0044 logic by quantifying gross removals from biochar carbon storage, subtracting project/transport/leakage emissions, applying uncertainty and buffer deductions, then applying issuance factors for conservative ex-ante screening.",
    defaults: { stableCarbon: 0.80, processE: 120, transportE: 40, leakageE: 30, uncertainty: 10, buffer: 12, issuance: 0.95, additionalityAdj: 1.00 },
  },
  puro: {
    name: "Puro.earth",
    standard: "Puro Standard",
    methodology: "Biochar Methodology",
    links: [
      { label: "Puro Biochar Methodology (official)", url: "https://puro.earth/biochar" },
      { label: "Puro Registry", url: "https://registry.puro.earth/projects" },
    ],
    compliance: "This calculator maps to Puro biochar quantification by starting with durable carbon storage and then applying conservative deductions for emissions, leakage, uncertainty and risk buffering before issuance-level adjustment.",
    defaults: { stableCarbon: 0.82, processE: 100, transportE: 35, leakageE: 25, uncertainty: 8, buffer: 8, issuance: 0.92, additionalityAdj: 1.00 },
  },
  gs: {
    name: "Gold Standard",
    standard: "GS4GG",
    methodology: "Project-specific quantification pathway",
    links: [
      { label: "Gold Standard for the Global Goals", url: "https://globalgoals.goldstandard.org/" },
      { label: "Gold Standard Our Standard", url: "https://www.goldstandard.org/gold-standard-for-the-global-goals/our-standard" },
    ],
    compliance: "This tool applies GS-style conservative impact accounting logic as a pre-feasibility screening model. Final crediting requires approved GS methodology pathway selection and full MRV documentation during project development.",
    defaults: { stableCarbon: 0.78, processE: 130, transportE: 45, leakageE: 35, uncertainty: 12, buffer: 15, issuance: 0.90, additionalityAdj: 0.98 },
  },
  isometric: {
    name: "Isometric",
    standard: "Isometric Biochar Protocol",
    methodology: "Biochar Production and Storage Protocol",
    links: [
      { label: "Isometric Biochar", url: "https://isometric.com/biochar" },
      { label: "Isometric Biochar Pathway", url: "https://isometric.com/pathways/biochar" },
    ],
    compliance: "This calculator aligns with Isometric-style protocol structure by quantifying gross durable storage, deducting full life-cycle emissions/leakage, then applying explicit uncertainty and issuance assumptions for conservative feasibility outputs.",
    defaults: { stableCarbon: 0.84, processE: 95, transportE: 30, leakageE: 20, uncertainty: 7, buffer: 10, issuance: 0.94, additionalityAdj: 1.00 },
  },
};

const ASSUMPTIONS = [
  "Feedstock eligibility and sustainability checks are completed and documented before validation.",
  "Biochar quality parameters (carbon content, H/Corg, and stability proxy) are based on representative lab data.",
  "All major project emissions (production energy, transport, preprocessing) are included in lifecycle deductions.",
  "Leakage risk is conservatively estimated and updated during project design and monitoring.",
  "Uncertainty deduction is applied to account for measurement, sampling, and model error margins.",
  "Buffer/risk deduction is assumed ex-ante and may change at validation/verification.",
  "Additionality and financial need must be evidenced with project-specific documentation.",
  "Final issuance depends on verifier review, registry rules, and monitoring evidence during project operation.",
];

function num(el, fallback = 0) {
  const v = Number(el.value);
  return Number.isFinite(v) ? v : fallback;
}

function loadPayload() {
  if (!transferToken) return null;
  try {
    const raw = sessionStorage.getItem(`${TRANSFER_STORAGE_PREFIX}${transferToken}`);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function setTextList(parent, items, asLinks = false) {
  parent.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    if (asLinks) {
      const a = document.createElement("a");
      a.href = item.url;
      a.target = "_blank";
      a.rel = "noreferrer";
      a.textContent = item.label;
      li.appendChild(a);
    } else {
      li.textContent = item;
    }
    parent.appendChild(li);
  });
}

function calculateCredits(inputOverride = {}) {
  const annualBiochar = inputOverride.annualBiochar ?? num(inputAnnualBiochar);
  const carbonContent = (inputOverride.carbonContent ?? num(inputCarbonContent)) / 100;
  const permanence = inputOverride.permanence ?? num(inputPermanence);
  const stableCarbon = inputOverride.stableCarbon ?? num(inputStableCarbon);
  const processE = inputOverride.processE ?? num(inputProcessEmissions);
  const transportE = inputOverride.transportE ?? num(inputTransportEmissions);
  const leakageE = inputOverride.leakageE ?? num(inputLeakage);
  const uncertaintyPct = (inputOverride.uncertaintyPct ?? num(inputUncertaintyPct)) / 100;
  const bufferPct = (inputOverride.bufferPct ?? num(inputBufferPct)) / 100;
  const issuance = inputOverride.issuance ?? num(inputIssuance);
  const additionalityAdj = inputOverride.additionalityAdj ?? num(inputAdditionalityAdj);

  const gross = Math.max(0, annualBiochar * carbonContent * stableCarbon * permanence * 3.667 * additionalityAdj);
  const deductions = Math.max(0, processE) + Math.max(0, transportE) + Math.max(0, leakageE);
  const netBeforeDiscounts = Math.max(0, gross - deductions);
  const afterUncertainty = netBeforeDiscounts * Math.max(0, 1 - uncertaintyPct);
  const afterBuffer = afterUncertainty * Math.max(0, 1 - bufferPct);
  const final = Math.max(0, afterBuffer * issuance);

  return {
    gross,
    processE,
    transportE,
    leakageE,
    netBeforeDiscounts,
    uncertaintyLoss: Math.max(0, netBeforeDiscounts - afterUncertainty),
    bufferLoss: Math.max(0, afterUncertainty - afterBuffer),
    issuanceLoss: Math.max(0, afterBuffer - final),
    final,
  };
}

function renderBreakdownChart(result) {
  if (!window.Chart) return;
  const ctx = document.getElementById("calcChart");
  const labels = ["Gross", "Process E", "Transport E", "Leakage", "Uncertainty", "Buffer", "Issuance", "Final"];
  const values = [
    result.gross,
    -result.processE,
    -result.transportE,
    -result.leakageE,
    -result.uncertaintyLoss,
    -result.bufferLoss,
    -result.issuanceLoss,
    result.final,
  ];

  if (breakdownChart) breakdownChart.destroy();
  breakdownChart = new window.Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{ label: "tCO2e/year", data: values }],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } },
    },
  });
}

function renderSensitivityChart() {
  if (!window.Chart) return;
  const variable = sensitivityVariableEl.value;
  const lowPct = num(sensitivityLowEl, -20);
  const highPct = num(sensitivityHighEl, 20);

  const points = [];
  for (let p = lowPct; p <= highPct; p += 5) {
    const multiplier = 1 + (p / 100);
    const overrides = {};
    if (variable === "carbonContent") overrides.carbonContent = num(inputCarbonContent) * multiplier;
    if (variable === "permanence") overrides.permanence = num(inputPermanence) * multiplier;
    if (variable === "stableCarbon") overrides.stableCarbon = num(inputStableCarbon) * multiplier;
    if (variable === "processE") overrides.processE = num(inputProcessEmissions) * multiplier;
    points.push({ x: p, y: calculateCredits(overrides).final });
  }

  const current = calculateCredits().final;
  sensitivityValueEl.textContent = `${current.toFixed(2)} tCO2e/year at current inputs`;

  const ctx = document.getElementById("sensitivityChart");
  if (sensitivityChart) sensitivityChart.destroy();
  sensitivityChart = new window.Chart(ctx, {
    type: "line",
    data: {
      datasets: [{
        label: "Final credits sensitivity",
        data: points,
        parsing: false,
        borderWidth: 2,
      }],
    },
    options: {
      responsive: true,
      scales: {
        x: { type: "linear", title: { display: true, text: "Input variation (%)" } },
        y: { beginAtZero: true, title: { display: true, text: "Final credits (tCO2e/year)" } },
      },
    },
  });
}

function renderAll() {
  const result = calculateCredits();
  grossCreditsEl.value = result.gross.toFixed(2);
  netBeforeBufferEl.value = result.netBeforeDiscounts.toFixed(2);
  finalCreditsEl.value = result.final.toFixed(2);

  const requiredOk = num(inputAnnualBiochar) > 0 && num(inputCarbonContent) > 0 && num(inputPermanence) > 0;
  calcStatusEl.textContent = requiredOk
    ? "Inputs complete for screening calculation."
    : "Provide required inputs (annual biochar, carbon content, permanence) for valid result.";

  renderBreakdownChart(result);
  renderSensitivityChart();
}

function initDefaults(config) {
  const d = config.defaults;
  inputStableCarbon.value = String(d.stableCarbon);
  inputProcessEmissions.value = String(d.processE);
  inputTransportEmissions.value = String(d.transportE);
  inputLeakage.value = String(d.leakageE);
  inputUncertaintyPct.value = String(d.uncertainty);
  inputBufferPct.value = String(d.buffer);
  inputIssuance.value = String(d.issuance);
  inputAdditionalityAdj.value = String(d.additionalityAdj);
}

function initFromPayload() {
  payload = loadPayload();
  if (!payload) return;
  const d = payload.form_data || {};
  inputAnnualBiochar.value = d.q5_annual_biochar_t || "0";
  inputCarbonContent.value = d.q6_biochar_carbon_content_pct || "0";
  inputPermanence.value = payload.tentative_permanence_factor || "0.80";
}

function initPage() {
  const config = REGISTRY_CONFIG[registryId] || REGISTRY_CONFIG.verra;
  registryNameEl.textContent = `${config.name} | ${config.standard}`;
  complianceTextEl.textContent = config.compliance;
  setTextList(methodologyLinksEl, config.links, true);
  setTextList(assumptionsListEl, ASSUMPTIONS, false);
  initDefaults(config);
  initFromPayload();
  renderAll();
}

[
  inputAnnualBiochar,
  inputCarbonContent,
  inputPermanence,
  inputStableCarbon,
  inputProcessEmissions,
  inputTransportEmissions,
  inputLeakage,
  inputUncertaintyPct,
  inputBufferPct,
  inputIssuance,
  inputAdditionalityAdj,
  sensitivityVariableEl,
  sensitivityLowEl,
  sensitivityHighEl,
].forEach((el) => el.addEventListener("input", renderAll));

backBtn.addEventListener("click", () => {
  window.location.href = "./biochar-phase1-feasibility-tool.html?section=tentative";
});

useResultBtn.addEventListener("click", () => {
  const result = calculateCredits();
  const config = REGISTRY_CONFIG[registryId] || REGISTRY_CONFIG.verra;
  const payloadRegistry = payload?.registry_id || registryId;

  localStorage.setItem(
    FINAL_CREDITS_STORAGE_KEY,
    JSON.stringify({
      transfer_token: transferToken,
      registry_id: payloadRegistry,
      registry_name: payload?.registry_name || config.name,
      final_credits_tco2e: result.final,
      issuance_factor: num(inputIssuance),
      buffer_percent: num(inputBufferPct),
      uncertainty_percent: num(inputUncertaintyPct),
      process_emissions_tco2e: num(inputProcessEmissions),
      transport_emissions_tco2e: num(inputTransportEmissions),
      leakage_tco2e: num(inputLeakage),
      calculated_at_utc: new Date().toISOString(),
    })
  );

  window.location.href = "./biochar-phase1-feasibility-tool.html?section=tentative";
});

initPage();
