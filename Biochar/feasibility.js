const GEO_DATA_URLS = {
  countries:
    "https://cdn.jsdelivr.net/npm/country-state-city@3.2.1/lib/assets/country.json",
  states:
    "https://cdn.jsdelivr.net/npm/country-state-city@3.2.1/lib/assets/state.json",
  cities:
    "https://cdn.jsdelivr.net/npm/country-state-city@3.2.1/lib/assets/city.json",
};

const FEEDSTOCK_MATRIX_URL = "./feedstock-registry.csv";
const STORAGE_KEY_PREFIX = "biochar-feasibility-user:";

const REGISTRIES = [
  { id: "verra", name: "Verra", type: "Public", source: "https://verra.org/" },
  { id: "gs", name: "Gold Standard", type: "Public", source: "https://www.goldstandard.org/" },
  { id: "puro", name: "Puro.earth", type: "Public", source: "https://registry.puro.earth/projects" },
  { id: "isometric", name: "Isometric", type: "Public", source: "https://isometric.com/" },
];

const REGISTRY_COLUMN_BY_ID = {
  verra: "Verra",
  gs: "GS",
  puro: "Puro Earth",
  isometric: "Isometric",
};

const userIdInput = document.getElementById("userIdInput");
const countrySelect = document.getElementById("countrySelect");
const stateSelect = document.getElementById("stateSelect");
const citySelect = document.getElementById("citySelect");
const registrySelect = document.getElementById("registrySelect");
const registryMeta = document.getElementById("registryMeta");
const summary = document.getElementById("summary");
const facilityMapEl = document.getElementById("facilityMap");
const editFacilityMarkerBtn = document.getElementById("editFacilityMarkerBtn");
const facilityLocationSummary = document.getElementById("facilityLocationSummary");
const progressFill = document.getElementById("progressFill");
const progressStep1 = document.getElementById("progressStep1");
const progressStep2 = document.getElementById("progressStep2");
const progressStep3 = document.getElementById("progressStep3");
const progressStep4 = document.getElementById("progressStep4");
const progressStep5 = document.getElementById("progressStep5");
const progressStep6 = document.getElementById("progressStep6");
const progressStep7 = document.getElementById("progressStep7");

const step1Card = document.getElementById("step1Card");
const toFeedstockBtn = document.getElementById("toFeedstockBtn");
const feedstockSection = document.getElementById("feedstockSection");
const previousSummaryInFeedstock = document.getElementById("previousSummaryInFeedstock");
const editStep1FromFeedstockBtn = document.getElementById("editStep1FromFeedstockBtn");
const editFeedstockFromFeedstockBtn = document.getElementById("editFeedstockFromFeedstockBtn");
const feedstockQcSummary = document.getElementById("feedstockQcSummary");
const feedstockFeedback = document.getElementById("feedstockFeedback");

const feedstockType = document.getElementById("feedstockType");
const addFeedstockBtn = document.getElementById("addFeedstockBtn");
const activeFeedstockCard = document.getElementById("activeFeedstockCard");
const activeFeedstockTitle = document.getElementById("activeFeedstockTitle");
const saveFeedstockInfoBtn = document.getElementById("saveFeedstockInfoBtn");

const q1SourceSupply = document.getElementById("q1SourceSupply");
const q2SupplierRelation = document.getElementById("q2SupplierRelation");
const q3CurrentUse = document.getElementById("q3CurrentUse");
const q4TransportKm = document.getElementById("q4TransportKm");
const feedstockQty = document.getElementById("feedstockQty");
const feedstockNotes = document.getElementById("feedstockNotes");

const feedstockTableBodyFeedstock = document.getElementById("feedstockTableBodyFeedstock");
const feedstockTableBodyBiochar = document.getElementById("feedstockTableBodyBiochar");
const feedstockTableBodyPyro = document.getElementById("feedstockTableBodyPyro");
const biomassTotalFeedstock = document.getElementById("biomassTotalFeedstock");
const biomassTotalBiochar = document.getElementById("biomassTotalBiochar");
const biomassTotalPyro = document.getElementById("biomassTotalPyro");

const toBiocharPageBtn = document.getElementById("toBiocharPageBtn");
const biocharSection = document.getElementById("biocharSection");
const previousSummaryInBiochar = document.getElementById("previousSummaryInBiochar");
const editStep1FromBiocharBtn = document.getElementById("editStep1FromBiocharBtn");
const editFeedstockFromBiocharBtn = document.getElementById("editFeedstockFromBiocharBtn");
const plantCapacity = document.getElementById("plantCapacity");
const biocharCarbonContent = document.getElementById("biocharCarbonContent");
const biocharHcorg = document.getElementById("biocharHcorg");
const biocharCertification = document.getElementById("biocharCertification");
const biocharEndUse = document.getElementById("biocharEndUse");
const biocharEndUseShare = document.getElementById("biocharEndUseShare");
const biocharEndUserRelation = document.getElementById("biocharEndUserRelation");
const biocharTransportDistance = document.getElementById("biocharTransportDistance");
const toPyrolysisPageBtn = document.getElementById("toPyrolysisPageBtn");

const pyrolysisSection = document.getElementById("pyrolysisSection");
const previousSummaryInPyro = document.getElementById("previousSummaryInPyro");
const editStep1FromPyroBtn = document.getElementById("editStep1FromPyroBtn");
const editFeedstockFromPyroBtn = document.getElementById("editFeedstockFromPyroBtn");
const biocharCriticalInfo = document.getElementById("biocharCriticalInfo");
const editBiocharFromPyroBtn = document.getElementById("editBiocharFromPyroBtn");
const pyroQ13 = document.getElementById("pyroQ13");
const pyroQ14 = document.getElementById("pyroQ14");
const pyroQ15 = document.getElementById("pyroQ15");
const pyroQ16 = document.getElementById("pyroQ16");
const pyroQ17 = document.getElementById("pyroQ17");
const pyroQ18 = document.getElementById("pyroQ18");
const pyroQ19 = document.getElementById("pyroQ19");
const pyroQ20 = document.getElementById("pyroQ20");
const financeQ21 = document.getElementById("financeQ21");
const financeQ22 = document.getElementById("financeQ22");

const toFinancialPageBtn = document.getElementById("toFinancialPageBtn");
const financialSection = document.getElementById("financialSection");
const previousSummaryInFinancial = document.getElementById("previousSummaryInFinancial");
const feedstockSummaryInFinancial = document.getElementById("feedstockSummaryInFinancial");
const biocharCriticalInfoFinancial = document.getElementById("biocharCriticalInfoFinancial");
const pyroCriticalInfoFinancial = document.getElementById("pyroCriticalInfoFinancial");
const editStep1FromFinancialBtn = document.getElementById("editStep1FromFinancialBtn");
const editFeedstockFromFinancialBtn = document.getElementById("editFeedstockFromFinancialBtn");
const editBiocharFromFinancialBtn = document.getElementById("editBiocharFromFinancialBtn");
const editPyroFromFinancialBtn = document.getElementById("editPyroFromFinancialBtn");
const toAdditionalPageBtn = document.getElementById("toAdditionalPageBtn");

const additionalSection = document.getElementById("additionalSection");
const previousSummaryInAdditional = document.getElementById("previousSummaryInAdditional");
const feedstockSummaryInAdditional = document.getElementById("feedstockSummaryInAdditional");
const biocharCriticalInfoAdditional = document.getElementById("biocharCriticalInfoAdditional");
const pyroCriticalInfoAdditional = document.getElementById("pyroCriticalInfoAdditional");
const financialCriticalInfoAdditional = document.getElementById("financialCriticalInfoAdditional");
const editStep1FromAdditionalBtn = document.getElementById("editStep1FromAdditionalBtn");
const editFeedstockFromAdditionalBtn = document.getElementById("editFeedstockFromAdditionalBtn");
const editBiocharFromAdditionalBtn = document.getElementById("editBiocharFromAdditionalBtn");
const editPyroFromAdditionalBtn = document.getElementById("editPyroFromAdditionalBtn");
const editFinancialFromAdditionalBtn = document.getElementById("editFinancialFromAdditionalBtn");
const toTentativePageBtn = document.getElementById("toTentativePageBtn");
const additionalInfoList = document.getElementById("additionalInfoList");
const addAdditionalInfoBtn = document.getElementById("addAdditionalInfoBtn");

const tentativeSection = document.getElementById("tentativeSection");
const tentativePermanenceFactor = document.getElementById("tentativePermanenceFactor");
const tentativeCreditsValue = document.getElementById("tentativeCreditsValue");
const refreshPreviewBtn = document.getElementById("refreshPreviewBtn");
const projectPreview = document.getElementById("projectPreview");
const contractSignedCheckbox = document.getElementById("contractSignedCheckbox");

const backToStep1Btn = document.getElementById("backToStep1Btn");
const saveCsvBtn = document.getElementById("saveCsvBtn");

let countries = [];
let states = [];
let cities = [];
let feedstockMatrix = [];
let feedstockEntries = [];
let additionalInfoEntries = [];
let showStep1Editor = false;
let facilityLat = null;
let facilityLng = null;
let mapEditMode = false;
let facilityMap = null;
let facilityMarker = null;

let draftFeedstockName = "";
let draftFeedstockIndex = -1;

function option(label, value) {
  const opt = document.createElement("option");
  opt.value = value;
  opt.textContent = label;
  return opt;
}

function clearAndSetDefault(selectEl, text) {
  selectEl.innerHTML = "";
  selectEl.appendChild(option(text, ""));
}

function selectedText(selectEl) {
  return selectEl?.selectedOptions?.[0]?.textContent || "";
}

function getMultiValues(selectEl) {
  return Array.from(selectEl.selectedOptions).map((o) => o.value).filter(Boolean);
}

function setMultiValues(selectEl, values) {
  const set = new Set(values || []);
  Array.from(selectEl.options).forEach((opt) => {
    opt.selected = set.has(opt.value);
  });
}

function updateFacilityLocationSummary() {
  if (!Number.isFinite(facilityLat) || !Number.isFinite(facilityLng)) {
    facilityLocationSummary.textContent = "Marker not set.";
    return;
  }
  facilityLocationSummary.textContent = `Facility marker: ${facilityLat.toFixed(6)}, ${facilityLng.toFixed(6)}`;
}

function setFacilityMarker(lat, lng, recenter = true) {
  facilityLat = Number(lat);
  facilityLng = Number(lng);
  if (!Number.isFinite(facilityLat) || !Number.isFinite(facilityLng)) return;

  if (facilityMap && !facilityMarker && window.L) {
    facilityMarker = window.L.marker([facilityLat, facilityLng], { draggable: mapEditMode }).addTo(facilityMap);
    facilityMarker.on("dragend", () => {
      const pos = facilityMarker.getLatLng();
      facilityLat = pos.lat;
      facilityLng = pos.lng;
      updateFacilityLocationSummary();
      renderSummary();
      saveUserToLocalStorage();
    });
  } else if (facilityMarker) {
    facilityMarker.setLatLng([facilityLat, facilityLng]);
  }

  if (facilityMarker) {
    facilityMarker.dragging[mapEditMode ? "enable" : "disable"]();
  }

  if (facilityMap && recenter) {
    facilityMap.setView([facilityLat, facilityLng], 11);
  }
  updateFacilityLocationSummary();
}

function updateMapEditMode(enabled) {
  mapEditMode = Boolean(enabled);
  editFacilityMarkerBtn.textContent = mapEditMode ? "Save Marker" : "Edit Facility Marker";
  editFacilityMarkerBtn.classList.toggle("btn-danger", mapEditMode);
  if (facilityMarker) {
    facilityMarker.dragging[mapEditMode ? "enable" : "disable"]();
  }
}

function geocodeProjectLocation() {
  const parts = [citySelect.value, selectedText(stateSelect), selectedText(countrySelect)].filter(Boolean);
  if (!parts.length) return;
  const query = encodeURIComponent(parts.join(", "));
  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
    .then((res) => res.json())
    .then((rows) => {
      const first = Array.isArray(rows) ? rows[0] : null;
      if (!first) return;
      setFacilityMarker(Number(first.lat), Number(first.lon), true);
      renderSummary();
      saveUserToLocalStorage();
    })
    .catch(() => {});
}

function initFacilityMap() {
  if (!window.L || !facilityMapEl) return;
  facilityMap = window.L.map(facilityMapEl).setView([20, 0], 2);
  window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(facilityMap);

  facilityMap.on("click", (e) => {
    if (!mapEditMode) return;
    setFacilityMarker(e.latlng.lat, e.latlng.lng, false);
    renderSummary();
    saveUserToLocalStorage();
  });

  if (Number.isFinite(facilityLat) && Number.isFinite(facilityLng)) {
    setFacilityMarker(facilityLat, facilityLng, true);
  }
  updateFacilityLocationSummary();
}

function parseCsvLine(line) {
  return line.split(",").map((v) => v.trim());
}

function parseFeedstockCsv(csvText) {
  const rows = csvText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (!rows.length) return [];
  const headers = parseCsvLine(rows[0]);
  return rows.slice(1).map((line) => {
    const cells = parseCsvLine(line);
    const row = {};
    headers.forEach((h, i) => {
      row[h] = cells[i] || "";
    });
    return row;
  });
}

function isAccepted(value) {
  return ["yes", "y", "1", "true"].includes(String(value).toLowerCase().trim());
}

function getSelectedRegistry() {
  return REGISTRIES.find((r) => r.id === registrySelect.value);
}

function getCurrentSectionFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const section = params.get("section") || "step1";
  return ["step1", "feedstock", "biochar", "pyrolysis", "financial", "additional", "tentative"].includes(section)
    ? section
    : "step1";
}

function canEnterFeedstockSection() {
  return Boolean(registrySelect.value);
}

function computeTotalBiomass() {
  return feedstockEntries.reduce((sum, row) => {
    const qty = Number(row.quantity_tpy || 0);
    return sum + (Number.isFinite(qty) ? qty : 0);
  }, 0);
}

function updatePlantCapacityFromBiomass() {
  const total = computeTotalBiomass();
  plantCapacity.value = total > 0 ? String(total) : "";
}

function renderFeedstockQc() {
  if (!feedstockEntries.length) {
    feedstockQcSummary.textContent = "QA/QC: No feedstock entries yet.";
    return;
  }

  let passCount = 0;
  let warnCount = 0;
  const warnings = [];

  feedstockEntries.forEach((entry) => {
    const qty = Number(entry.quantity_tpy || 0);
    const km = Number(entry.q4_transport_km || 0);

    const requiredOk =
      Boolean(entry.quantity_tpy) &&
      Boolean(entry.q1_source_supply) &&
      Boolean(entry.q2_suppliers_relation) &&
      Boolean(entry.q3_current_use) &&
      Boolean(entry.q4_transport_km);

    if (requiredOk) passCount += 1;
    else {
      warnCount += 1;
      warnings.push(`${entry.feedstock}: missing required fields`);
    }

    if (!Number.isFinite(qty) || qty <= 0) {
      warnCount += 1;
      warnings.push(`${entry.feedstock}: quantity should be > 0`);
    }

    if (Number.isFinite(km) && km > 1000) {
      warnCount += 1;
      warnings.push(`${entry.feedstock}: transport distance is high (>1000 km)`);
    }
  });

  feedstockQcSummary.textContent = `QA/QC: ${passCount} pass, ${warnCount} warnings.`;
  if (!feedstockFeedback.textContent && warnings.length) {
    feedstockFeedback.textContent = `Review: ${warnings.slice(0, 2).join(" | ")}${warnings.length > 2 ? " ..." : ""}`;
  }
}

function renderFeedstockTable(tbodyEl, withActions = false) {
  tbodyEl.innerHTML = "";
  if (!feedstockEntries.length) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="${withActions ? 4 : 3}">No feedstock added yet.</td>`;
    tbodyEl.appendChild(tr);
    return;
  }

  feedstockEntries.forEach((entry, idx) => {
    const tr = document.createElement("tr");
    const action = withActions
      ? `<td><div class="btn-row"><button class="btn btn-secondary btn-sm" type="button" data-edit-feedstock-index="${idx}">Edit</button><button class="btn btn-danger btn-sm" type="button" data-delete-feedstock-index="${idx}">Delete</button></div></td>`
      : "";
    tr.innerHTML = `<td>${entry.feedstock}</td><td>${entry.quantity_tpy || ""}</td><td>${entry.q4_transport_km || ""}</td>${action}`;
    tbodyEl.appendChild(tr);
  });
}

function renderAllFeedstockTables() {
  renderFeedstockTable(feedstockTableBodyFeedstock, true);
  renderFeedstockTable(feedstockTableBodyBiochar, false);
  renderFeedstockTable(feedstockTableBodyPyro, false);

  const total = computeTotalBiomass();
  biomassTotalFeedstock.textContent = String(total);
  biomassTotalBiochar.textContent = String(total);
  biomassTotalPyro.textContent = String(total);

  updatePlantCapacityFromBiomass();
}

function hideFeedstockForm() {
  draftFeedstockIndex = -1;
  draftFeedstockName = "";
  activeFeedstockCard.classList.add("hidden");
  q1SourceSupply.value = "";
  q2SupplierRelation.value = "";
  q3CurrentUse.value = "";
  q4TransportKm.value = "";
  feedstockQty.value = "";
  feedstockNotes.value = "";
}

function showFeedstockForm(entry, modeLabel) {
  activeFeedstockCard.classList.remove("hidden");
  activeFeedstockTitle.textContent = `${modeLabel}: ${entry.feedstock}`;
  q1SourceSupply.value = entry.q1_source_supply || "";
  q2SupplierRelation.value = entry.q2_suppliers_relation || "";
  q3CurrentUse.value = entry.q3_current_use || "";
  q4TransportKm.value = entry.q4_transport_km || "";
  feedstockQty.value = entry.quantity_tpy || "";
  feedstockNotes.value = entry.notes || "";
  activeFeedstockCard.scrollIntoView({ behavior: "smooth", block: "start" });
}

function openFeedstockFormBySelection() {
  const selected = feedstockType.value;
  if (!selected) {
    hideFeedstockForm();
    return;
  }

  const existingIdx = feedstockEntries.findIndex((x) => x.feedstock === selected);
  if (existingIdx >= 0) {
    draftFeedstockIndex = existingIdx;
    draftFeedstockName = selected;
    showFeedstockForm(feedstockEntries[existingIdx], "Edit Feedstock");
    feedstockFeedback.textContent = "Editing existing feedstock entry.";
    return;
  }

  const draft = {
    feedstock: selected,
    quantity_tpy: "",
    q1_source_supply: "",
    q2_suppliers_relation: "",
    q3_current_use: "",
    q4_transport_km: "",
    notes: "",
  };

  draftFeedstockIndex = -1;
  draftFeedstockName = selected;
  showFeedstockForm(draft, "New Feedstock");
  feedstockFeedback.textContent = "Fill feedstock questionnaire, then click Save Info.";
}

function validateFeedstockDraft() {
  if (!draftFeedstockName) return "Select a feedstock type first.";
  if (!feedstockQty.value) return "Enter feedstock quantity.";
  if (!q1SourceSupply.value) return "Fill Q1.";
  if (!q2SupplierRelation.value) return "Fill Q2.";
  if (!q3CurrentUse.value) return "Fill Q3.";
  if (!q4TransportKm.value) return "Fill Q4.";
  return "";
}

function saveFeedstockInfo() {
  const err = validateFeedstockDraft();
  if (err) {
    alert(err);
    return;
  }

  const row = {
    feedstock: draftFeedstockName,
    quantity_tpy: feedstockQty.value,
    q1_source_supply: q1SourceSupply.value,
    q2_suppliers_relation: q2SupplierRelation.value,
    q3_current_use: q3CurrentUse.value,
    q4_transport_km: q4TransportKm.value,
    notes: feedstockNotes.value,
  };

  if (draftFeedstockIndex >= 0) {
    feedstockEntries[draftFeedstockIndex] = row;
  } else {
    feedstockEntries.push(row);
  }

  renderAllFeedstockTables();
  renderFeedstockQc();
  renderSummary();
  saveUserToLocalStorage();
  feedstockFeedback.textContent = `Saved ${row.feedstock} information.`;
  hideFeedstockForm();
}

function openFeedstockFormForEdit(index) {
  if (!Number.isInteger(index) || index < 0 || index >= feedstockEntries.length) return;
  const entry = feedstockEntries[index];
  feedstockType.value = entry.feedstock;
  draftFeedstockIndex = index;
  draftFeedstockName = entry.feedstock;
  showFeedstockForm(entry, "Edit Feedstock");
  feedstockFeedback.textContent = "Editing existing feedstock entry.";
}

function updateRegistryMeta() {
  const selected = getSelectedRegistry();
  if (!selected) {
    registryMeta.innerHTML = "";
    return;
  }
  registryMeta.innerHTML = `${selected.name} selected (${selected.type}). <a href="${selected.source}" target="_blank" rel="noreferrer">source</a>`;
}

function renderFeedstockOptions(registryId) {
  feedstockType.innerHTML = "";
  const column = REGISTRY_COLUMN_BY_ID[registryId];

  if (!column) {
    feedstockType.appendChild(option("Select a registry first", ""));
    feedstockType.disabled = true;
    return;
  }

  const allowed = feedstockMatrix
    .filter((row) => isAccepted(row[column]))
    .map((row) => row.feedstock)
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));

  if (!allowed.length) {
    feedstockType.appendChild(option("No feedstocks mapped for this registry", ""));
    feedstockType.disabled = true;
    return;
  }

  feedstockType.appendChild(option("Select feedstock", ""));
  allowed.forEach((name) => feedstockType.appendChild(option(name, name)));
  feedstockType.disabled = false;
}

function validateFeedstockEntriesBeforeBiochar() {
  if (!feedstockEntries.length) return "Add at least one feedstock before moving to Biochar section.";
  for (const entry of feedstockEntries) {
    const missing = [];
    if (!entry.quantity_tpy) missing.push("quantity");
    if (!entry.q1_source_supply) missing.push("Q1");
    if (!entry.q2_suppliers_relation) missing.push("Q2");
    if (!entry.q3_current_use) missing.push("Q3");
    if (!entry.q4_transport_km) missing.push("Q4");
    if (missing.length) return `Complete ${entry.feedstock}: ${missing.join(", ")}.`;
  }
  return "";
}

function renderBiocharCriticalInfo() {
  const certs = getMultiValues(biocharCertification).join(", ") || "N/A";
  const content = biocharCarbonContent.value || "N/A";
  const hcorg = biocharHcorg.value || "N/A";
  const annual = plantCapacity.value || "0";
  const text = `Annual biochar (t): ${annual} | Carbon content (%): ${content} | H/Corg: ${hcorg} | Certifications: ${certs}`;
  biocharCriticalInfo.textContent = text;
  biocharCriticalInfoFinancial.textContent = text;
  biocharCriticalInfoAdditional.textContent = text;
}

function renderPyrolysisSummary() {
  const p13 = pyroQ13.value ? "Q13: provided" : "Q13: pending";
  const p14 = pyroQ14.value ? "Q14: provided" : "Q14: pending";
  const p15 = pyroQ15.value ? "Q15: provided" : "Q15: pending";
  const energy = pyroQ20.value || "N/A";
  pyroCriticalInfoFinancial.textContent = `${p13} | ${p14} | ${p15} | Energy source: ${energy}`;
  pyroCriticalInfoAdditional.textContent = `${p13} | ${p14} | ${p15} | Energy source: ${energy}`;
}

function renderFinancialSummary() {
  const q21 = financeQ21.value ? "Q21: provided" : "Q21: pending";
  const q22 = financeQ22.value ? "Q22: provided" : "Q22: pending";
  financialCriticalInfoAdditional.textContent = `${q21} | ${q22}`;
}

function computeTentativeCredits() {
  const annualBiochar = Number(plantCapacity.value || 0);
  const carbonContent = Number(biocharCarbonContent.value || 0) / 100;
  const permanence = Number(tentativePermanenceFactor.value || 0);
  if (!Number.isFinite(annualBiochar) || !Number.isFinite(carbonContent) || !Number.isFinite(permanence)) return 0;
  const raw = annualBiochar * carbonContent * 3.667 * permanence;
  return raw > 0 ? raw : 0;
}

function renderTentativeCredits() {
  tentativeCreditsValue.textContent = computeTentativeCredits().toFixed(2);
}

function renderProjectPreview() {
  const data = getFormData();
  const feedstockLines = feedstockEntries.length
    ? feedstockEntries.map((entry, idx) => `${idx + 1}. ${entry.feedstock} | qty: ${entry.quantity_tpy} | km: ${entry.q4_transport_km}`).join("\n")
    : "No feedstock added.";
  const additionalLines = additionalInfoEntries.length
    ? additionalInfoEntries.map((item, idx) => `${idx + 1}. ${item.text || "-"}`).join("\n")
    : "No additional info.";
  const preview = [
    `User: ${data.user_id || "N/A"}`,
    `Location: ${data.country_name || "N/A"} | ${data.state_name || "N/A"} | ${data.city_name || "N/A"}`,
    `Registry: ${data.registry_name || "N/A"}`,
    `Biomass total (t/year): ${data.biomass_total_tpy || "0"}`,
    `Tentative credits (tCO2e/year): ${computeTentativeCredits().toFixed(2)}`,
    "",
    "Feedstocks:",
    feedstockLines,
    "",
    `Biochar: Carbon=${data.q6_biochar_carbon_content_pct || "N/A"}% | H/Corg=${data.q7_biochar_h_corg_ratio || "N/A"} | End use=${data.q9_end_use_application || "N/A"}`,
    `Pyrolysis: Q13=${data.q13_pollution_controls ? "provided" : "pending"} | Q14=${data.q14_waste_heat_utilization ? "provided" : "pending"} | Q15=${data.q15_pyrolytic_gas_recovery ? "provided" : "pending"} | Energy=${data.q20_energy_source || "N/A"}`,
    `Financial: Q21=${data.q21_no_credit_revenue_scenario ? "provided" : "pending"} | Q22=${data.q22_financial_model_evidence ? "provided" : "pending"}`,
    "",
    "Additional Info:",
    additionalLines,
  ].join("\n");
  projectPreview.textContent = preview;
}

function renderAdditionalInfo() {
  additionalInfoList.innerHTML = "";
  if (!additionalInfoEntries.length) additionalInfoEntries.push({ text: "" });

  additionalInfoEntries.forEach((item, idx) => {
    const card = document.createElement("div");
    card.className = "questionnaire-card";
    card.innerHTML = `<label>Additional Info ${idx + 1}</label><textarea data-idx="${idx}" rows="3">${item.text || ""}</textarea>`;
    additionalInfoList.appendChild(card);
  });

  additionalInfoList.querySelectorAll("textarea[data-idx]").forEach((el) => {
    el.addEventListener("input", () => {
      const idx = Number(el.dataset.idx);
      if (!Number.isInteger(idx) || !additionalInfoEntries[idx]) return;
      additionalInfoEntries[idx].text = el.value;
      saveUserToLocalStorage();
    });
  });
}

function updateContractLockState() {
  const locked = contractSignedCheckbox.checked;
  addFeedstockBtn.disabled = locked;
  addAdditionalInfoBtn.disabled = locked;
}

function sectionToStep(sectionName) {
  return {
    step1: 1,
    feedstock: 2,
    biochar: 3,
    pyrolysis: 4,
    financial: 5,
    additional: 6,
    tentative: 7,
  }[sectionName] || 1;
}

function updateProgressUI(sectionName) {
  const step = sectionToStep(sectionName);
  const steps = [progressStep1, progressStep2, progressStep3, progressStep4, progressStep5, progressStep6, progressStep7];
  steps.forEach((el, idx) => {
    const n = idx + 1;
    el.classList.toggle("active", n === step);
    el.classList.toggle("done", n < step);
  });
  progressFill.style.width = `${((step - 1) / 6) * 100}%`;
}

function showSectionsFor(sectionName) {
  const showStep1 = sectionName === "step1";
  const showFeedstock = sectionName === "feedstock";
  const showBiochar = sectionName === "biochar";
  const showPyro = sectionName === "pyrolysis";
  const showFinancial = sectionName === "financial";
  const showAdditional = sectionName === "additional";
  const showTentative = sectionName === "tentative";

  const keepStep1Visible = showStep1 || (showFeedstock && showStep1Editor);
  step1Card.classList.toggle("hidden", !keepStep1Visible);
  feedstockSection.classList.toggle("hidden", !showFeedstock);
  biocharSection.classList.toggle("hidden", !showBiochar);
  pyrolysisSection.classList.toggle("hidden", !showPyro);
  financialSection.classList.toggle("hidden", !showFinancial);
  additionalSection.classList.toggle("hidden", !showAdditional);
  tentativeSection.classList.toggle("hidden", !showTentative);

  if (showPyro || showFinancial || showAdditional || showTentative) renderBiocharCriticalInfo();
  if (showFinancial || showAdditional || showTentative) renderPyrolysisSummary();
  if (showAdditional || showTentative) renderFinancialSummary();
  if (showTentative) {
    renderTentativeCredits();
    renderProjectPreview();
  }
  if (showStep1 && facilityMap) {
    setTimeout(() => facilityMap.invalidateSize(), 0);
  }
  updateProgressUI(sectionName);
}

function navigateToSection(sectionName) {
  if (sectionName === "feedstock" && !canEnterFeedstockSection()) {
    alert("Select registry before opening feedstock section.");
    return;
  }
  if (sectionName === "step1") showStep1Editor = true;
  else if (sectionName !== "feedstock") showStep1Editor = false;
  const current = getCurrentSectionFromUrl();
  const url = new URL(window.location.href);
  url.searchParams.set("section", sectionName);
  url.searchParams.set("prev", current);
  window.history.pushState({}, "", `${url.pathname}?${url.searchParams.toString()}`);
  applySectionFromUrl();
}

function navigateBackByHistory() {
  const params = new URLSearchParams(window.location.search);
  const prev = params.get("prev");
  if (prev && ["step1", "feedstock", "biochar", "pyrolysis", "financial", "additional", "tentative"].includes(prev)) {
    navigateToSection(prev);
    return;
  }

  const current = getCurrentSectionFromUrl();
  const fallback = {
    tentative: "additional",
    additional: "financial",
    financial: "pyrolysis",
    pyrolysis: "biochar",
    biochar: "feedstock",
    feedstock: "step1",
    step1: "step1",
  }[current];
  navigateToSection(fallback);
}

function openStep1Editor() {
  showStep1Editor = true;
  navigateToSection("step1");
  showSectionsFor("step1");
  step1Card.classList.remove("hidden");
  step1Card.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderPreviousSectionSummary() {
  const parts = [];
  if (selectedText(countrySelect)) parts.push(`Country: ${selectedText(countrySelect)}`);
  if (selectedText(stateSelect)) parts.push(`State: ${selectedText(stateSelect)}`);
  if (citySelect.value) parts.push(`City: ${citySelect.value}`);
  if (selectedText(registrySelect)) parts.push(`Registry: ${selectedText(registrySelect)}`);
  const text = parts.length ? parts.join(" | ") : "Select country, location, and registry.";
  previousSummaryInFeedstock.textContent = text;
  previousSummaryInBiochar.textContent = text;
  previousSummaryInPyro.textContent = text;
  previousSummaryInFinancial.textContent = text;
  previousSummaryInAdditional.textContent = text;
}

function renderFeedstockSummaryText() {
  if (!feedstockEntries.length) {
    feedstockSummaryInFinancial.textContent = "No feedstock added yet.";
    feedstockSummaryInAdditional.textContent = "No feedstock added yet.";
    return;
  }
  const total = computeTotalBiomass();
  const list = feedstockEntries.map((entry) => entry.feedstock).join(", ");
  feedstockSummaryInFinancial.textContent = `Total biomass: ${total} t/year | Feedstocks: ${list}`;
  feedstockSummaryInAdditional.textContent = `Total biomass: ${total} t/year | Feedstocks: ${list}`;
}

function updateFeedstockAvailability() {
  const enabled = canEnterFeedstockSection();
  if (!enabled) {
    feedstockSection.classList.add("hidden");
    showStep1Editor = false;
    step1Card.classList.remove("hidden");
    hideFeedstockForm();
    feedstockFeedback.textContent = "Select a registry to unlock feedstock section.";
  }
}

function getFormData() {
  return {
    user_id: userIdInput.value.trim(),
    country_code: countrySelect.value,
    country_name: selectedText(countrySelect),
    state_code: stateSelect.value,
    state_name: selectedText(stateSelect),
    city_name: citySelect.value,
    registry_id: registrySelect.value,
    registry_name: selectedText(registrySelect),
    facility_lat: Number.isFinite(facilityLat) ? String(facilityLat) : "",
    facility_lng: Number.isFinite(facilityLng) ? String(facilityLng) : "",

    feedstock_entries_json: JSON.stringify(feedstockEntries),
    biomass_total_tpy: String(computeTotalBiomass()),

    q5_annual_biochar_t: plantCapacity.value,
    q6_biochar_carbon_content_pct: biocharCarbonContent.value,
    q7_biochar_h_corg_ratio: biocharHcorg.value,
    q8_biochar_certifications: getMultiValues(biocharCertification).join("; "),
    q9_end_use_application: biocharEndUse.value,
    q10_end_use_share_pct: biocharEndUseShare.value,
    q11_end_user_relation_doc: biocharEndUserRelation.value,
    q12_biochar_transport_km: biocharTransportDistance.value,

    q13_pollution_controls: pyroQ13.value,
    q14_waste_heat_utilization: pyroQ14.value,
    q15_pyrolytic_gas_recovery: pyroQ15.value,
    q16_continuous_temperature_reporting: pyroQ16.value,
    q17_avg_yearly_temp: pyroQ17.value,
    q18_facility_certifications: getMultiValues(pyroQ18).join("; "),
    q19_energy_used_mwh_a: pyroQ19.value,
    q20_energy_source: pyroQ20.value,
    q21_no_credit_revenue_scenario: financeQ21.value,
    q22_financial_model_evidence: financeQ22.value,
    q23_tentative_permanence_factor: tentativePermanenceFactor.value,
    q24_tentative_credits_tco2e: computeTentativeCredits().toFixed(2),

    additional_info_json: JSON.stringify(additionalInfoEntries),
    contract_signed: contractSignedCheckbox.checked ? "yes" : "no",
    saved_at_utc: new Date().toISOString(),
  };
}

function renderSummary() {
  const data = getFormData();
  const parts = [];
  if (data.user_id) parts.push(`User: ${data.user_id}`);
  if (data.country_name) parts.push(`Country: ${data.country_name}`);
  if (data.registry_name) parts.push(`Registry: ${data.registry_name}`);
  if (data.facility_lat && data.facility_lng) parts.push(`Facility: ${Number(data.facility_lat).toFixed(4)}, ${Number(data.facility_lng).toFixed(4)}`);
  if (feedstockEntries.length) parts.push(`Feedstocks: ${feedstockEntries.length}`);
  parts.push(`Biomass Total: ${data.biomass_total_tpy || "0"} t/year`);
  if (data.contract_signed === "yes") parts.push("Contract: Signed");
  summary.textContent = parts.join(" | ");
  renderPreviousSectionSummary();
  renderFeedstockQc();
  renderFeedstockSummaryText();
  renderPyrolysisSummary();
  renderFinancialSummary();
  renderTentativeCredits();
  renderProjectPreview();
}

function csvEscape(value) {
  const str = String(value ?? "");
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replaceAll('"', '""')}"`;
  }
  return str;
}

function saveUserToLocalStorage() {
  const userId = userIdInput.value.trim();
  if (!userId) return;
  localStorage.setItem(`${STORAGE_KEY_PREFIX}${userId}`, JSON.stringify(getFormData()));
}

function loadUserFromLocalStorage() {
  const userId = userIdInput.value.trim();
  if (!userId) return;
  const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${userId}`);
  if (!raw) return;

  try {
    const data = JSON.parse(raw);

    if (data.country_code) {
      countrySelect.value = data.country_code;
      loadStates(data.country_code);
    }
    if (data.state_code) {
      stateSelect.value = data.state_code;
      loadCities(data.country_code, data.state_code);
    } else if (data.country_code) {
      loadCities(data.country_code);
    }

    citySelect.value = data.city_name || "";
    registrySelect.value = data.registry_id || "";
    facilityLat = data.facility_lat ? Number(data.facility_lat) : null;
    facilityLng = data.facility_lng ? Number(data.facility_lng) : null;
    updateRegistryMeta();
    renderFeedstockOptions(registrySelect.value);

    try {
      feedstockEntries = JSON.parse(data.feedstock_entries_json || "[]");
      if (!Array.isArray(feedstockEntries)) feedstockEntries = [];
    } catch {
      feedstockEntries = [];
    }

    renderAllFeedstockTables();
    hideFeedstockForm();

    plantCapacity.value = data.q5_annual_biochar_t || "";
    biocharCarbonContent.value = data.q6_biochar_carbon_content_pct || "";
    biocharHcorg.value = data.q7_biochar_h_corg_ratio || "";
    setMultiValues(
      biocharCertification,
      String(data.q8_biochar_certifications || "").split(/;|,/).map((v) => v.trim()).filter(Boolean)
    );
    biocharEndUse.value = data.q9_end_use_application || "";
    biocharEndUseShare.value = data.q10_end_use_share_pct || "";
    biocharEndUserRelation.value = data.q11_end_user_relation_doc || "";
    biocharTransportDistance.value = data.q12_biochar_transport_km || "";

    pyroQ13.value = data.q13_pollution_controls || "";
    pyroQ14.value = data.q14_waste_heat_utilization || "";
    pyroQ15.value = data.q15_pyrolytic_gas_recovery || "";
    pyroQ16.value = data.q16_continuous_temperature_reporting || "";
    pyroQ17.value = data.q17_avg_yearly_temp || "";
    setMultiValues(
      pyroQ18,
      String(data.q18_facility_certifications || "").split(/;|,/).map((v) => v.trim()).filter(Boolean)
    );
    pyroQ19.value = data.q19_energy_used_mwh_a || "";
    pyroQ20.value = data.q20_energy_source || "";
    financeQ21.value = data.q21_no_credit_revenue_scenario || "";
    financeQ22.value = data.q22_financial_model_evidence || "";
    tentativePermanenceFactor.value = data.q23_tentative_permanence_factor || "0.80";

    try {
      additionalInfoEntries = JSON.parse(data.additional_info_json || "[]");
      if (!Array.isArray(additionalInfoEntries)) additionalInfoEntries = [];
    } catch {
      additionalInfoEntries = [];
    }
    renderAdditionalInfo();

    contractSignedCheckbox.checked = data.contract_signed === "yes";
    updateContractLockState();
    updateFeedstockAvailability();

    renderBiocharCriticalInfo();
    if (facilityMap) setFacilityMarker(facilityLat, facilityLng, true);
    updateFacilityLocationSummary();
    renderSummary();
  } catch (error) {
    console.error("Failed to load saved data", error);
  }
}

function downloadCsv() {
  const data = getFormData();
  if (!data.user_id) {
    alert("Enter User ID/Email before saving CSV.");
    return;
  }

  const headers = Object.keys(data);
  const values = headers.map((k) => csvEscape(data[k]));
  const csv = `${headers.join(",")}\n${values.join(",")}\n`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const safeUser = data.user_id.replace(/[^a-zA-Z0-9_-]/g, "_");
  link.href = url;
  link.download = `feasibility_${safeUser}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);

  saveUserToLocalStorage();
}

function loadStates(countryCode) {
  const countryStates = states
    .filter((state) => state.countryCode === countryCode)
    .sort((a, b) => a.name.localeCompare(b.name));

  clearAndSetDefault(
    stateSelect,
    countryStates.length ? "Select state/province" : "No state data available"
  );
  stateSelect.disabled = !countryStates.length;
  countryStates.forEach((state) => stateSelect.appendChild(option(state.name, state.isoCode)));
}

function loadCities(countryCode, stateCode = "") {
  const inCountry = cities.filter((city) => city.countryCode === countryCode);
  let filteredCities = inCountry;
  if (stateCode) {
    const byState = inCountry.filter((city) => city.stateCode === stateCode);
    filteredCities = byState.length ? byState : inCountry;
  }
  filteredCities = filteredCities.sort((a, b) => a.name.localeCompare(b.name));

  clearAndSetDefault(citySelect, filteredCities.length ? "Select city" : "No city data available");
  citySelect.disabled = !filteredCities.length;
  filteredCities.forEach((city) => citySelect.appendChild(option(city.name, city.name)));
}

async function loadGeoData() {
  try {
    const [countryRes, stateRes, cityRes] = await Promise.all([
      fetch(GEO_DATA_URLS.countries),
      fetch(GEO_DATA_URLS.states),
      fetch(GEO_DATA_URLS.cities),
    ]);

    if (!countryRes.ok || !stateRes.ok || !cityRes.ok) {
      throw new Error("Failed to fetch geo datasets.");
    }

    [countries, states, cities] = await Promise.all([
      countryRes.json(),
      stateRes.json(),
      cityRes.json(),
    ]);

    clearAndSetDefault(countrySelect, "Select country");
    [...countries]
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((country) => countrySelect.appendChild(option(country.name, country.isoCode)));

    clearAndSetDefault(stateSelect, "Select country first");
    clearAndSetDefault(citySelect, "Select state first");
    countrySelect.disabled = false;
  } catch (error) {
    console.error(error);
    clearAndSetDefault(countrySelect, "Unable to load country list");
    clearAndSetDefault(stateSelect, "Unable to load state list");
    clearAndSetDefault(citySelect, "Unable to load city list");
    countrySelect.disabled = true;
    stateSelect.disabled = true;
    citySelect.disabled = true;
  }
}

async function loadFeedstockMatrix() {
  try {
    const res = await fetch(FEEDSTOCK_MATRIX_URL);
    if (!res.ok) throw new Error("Failed to fetch feedstock matrix.");
    feedstockMatrix = parseFeedstockCsv(await res.text());
    renderFeedstockOptions(registrySelect.value);
  } catch (error) {
    console.error(error);
    feedstockType.innerHTML = "";
    feedstockType.appendChild(option("Unable to load feedstock matrix", ""));
    feedstockType.disabled = true;
  }
}

function applySectionFromUrl() {
  const section = getCurrentSectionFromUrl();

  if (!canEnterFeedstockSection()) {
    showSectionsFor("step1");
    return;
  }

  if ((section === "biochar" || section === "pyrolysis" || section === "financial" || section === "additional" || section === "tentative") && !feedstockEntries.length) {
    showSectionsFor("feedstock");
    return;
  }

  if (section !== "feedstock" && section !== "step1") showStep1Editor = false;
  showSectionsFor(section);
}

countrySelect.addEventListener("change", () => {
  const countryCode = countrySelect.value;
  clearAndSetDefault(citySelect, "Select state first");
  citySelect.disabled = true;

  if (!countryCode) {
    clearAndSetDefault(stateSelect, "Select country first");
    stateSelect.disabled = true;
    renderSummary();
    return;
  }

  loadStates(countryCode);
  loadCities(countryCode);
  if (!Number.isFinite(facilityLat) || !Number.isFinite(facilityLng)) geocodeProjectLocation();
  renderSummary();
  saveUserToLocalStorage();
});

stateSelect.addEventListener("change", () => {
  if (!countrySelect.value) return;
  loadCities(countrySelect.value, stateSelect.value || "");
  if (!Number.isFinite(facilityLat) || !Number.isFinite(facilityLng)) geocodeProjectLocation();
  renderSummary();
  saveUserToLocalStorage();
});

citySelect.addEventListener("change", () => {
  if (!Number.isFinite(facilityLat) || !Number.isFinite(facilityLng)) geocodeProjectLocation();
  renderSummary();
  saveUserToLocalStorage();
});

registrySelect.addEventListener("change", () => {
  updateRegistryMeta();
  renderFeedstockOptions(registrySelect.value);
  updateFeedstockAvailability();
  hideFeedstockForm();
  if (registrySelect.value) {
    feedstockFeedback.textContent = "Registry selected. Select a feedstock and open the form.";
  }
  renderSummary();
  saveUserToLocalStorage();
});

userIdInput.addEventListener("change", () => {
  loadUserFromLocalStorage();
  renderSummary();
  saveUserToLocalStorage();
});

editFacilityMarkerBtn.addEventListener("click", () => {
  if (!mapEditMode) {
    updateMapEditMode(true);
    return;
  }
  updateMapEditMode(false);
  renderSummary();
  saveUserToLocalStorage();
});

toFeedstockBtn.addEventListener("click", () => {
  if (!registrySelect.value) {
    feedstockFeedback.textContent = "Select a registry first, then continue to Feedstock Section.";
    registrySelect.focus();
    return;
  }
  if (!countrySelect.value) {
    feedstockFeedback.textContent = "Country is not selected yet. You can continue with feedstock and update location later.";
  }
  showSectionsFor("feedstock");
  feedstockSection.scrollIntoView({ behavior: "smooth", block: "start" });
  navigateToSection("feedstock");
});

editStep1FromFeedstockBtn.addEventListener("click", openStep1Editor);
editStep1FromBiocharBtn.addEventListener("click", openStep1Editor);
editStep1FromPyroBtn.addEventListener("click", openStep1Editor);
editStep1FromFinancialBtn.addEventListener("click", openStep1Editor);
editStep1FromAdditionalBtn.addEventListener("click", openStep1Editor);

feedstockType.addEventListener("change", openFeedstockFormBySelection);
addFeedstockBtn.addEventListener("click", openFeedstockFormBySelection);
editFeedstockFromFeedstockBtn.addEventListener("click", () => {
  feedstockType.focus();
  feedstockSection.scrollIntoView({ behavior: "smooth", block: "start" });
});
editFeedstockFromBiocharBtn.addEventListener("click", () => navigateToSection("feedstock"));
editFeedstockFromPyroBtn.addEventListener("click", () => navigateToSection("feedstock"));
editFeedstockFromFinancialBtn.addEventListener("click", () => navigateToSection("feedstock"));
editFeedstockFromAdditionalBtn.addEventListener("click", () => navigateToSection("feedstock"));
saveFeedstockInfoBtn.addEventListener("click", saveFeedstockInfo);

feedstockTableBodyFeedstock.addEventListener("click", (event) => {
  const editButton = event.target.closest("button[data-edit-feedstock-index]");
  if (editButton) {
    const index = Number(editButton.dataset.editFeedstockIndex);
    openFeedstockFormForEdit(index);
    return;
  }
  const deleteButton = event.target.closest("button[data-delete-feedstock-index]");
  if (!deleteButton) return;
  const index = Number(deleteButton.dataset.deleteFeedstockIndex);
  if (!Number.isInteger(index) || index < 0 || index >= feedstockEntries.length) return;
  feedstockEntries.splice(index, 1);
  renderAllFeedstockTables();
  renderSummary();
  saveUserToLocalStorage();
  hideFeedstockForm();
  feedstockFeedback.textContent = "Feedstock entry deleted.";
});

toBiocharPageBtn.addEventListener("click", () => {
  const err = validateFeedstockEntriesBeforeBiochar();
  if (err) {
    alert(err);
    return;
  }
  navigateToSection("biochar");
});

toPyrolysisPageBtn.addEventListener("click", () => {
  navigateToSection("pyrolysis");
});

editBiocharFromPyroBtn.addEventListener("click", () => navigateToSection("biochar"));
editBiocharFromFinancialBtn.addEventListener("click", () => navigateToSection("biochar"));
editBiocharFromAdditionalBtn.addEventListener("click", () => navigateToSection("biochar"));
editPyroFromFinancialBtn.addEventListener("click", () => navigateToSection("pyrolysis"));
editPyroFromAdditionalBtn.addEventListener("click", () => navigateToSection("pyrolysis"));
editFinancialFromAdditionalBtn.addEventListener("click", () => navigateToSection("financial"));

toFinancialPageBtn.addEventListener("click", () => {
  navigateToSection("financial");
});

toAdditionalPageBtn.addEventListener("click", () => {
  navigateToSection("additional");
});

toTentativePageBtn.addEventListener("click", () => {
  navigateToSection("tentative");
});

backToStep1Btn.addEventListener("click", navigateBackByHistory);
window.addEventListener("popstate", applySectionFromUrl);

progressStep1.addEventListener("click", () => navigateToSection("step1"));
progressStep2.addEventListener("click", () => navigateToSection("feedstock"));
progressStep3.addEventListener("click", () => navigateToSection("biochar"));
progressStep4.addEventListener("click", () => navigateToSection("pyrolysis"));
progressStep5.addEventListener("click", () => navigateToSection("financial"));
progressStep6.addEventListener("click", () => navigateToSection("additional"));
progressStep7.addEventListener("click", () => navigateToSection("tentative"));

tentativePermanenceFactor.addEventListener("input", () => {
  renderTentativeCredits();
  saveUserToLocalStorage();
});

refreshPreviewBtn.addEventListener("click", renderProjectPreview);

[
  biocharCarbonContent,
  biocharHcorg,
  biocharCertification,
  biocharEndUse,
  biocharEndUseShare,
  biocharEndUserRelation,
  biocharTransportDistance,
  pyroQ13,
  pyroQ14,
  pyroQ15,
  pyroQ16,
  pyroQ17,
  pyroQ18,
  pyroQ19,
  pyroQ20,
  financeQ21,
  financeQ22,
].forEach((el) => {
  el.addEventListener("change", () => {
    renderBiocharCriticalInfo();
    renderSummary();
    saveUserToLocalStorage();
  });
});

addAdditionalInfoBtn.addEventListener("click", () => {
  additionalInfoEntries.push({ text: "" });
  renderAdditionalInfo();
  saveUserToLocalStorage();
});

contractSignedCheckbox.addEventListener("change", () => {
  updateContractLockState();
  renderSummary();
  saveUserToLocalStorage();
});

saveCsvBtn.addEventListener("click", downloadCsv);

Promise.all([loadGeoData(), loadFeedstockMatrix()]).then(() => {
  initFacilityMap();
  renderAdditionalInfo();
  loadUserFromLocalStorage();
  renderAllFeedstockTables();
  renderBiocharCriticalInfo();
  updateFeedstockAvailability();
  applySectionFromUrl();
  renderSummary();
});
