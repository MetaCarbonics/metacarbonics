const params = new URLSearchParams(window.location.search);
const transferToken = params.get("token") || "";
const registryId = document.body.dataset.registry || "";

const TRANSFER_STORAGE_PREFIX = "biochar-feasibility-transfer:";
const FINAL_CREDITS_STORAGE_KEY = "biochar-feasibility-final-credits";

const registryNameEl = document.getElementById("registryName");
const methodologyLinksEl = document.getElementById("methodologyLinks");
const complianceTextEl = document.getElementById("complianceText");
const assumptionsListEl = document.getElementById("assumptionsList");
const monitoringParamsBodyEl = document.getElementById("monitoringParamsBody");

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

const sensitivityValueEl = document.getElementById("sensitivityValue");

const carbonGuideBody = document.getElementById("carbonGuideBody");
const permanenceGuideBody = document.getElementById("permanenceGuideBody");
const transportGuideBody = document.getElementById("transportGuideBody");
const tenYearCreditsBody = document.getElementById("tenYearCreditsBody");
const cumulative10YearEl = document.getElementById("cumulative10Year");
const feedstockContributionSummaryEl = document.getElementById("feedstockContributionSummary");
const feedstockContributionTableWrap = document.getElementById("feedstockContributionTableWrap");
const feedstockChartsWrap = document.getElementById("feedstockChartsWrap");
const feedstockContributionChartEl = document.getElementById("feedstockContributionChart");
const parameterDefaultsSummaryEl = document.getElementById("parameterDefaultsSummary");
const openGuideLink = document.getElementById("openGuideLink");
const closeGuideBtn = document.getElementById("closeGuideBtn");
const guidePanel = document.getElementById("guidePanel");

const backBtn = document.getElementById("backToFeasibilityBtn");
const useResultBtn = document.getElementById("useResultBtn");

let breakdownChart = null;
let sensitivityChart = null;
let feedstockContributionChart = null;
let perFeedstockCharts = [];
let payload = null;
let feedstockEntries = [];
let projectRegion = "Global";
let lastFeedstockContributions = [];
let lastParameterDefaults = [];
let guideOpen = false;

const SENSITIVITY_CONFIG = [
  { key: "carbonContent", label: "Carbon Content" },
  { key: "permanence", label: "Permanence" },
  { key: "stableCarbon", label: "Stable Carbon Fraction" },
  { key: "processE", label: "Process Emissions" },
];

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
    monitoring: [
      { parameter: "Feedstock type, source, and quantity", explanation: "Track eligible biomass type, supplier records, and mass balance to verify project boundaries and sustainability claims." },
      { parameter: "Pyrolysis operating temperature profile", explanation: "Continuously monitor reactor temperatures and retain logs to support carbon stability assumptions." },
      { parameter: "Biochar batch carbon properties", explanation: "Measure C content and H/Corg (or equivalent stability metrics) by representative lab testing and QA/QC." },
      { parameter: "Biochar production and inventory", explanation: "Record produced, stored, sold, and applied quantities with batch IDs for chain of custody." },
      { parameter: "Process, transport, and leakage emissions", explanation: "Monitor energy use, transport distances/modes, and non-CO2 releases used in net-removal calculations." },
      { parameter: "End-use application and permanence controls", explanation: "Document where and how biochar is applied/used, with evidence of durable storage and non-reversal safeguards." },
    ],
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
    monitoring: [
      { parameter: "Feedstock provenance and sustainability", explanation: "Maintain auditable records of biomass origin, eligibility, and sustainability compliance." },
      { parameter: "Process conditions (temperature/residence)", explanation: "Log reactor conditions required to demonstrate consistent biochar quality and permanence." },
      { parameter: "Biochar carbon and stability metrics", explanation: "Test and document carbon content and durability indicators per certification/standard requirements." },
      { parameter: "Mass balance and chain of custody", explanation: "Track feedstock-in to biochar-out with inventory reconciliation and delivery/application records." },
      { parameter: "Lifecycle emissions inputs", explanation: "Monitor process energy, transport, and leakage factors used in net credit accounting." },
      { parameter: "Storage/application evidence", explanation: "Retain evidence that produced biochar is durably stored or applied according to approved pathway." },
    ],
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
    monitoring: [
      { parameter: "Project boundary activity data", explanation: "Monitor all relevant activity data inside boundary, including biomass intake and production outputs." },
      { parameter: "Technology operating records", explanation: "Maintain continuous operational logs for process parameters that influence permanence and emissions." },
      { parameter: "Biochar quality and stability tests", explanation: "Use periodic representative sampling and laboratory results to support claimed removals." },
      { parameter: "Emission source monitoring", explanation: "Quantify process, transport, and leakage emissions with transparent assumptions and evidence." },
      { parameter: "Safeguards and sustainable development indicators", explanation: "Collect monitoring evidence required by GS safeguards and SDG-related reporting." },
      { parameter: "Verification-ready documentation", explanation: "Retain QA/QC trail for validation and verification against approved GS pathway requirements." },
    ],
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
    monitoring: [
      { parameter: "Eligible feedstock and supplier data", explanation: "Track feedstock classes, suppliers, and intake quantities for protocol alignment and auditability." },
      { parameter: "Production process telemetry", explanation: "Capture operating parameters and control logs supporting consistent biochar generation." },
      { parameter: "Durability-linked biochar analytics", explanation: "Measure carbon/stability properties on representative batches for removal quality claims." },
      { parameter: "Full traceability and custody", explanation: "Record batch-level movement from production through final application/storage." },
      { parameter: "Lifecycle deductions dataset", explanation: "Monitor energy, transport, and leakage inputs used for deduction calculations." },
      { parameter: "Continuous evidence package", explanation: "Maintain protocol-ready evidence and QA/QC records for verifier review and issuance." },
    ],
  },
};

const METHODOLOGY_CARBON_NOTES = {
  verra: "VM0044 requires project-specific characterization and monitoring; generic feedstock carbon defaults are not prescribed for issuance.",
  puro: "Puro biochar methodology requires measured biochar properties (e.g., Corg/H:Corg) for certification; no universal feedstock default table is prescribed for issuance.",
  gs: "Gold Standard requires project-specific quantification evidence; no universal feedstock carbon default table is prescribed for issuance.",
  isometric: "Isometric protocol requires project-specific measured pathway data; no universal feedstock carbon default table is prescribed for issuance.",
};

const CARBON_GUIDE_LIBRARY = [
  {
    feedstock: "Forestry residues",
    region: "Global",
    carbon: 0.77,
    min: 0.70,
    max: 0.85,
    basis: "Literature",
    source_label: "Materials (2023): softwood biochar carbon ~77.48%",
    source_url: "https://www.mdpi.com/1996-1944/16/6/2522",
  },
  {
    feedstock: "Sawmill waste",
    region: "Global",
    carbon: 0.80,
    min: 0.79,
    max: 0.82,
    basis: "Literature",
    source_label: "Sustainable Futures (2023): sawdust biochar C ~78.96-81.70%",
    source_url: "https://www.sciencedirect.com/science/article/abs/pii/S2589014X23001561",
  },
  {
    feedstock: "Orchard prunings",
    region: "Europe",
    carbon: 0.72,
    min: 0.63,
    max: 0.80,
    basis: "Literature",
    source_label: "Agriculture (2023) + PMC pruning review: olive pruning biochar rich in carbon (>70%), literature range includes ~63%",
    source_url: "https://www.mdpi.com/2077-0472/13/5/1064",
  },
  {
    feedstock: "Orchard prunings",
    region: "Global",
    carbon: 0.70,
    min: 0.60,
    max: 0.80,
    basis: "Literature",
    source_label: "Orchard pruning pyrolysis review (olive/apple/pear/plum residues)",
    source_url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8198515/",
  },
  {
    feedstock: "Rice husk",
    region: "Asia",
    carbon: 0.50,
    min: 0.48,
    max: 0.55,
    basis: "Literature",
    source_label: "JEA + Environ. Sci. Europe table: rice husk biochar C around ~47.7%-54.5%",
    source_url: "https://www.sciencedirect.com/science/article/pii/S2095633921000939",
  },
  {
    feedstock: "Rice husk",
    region: "Global",
    carbon: 0.50,
    min: 0.47,
    max: 0.55,
    basis: "Literature",
    source_label: "JEA/Review values for rice husk biochar carbon",
    source_url: "https://enveurope.springeropen.com/articles/10.1186/s12302-024-00908-7/tables/2",
  },
  {
    feedstock: "Coconut shell",
    region: "Asia",
    carbon: 0.86,
    min: 0.83,
    max: 0.94,
    basis: "Literature",
    source_label: "Review tables: coconut-shell/fibre biochar carbon commonly >80%",
    source_url: "https://enveurope.springeropen.com/articles/10.1186/s12302-024-00908-7/tables/2",
  },
  {
    feedstock: "Coconut shell",
    region: "Global",
    carbon: 0.85,
    min: 0.80,
    max: 0.94,
    basis: "Literature",
    source_label: "Shell-derived biochar studies and review values",
    source_url: "https://www.tandfonline.com/doi/abs/10.1080/15567036.2016.1263252",
  },
  {
    feedstock: "Nut shells",
    region: "Global",
    carbon: 0.88,
    min: 0.81,
    max: 0.90,
    basis: "Literature",
    source_label: "Walnut-shell biochar studies: carbon often ~81%-90%+",
    source_url: "https://link.springer.com/article/10.1007/s10098-023-02525-z",
  },
  {
    feedstock: "Bamboo residues",
    region: "Asia",
    carbon: 0.83,
    min: 0.78,
    max: 0.86,
    basis: "Literature",
    source_label: "Bamboo biochar review reporting ~83.29% carbon",
    source_url: "https://www.sciencedirect.com/org/science/article/pii/S2753812525001211",
  },
  {
    feedstock: "Bamboo residues",
    region: "Global",
    carbon: 0.82,
    min: 0.75,
    max: 0.86,
    basis: "Literature",
    source_label: "Bamboo biochar review values",
    source_url: "https://www.sciencedirect.com/org/science/article/pii/S2753812525001211",
  },
  {
    feedstock: "Crop straw",
    region: "Global",
    carbon: 0.74,
    min: 0.68,
    max: 0.81,
    basis: "Literature",
    source_label: "Wheat-straw biochar studies (~73-75%+ depending on conditions)",
    source_url: "https://link.springer.com/article/10.1007/s10973-025-14766-9",
  },
  {
    feedstock: "Sugarcane bagasse",
    region: "Latin America",
    carbon: 0.70,
    min: 0.58,
    max: 0.82,
    basis: "Literature",
    source_label: "Bagasse biochar studies/review show broad C range (~58% to >80%)",
    source_url: "https://link.springer.com/article/10.1007/s42247-023-00603-y",
  },
  {
    feedstock: "Sugarcane bagasse",
    region: "Global",
    carbon: 0.68,
    min: 0.58,
    max: 0.82,
    basis: "Literature",
    source_label: "Bagasse biochar literature range for screening",
    source_url: "https://www.tandfonline.com/doi/abs/10.1080/03650340.2021.1892651",
  },
  {
    feedstock: "Corn stover",
    region: "North America",
    carbon: 0.60,
    min: 0.46,
    max: 0.65,
    basis: "Literature",
    source_label: "Corn stover pyrolysis study: C increased from 45.5% to 64.5%",
    source_url: "https://pubmed.ncbi.nlm.nih.gov/27327870/",
  },
  {
    feedstock: "Corn stover",
    region: "Global",
    carbon: 0.60,
    min: 0.46,
    max: 0.65,
    basis: "Literature",
    source_label: "Corn stover biochar carbon range from pyrolysis experiments",
    source_url: "https://pubmed.ncbi.nlm.nih.gov/27327870/",
  },
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

function getSensitivityLowEl(key) {
  return document.getElementById(`sensitivityLow_${key}`);
}

function getSensitivityHighEl(key) {
  return document.getElementById(`sensitivityHigh_${key}`);
}

function getSensitivityLineEl(key) {
  return document.getElementById(`sensitivityLine_${key}`);
}

function sensitivityOverrides(key, multiplier) {
  const overrides = {};
  if (key === "carbonContent") overrides.carbonContent = num(inputCarbonContent) * multiplier;
  if (key === "permanence") overrides.permanence = num(inputPermanence) * multiplier;
  if (key === "stableCarbon") overrides.stableCarbon = num(inputStableCarbon) * multiplier;
  if (key === "processE") overrides.processE = num(inputProcessEmissions) * multiplier;
  return overrides;
}

function dominantFeedstockName() {
  if (!feedstockEntries.length) return "";
  const sorted = [...feedstockEntries].sort((a, b) => Number(b.quantity_tpy || 0) - Number(a.quantity_tpy || 0));
  return String(sorted[0]?.feedstock || "").toLowerCase();
}

function inferRegionFromCountry(countryCode, countryName) {
  const cc = String(countryCode || "").toUpperCase();
  if (["US", "CA", "MX"].includes(cc)) return "North America";
  if (["BR", "AR", "CL", "CO", "PE", "EC", "UY", "PY", "BO"].includes(cc)) return "Latin America";
  if (["IN", "CN", "JP", "KR", "TH", "VN", "ID", "PH", "MY", "SG", "PK", "BD", "LK", "NP"].includes(cc)) return "Asia";
  if (["DE", "FR", "IT", "ES", "PT", "NL", "BE", "PL", "SE", "NO", "DK", "FI", "IE", "CH", "AT", "GR", "RO", "CZ", "HU", "UA", "GB"].includes(cc)) return "Europe";
  if (["ZA", "NG", "KE", "ET", "GH", "TZ", "UG", "DZ", "MA", "EG"].includes(cc)) return "Africa";
  if (["AU", "NZ", "PG", "FJ"].includes(cc)) return "Oceania";
  const cn = String(countryName || "").toLowerCase();
  if (cn.includes("united states") || cn.includes("canada") || cn.includes("mexico")) return "North America";
  if (cn.includes("brazil") || cn.includes("argentina") || cn.includes("chile") || cn.includes("colombia") || cn.includes("peru")) return "Latin America";
  if (cn.includes("india") || cn.includes("china") || cn.includes("japan") || cn.includes("indonesia") || cn.includes("thailand")) return "Asia";
  return "Global";
}

function canonicalFeedstockName(rawName) {
  const n = String(rawName || "").toLowerCase();
  if (n.includes("forestry")) return "Forestry residues";
  if (n.includes("sawmill") || n.includes("sawdust")) return "Sawmill waste";
  if (n.includes("orchard") || n.includes("pruning")) return "Orchard prunings";
  if (n.includes("rice")) return "Rice husk";
  if (n.includes("coconut")) return "Coconut shell";
  if (n.includes("nut")) return "Nut shells";
  if (n.includes("bamboo")) return "Bamboo residues";
  if (n.includes("straw")) return "Crop straw";
  if (n.includes("bagasse")) return "Sugarcane bagasse";
  if (n.includes("corn")) return "Corn stover";
  return "";
}

function inferCarbonDefault() {
  const row = lookupCarbonDefault(dominantFeedstockName() || "Forestry residues");
  return {
    value: Number((Number(row?.carbon || 0.77) * 100).toFixed(2)),
    row,
  };
}

function lookupCarbonDefault(feedstockName) {
  const canonical = canonicalFeedstockName(feedstockName) || "Forestry residues";
  const exactRegion = CARBON_GUIDE_LIBRARY.find((r) => r.feedstock === canonical && r.region === projectRegion);
  const global = CARBON_GUIDE_LIBRARY.find((r) => r.feedstock === canonical && r.region === "Global");
  return exactRegion || global || CARBON_GUIDE_LIBRARY.find((r) => r.feedstock === "Forestry residues" && r.region === "Global");
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
  carbonGuideBody.innerHTML = CARBON_GUIDE_LIBRARY.map((r) => {
    const source = r.source_url ? `<a href="${r.source_url}" target="_blank" rel="noreferrer">${r.source_label}</a>` : r.source_label;
    return `<tr><td>${r.feedstock} (${r.region})</td><td>${(r.carbon * 100).toFixed(2)}%</td><td>${r.basis}: ${source}</td></tr>`;
  }).join("");
  permanenceGuideBody.innerHTML = PERMANENCE_GUIDE.map((r) => `<tr><td>${r.label}</td><td>${r.factor}</td></tr>`).join("");
  transportGuideBody.innerHTML = TRANSPORT_GUIDE.map((r) => `<tr><td>${r.mode}</td><td>${r.factorKgTkm}</td><td>${r.source}</td></tr>`).join("");

  permanenceClassSelect.innerHTML = PERMANENCE_GUIDE.map((r) => `<option value="${r.key}">${r.label}</option>`).join("");
  transportFactorSelect.innerHTML = TRANSPORT_GUIDE.map((r) => `<option value="${r.key}">${r.mode} (${r.factorKgTkm} kgCO2e/t-km)</option>`).join("");
}

function renderMonitoringParams(config) {
  if (!monitoringParamsBodyEl) return;
  const rows = Array.isArray(config?.monitoring) ? config.monitoring : [];
  monitoringParamsBodyEl.innerHTML = rows
    .map((r) => `<tr><td>${r.parameter}</td><td>${r.explanation}</td></tr>`)
    .join("");
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
    const inferred = inferCarbonDefault();
    inputCarbonContent.value = String(inferred.value);
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
  projectRegion = inferRegionFromCountry(d.country_code, d.country_name);
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

function computeFeedstockContributions(baseResult) {
  const entries = Array.isArray(feedstockEntries) ? feedstockEntries.filter((e) => Number(e.quantity_tpy || 0) > 0) : [];
  const totalQty = entries.reduce((sum, e) => sum + Number(e.quantity_tpy || 0), 0);
  if (!entries.length || totalQty <= 0) return [];

  const annualBiochar = num(inputAnnualBiochar);
  const stableCarbon = num(inputStableCarbon);
  const permanence = num(inputPermanence);
  const additionalityAdj = num(inputAdditionalityAdj);
  const baseFinal = Number(baseResult?.final || 0);

  const grossRows = entries.map((e) => {
    const qty = Number(e.quantity_tpy || 0);
    const share = qty / totalQty;
    const annualBiocharShare = annualBiochar * share;
    const carbonRef = lookupCarbonDefault(e.feedstock);
    const carbonFraction = Number(carbonRef?.carbon || 0.77);
    const gross = Math.max(0, annualBiocharShare * carbonFraction * stableCarbon * permanence * 3.667 * additionalityAdj);
    return {
      feedstock: String(e.feedstock || "Unknown"),
      quantity_tpy: Number(qty.toFixed(3)),
      share_pct: Number((share * 100).toFixed(2)),
      carbon_default_pct: Number((carbonFraction * 100).toFixed(2)),
      carbon_reference: carbonRef
        ? {
            region: carbonRef.region,
            range_pct: `${Number((carbonRef.min * 100).toFixed(2))}-${Number((carbonRef.max * 100).toFixed(2))}`,
            source_label: carbonRef.source_label,
            source_url: carbonRef.source_url,
          }
        : null,
      gross_raw: gross,
    };
  });

  const grossTotal = grossRows.reduce((sum, r) => sum + r.gross_raw, 0);
  return grossRows.map((r) => {
    const weight = grossTotal > 0 ? r.gross_raw / grossTotal : r.share_pct / 100;
    const annualCredits = baseFinal * weight;
    return {
      feedstock: r.feedstock,
      quantity_tpy: r.quantity_tpy,
      share_pct: r.share_pct,
      carbon_default_pct: r.carbon_default_pct,
      carbon_reference: r.carbon_reference,
      annual_credits_tco2e: Number(annualCredits.toFixed(2)),
      contribution_pct: Number((weight * 100).toFixed(2)),
    };
  });
}

function renderFeedstockContributionViews(baseResult) {
  const rows = computeFeedstockContributions(baseResult);
  if (feedstockContributionSummaryEl) {
    feedstockContributionSummaryEl.textContent = rows.length
      ? `Contributions allocated across ${rows.length} feedstock(s).`
      : "Add feedstocks with quantity to view contribution graphs.";
  }

  if (feedstockContributionTableWrap) {
    if (!rows.length) {
      feedstockContributionTableWrap.innerHTML = "";
    } else {
      const tableRows = rows
        .map(
          (r) =>
            `<tr><td>${r.feedstock}</td><td>${r.quantity_tpy}</td><td>${r.carbon_default_pct}%</td><td>${r.annual_credits_tco2e}</td><td>${r.contribution_pct}%</td></tr>`
        )
        .join("");
      feedstockContributionTableWrap.innerHTML = `<table class="feedstock-table"><thead><tr><th>Feedstock</th><th>Qty (t/yr)</th><th>Carbon default</th><th>Annual credits</th><th>Contribution</th></tr></thead><tbody>${tableRows}</tbody></table>`;
    }
  }

  if (window.Chart) {
    perFeedstockCharts.forEach((c) => c.destroy());
    perFeedstockCharts = [];
    if (feedstockChartsWrap) {
      feedstockChartsWrap.innerHTML = "";
      if (rows.length) {
        const card = document.createElement("div");
        card.className = "questionnaire-card";
        const title = document.createElement("div");
        title.className = "small";
        title.innerHTML = "<strong>Feedstock Contribution Bars (Annual)</strong>";
        const cv = document.createElement("canvas");
        cv.id = "feedstockBarsChart";
        card.appendChild(title);
        card.appendChild(cv);
        feedstockChartsWrap.appendChild(card);
        const labels = rows.map((r) => r.feedstock);
        const vals = rows.map((r) => Number(r.annual_credits_tco2e || 0));
        const colors = rows.map((_, idx) => `hsl(${(idx * 67) % 360} 70% 45%)`);
        const chart = new window.Chart(cv, {
          type: "bar",
          data: { labels, datasets: [{ label: "Annual credits (tCO2e/year)", data: vals, backgroundColor: colors }] },
          options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } },
        });
        perFeedstockCharts.push(chart);
      }
    }

    if (feedstockContributionChart) {
      feedstockContributionChart.destroy();
      feedstockContributionChart = null;
    }
    if (feedstockContributionChartEl && rows.length) {
      const labels = rows.map((r) => r.feedstock);
      const vals = rows.map((r) => r.annual_credits_tco2e);
      const colors = rows.map((_, idx) => `hsl(${(idx * 67) % 360} 70% 45%)`);
      feedstockContributionChart = new window.Chart(feedstockContributionChartEl, {
        type: "pie",
        data: { labels, datasets: [{ label: "Annual credits (tCO2e/year)", data: vals, backgroundColor: colors }] },
        options: { responsive: true, plugins: { legend: { display: true, position: "right" } } },
      });
    }
  }

  return rows;
}

function buildParameterDefaultsSummary() {
  const configDefaults = (REGISTRY_CONFIG[registryId] || REGISTRY_CONFIG.verra).defaults;
  const cfg = REGISTRY_CONFIG[registryId] || REGISTRY_CONFIG.verra;
  const registrySourceLabel = `${cfg.name} ${cfg.methodology} screening default`;
  const registrySourceUrl = cfg.links?.[0]?.url || "";
  const pClass = PERMANENCE_GUIDE.find((p) => p.key === permanenceClassSelect.value) || PERMANENCE_GUIDE[1];
  const transportSel = TRANSPORT_GUIDE.find((t) => t.key === transportFactorSelect.value) || TRANSPORT_GUIDE[0];
  const rows = [
    {
      parameter: "Permanence factor",
      value: Number(num(inputPermanence).toFixed(3)),
      default_value: Number(pClass.factor.toFixed(3)),
      used_default: Math.abs(num(inputPermanence) - pClass.factor) < 1e-6,
      guide: `Permanence class: ${pClass.label}`,
      source_label: "Permanence adjustment guide table",
      source_url: registrySourceUrl,
    },
    {
      parameter: "Stable carbon fraction",
      value: Number(num(inputStableCarbon).toFixed(3)),
      default_value: Number(configDefaults.stableCarbon.toFixed(3)),
      used_default: Math.abs(num(inputStableCarbon) - configDefaults.stableCarbon) < 1e-6,
      guide: "Registry default screening value",
      source_label: registrySourceLabel,
      source_url: registrySourceUrl,
    },
    {
      parameter: "Process emissions (tCO2e/yr)",
      value: Number(num(inputProcessEmissions).toFixed(2)),
      default_value: Number(configDefaults.processE.toFixed(2)),
      used_default: Math.abs(num(inputProcessEmissions) - configDefaults.processE) < 1e-6,
      guide: "Registry default screening value",
      source_label: registrySourceLabel,
      source_url: registrySourceUrl,
    },
    {
      parameter: "Transport emissions (tCO2e/yr)",
      value: Number(num(inputTransportEmissions).toFixed(2)),
      default_value: Number(num(inputTransportEmissions).toFixed(2)),
      used_default: true,
      guide: `Auto from ${transportFactorSelect.options[transportFactorSelect.selectedIndex]?.text || "transport mode"} and feedstock distance`,
      source_label: `Transport factor guide: ${transportSel.mode} (${transportSel.factorKgTkm} kgCO2e/t-km)`,
      source_url: registrySourceUrl,
    },
    {
      parameter: "Leakage (tCO2e/yr)",
      value: Number(num(inputLeakage).toFixed(2)),
      default_value: Number(configDefaults.leakageE.toFixed(2)),
      used_default: Math.abs(num(inputLeakage) - configDefaults.leakageE) < 1e-6,
      guide: "Registry default screening value",
      source_label: registrySourceLabel,
      source_url: registrySourceUrl,
    },
    {
      parameter: "Uncertainty deduction (%)",
      value: Number(num(inputUncertaintyPct).toFixed(2)),
      default_value: Number(configDefaults.uncertainty.toFixed(2)),
      used_default: Math.abs(num(inputUncertaintyPct) - configDefaults.uncertainty) < 1e-6,
      guide: "Registry default screening value",
      source_label: registrySourceLabel,
      source_url: registrySourceUrl,
    },
    {
      parameter: "Buffer deduction (%)",
      value: Number(num(inputBufferPct).toFixed(2)),
      default_value: Number(configDefaults.buffer.toFixed(2)),
      used_default: Math.abs(num(inputBufferPct) - configDefaults.buffer) < 1e-6,
      guide: "Registry default screening value",
      source_label: registrySourceLabel,
      source_url: registrySourceUrl,
    },
    {
      parameter: "Issuance factor",
      value: Number(num(inputIssuance).toFixed(3)),
      default_value: Number(configDefaults.issuance.toFixed(3)),
      used_default: Math.abs(num(inputIssuance) - configDefaults.issuance) < 1e-6,
      guide: "Registry default screening value",
      source_label: registrySourceLabel,
      source_url: registrySourceUrl,
    },
    {
      parameter: "Additionality adjustment",
      value: Number(num(inputAdditionalityAdj).toFixed(3)),
      default_value: Number(configDefaults.additionalityAdj.toFixed(3)),
      used_default: Math.abs(num(inputAdditionalityAdj) - configDefaults.additionalityAdj) < 1e-6,
      guide: "Registry default screening value",
      source_label: registrySourceLabel,
      source_url: registrySourceUrl,
    },
  ];
  return rows;
}

function renderParameterDefaultsSummary() {
  const rows = buildParameterDefaultsSummary();
  lastParameterDefaults = rows;
  if (!parameterDefaultsSummaryEl) return;
  const lineRows = rows
    .map((r) => `${r.parameter}: ${r.value} (${r.used_default ? "Default" : "User override"}, default ${r.default_value})`)
    .join("<br>");
  parameterDefaultsSummaryEl.innerHTML = `<strong>Parameter defaults check:</strong><br>${lineRows}`;
}

function showGuidePanel() {
  if (!guidePanel) return;
  guidePanel.classList.remove("hidden", "fading-out");
  guideOpen = true;
  guidePanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function hideGuidePanel() {
  if (!guidePanel || !guideOpen) return;
  guidePanel.classList.add("fading-out");
  setTimeout(() => {
    if (!guidePanel) return;
    guidePanel.classList.add("hidden");
    guidePanel.classList.remove("fading-out");
  }, 200);
  guideOpen = false;
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
  const contribRows = computeFeedstockContributions(result);
  let labels = [];
  let values = [];
  let datasetLabel = "tCO2e/year";

  if (contribRows.length) {
    labels = contribRows.map((r) => r.feedstock);
    values = contribRows.map((r) => Number(r.annual_credits_tco2e || 0));
    datasetLabel = "Feedstock contribution (annual credits)";
  } else {
    labels = ["Gross", "Process", "Transport", "Leakage", "Uncertainty", "Buffer", "Issuance", "Final"];
    values = [result.gross, -result.processE, -result.transportE, -result.leakageE, -result.uncertaintyLoss, -result.bufferLoss, -result.issuanceLoss, result.final];
    datasetLabel = "tCO2e/year";
  }
  if (breakdownChart) breakdownChart.destroy();
  breakdownChart = new window.Chart(ctx, {
    type: "bar",
    data: { labels, datasets: [{ data: values, label: datasetLabel }] },
    options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } },
  });
}

function renderSensitivityChart() {
  if (!window.Chart) return;
  const baseFinal = calculateCredits().final;
  const datasets = [];
  const summaryLines = [];

  SENSITIVITY_CONFIG.forEach((cfg) => {
    const lowEl = getSensitivityLowEl(cfg.key);
    const highEl = getSensitivityHighEl(cfg.key);
    const lowRaw = num(lowEl, -20);
    const highRaw = num(highEl, 20);
    const low = Math.min(lowRaw, highRaw);
    const high = Math.max(lowRaw, highRaw);
    const points = [];
    for (let p = low; p <= high; p += 5) {
      const m = 1 + p / 100;
      points.push({ x: p, y: calculateCredits(sensitivityOverrides(cfg.key, m)).final });
    }
    if (!points.length || points[points.length - 1]?.x !== high) {
      const mHigh = 1 + high / 100;
      points.push({ x: high, y: calculateCredits(sensitivityOverrides(cfg.key, mHigh)).final });
    }
    const lowFinal = calculateCredits(sensitivityOverrides(cfg.key, 1 + low / 100)).final;
    const highFinal = calculateCredits(sensitivityOverrides(cfg.key, 1 + high / 100)).final;
    const lineEl = getSensitivityLineEl(cfg.key);
    if (lineEl) {
      lineEl.textContent = `Low ${low}%: ${lowFinal.toFixed(2)} | Base: ${baseFinal.toFixed(2)} | High ${high}%: ${highFinal.toFixed(2)}`;
    }
    summaryLines.push(`${cfg.label}: low ${low}%=${lowFinal.toFixed(2)}, base=${baseFinal.toFixed(2)}, high ${high}%=${highFinal.toFixed(2)} tCO2e/year`);
    datasets.push({
      data: points,
      parsing: false,
      borderWidth: 2,
      label: cfg.label,
      tension: 0.2,
      pointRadius: 1.5,
    });
  });
  sensitivityValueEl.innerHTML = `<strong>Base final credits:</strong> ${baseFinal.toFixed(2)} tCO2e/year<br>${summaryLines.join("<br>")}`;

  const ctx = document.getElementById("sensitivityChart");
  if (sensitivityChart) sensitivityChart.destroy();
  sensitivityChart = new window.Chart(ctx, {
    type: "line",
    data: { datasets },
    options: { responsive: true, scales: { x: { type: "linear", title: { display: true, text: "Input variation (%)" } }, y: { beginAtZero: true } } },
  });
}

function renderAll() {
  const res = calculateCredits();
  const inferred = inferCarbonDefault();
  const sourceRow = inferred.row;
  const methodologyNote = METHODOLOGY_CARBON_NOTES[registryId] || METHODOLOGY_CARBON_NOTES.verra;
  grossCreditsEl.value = res.gross.toFixed(2);
  netBeforeBufferEl.value = res.netBeforeDiscounts.toFixed(2);
  finalCreditsEl.value = res.final.toFixed(2);
  calcStatusEl.innerHTML = num(inputAnnualBiochar) > 0
    ? `Using guided defaults and your project values.<br><strong>Carbon default basis:</strong> ${sourceRow ? `${sourceRow.feedstock} (${sourceRow.region}) = ${(sourceRow.carbon * 100).toFixed(2)}%` : "N/A"}<br>${sourceRow?.source_url ? `<a href="${sourceRow.source_url}" target="_blank" rel="noreferrer">${sourceRow.source_label}</a><br>` : ""}<strong>Methodology note:</strong> ${methodologyNote}`
    : `Provide annual output to activate full calculation.<br><strong>Methodology note:</strong> ${methodologyNote}`;
  renderTenYearTable(res.final);
  renderBreakdownChart(res);
  lastFeedstockContributions = renderFeedstockContributionViews(res);
  renderParameterDefaultsSummary();
  renderSensitivityChart();
}

function collectSensitivityDetails() {
  const baseFinal = calculateCredits().final;
  return SENSITIVITY_CONFIG.map((cfg) => {
    const lowEl = getSensitivityLowEl(cfg.key);
    const highEl = getSensitivityHighEl(cfg.key);
    const lowRaw = num(lowEl, -20);
    const highRaw = num(highEl, 20);
    const lowPct = Math.min(lowRaw, highRaw);
    const highPct = Math.max(lowRaw, highRaw);
    const lowFinal = calculateCredits(sensitivityOverrides(cfg.key, 1 + lowPct / 100)).final;
    const highFinal = calculateCredits(sensitivityOverrides(cfg.key, 1 + highPct / 100)).final;
    return {
      variable: cfg.key,
      label: cfg.label,
      low_pct: lowPct,
      high_pct: highPct,
      base_final: Number(baseFinal.toFixed(2)),
      low_final: Number(lowFinal.toFixed(2)),
      high_final: Number(highFinal.toFixed(2)),
    };
  });
}

function init() {
  const config = REGISTRY_CONFIG[registryId] || REGISTRY_CONFIG.verra;
  registryNameEl.textContent = `${config.name} | ${config.standard} | ${config.methodology}`;
  setList(methodologyLinksEl, config.links, true);
  setList(assumptionsListEl, ASSUMPTIONS, false);
  complianceTextEl.textContent = config.compliance;
  renderMonitoringParams(config);

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
].forEach((el) => el.addEventListener("input", renderAll));

document.querySelectorAll('[data-sensitivity-input="true"]').forEach((el) => {
  el.addEventListener("input", renderAll);
});

if (openGuideLink) {
  openGuideLink.addEventListener("click", (e) => {
    e.preventDefault();
    showGuidePanel();
  });
}
if (closeGuideBtn) {
  closeGuideBtn.addEventListener("click", () => hideGuidePanel());
}
window.addEventListener("scroll", () => {
  if (!guideOpen || !guidePanel) return;
  const panelBottom = guidePanel.offsetTop + guidePanel.offsetHeight;
  if (window.scrollY > panelBottom + 60) hideGuidePanel();
});

backBtn.addEventListener("click", () => {
  window.location.href = "./biochar-phase1-feasibility-tool.html?section=tentative";
});

useResultBtn.addEventListener("click", () => {
  const result = calculateCredits();
  const sensitivityDetails = collectSensitivityDetails();
  const inferred = inferCarbonDefault();
  const cfg = REGISTRY_CONFIG[registryId] || REGISTRY_CONFIG.verra;

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
      carbon_default_reference: inferred.row
        ? {
            feedstock: inferred.row.feedstock,
            region: inferred.row.region,
            default_pct: Number((inferred.row.carbon * 100).toFixed(2)),
            range_pct: `${Number((inferred.row.min * 100).toFixed(2))}-${Number((inferred.row.max * 100).toFixed(2))}`,
            source_label: inferred.row.source_label,
            source_url: inferred.row.source_url,
          }
        : null,
      feedstock_contributions: lastFeedstockContributions,
      parameter_defaults_summary: lastParameterDefaults,
      monitoring_parameters: Array.isArray(cfg.monitoring) ? cfg.monitoring : [],
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
        base_final: Number(result.final.toFixed(2)),
        details: sensitivityDetails,
      },
      calculated_at_utc: new Date().toISOString(),
    })
  );
  window.location.href = "./biochar-phase1-feasibility-tool.html?section=tentative";
});

init();
