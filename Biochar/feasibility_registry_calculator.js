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

const permanenceClassSelect = document.getElementById("permanenceClassSelect");
const transportFactorSelect = document.getElementById("transportFactorSelect");
const autoTransportNote = document.getElementById("autoTransportNote");

const calcStatusEl = document.getElementById("calcStatus");
const grossCreditsEl = document.getElementById("grossCredits");
const netBeforeBufferEl = document.getElementById("netBeforeBuffer");
const finalCreditsEl = document.getElementById("finalCredits");

const sensitivityVariableEl = document.getElementById("sensitivityVariable");
const sensitivityLowEl = document.getElementById("sensitivityLow");
const sensitivityHighEl = document.getElementById("sensitivityHigh");
const sensitivityValueEl = document.getElementById("sensitivityValue");

const carbonGuideBody = document.getElementById("carbonGuideBody");
const permanenceGuideBody = document.getElementById("permanenceGuideBody");
const transportGuideBody = document.getElementById("transportGuideBody");
const tenYearCreditsBody = document.getElementById("tenYearCreditsBody");
const cumulative10YearEl = document.getElementById("cumulative10Year");

const backBtn = document.getElementById("backToFeasibilityBtn");
const useResultBtn = document.getElementById("useResultBtn");

let breakdownChart = null;
let sensitivityChart = null;
let payload = null;
let feedstockEntries = [];

const REGISTRY_CONFIG = {
  verra: {
    name: "Verra",
    standard: "VCS",
    methodology: "VM0044",
    links: [
      { label: "Verra VM0044", url: "https://verra.org/methodologies/vm0044-methodology-for-biochar-utilization-in-soil-and-non-soil-applications/" },
      { label: "Verra Methodologies and Tools", url: "https://verra.org/methodologies-tools/" },
    ],
    compliance: "Guide-level screening aligned with VM0044 structure: quantify durable storage, subtract project emissions/leakage, apply conservative uncertainty and risk deductions, then issuance adjustment.",
    defaults: { stableCarbon: 0.80, processE: 120, leakageE: 30, uncertainty: 10, buffer: 12, issuance: 0.95, additionalityAdj: 1.00 },
  },
  puro: {
    name: "Puro.earth",
    standard: "Puro Standard",
    methodology: "Biochar Methodology",
    links: [
      { label: "Puro Biochar Overview", url: "https://puro.earth/biochar" },
      { label: "Puro Registry", url: "https://registry.puro.earth/projects" },
    ],
    compliance: "Guide-level screening aligned with Puro biochar pathway logic, using durable carbon accounting and conservative project deductions.",
    defaults: { stableCarbon: 0.82, processE: 100, leakageE: 25, uncertainty: 8, buffer: 8, issuance: 0.92, additionalityAdj: 1.00 },
  },
  gs: {
    name: "Gold Standard",
    standard: "GS4GG",
    methodology: "Project-specific approved pathway",
    links: [
      { label: "Gold Standard for the Global Goals", url: "https://globalgoals.goldstandard.org/" },
      { label: "Gold Standard - Our Standard", url: "https://www.goldstandard.org/gold-standard-for-the-global-goals/our-standard" },
    ],
    compliance: "Guide-level screening for GS projects. Final compliance requires approved GS quantification pathway, validation and monitoring evidence.",
    defaults: { stableCarbon: 0.78, processE: 130, leakageE: 35, uncertainty: 12, buffer: 15, issuance: 0.90, additionalityAdj: 0.98 },
  },
  isometric: {
    name: "Isometric",
    standard: "Isometric Biochar Protocol",
    methodology: "Protocol-aligned pathway",
    links: [
      { label: "Isometric Biochar", url: "https://isometric.com/biochar" },
      { label: "Isometric Pathways", url: "https://isometric.com/pathways/biochar" },
    ],
    compliance: "Guide-level screening aligned with Isometric protocol framing for durable removals, lifecycle deductions and conservative credit issuance assumptions.",
    defaults: { stableCarbon: 0.84, processE: 95, leakageE: 20, uncertainty: 7, buffer: 10, issuance: 0.94, additionalityAdj: 1.00 },
  },
};

const CARBON_GUIDE = [
  { feedstock: "Animal manure", carbon: 0.38, source: "Literature default (screening)" },
  { feedstock: "Wood", carbon: 0.77, source: "Literature default (screening)" },
  { feedstock: "Biosolids (Paper sludge)", carbon: 0.35, source: "Literature default (screening)" },
];

const PERMANENCE_GUIDE = [
  { key: "high", label: "High temperature pyrolysis / gasification (>600 C)", factor: 0.89 },
  { key: "medium", label: "Medium temperature pyrolysis (450-600 C)", factor: 0.80 },
  { key: "low", label: "Low temperature pyrolysis (350-450 C)", factor: 0.65 },
];

const TRANSPORT_GUIDE = [
  { key: "truck", mode: "Road truck", factorKgTkm: 0.10, source: "Typical logistics default for screening" },
  { key: "rail", mode: "Rail", factorKgTkm: 0.03, source: "Typical logistics default for screening" },
  { key: "ship", mode: "Sea/river vessel", factorKgTkm: 0.015, source: "Typical logistics default for screening" },
];

const ASSUMPTIONS = [
  "Defaults are screening values; project-specific measured values should replace these during development.",
  "Feedstock eligibility and sustainability are validated against selected registry requirements.",
  "Carbon content and stability should be replaced with lab-tested values for issuance.",
  "Transport and process emissions must include all significant sources in final LCA/MRV.",
  "Leakage, uncertainty, buffer and issuance factors are conservative placeholders pending verifier review.",
  "Final credit issuance depends on registry verification and monitoring evidence.",
];

function num(el, fallback = 0) {
  const v = Number(el.value);
  return Number.isFinite(v) ? v : fallback;
}

function dominantFeedstockName() {
  if (!feedstockEntries.length) return "";
  const sorted = [...feedstockEntries].sort((a, b) => Number(b.quantity_tpy || 0) - Number(a.quantity_tpy || 0));
  return String(sorted[0]?.feedstock || "").toLowerCase();
}

function inferCarbonDefault() {
  const name = dominantFeedstockName();
  if (!name) return 0.77;
  if (name.includes("manure")) return 0.38;
  if (name.includes("sludge") || name.includes("biosolid") || name.includes("paper")) return 0.35;
  return 0.77;
}

function averageTransportDistanceKm() {
  if (!feedstockEntries.length) return 0;
  let weightedDist = 0;
  let totalQty = 0;
  feedstockEntries.forEach((e) => {
    const q = Number(e.quantity_tpy || 0);
    const d = Number(e.q4_transport_km || 0);
    if (q > 0 && d >= 0) {
      weightedDist += q * d;
      totalQty += q;
    }
  });
  return totalQty > 0 ? weightedDist / totalQty : 0;
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

function setList(parent, items, linkMode = false) {
  parent.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    if (linkMode) {
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

function fillGuideTables() {
  carbonGuideBody.innerHTML = CARBON_GUIDE.map((r) => `<tr><td>${r.feedstock}</td><td>${r.carbon}</td><td>${r.source}</td></tr>`).join("");
  permanenceGuideBody.innerHTML = PERMANENCE_GUIDE.map((r) => `<tr><td>${r.label}</td><td>${r.factor}</td></tr>`).join("");
  transportGuideBody.innerHTML = TRANSPORT_GUIDE.map((r) => `<tr><td>${r.mode}</td><td>${r.factorKgTkm}</td><td>${r.source}</td></tr>`).join("");

  permanenceClassSelect.innerHTML = PERMANENCE_GUIDE.map((r) => `<option value="${r.key}">${r.label}</option>`).join("");
  transportFactorSelect.innerHTML = TRANSPORT_GUIDE.map((r) => `<option value="${r.key}">${r.mode} (${r.factorKgTkm} kgCO2e/t-km)</option>`).join("");
}

function applyGuidedDefaults(config) {
  const d = config.defaults;
  inputStableCarbon.value = String(d.stableCarbon);
  inputProcessEmissions.value = String(d.processE);
  inputLeakage.value = String(d.leakageE);
  inputUncertaintyPct.value = String(d.uncertainty);
  inputBufferPct.value = String(d.buffer);
  inputIssuance.value = String(d.issuance);
  inputAdditionalityAdj.value = String(d.additionalityAdj);

  if (!inputAnnualBiochar.value) inputAnnualBiochar.value = "0";
  if (!inputCarbonContent.value || Number(inputCarbonContent.value) <= 0) {
    inputCarbonContent.value = String((inferCarbonDefault() * 100).toFixed(2));
  }

  if (!inputPermanence.value || Number(inputPermanence.value) <= 0) {
    permanenceClassSelect.value = "medium";
    inputPermanence.value = String(PERMANENCE_GUIDE.find((x) => x.key === "medium").factor);
  }
}

function applyPayloadValues() {
  payload = loadPayload();
  if (!payload) return;
  const d = payload.form_data || {};
  try {
    const parsed = JSON.parse(d.feedstock_entries_json || "[]");
    feedstockEntries = Array.isArray(parsed) ? parsed : [];
  } catch {
    feedstockEntries = [];
  }

  if (d.q5_annual_biochar_t) inputAnnualBiochar.value = d.q5_annual_biochar_t;
  if (d.q6_biochar_carbon_content_pct) inputCarbonContent.value = d.q6_biochar_carbon_content_pct;
  if (payload.tentative_permanence_factor) inputPermanence.value = payload.tentative_permanence_factor;
}

function autoTransportEmissions() {
  const avgKm = averageTransportDistanceKm();
  const annualBiomass = feedstockEntries.reduce((s, e) => s + Number(e.quantity_tpy || 0), 0);
  const selected = TRANSPORT_GUIDE.find((x) => x.key === transportFactorSelect.value) || TRANSPORT_GUIDE[0];
  const tco2e = (annualBiomass * avgKm * selected.factorKgTkm) / 1000;
  inputTransportEmissions.value = tco2e.toFixed(2);
  autoTransportNote.textContent = `Auto transport emissions from avg distance ${avgKm.toFixed(1)} km and ${selected.mode} factor.`;
}

function calculateCredits(overrides = {}) {
  const annualBiochar = overrides.annualBiochar ?? num(inputAnnualBiochar);
  const carbonContent = (overrides.carbonContent ?? num(inputCarbonContent)) / 100;
  const permanence = overrides.permanence ?? num(inputPermanence);
  const stableCarbon = overrides.stableCarbon ?? num(inputStableCarbon);
  const processE = overrides.processE ?? num(inputProcessEmissions);
  const transportE = overrides.transportE ?? num(inputTransportEmissions);
  const leakageE = overrides.leakageE ?? num(inputLeakage);
  const uncertaintyPct = (overrides.uncertaintyPct ?? num(inputUncertaintyPct)) / 100;
  const bufferPct = (overrides.bufferPct ?? num(inputBufferPct)) / 100;
  const issuance = overrides.issuance ?? num(inputIssuance);
  const additionalityAdj = overrides.additionalityAdj ?? num(inputAdditionalityAdj);

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

function renderTenYearTable(finalAnnual) {
  let cumulative = 0;
  tenYearCreditsBody.innerHTML = "";
  for (let y = 1; y <= 10; y += 1) {
    cumulative += finalAnnual;
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${y}</td><td>${finalAnnual.toFixed(2)}</td><td>${cumulative.toFixed(2)}</td>`;
    tenYearCreditsBody.appendChild(tr);
  }
  cumulative10YearEl.textContent = `${cumulative.toFixed(2)} tCO2e over 10 years`;
}

function renderBreakdownChart(result) {
  if (!window.Chart) return;
  const ctx = document.getElementById("calcChart");
  const labels = ["Gross", "Process", "Transport", "Leakage", "Uncertainty", "Buffer", "Issuance", "Final"];
  const values = [result.gross, -result.processE, -result.transportE, -result.leakageE, -result.uncertaintyLoss, -result.bufferLoss, -result.issuanceLoss, result.final];
  if (breakdownChart) breakdownChart.destroy();
  breakdownChart = new window.Chart(ctx, {
    type: "bar",
    data: { labels, datasets: [{ data: values, label: "tCO2e/year" }] },
    options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } },
  });
}

function renderSensitivityChart() {
  if (!window.Chart) return;
  const variable = sensitivityVariableEl.value;
  const low = num(sensitivityLowEl, -20);
  const high = num(sensitivityHighEl, 20);
  const points = [];
  for (let p = low; p <= high; p += 5) {
    const m = 1 + p / 100;
    const o = {};
    if (variable === "carbonContent") o.carbonContent = num(inputCarbonContent) * m;
    if (variable === "permanence") o.permanence = num(inputPermanence) * m;
    if (variable === "stableCarbon") o.stableCarbon = num(inputStableCarbon) * m;
    if (variable === "processE") o.processE = num(inputProcessEmissions) * m;
    points.push({ x: p, y: calculateCredits(o).final });
  }
  sensitivityValueEl.textContent = `${calculateCredits().final.toFixed(2)} tCO2e/year at current inputs`;

  const ctx = document.getElementById("sensitivityChart");
  if (sensitivityChart) sensitivityChart.destroy();
  sensitivityChart = new window.Chart(ctx, {
    type: "line",
    data: { datasets: [{ data: points, parsing: false, borderWidth: 2, label: "Final credits" }] },
    options: { responsive: true, scales: { x: { type: "linear", title: { display: true, text: "Input variation (%)" } }, y: { beginAtZero: true } } },
  });
}

function renderAll() {
  const res = calculateCredits();
  grossCreditsEl.value = res.gross.toFixed(2);
  netBeforeBufferEl.value = res.netBeforeDiscounts.toFixed(2);
  finalCreditsEl.value = res.final.toFixed(2);
  calcStatusEl.textContent = num(inputAnnualBiochar) > 0 ? "Using guided defaults and your project values." : "Provide annual output to activate full calculation.";
  renderTenYearTable(res.final);
  renderBreakdownChart(res);
  renderSensitivityChart();
}

function init() {
  const config = REGISTRY_CONFIG[registryId] || REGISTRY_CONFIG.verra;
  registryNameEl.textContent = `${config.name} | ${config.standard} | ${config.methodology}`;
  setList(methodologyLinksEl, config.links, true);
  setList(assumptionsListEl, ASSUMPTIONS, false);
  complianceTextEl.textContent = config.compliance;

  fillGuideTables();
  applyPayloadValues();
  applyGuidedDefaults(config);
  autoTransportEmissions();

  const pMatch = PERMANENCE_GUIDE.find((x) => Number(x.factor).toFixed(2) === Number(inputPermanence.value).toFixed(2));
  if (pMatch) permanenceClassSelect.value = pMatch.key;

  renderAll();
}

permanenceClassSelect.addEventListener("change", () => {
  const p = PERMANENCE_GUIDE.find((x) => x.key === permanenceClassSelect.value);
  if (p) inputPermanence.value = String(p.factor);
  renderAll();
});

transportFactorSelect.addEventListener("change", () => {
  autoTransportEmissions();
  renderAll();
});

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
  const lowPct = num(sensitivityLowEl, -20);
  const highPct = num(sensitivityHighEl, 20);
  const variable = sensitivityVariableEl.value;
  const lowMultiplier = 1 + lowPct / 100;
  const highMultiplier = 1 + highPct / 100;
  const lowOverrides = {};
  const highOverrides = {};
  if (variable === "carbonContent") {
    lowOverrides.carbonContent = num(inputCarbonContent) * lowMultiplier;
    highOverrides.carbonContent = num(inputCarbonContent) * highMultiplier;
  }
  if (variable === "permanence") {
    lowOverrides.permanence = num(inputPermanence) * lowMultiplier;
    highOverrides.permanence = num(inputPermanence) * highMultiplier;
  }
  if (variable === "stableCarbon") {
    lowOverrides.stableCarbon = num(inputStableCarbon) * lowMultiplier;
    highOverrides.stableCarbon = num(inputStableCarbon) * highMultiplier;
  }
  if (variable === "processE") {
    lowOverrides.processE = num(inputProcessEmissions) * lowMultiplier;
    highOverrides.processE = num(inputProcessEmissions) * highMultiplier;
  }
  const lowFinal = calculateCredits(lowOverrides).final;
  const highFinal = calculateCredits(highOverrides).final;

  localStorage.setItem(
    FINAL_CREDITS_STORAGE_KEY,
    JSON.stringify({
      transfer_token: transferToken,
      registry_id: payload?.registry_id || registryId,
      registry_name: payload?.registry_name || (REGISTRY_CONFIG[registryId]?.name || registryId.toUpperCase()),
      final_credits_tco2e: result.final,
      issuance_factor: num(inputIssuance),
      buffer_percent: num(inputBufferPct),
      uncertainty_percent: num(inputUncertaintyPct),
      process_emissions_tco2e: num(inputProcessEmissions),
      transport_emissions_tco2e: num(inputTransportEmissions),
      leakage_tco2e: num(inputLeakage),
      breakdown: {
        gross: Number(result.gross.toFixed(2)),
        process: Number(result.processE.toFixed(2)),
        transport: Number(result.transportE.toFixed(2)),
        leakage: Number(result.leakageE.toFixed(2)),
        uncertainty_loss: Number(result.uncertaintyLoss.toFixed(2)),
        buffer_loss: Number(result.bufferLoss.toFixed(2)),
        issuance_loss: Number(result.issuanceLoss.toFixed(2)),
        final: Number(result.final.toFixed(2)),
      },
      assumptions_used: ASSUMPTIONS,
      sensitivity: {
        variable,
        low_pct: lowPct,
        high_pct: highPct,
        low_final: Number(lowFinal.toFixed(2)),
        high_final: Number(highFinal.toFixed(2)),
      },
      calculated_at_utc: new Date().toISOString(),
    })
  );
  window.location.href = "./biochar-phase1-feasibility-tool.html?section=tentative";
});

init();
