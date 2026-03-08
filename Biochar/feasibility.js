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
const singleFacilityCount = document.getElementById("singleFacilityCount");
const singleStateWrap = document.getElementById("singleStateWrap");
const multiStateModeSelect = document.getElementById("multiStateMode");
const multiStateCheckbox = document.getElementById("multiStateCheckbox");
const multiStateWrap = document.getElementById("multiStateWrap");
const multiStateSummary = document.getElementById("multiStateSummary");
const multiStateEditor = document.getElementById("multiStateEditor");
const openMultiStateEditorBtn = document.getElementById("openMultiStateEditorBtn");
const closeMultiStateEditorBtn = document.getElementById("closeMultiStateEditorBtn");
const multiStateSelect = document.getElementById("multiStateSelect");
const multiStateLocationList = document.getElementById("multiStateLocationList");
const addMultiStateLocationBtn = document.getElementById("addMultiStateLocationBtn");
const registrySelect = document.getElementById("registrySelect");
const registryMeta = document.getElementById("registryMeta");
const countryEligibilityMsg = document.getElementById("countryEligibilityMsg");
const summary = document.getElementById("summary");
const facilityMapEl = document.getElementById("facilityMap");
const editFacilityMarkerBtn = document.getElementById("editFacilityMarkerBtn");
const mapHoverDistrict = document.getElementById("mapHoverDistrict");
const facilityCoordLat = document.getElementById("facilityCoordLat");
const facilityCoordLng = document.getElementById("facilityCoordLng");
const addFacilityByCoordBtn = document.getElementById("addFacilityByCoordBtn");
const facilityLocationSummary = document.getElementById("facilityLocationSummary");
const facilityAddressPreview = document.getElementById("facilityAddressPreview");
const facilityPlanQCSummary = document.getElementById("facilityPlanQCSummary");
const facilityMarkerDates = document.getElementById("facilityMarkerDates");
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
const feedstockFacilitySelect = document.getElementById("feedstockFacilitySelect");
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
const openRegistryCalculatorBtn = document.getElementById("openRegistryCalculatorBtn");
const finalCreditsValue = document.getElementById("finalCreditsValue");
const step7SummaryBody = document.getElementById("step7SummaryBody");
const step7ContributionBody = document.getElementById("step7ContributionBody");
const step7DefaultsBody = document.getElementById("step7DefaultsBody");
const step7MonitoringBody = document.getElementById("step7MonitoringBody");
const step7FacilityMatrixBody = document.getElementById("step7FacilityMatrixBody");
const refreshPreviewBtn = document.getElementById("refreshPreviewBtn");
const downloadPreviewPdfBtn = document.getElementById("downloadPreviewPdfBtn");
const projectPreview = document.getElementById("projectPreview");
const previewFacilityMapEl = document.getElementById("previewFacilityMap");
const previewFacilityTableBody = document.getElementById("previewFacilityTableBody");
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
let facilityPoints = [];
let multiStateLocations = [];
let activeMultiStateIndex = 0;
let multiStateEditorOpen = false;
let mapEditMode = false;
let facilityMap = null;
let facilityMarkersLayer = null;
let previewFacilityMap = null;
let previewFacilityMarkersLayer = null;
let previewBoundaryLayer = null;
let stateBoundaryLayer = null;
let districtBoundaryLayer = null;
let hoverDistrictBoundaryLayer = null;
let stateBoundaryFeatures = [];
let districtBoundaryFeatures = [];
let hoverDistrictCache = new Map();
let hoverDistrictFeatureCache = new Map();
let hoverDistrictBoundaryKey = "";
let hoverDistrictInFlight = false;
let hoverDistrictLastMs = 0;
let finalRegistryCredits = null;
let editingFacilityIndex = -1;

const FINAL_CREDITS_STORAGE_KEY = "biochar-feasibility-final-credits";
const TRANSFER_STORAGE_PREFIX = "biochar-feasibility-transfer:";
const REGISTRY_COUNTRY_POLICY = {
  verra: { disallow: [] },
  gs: { disallow: [] },
  puro: { disallow: [] },
  isometric: { disallow: [] },
};

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

function getStorageUserId() {
  const typed = (userIdInput?.value || "").trim();
  return typed || "default";
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

function getFacilityLabelById(facilityId) {
  const idx = facilityPoints.findIndex((f) => f.id === facilityId);
  return idx >= 0 ? `Facility ${idx + 1}` : "Facility N/A";
}

function listFacilities() {
  return facilityPoints.map((f, idx) => ({ id: f.id, label: `Facility ${idx + 1}` }));
}

function renderFeedstockFacilityOptions() {
  if (!feedstockFacilitySelect) return;
  const current = feedstockFacilitySelect.value;
  feedstockFacilitySelect.innerHTML = "";
  if (!facilityPoints.length) {
    feedstockFacilitySelect.appendChild(option("Select facility first", ""));
    feedstockFacilitySelect.disabled = true;
    return;
  }
  feedstockFacilitySelect.appendChild(option("Select facility", ""));
  listFacilities().forEach((f) => feedstockFacilitySelect.appendChild(option(f.label, f.id)));
  feedstockFacilitySelect.disabled = false;
  if (current && facilityPoints.some((f) => f.id === current)) feedstockFacilitySelect.value = current;
}

function reconcileFeedstockWithFacilities() {
  const valid = new Set(facilityPoints.map((f) => f.id));
  feedstockEntries = feedstockEntries.filter((e) => !e.facility_id || valid.has(e.facility_id));
  if (feedstockFacilitySelect?.value && !valid.has(feedstockFacilitySelect.value)) {
    feedstockFacilitySelect.value = "";
  }
}

function reconcileFacilitiesWithPlan() {
  const plans = getFacilityPlanRows();
  if (!plans.length) {
    facilityPoints = [];
    syncPrimaryFacilityPoint();
    return;
  }
  const limit = Math.max(0, Number(plans[0]?.facility_count || 0));
  facilityPoints = facilityPoints.slice(0, limit || facilityPoints.length).map((f) => ({ ...f, plan_key: "plan::global" }));
  syncPrimaryFacilityPoint();
}

function getSingleStateFacilityPlan() {
  const count = Math.max(1, Number(singleFacilityCount?.value || 1));
  return {
    state_code: stateSelect.value || "",
    state_name: getStateNameFromCode(countrySelect.value, stateSelect.value || "") || selectedText(stateSelect),
    city_name: citySelect.value || "",
    facility_count: count,
  };
}

function refreshCountryOptionsForRegistry(preserveCode = "") {
  if (!registrySelect.value) {
    clearAndSetDefault(countrySelect, "Select registry first");
    countrySelect.disabled = true;
    return;
  }
  clearAndSetDefault(countrySelect, "Select country");
  [...countries]
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((country) => countrySelect.appendChild(option(country.name, country.isoCode)));
  countrySelect.disabled = false;
  if (preserveCode && Array.from(countrySelect.options).some((o) => o.value === preserveCode)) {
    countrySelect.value = preserveCode;
  }
}

function checkCountryEligibility(registryId, countryCode) {
  if (!registryId || !countryCode) return { allowed: false, message: "Select registry and country." };
  const policy = REGISTRY_COUNTRY_POLICY[registryId] || { disallow: [] };
  if ((policy.disallow || []).includes(countryCode)) {
    return { allowed: false, message: "This registry pathway is currently not enabled for the selected country." };
  }
  return { allowed: true, message: "Country is eligible for selected registry (screening stage)." };
}

function renderFacilityPlanQc() {
  if (!facilityPlanQCSummary) return;
  const plans = getFacilityPlanRows();
  if (!plans.length) {
    facilityPlanQCSummary.textContent = "QA/QC: Select state(s) and set facility count.";
    return;
  }
  const expected = plans.reduce((s, p) => s + Number(p.facility_count || 0), 0);
  const added = facilityPoints.length;
  const pending = Math.max(0, expected - added);
  const msg = [
    `QA/QC: planned ${expected}, added ${added}, pending ${pending}.`,
    isMultiStateEnabled() && !getMultiValues(multiStateSelect).length ? "Select at least one state." : "",
  ]
    .filter(Boolean)
    .join(" ");
  facilityPlanQCSummary.textContent = msg;
}

function getCountryStates(countryCode) {
  return states
    .filter((state) => state.countryCode === countryCode)
    .sort((a, b) => a.name.localeCompare(b.name));
}

function getStateNameFromCode(countryCode, stateCode) {
  const hit = states.find((s) => s.countryCode === countryCode && s.isoCode === stateCode);
  return hit?.name || "";
}

function getCitiesForState(countryCode, stateCode) {
  const inCountry = cities.filter((city) => city.countryCode === countryCode);
  const inState = inCountry.filter((city) => city.stateCode === stateCode);
  const list = (inState.length ? inState : inCountry).slice();
  list.sort((a, b) => a.name.localeCompare(b.name));
  return list;
}

function syncMultiStateSelectFromLocations() {
  if (!multiStateSelect) return;
  const selectedCodes = new Set((multiStateLocations || []).map((m) => String(m.state_code || "")).filter(Boolean));
  Array.from(multiStateSelect.options).forEach((opt) => {
    opt.selected = selectedCodes.has(String(opt.value || ""));
  });
}

function isMultiStateEnabled() {
  if (multiStateModeSelect) return multiStateModeSelect.value === "yes";
  return Boolean(multiStateCheckbox?.checked);
}

function setMultiStateEnabled(enabled) {
  if (multiStateModeSelect) multiStateModeSelect.value = enabled ? "yes" : "no";
  if (multiStateCheckbox) multiStateCheckbox.checked = Boolean(enabled);
  if (multiStateWrap) multiStateWrap.classList.toggle("hidden", !enabled);
  if (singleStateWrap) singleStateWrap.classList.toggle("hidden", enabled);
}

function getSelectedStateCodes() {
  return getMultiValues(multiStateSelect);
}

function getBoundaryStateNames() {
  if (!isMultiStateEnabled()) return [selectedText(stateSelect)].filter(Boolean);
  const codes = getMultiValues(multiStateSelect);
  const names = codes.map((c) => getStateNameFromCode(countrySelect.value, c)).filter(Boolean);
  return [...new Set(names)];
}

function getFacilityPlanRows() {
  const count = Math.max(1, Number(singleFacilityCount?.value || 1));
  if (isMultiStateEnabled()) {
    const stateCodes = getMultiValues(multiStateSelect);
    if (!stateCodes.length) return [];
    const names = stateCodes.map((c) => getStateNameFromCode(countrySelect.value, c)).filter(Boolean);
    return [{
      key: "plan::global",
      state_name: names.join(", "),
      state_code: "",
      districts: [],
      city_name: "",
      facility_count: count,
    }];
  }
  const single = getSingleStateFacilityPlan();
  if (!single.state_name) return [];
  return [{ key: "plan::global", ...single, city_name: "", districts: [], facility_count: count }];
}

function getPlanFacilityCount(planKey) {
  return facilityPoints.filter((f) => f.plan_key === planKey).length;
}

function normalizeBoundaryName(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\b(district|city|municipality|municipal|division|province|state|county|region)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function boundaryNameMatches(a, b) {
  const x = normalizeBoundaryName(a);
  const y = normalizeBoundaryName(b);
  if (!x || !y) return false;
  return x === y || x.includes(y) || y.includes(x);
}

function findTargetPlanForPoint(lat, lng) {
  const plans = getFacilityPlanRows();
  if (!plans.length) return null;
  const candidates = plans.filter((p) => getPlanFacilityCount(p.key) < p.facility_count);
  if (!candidates.length) return null;
  return candidates[0];
}

function renderMultiStateLocationRows(focusIdx = -1) {
  if (!multiStateSummary) return;
  if (!isMultiStateEnabled()) {
    multiStateSummary.textContent = "No states selected.";
    if (multiStateEditor) multiStateEditor.classList.add("hidden");
    if (closeMultiStateEditorBtn) closeMultiStateEditorBtn.classList.add("hidden");
    if (openMultiStateEditorBtn) openMultiStateEditorBtn.textContent = "Add New State";
    return;
  }
  const names = getBoundaryStateNames();
  multiStateSummary.textContent = names.length ? names.join(", ") : "No states selected.";
  if (openMultiStateEditorBtn) openMultiStateEditorBtn.textContent = names.length ? "Edit States" : "Add New State";
  if (multiStateEditor) multiStateEditor.classList.toggle("hidden", !multiStateEditorOpen);
  if (closeMultiStateEditorBtn) closeMultiStateEditorBtn.classList.toggle("hidden", !multiStateEditorOpen);
}

function updateFacilityLocationSummary() {
  const plans = getFacilityPlanRows();
  const expected = plans.reduce((s, p) => s + Number(p.facility_count || 0), 0);
  if (!facilityPoints.length) {
    facilityLocationSummary.textContent = expected ? `No facility added yet. Expected: ${expected}.` : "No facility added yet.";
    return;
  }
  const list = facilityPoints
    .slice(0, 4)
    .map((p, i) => {
      const startDate = p.start_date ? ` | Start: ${p.start_date}` : "";
      return `${i + 1}) ${Number(p.lat).toFixed(6)}, ${Number(p.lng).toFixed(6)}${startDate}`;
    })
    .join(" | ");
  facilityLocationSummary.textContent = `Facilities: ${facilityPoints.length}${expected ? ` / ${expected}` : ""}. ${list}${facilityPoints.length > 4 ? " ..." : ""}`;
  if (!facilityPoints.length && facilityAddressPreview) {
    facilityAddressPreview.textContent = "Address preview will appear after marker placement.";
  }
}

function syncPrimaryFacilityPoint() {
  if (!facilityPoints.length) {
    facilityLat = null;
    facilityLng = null;
    return;
  }
  facilityLat = Number(facilityPoints[0].lat);
  facilityLng = Number(facilityPoints[0].lng);
}

function pointInRing(lat, lng, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = Number(ring[i][0]);
    const yi = Number(ring[i][1]);
    const xj = Number(ring[j][0]);
    const yj = Number(ring[j][1]);
    const intersect = yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi + Number.EPSILON) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function pointInFeature(lat, lng, feature) {
  const geom = feature?.geometry;
  if (!geom) return false;
  if (geom.type === "Polygon") {
    const rings = geom.coordinates || [];
    if (!rings.length) return false;
    if (!pointInRing(lat, lng, rings[0])) return false;
    for (let i = 1; i < rings.length; i += 1) if (pointInRing(lat, lng, rings[i])) return false;
    return true;
  }
  if (geom.type === "MultiPolygon") {
    const polys = geom.coordinates || [];
    return polys.some((poly) => {
      if (!poly.length) return false;
      if (!pointInRing(lat, lng, poly[0])) return false;
      for (let i = 1; i < poly.length; i += 1) if (pointInRing(lat, lng, poly[i])) return false;
      return true;
    });
  }
  return false;
}

function getPlacementError(lat, lng, plan = null) {
  const plans = getFacilityPlanRows();
  if (!plans.length) return "Select state(s) and facility count before adding facilities.";
  if (!stateBoundaryFeatures.length) return "State boundary is still loading. Try again in a moment.";
  const insideState = stateBoundaryFeatures.some((f) => pointInFeature(lat, lng, f));
  if (!insideState) return "Facility is outside selected state boundary.";
  if (plan) {
    const existing = getPlanFacilityCount(plan.key);
    if (existing >= Number(plan.facility_count || 0)) {
      return `Facility limit reached (${Number(plan.facility_count || 0)}). Increase facility count to add more markers.`;
    }
  }
  return "";
}

function renderFacilityMarkerDates() {
  if (!facilityMarkerDates) return;
  if (!facilityPoints.length) {
    editingFacilityIndex = -1;
    facilityMarkerDates.innerHTML = "Add facilities in edit mode. District is auto-detected from marker location; edit operation start date in the table below.";
    return;
  }
  const countryCode = countrySelect.value;
  if (editingFacilityIndex < 0 || editingFacilityIndex >= facilityPoints.length) {
    editingFacilityIndex = facilityPoints.findIndex((p) => !p.state_code || !p.start_date);
  }
  const tableRows = facilityPoints
    .map((p, idx) => {
      const stateName = fmt(p.state_name || getStateNameFromCode(countryCode, p.state_code));
      const cityName = fmt(p.city_name);
      const startDate = fmt(p.start_date);
      return `<tr>
        <td>Facility ${idx + 1}</td>
        <td>${stateName}</td>
        <td>${cityName}</td>
        <td>${Number(p.lat).toFixed(6)}</td>
        <td>${Number(p.lng).toFixed(6)}</td>
        <td>${startDate}</td>
        <td>
          <div class="btn-row">
            <button type="button" class="btn btn-secondary btn-sm" data-edit-facility-idx="${idx}">Edit</button>
            <button type="button" class="btn btn-danger btn-sm" data-delete-facility-idx="${idx}">Delete</button>
          </div>
        </td>
      </tr>`;
    })
    .join("");
  let editorHtml = "";
  if (editingFacilityIndex >= 0 && facilityPoints[editingFacilityIndex]) {
    const p = facilityPoints[editingFacilityIndex];
    editorHtml = `<div class="questionnaire-card" style="margin-top:8px;">
      <strong>Edit Facility ${editingFacilityIndex + 1}</strong>
      <div class="small">State: ${fmt(p.state_name || getStateNameFromCode(countryCode, p.state_code))} | District: ${fmt(p.city_name)}</div>
      <div style="height:6px"></div>
      <div>
        <label>Location</label>
        <div class="small">${Number(p.lat).toFixed(6)}, ${Number(p.lng).toFixed(6)}</div>
      </div>
      <label for="facilityEditStartDate">Operation start date</label>
      <input id="facilityEditStartDate" type="date" value="${p.start_date || ""}" />
      <div class="btn-row">
        <button type="button" id="saveFacilityEditBtn" class="btn btn-secondary btn-sm">Save Facility</button>
        <button type="button" id="cancelFacilityEditBtn" class="btn btn-secondary btn-sm">Cancel</button>
      </div>
    </div>`;
  }
  facilityMarkerDates.innerHTML = `
    <table class="feedstock-table">
      <thead><tr><th>Facility</th><th>State</th><th>District</th><th>Lat</th><th>Lng</th><th>Operation Start Date</th><th>Action</th></tr></thead>
      <tbody>${tableRows}</tbody>
    </table>
    ${editorHtml}
  `;
  facilityMarkerDates.querySelectorAll("button[data-edit-facility-idx]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.editFacilityIdx);
      if (!Number.isInteger(idx) || !facilityPoints[idx]) return;
      editingFacilityIndex = idx;
      renderFacilityMarkerDates();
    });
  });
  facilityMarkerDates.querySelectorAll("button[data-delete-facility-idx]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.deleteFacilityIdx);
      if (!Number.isInteger(idx) || !facilityPoints[idx]) return;
      facilityPoints.splice(idx, 1);
      if (editingFacilityIndex === idx) editingFacilityIndex = -1;
      if (editingFacilityIndex > idx) editingFacilityIndex -= 1;
      syncPrimaryFacilityPoint();
      reconcileFeedstockWithFacilities();
      renderFacilityMarkers(false);
      updateFacilityLocationSummary();
      renderFacilityMarkerDates();
      renderSummary();
      saveUserToLocalStorage();
    });
  });
  const saveBtn = document.getElementById("saveFacilityEditBtn");
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const idx = editingFacilityIndex;
      if (!Number.isInteger(idx) || !facilityPoints[idx]) return;
      const startDate = String(document.getElementById("facilityEditStartDate")?.value || "");
      if (!startDate) {
        alert("Select operation start date.");
        return;
      }
      facilityPoints[idx].start_date = startDate;
      editingFacilityIndex = -1;
      updateFacilityLocationSummary();
      renderFacilityMarkerDates();
      renderSummary();
      saveUserToLocalStorage();
    });
  }
  const cancelBtn = document.getElementById("cancelFacilityEditBtn");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      editingFacilityIndex = -1;
      renderFacilityMarkerDates();
    });
  }
}

function renderFacilityMarkers(recenter = false) {
  if (!facilityMap || !window.L) return;
  if (!facilityMarkersLayer) facilityMarkersLayer = window.L.layerGroup().addTo(facilityMap);
  facilityMarkersLayer.clearLayers();
  facilityPoints.forEach((p, idx) => {
    const marker = window.L.marker([p.lat, p.lng], { draggable: mapEditMode }).addTo(facilityMarkersLayer);
    if (p.start_date) marker.bindTooltip(`Start: ${p.start_date}`);
    marker.on("dragend", async () => {
      const pos = marker.getLatLng();
      const placementError = getPlacementError(pos.lat, pos.lng);
      if (placementError) {
        alert(placementError);
        marker.setLatLng([p.lat, p.lng]);
        return;
      }
      const autoLoc = await resolveFacilityLocationFromPoint(Number(pos.lat), Number(pos.lng));
      facilityPoints[idx] = {
        id: p.id || `${Date.now()}-${idx}`,
        plan_key: p.plan_key || "",
        lat: Number(pos.lat),
        lng: Number(pos.lng),
        start_date: p.start_date || "",
        state_code: autoLoc.state_code || p.state_code || "",
        state_name: autoLoc.state_name || p.state_name || "",
        city_name: autoLoc.city_name || p.city_name || "",
      };
      syncPrimaryFacilityPoint();
      updateFacilityLocationSummary();
      updateFacilityAddressPreview(Number(pos.lat), Number(pos.lng));
      renderSummary();
      saveUserToLocalStorage();
    });
    marker.on("click", () => {
      if (!mapEditMode) return;
      facilityPoints.splice(idx, 1);
      if (editingFacilityIndex === idx) editingFacilityIndex = -1;
      if (editingFacilityIndex > idx) editingFacilityIndex -= 1;
      syncPrimaryFacilityPoint();
      renderFacilityMarkers(false);
      updateFacilityLocationSummary();
      renderSummary();
      saveUserToLocalStorage();
    });
  });
  if (recenter && facilityPoints.length) {
    const latlngs = facilityPoints.map((p) => [p.lat, p.lng]);
    facilityMap.fitBounds(latlngs, { padding: [20, 20] });
  }
  renderFacilityMarkerDates();
}

function setFacilityMarker(lat, lng, recenter = true) {
  const la = Number(lat);
  const ln = Number(lng);
  if (!Number.isFinite(la) || !Number.isFinite(ln)) return false;
  const targetPlan = findTargetPlanForPoint(la, ln);
  const placementError = getPlacementError(la, ln, targetPlan);
  if (placementError) {
    alert(placementError);
    return false;
  }
  const markerId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  facilityPoints.push({
    id: markerId,
    lat: la,
    lng: ln,
    plan_key: targetPlan?.key || "plan::global",
    start_date: "",
    state_code: "",
    state_name: "",
    city_name: "",
  });
  editingFacilityIndex = facilityPoints.length - 1;
  resolveFacilityLocationFromPoint(la, ln).then((autoLoc) => {
    const latest = facilityPoints.find((p) => p.id === markerId);
    if (!latest) return;
    latest.state_code = autoLoc.state_code || latest.state_code || "";
    latest.state_name = autoLoc.state_name || latest.state_name || "";
    latest.city_name = autoLoc.city_name || latest.city_name || "";
    renderFacilityMarkerDates();
    renderSummary();
    saveUserToLocalStorage();
  }).catch(() => {});
  updateFacilityAddressPreview(la, ln);
  syncPrimaryFacilityPoint();
  renderFacilityMarkers(recenter);
  updateFacilityLocationSummary();
  renderFacilityMarkerDates();
  return true;
}

function updateMapEditMode(enabled) {
  mapEditMode = Boolean(enabled);
  editFacilityMarkerBtn.textContent = mapEditMode ? "Save Locations" : "Edit Facility Locations";
  editFacilityMarkerBtn.classList.toggle("btn-danger", mapEditMode);
  renderFacilityMarkers(false);
  refreshStateBoundaryLayer();
}

async function fetchStateBoundaryFeature(stateName, countryName) {
  const query = encodeURIComponent([stateName, countryName].filter(Boolean).join(", "));
  const url = `https://nominatim.openstreetmap.org/search?format=json&polygon_geojson=1&addressdetails=1&limit=10&q=${query}`;
  const res = await fetch(url);
  const rows = await res.json();
  const isAreaGeo = (geo) => {
    const t = String(geo?.type || "");
    return t === "Polygon" || t === "MultiPolygon";
  };
  const list = Array.isArray(rows) ? rows.filter((r) => r?.geojson) : [];
  const areaList = list.filter((r) => isAreaGeo(r.geojson));
  const pool = areaList.length ? areaList : list;
  const stateNorm = normalizeBoundaryName(stateName);
  const scoreRow = (r) => {
    let score = 0;
    const addr = r?.address || {};
    if (String(r?.class || "").toLowerCase() === "boundary") score += 6;
    if (String(r?.type || "").toLowerCase() === "administrative") score += 6;
    if (boundaryNameMatches(r?.name, stateNorm) || boundaryNameMatches(addr.state, stateNorm)) score += 10;
    if (isAreaGeo(r?.geojson)) score += 4;
    if (String(r?.osm_type || "").toLowerCase() === "node") score -= 5;
    return score;
  };
  const first = pool.sort((a, b) => scoreRow(b) - scoreRow(a))[0] || null;
  if (!first?.geojson) return null;
  return { type: "Feature", properties: { name: stateName }, geometry: first.geojson };
}

async function fetchDistrictBoundaryFeature(cityName, stateName, countryName) {
  if (!cityName) return null;
  const query = encodeURIComponent([`${cityName} district`, stateName, countryName].filter(Boolean).join(", "));
  const url = `https://nominatim.openstreetmap.org/search?format=json&polygon_geojson=1&addressdetails=1&limit=10&q=${query}`;
  const res = await fetch(url);
  const rows = await res.json();
  const list = Array.isArray(rows) ? rows.filter((r) => r?.geojson) : [];
  const isAreaGeo = (geo) => {
    const t = String(geo?.type || "");
    return t === "Polygon" || t === "MultiPolygon";
  };
  const areaList = list.filter((r) => isAreaGeo(r.geojson));
  const pool = areaList.length ? areaList : list;
  const cityNorm = normalizeBoundaryName(cityName);
  const stateNorm = normalizeBoundaryName(stateName);
  const scoreRow = (r) => {
    let score = 0;
    const addr = r?.address || {};
    const adminName = [
      addr.county,
      addr.state_district,
      addr.city_district,
      addr.city,
      addr.municipality,
      addr.town,
      addr.village,
    ].find(Boolean);
    if (String(r?.class || "").toLowerCase() === "boundary") score += 6;
    if (String(r?.type || "").toLowerCase() === "administrative") score += 6;
    if (boundaryNameMatches(adminName, cityNorm) || boundaryNameMatches(r?.name, cityNorm)) score += 10;
    if (boundaryNameMatches(addr.state, stateNorm)) score += 4;
    if (isAreaGeo(r?.geojson)) score += 4;
    if (String(r?.osm_type || "").toLowerCase() === "node") score -= 5;
    return score;
  };
  const best = pool.sort((a, b) => scoreRow(b) - scoreRow(a))[0] || null;
  const first = best || (Array.isArray(rows) ? rows[0] : null);
  if (!first?.geojson) return null;
  return { type: "Feature", properties: { name: cityName, state: stateName }, geometry: first.geojson };
}

async function resolveFacilityLocationFromPoint(lat, lng) {
  const inStateFeature = stateBoundaryFeatures.find((f) => pointInFeature(lat, lng, f));
  let stateName = String(inStateFeature?.properties?.name || "");
  let stateCode = stateName
    ? (getCountryStates(countrySelect.value).find((s) => s.name === stateName)?.isoCode || "")
    : "";
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}&zoom=12&addressdetails=1`;
    const res = await fetch(url);
    const row = await res.json();
    const addr = row?.address || {};
    const districtName = String(
      addr.county ||
        addr.city_district ||
        addr.state_district ||
        addr.city ||
        addr.town ||
        addr.municipality ||
        addr.village ||
        ""
    );
    if (!stateName && addr.state) {
      stateName = String(addr.state);
      stateCode = getCountryStates(countrySelect.value).find((s) => s.name === stateName)?.isoCode || stateCode;
    }
    return { state_code: stateCode, state_name: stateName, city_name: districtName };
  } catch {
    return { state_code: stateCode, state_name: stateName, city_name: "" };
  }
}

async function fetchDistrictNameForPoint(lat, lng) {
  const key = `${Number(lat).toFixed(3)},${Number(lng).toFixed(3)}`;
  if (hoverDistrictCache.has(key)) return hoverDistrictCache.get(key);
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}&zoom=12&addressdetails=1`;
  const res = await fetch(url);
  const row = await res.json();
  const addr = row?.address || {};
  const districtName = String(
    addr.county ||
      addr.city_district ||
      addr.state_district ||
      addr.city ||
      addr.town ||
      addr.municipality ||
      addr.village ||
      ""
  );
  hoverDistrictCache.set(key, districtName || "N/A");
  return hoverDistrictCache.get(key);
}

async function fetchDistrictInfoForPoint(lat, lng) {
  const key = `${Number(lat).toFixed(3)},${Number(lng).toFixed(3)}`;
  if (hoverDistrictCache.has(key)) {
    return { district_name: hoverDistrictCache.get(key), state_name: "" };
  }
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}&zoom=12&addressdetails=1`;
  const res = await fetch(url);
  const row = await res.json();
  const addr = row?.address || {};
  const districtName = String(
    addr.county ||
      addr.city_district ||
      addr.state_district ||
      addr.city ||
      addr.town ||
      addr.municipality ||
      addr.village ||
      ""
  );
  const stateName = String(addr.state || "");
  hoverDistrictCache.set(key, districtName || "N/A");
  return { district_name: districtName || "N/A", state_name: stateName };
}

async function updateFacilityAddressPreview(lat, lng) {
  if (!facilityAddressPreview) return;
  facilityAddressPreview.textContent = "Resolving address...";
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}&zoom=18&addressdetails=1`;
    const res = await fetch(url);
    const row = await res.json();
    const label = String(row?.display_name || "").trim();
    facilityAddressPreview.textContent = label ? `Address: ${label}` : "Address: unavailable";
  } catch {
    facilityAddressPreview.textContent = "Address: unavailable";
  }
}

async function refreshStateBoundaryLayer() {
  if (!facilityMap || !window.L) return;
  hoverDistrictCache = new Map();
  hoverDistrictFeatureCache = new Map();
  hoverDistrictBoundaryKey = "";
  const stateNames = getBoundaryStateNames();
  stateBoundaryFeatures = [];
  districtBoundaryFeatures = [];
  if (!stateNames.length) {
    if (stateBoundaryLayer) stateBoundaryLayer.clearLayers();
    if (districtBoundaryLayer) districtBoundaryLayer.clearLayers();
    if (hoverDistrictBoundaryLayer) hoverDistrictBoundaryLayer.clearLayers();
    if (mapHoverDistrict) mapHoverDistrict.textContent = "Hover inside selected state boundary to view district.";
    return;
  }
  const country = selectedText(countrySelect);
  for (const s of stateNames) {
    try {
      const feature = await fetchStateBoundaryFeature(s, country);
      if (feature) stateBoundaryFeatures.push(feature);
    } catch {
      // ignore boundary fetch failures for individual states
    }
  }
  if (!stateBoundaryLayer) {
    stateBoundaryLayer = window.L.geoJSON([], {
      style: { color: "#eab308", weight: 2, opacity: 0.9, fillOpacity: 0.05 },
    }).addTo(facilityMap);
  }
  if (!districtBoundaryLayer) {
    districtBoundaryLayer = window.L.geoJSON([], {
      style: { color: "#22c55e", weight: 1.6, opacity: 0.95, fillOpacity: 0.02 },
    }).addTo(facilityMap);
  }
  if (!hoverDistrictBoundaryLayer) {
    hoverDistrictBoundaryLayer = window.L.geoJSON([], {
      style: { color: "#38bdf8", weight: 2.2, opacity: 1, fillOpacity: 0.06 },
    }).addTo(facilityMap);
  }
  stateBoundaryLayer.clearLayers();
  districtBoundaryLayer.clearLayers();
  hoverDistrictBoundaryLayer.clearLayers();
  if (stateBoundaryFeatures.length) {
    stateBoundaryLayer.addData({ type: "FeatureCollection", features: stateBoundaryFeatures });
    if (mapEditMode) {
      const country = selectedText(countrySelect);
      const targets = [];
      facilityPoints.forEach((f) => {
        if (f.city_name && f.state_name) targets.push({ city_name: f.city_name, state_name: f.state_name });
      });
      const seen = new Set();
      for (const t of targets) {
        const key = `${String(t.state_name).toLowerCase()}::${String(t.city_name).toLowerCase()}`;
        if (seen.has(key)) continue;
        seen.add(key);
        try {
          const f = await fetchDistrictBoundaryFeature(t.city_name, t.state_name, country);
          if (f) districtBoundaryFeatures.push(f);
        } catch {
          // ignore
        }
      }
      if (districtBoundaryFeatures.length) {
        districtBoundaryLayer.addData({ type: "FeatureCollection", features: districtBoundaryFeatures });
      }
    }
    const b = stateBoundaryLayer.getBounds();
    if (b.isValid()) facilityMap.fitBounds(b.pad(0.1));
  }
  renderPreviewFacilityBlock();
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
  window.L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 19,
    attribution: "Tiles &copy; Esri",
  }).addTo(facilityMap);

  facilityMap.on("click", (e) => {
    if (!mapEditMode) return;
    const targetPlan = findTargetPlanForPoint(e.latlng.lat, e.latlng.lng);
    if (!targetPlan) {
      alert("All planned facilities are already added. Increase facility count to add more markers.");
      return;
    }
    const placementError = getPlacementError(e.latlng.lat, e.latlng.lng, targetPlan);
    if (placementError) {
      alert(placementError);
      return;
    }
    setFacilityMarker(Number(e.latlng.lat), Number(e.latlng.lng), false);
    renderSummary();
    saveUserToLocalStorage();
  });

  facilityMap.on("mousemove", async (e) => {
    if (!mapHoverDistrict) return;
    if (!stateBoundaryFeatures.length) {
      mapHoverDistrict.textContent = "Hover inside selected state boundary to view district.";
      return;
    }
    const lat = Number(e.latlng.lat);
    const lng = Number(e.latlng.lng);
    const insideState = stateBoundaryFeatures.some((f) => pointInFeature(lat, lng, f));
    if (!insideState) {
      mapHoverDistrict.textContent = "Pointer is outside selected state boundary.";
      if (hoverDistrictBoundaryLayer) hoverDistrictBoundaryLayer.clearLayers();
      hoverDistrictBoundaryKey = "";
      return;
    }
    const now = Date.now();
    if (hoverDistrictInFlight || now - hoverDistrictLastMs < 450) return;
    hoverDistrictLastMs = now;
    hoverDistrictInFlight = true;
    try {
      const info = await fetchDistrictInfoForPoint(lat, lng);
      const dName = info.district_name || "N/A";
      mapHoverDistrict.textContent = `District: ${dName}`;
      if (dName && dName !== "N/A") {
        const stateFromPoint = stateBoundaryFeatures.find((f) => pointInFeature(lat, lng, f))?.properties?.name || info.state_name || "";
        const key = `${String(stateFromPoint).toLowerCase()}::${String(dName).toLowerCase()}`;
        if (key && key !== hoverDistrictBoundaryKey) {
          hoverDistrictBoundaryKey = key;
          if (hoverDistrictBoundaryLayer) hoverDistrictBoundaryLayer.clearLayers();
          let feature = hoverDistrictFeatureCache.get(key);
          if (!feature) {
            feature = await fetchDistrictBoundaryFeature(dName, String(stateFromPoint || ""), selectedText(countrySelect));
            if (feature) hoverDistrictFeatureCache.set(key, feature);
          }
          if (feature && hoverDistrictBoundaryLayer) {
            hoverDistrictBoundaryLayer.addData(feature);
          }
        }
      }
    } catch {
      mapHoverDistrict.textContent = "District: unavailable";
    } finally {
      hoverDistrictInFlight = false;
    }
  });

  facilityMap.on("mouseout", () => {
    if (mapHoverDistrict) mapHoverDistrict.textContent = "Hover inside selected state boundary to view district.";
    if (hoverDistrictBoundaryLayer) hoverDistrictBoundaryLayer.clearLayers();
    hoverDistrictBoundaryKey = "";
  });

  if (facilityPoints.length) renderFacilityMarkers(true);
  else if (Number.isFinite(facilityLat) && Number.isFinite(facilityLng)) setFacilityMarker(facilityLat, facilityLng, true);
  updateFacilityLocationSummary();
  renderFacilityMarkerDates();
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

function normalizeCities(rawCities) {
  if (!Array.isArray(rawCities)) return [];
  if (!rawCities.length) return [];

  if (Array.isArray(rawCities[0])) {
    // Format: [name, countryCode, stateCode, latitude, longitude]
    return rawCities.map((row) => ({
      name: row[0] || "",
      countryCode: row[1] || "",
      stateCode: row[2] || "",
      latitude: row[3] || "",
      longitude: row[4] || "",
    }));
  }

  return rawCities;
}

function isAccepted(value) {
  return ["yes", "y", "1", "true"].includes(String(value).toLowerCase().trim());
}

function getSelectedRegistry() {
  return REGISTRIES.find((r) => r.id === registrySelect.value);
}

function getRegistryCalculatorPage(registryId) {
  return {
    verra: "feasibility_verra.html",
    gs: "feasibility_gs.html",
    puro: "feasibility_puro.html",
    isometric: "feasibility_isometric.html",
  }[registryId] || "";
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

function computeFacilityMatrices() {
  return facilityPoints.map((f, idx) => {
    const rows = feedstockEntries.filter((e) => e.facility_id === f.id);
    const biomass = rows.reduce((s, r) => s + Number(r.quantity_tpy || 0), 0);
    return {
      facility_id: f.id,
      facility_label: `Facility ${idx + 1}`,
      state_name: f.state_name || "",
      city_name: f.city_name || "",
      start_date: f.start_date || "",
      biomass_tpy: biomass,
      feedstocks: rows,
    };
  });
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
      warnings.push(`${getFacilityLabelById(entry.facility_id)} - ${entry.feedstock}: missing required fields`);
    }

    if (!Number.isFinite(qty) || qty <= 0) {
      warnCount += 1;
      warnings.push(`${getFacilityLabelById(entry.facility_id)} - ${entry.feedstock}: quantity should be > 0`);
    }

    if (Number.isFinite(km) && km > 1000) {
      warnCount += 1;
      warnings.push(`${getFacilityLabelById(entry.facility_id)} - ${entry.feedstock}: transport distance is high (>1000 km)`);
    }
  });

  feedstockQcSummary.textContent = `QA/QC: ${passCount} pass, ${warnCount} warnings.`;
  if (!feedstockFeedback.textContent && warnings.length) {
    feedstockFeedback.textContent = `Review: ${warnings.slice(0, 2).join(" | ")}${warnings.length > 2 ? " ..." : ""}`;
  }
}

function renderFeedstockTable(tbodyEl, withActions = false) {
  tbodyEl.innerHTML = "";
  const rows = feedstockEntries;
  if (!rows.length) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="${withActions ? 5 : 4}">No feedstock added yet.</td>`;
    tbodyEl.appendChild(tr);
    return;
  }

  rows.forEach((entry) => {
    const idx = feedstockEntries.findIndex((e) => e === entry);
    const tr = document.createElement("tr");
    const action = withActions
      ? `<td><div class="btn-row"><button class="btn btn-secondary btn-sm" type="button" data-edit-feedstock-index="${idx}">Edit</button><button class="btn btn-danger btn-sm" type="button" data-delete-feedstock-index="${idx}">Delete</button></div></td>`
      : "";
    tr.innerHTML = `<td>${getFacilityLabelById(entry.facility_id)}</td><td>${entry.feedstock}</td><td>${entry.quantity_tpy || ""}</td><td>${entry.q4_transport_km || ""}</td>${action}`;
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
  if (!feedstockFacilitySelect?.value) {
    feedstockFeedback.textContent = "Select facility first.";
    return;
  }
  const selected = feedstockType.value;
  if (!selected) {
    hideFeedstockForm();
    return;
  }

  const existingIdx = feedstockEntries.findIndex((x) => x.feedstock === selected && x.facility_id === feedstockFacilitySelect.value);
  if (existingIdx >= 0) {
    draftFeedstockIndex = existingIdx;
    draftFeedstockName = selected;
    showFeedstockForm(feedstockEntries[existingIdx], "Edit Feedstock");
    feedstockFeedback.textContent = "Editing existing feedstock entry.";
    return;
  }

  const draft = {
    facility_id: feedstockFacilitySelect.value,
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
  if (!feedstockFacilitySelect?.value) return "Select facility first.";
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
    facility_id: feedstockFacilitySelect.value,
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
  if (feedstockFacilitySelect) feedstockFacilitySelect.value = entry.facility_id || "";
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
  for (const f of facilityPoints) {
    if (!feedstockEntries.some((e) => e.facility_id === f.id)) {
      return `${getFacilityLabelById(f.id)} has no feedstock entry. Add feedstock for each facility.`;
    }
  }
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

function renderStep7Tables() {
  if (!step7SummaryBody || !step7ContributionBody || !step7DefaultsBody || !step7MonitoringBody || !step7FacilityMatrixBody) return;
  const methodology = getRegistryMethodologyMeta(registrySelect.value);
  const methodologyVersion = finalRegistryCredits?.methodology_version || methodology.version;
  const methodologyAsOf = finalRegistryCredits?.methodology_version_as_of || methodology.version_as_of || "2026-03-07";

  const summaryRows = [
    ["Tentative credits (tCO2e/year)", computeTentativeCredits().toFixed(2)],
    ["Final credits (tCO2e/year)", finalRegistryCredits ? Number(finalRegistryCredits.final_credits_tco2e || 0).toFixed(2) : "Not calculated yet"],
    ["Methodology version (as of date)", `${fmt(methodologyVersion)} (as of ${fmt(methodologyAsOf)})`],
    ["Issuance factor", finalRegistryCredits ? fmt(finalRegistryCredits.issuance_factor) : "N/A"],
    ["Buffer (%)", finalRegistryCredits ? fmt(finalRegistryCredits.buffer_percent) : "N/A"],
    ["Uncertainty (%)", finalRegistryCredits ? fmt(finalRegistryCredits.uncertainty_percent) : "N/A"],
  ];
  step7SummaryBody.innerHTML = summaryRows.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join("");

  const rawContributions = Array.isArray(finalRegistryCredits?.feedstock_contributions) ? finalRegistryCredits.feedstock_contributions : [];
  const contributions = aggregateFeedstockContributionRows(rawContributions);
  if (!contributions.length) {
    step7ContributionBody.innerHTML = '<tr><td colspan="6">No contribution data yet.</td></tr>';
  } else {
    step7ContributionBody.innerHTML = contributions
      .map(
        (r) =>
          `<tr><td>${fmt(r.feedstock)}</td><td>${fmt(r.quantity_tpy)}</td><td>${fmt(r.carbon_default_pct)}</td><td>${fmt(r.annual_credits_tco2e)}</td><td>${fmt(r.contribution_pct)}</td><td>${fmt(r?.carbon_reference?.source_label)}</td></tr>`
      )
      .join("");
  }

  const defaults = Array.isArray(finalRegistryCredits?.parameter_defaults_summary) ? finalRegistryCredits.parameter_defaults_summary : [];
  if (!defaults.length) {
    step7DefaultsBody.innerHTML = '<tr><td colspan="5">No parameter defaults yet.</td></tr>';
  } else {
    step7DefaultsBody.innerHTML = defaults
      .map(
        (p) =>
          `<tr><td>${fmt(p.parameter)}</td><td>${fmt(p.value)}</td><td>${fmt(p.default_value)}</td><td>${p.used_default ? "Default" : "Override"}</td><td>${fmt(p.source_label)}</td></tr>`
      )
      .join("");
  }

  const monitoring = Array.isArray(finalRegistryCredits?.monitoring_parameters) ? finalRegistryCredits.monitoring_parameters : [];
  if (!monitoring.length) {
    step7MonitoringBody.innerHTML = '<tr><td colspan="2">No monitoring parameters yet.</td></tr>';
  } else {
    step7MonitoringBody.innerHTML = monitoring.map((m) => `<tr><td>${fmt(m.parameter)}</td><td>${fmt(m.explanation)}</td></tr>`).join("");
  }

  const mats = computeFacilityMatrices();
  if (!mats.length) {
    step7FacilityMatrixBody.innerHTML = '<tr><td colspan="6">No facility matrix yet.</td></tr>';
  } else {
    step7FacilityMatrixBody.innerHTML = mats
      .map((m) => {
        const feedstocks = m.feedstocks.length
          ? m.feedstocks.map((f) => `${fmt(f.feedstock)} (${fmt(f.quantity_tpy)} t/yr)`).join("; ")
          : "None";
        return `<tr><td>${m.facility_label}</td><td>${fmt(m.state_name)}</td><td>${fmt(m.city_name)}</td><td>${fmt(m.start_date)}</td><td>${Number(m.biomass_tpy || 0).toFixed(2)}</td><td>${feedstocks}</td></tr>`;
      })
      .join("");
  }
}

function loadFinalRegistryCredits() {
  try {
    const raw = localStorage.getItem(FINAL_CREDITS_STORAGE_KEY);
    if (!raw) {
      finalRegistryCredits = null;
      finalCreditsValue.textContent = "Not calculated yet.";
      renderStep7Tables();
      return;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.registry_id !== registrySelect.value) {
      finalRegistryCredits = null;
      finalCreditsValue.textContent = "Not calculated yet.";
      renderStep7Tables();
      return;
    }
    finalRegistryCredits = parsed;
    finalCreditsValue.textContent = `${Number(parsed.final_credits_tco2e || 0).toFixed(2)} tCO2e/year`;
    renderStep7Tables();
  } catch {
    finalRegistryCredits = null;
    finalCreditsValue.textContent = "Not calculated yet.";
    renderStep7Tables();
  }
}

function fmt(value) {
  return value === null || value === undefined || value === "" ? "N/A" : String(value);
}

function aggregateFeedstockContributionRows(rows) {
  if (!Array.isArray(rows) || !rows.length) return [];
  const map = new Map();
  rows.forEach((r) => {
    const key = String(r?.feedstock || "Unknown");
    const prev = map.get(key) || {
      feedstock: key,
      quantity_tpy: 0,
      annual_credits_tco2e: 0,
      source_labels: new Set(),
      source_urls: new Set(),
      carbon_default_pct: "",
    };
    prev.quantity_tpy += Number(r?.quantity_tpy || 0);
    prev.annual_credits_tco2e += Number(r?.annual_credits_tco2e || 0);
    if (!prev.carbon_default_pct && r?.carbon_default_pct !== undefined) prev.carbon_default_pct = r.carbon_default_pct;
    if (r?.carbon_reference?.source_label) prev.source_labels.add(String(r.carbon_reference.source_label));
    if (r?.carbon_reference?.source_url) prev.source_urls.add(String(r.carbon_reference.source_url));
    map.set(key, prev);
  });
  const out = Array.from(map.values()).map((v) => ({
    feedstock: v.feedstock,
    quantity_tpy: Number(v.quantity_tpy || 0),
    annual_credits_tco2e: Number(v.annual_credits_tco2e || 0),
    contribution_pct: 0,
    carbon_default_pct: v.carbon_default_pct,
    carbon_reference: {
      source_label: Array.from(v.source_labels).join(" | "),
      source_url: Array.from(v.source_urls)[0] || "",
    },
  }));
  const total = out.reduce((s, r) => s + Number(r.annual_credits_tco2e || 0), 0);
  out.forEach((r) => {
    r.contribution_pct = total > 0 ? Number(((r.annual_credits_tco2e / total) * 100).toFixed(2)) : 0;
  });
  return out.sort((a, b) => Number(b.annual_credits_tco2e || 0) - Number(a.annual_credits_tco2e || 0));
}

function getRegistryMethodologyMeta(registryId) {
  return {
    verra: {
      standard: "VCS",
      methodology: "VM0044",
      version: "v1.2",
      version_as_of: "2026-03-07",
      version_note: "Active since 2025-06-27 (official Verra VM0044 page)",
      references: [
        "https://verra.org/methodologies/vm0044-methodology-for-biochar-utilization-in-soil-and-non-soil-applications/",
      ],
    },
    puro: {
      standard: "Puro Standard",
      methodology: "Puro Biochar Methodology",
      version: "Edition 2025",
      version_as_of: "2026-03-07",
      version_note: "2025 updated methodology",
      references: ["https://puro.earth/biochar"],
    },
    gs: {
      standard: "Gold Standard for the Global Goals",
      methodology: "Approved GS pathway (project-specific)",
      version: "Project-specific (no single global biochar version)",
      version_as_of: "2026-03-07",
      version_note: "Use applicable approved GS pathway/version for the project",
      references: ["https://globalgoals.goldstandard.org/"],
    },
    isometric: {
      standard: "Isometric Biochar Protocol",
      methodology: "Isometric pathway (project-specific)",
      version: "Biochar Protocol v1.0 (plus certified updates in 2025)",
      version_as_of: "2026-03-07",
      version_note: "See Isometric protocol/module updates for latest applicable scope",
      references: ["https://isometric.com/pathways/biochar"],
    },
  }[registryId || ""] || {
    standard: "N/A",
    methodology: "N/A",
    version: "N/A",
    version_as_of: "2026-03-07",
    version_note: "",
    references: [],
  };
}

function inferProjectName(data) {
  const city = data.city_name || "Unnamed";
  const country = data.country_name || "Project";
  return `MetaCarbonics Biochar - ${city}, ${country}`;
}

function buildContractPreviewLines() {
  const data = getFormData();
  const methodology = getRegistryMethodologyMeta(data.registry_id);
  const lines = [];
  lines.push("METACARBONICS BIOCHAR - PHASE 1 CONTRACT PREVIEW");
  lines.push(`Generated UTC: ${new Date().toISOString()}`);
  lines.push(`Project Name: ${inferProjectName(data)}`);
  lines.push(`Standard: ${fmt(methodology.standard)}`);
  lines.push(`Methodology: ${fmt(methodology.methodology)}`);
  lines.push(
    `Methodology Version (as of ${fmt(finalRegistryCredits?.methodology_version_as_of || methodology.version_as_of)}): ${fmt(finalRegistryCredits?.methodology_version || methodology.version)}`
  );
  if (finalRegistryCredits?.methodology_version_note || methodology.version_note) {
    lines.push(`Methodology Version Note: ${fmt(finalRegistryCredits?.methodology_version_note || methodology.version_note)}`);
  }
  if (methodology.references.length) {
    lines.push(`Methodology Source: ${methodology.references.join(" | ")}`);
  }
  lines.push("");
  lines.push("STEP 1: PROJECT PROFILE");
  lines.push(`Country: ${fmt(data.country_name)}`);
  if (data.multi_state_mode === "yes") {
    try {
      const ms = JSON.parse(data.selected_states_json || "[]");
      const stateNames = (Array.isArray(ms) ? ms : [])
        .map((v) => getStateNameFromCode(data.country_code, String(v || "")) || String(v || ""))
        .filter(Boolean);
      lines.push(`States: ${stateNames.length ? stateNames.join(", ") : "N/A"}`);
    } catch {
      lines.push("States: N/A");
    }
  } else {
    lines.push(`State: ${fmt(data.state_name)}`);
  }
  lines.push(`City: ${fmt(data.city_name)}`);
  lines.push(`Registry: ${fmt(data.registry_name)}`);
  lines.push(`Facility count: ${facilityPoints.length}`);
  facilityPoints.forEach((p, i) =>
    lines.push(
      `  Facility ${i + 1}: ${Number(p.lat).toFixed(6)}, ${Number(p.lng).toFixed(6)} | State: ${fmt(p.state_name)} | City: ${fmt(p.city_name)} | Start date: ${fmt(p.start_date)}`
    )
  );
  if (facilityPoints.length) {
    const p0 = facilityPoints[0];
    lines.push(`Map Link: https://www.openstreetmap.org/?mlat=${p0.lat}&mlon=${p0.lng}#map=12/${p0.lat}/${p0.lng}`);
  }
  lines.push("");

  lines.push("STEP 2: FEEDSTOCK QUESTIONNAIRE");
  if (!feedstockEntries.length) {
    lines.push("No feedstock entries.");
  } else {
    feedstockEntries.forEach((entry, idx) => {
      lines.push(`Feedstock ${idx + 1}: ${fmt(entry.feedstock)}`);
      lines.push(`  Quantity (t/year): ${fmt(entry.quantity_tpy)}`);
      lines.push(`  Q1 Source/Supply: ${fmt(entry.q1_source_supply)}`);
      lines.push(`  Q2 Supplier relation: ${fmt(entry.q2_suppliers_relation)}`);
      lines.push(`  Q3 Current use: ${fmt(entry.q3_current_use)}`);
      lines.push(`  Q4 Transport distance km: ${fmt(entry.q4_transport_km)}`);
      lines.push(`  Notes: ${fmt(entry.notes)}`);
    });
  }
  lines.push(`Total biomass (t/year): ${fmt(data.biomass_total_tpy)}`);
  lines.push("");

  lines.push("STEP 3: BIOCHAR");
  lines.push(`Q5 Annual biochar (t): ${fmt(data.q5_annual_biochar_t)}`);
  lines.push(`Q6 Carbon content (%): ${fmt(data.q6_biochar_carbon_content_pct)}`);
  lines.push(`Q7 H/Corg: ${fmt(data.q7_biochar_h_corg_ratio)}`);
  lines.push(`Q8 Certifications: ${fmt(data.q8_biochar_certifications)}`);
  lines.push(`Q9 End use application: ${fmt(data.q9_end_use_application)}`);
  lines.push(`Q10 End use split: ${fmt(data.q10_end_use_share_pct)}`);
  lines.push(`Q11 End-user relationship: ${fmt(data.q11_end_user_relation_doc)}`);
  lines.push(`Q12 Transport to end users km: ${fmt(data.q12_biochar_transport_km)}`);
  lines.push("");

  lines.push("STEP 4: PYROLYSIS");
  lines.push(`Q13 Pollution controls: ${fmt(data.q13_pollution_controls)}`);
  lines.push(`Q14 Waste heat utilization: ${fmt(data.q14_waste_heat_utilization)}`);
  lines.push(`Q15 Gas recovery/compliance: ${fmt(data.q15_pyrolytic_gas_recovery)}`);
  lines.push(`Q16 Continuous temperature reporting: ${fmt(data.q16_continuous_temperature_reporting)}`);
  lines.push(`Q17 Avg yearly production temperature: ${fmt(data.q17_avg_yearly_temp)}`);
  lines.push(`Q18 Facility certifications: ${fmt(data.q18_facility_certifications)}`);
  lines.push(`Q19 Energy used MWh/a: ${fmt(data.q19_energy_used_mwh_a)}`);
  lines.push(`Q20 Energy source: ${fmt(data.q20_energy_source)}`);
  lines.push("");

  lines.push("STEP 5: FINANCIAL");
  lines.push(`Q21 No-credit-revenue scenario: ${fmt(data.q21_no_credit_revenue_scenario)}`);
  lines.push(`Q22 Financial model evidence: ${fmt(data.q22_financial_model_evidence)}`);
  lines.push("");

  lines.push("STEP 6: ADDITIONAL INFORMATION");
  if (!additionalInfoEntries.length) lines.push("No additional information.");
  additionalInfoEntries.forEach((item, idx) => lines.push(`${idx + 1}. ${fmt(item.text)}`));
  lines.push("");

  lines.push("STEP 7: CREDITS");
  lines.push(`Tentative credits (tCO2e/year): ${computeTentativeCredits().toFixed(2)}`);
  lines.push(`Final credits (tCO2e/year): ${finalRegistryCredits ? Number(finalRegistryCredits.final_credits_tco2e || 0).toFixed(2) : "Not calculated yet"}`);
  lines.push(`Registry issuance factor: ${fmt(finalRegistryCredits?.issuance_factor)}`);
  lines.push(`Buffer (%): ${fmt(finalRegistryCredits?.buffer_percent)}`);
  lines.push(`Uncertainty (%): ${fmt(finalRegistryCredits?.uncertainty_percent)}`);
  lines.push(`Process emissions tCO2e: ${fmt(finalRegistryCredits?.process_emissions_tco2e)}`);
  lines.push(`Transport emissions tCO2e: ${fmt(finalRegistryCredits?.transport_emissions_tco2e)}`);
  lines.push(`Leakage tCO2e: ${fmt(finalRegistryCredits?.leakage_tco2e)}`);
  if (finalRegistryCredits?.carbon_default_reference) {
    const cdr = finalRegistryCredits.carbon_default_reference;
    lines.push(`Carbon content default used: ${fmt(cdr.feedstock)} (${fmt(cdr.region)}) = ${fmt(cdr.default_pct)}% [range ${fmt(cdr.range_pct)}%]`);
    if (cdr.source_label || cdr.source_url) lines.push(`  Source: ${fmt(cdr.source_label)} ${fmt(cdr.source_url)}`);
  }
  if (finalRegistryCredits?.sensitivity?.details && Array.isArray(finalRegistryCredits.sensitivity.details)) {
    lines.push("Sensitivity scenarios:");
    finalRegistryCredits.sensitivity.details.forEach((s) => {
      lines.push(
        `  ${fmt(s.label || s.variable)}: low ${fmt(s.low_pct)}%=${fmt(s.low_final)}, base=${fmt(s.base_final)}, high ${fmt(s.high_pct)}%=${fmt(s.high_final)}`
      );
    });
  } else if (finalRegistryCredits?.sensitivity) {
    lines.push(`Sensitivity: variable=${fmt(finalRegistryCredits.sensitivity.variable)}, range=${fmt(finalRegistryCredits.sensitivity.low_pct)}% to ${fmt(finalRegistryCredits.sensitivity.high_pct)}%, low=${fmt(finalRegistryCredits.sensitivity.low_final)}, high=${fmt(finalRegistryCredits.sensitivity.high_final)}`);
  }
  const facilityMatrices = computeFacilityMatrices();
  if (facilityMatrices.length) {
    lines.push("Facility-wise matrix:");
    facilityMatrices.forEach((m) => {
      lines.push(`  ${m.facility_label} | ${fmt(m.state_name)}, ${fmt(m.city_name)} | Start: ${fmt(m.start_date)} | Biomass: ${Number(m.biomass_tpy || 0).toFixed(2)} t/year`);
      if (!m.feedstocks.length) lines.push("    No feedstock added.");
      m.feedstocks.forEach((fs) => {
        lines.push(`    - ${fmt(fs.feedstock)} | Qty: ${fmt(fs.quantity_tpy)} | Distance km: ${fmt(fs.q4_transport_km)}`);
      });
    });
  }
  lines.push("");
  lines.push(`Contract sign status: ${data.contract_signed === "yes" ? "SIGNED" : "PENDING"}`);
  return lines;
}

function renderProjectPreview() {
  projectPreview.textContent = buildContractPreviewLines().join("\n");
  renderPreviewFacilityBlock();
}

function initPreviewFacilityMap() {
  if (!previewFacilityMapEl || !window.L || previewFacilityMap) return;
  previewFacilityMap = window.L.map(previewFacilityMapEl, {
    zoomControl: true,
    attributionControl: true,
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    keyboard: false,
    tap: false,
  }).setView([20, 0], 2);
  window.L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 19,
    attribution: "Tiles &copy; Esri",
  }).addTo(previewFacilityMap);
  previewFacilityMarkersLayer = window.L.layerGroup().addTo(previewFacilityMap);
  previewBoundaryLayer = window.L.geoJSON([], {
    style: { color: "#eab308", weight: 2, opacity: 0.9, fillOpacity: 0.05 },
  }).addTo(previewFacilityMap);
}

function renderPreviewFacilityBlock() {
  if (previewFacilityTableBody) {
    if (!facilityPoints.length) {
      previewFacilityTableBody.innerHTML = '<tr><td colspan="6">No facility markers yet.</td></tr>';
    } else {
      previewFacilityTableBody.innerHTML = facilityPoints
        .map(
          (p, idx) =>
            `<tr><td>Facility ${idx + 1}</td><td>${fmt(p.state_name)}</td><td>${fmt(p.city_name)}</td><td>${Number(p.lat).toFixed(6)}</td><td>${Number(p.lng).toFixed(6)}</td><td>${fmt(p.start_date)}</td></tr>`
        )
        .join("");
    }
  }
  if (!previewFacilityMap || !window.L || !previewFacilityMarkersLayer || !previewBoundaryLayer) return;
  previewFacilityMap.invalidateSize();
  previewFacilityMarkersLayer.clearLayers();
  previewBoundaryLayer.clearLayers();
  if (stateBoundaryFeatures.length) {
    previewBoundaryLayer.addData({ type: "FeatureCollection", features: stateBoundaryFeatures });
  }
  if (!facilityPoints.length) {
    if (stateBoundaryFeatures.length) {
      const b = previewBoundaryLayer.getBounds();
      if (b.isValid()) previewFacilityMap.fitBounds(b.pad(0.1));
      else previewFacilityMap.setView([20, 0], 2);
    } else {
      previewFacilityMap.setView([20, 0], 2);
    }
    return;
  }
  const latlngs = facilityPoints.map((p) => [Number(p.lat), Number(p.lng)]);
  facilityPoints.forEach((p, idx) => {
    const marker = window.L.marker([Number(p.lat), Number(p.lng)]).addTo(previewFacilityMarkersLayer);
    marker.bindPopup(`Facility ${idx + 1}<br>State: ${fmt(p.state_name)}<br>City: ${fmt(p.city_name)}<br>Start: ${fmt(p.start_date)}`);
  });
  const bounds = window.L.latLngBounds(latlngs);
  if (bounds.isValid()) previewFacilityMap.fitBounds(bounds.pad(0.15));
}

function getCoordsExtentFromFeature(feature) {
  const out = { minLat: Infinity, maxLat: -Infinity, minLng: Infinity, maxLng: -Infinity };
  const geom = feature?.geometry;
  if (!geom) return null;
  const walk = (coords) => {
    if (!Array.isArray(coords)) return;
    if (typeof coords[0] === "number" && typeof coords[1] === "number") {
      const lng = Number(coords[0]);
      const lat = Number(coords[1]);
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        out.minLat = Math.min(out.minLat, lat);
        out.maxLat = Math.max(out.maxLat, lat);
        out.minLng = Math.min(out.minLng, lng);
        out.maxLng = Math.max(out.maxLng, lng);
      }
      return;
    }
    coords.forEach(walk);
  };
  walk(geom.coordinates);
  if (!Number.isFinite(out.minLat) || !Number.isFinite(out.minLng)) return null;
  return out;
}

function mergeExtent(a, b) {
  if (!a) return b;
  if (!b) return a;
  return {
    minLat: Math.min(a.minLat, b.minLat),
    maxLat: Math.max(a.maxLat, b.maxLat),
    minLng: Math.min(a.minLng, b.minLng),
    maxLng: Math.max(a.maxLng, b.maxLng),
  };
}

function computePdfMapExtent(points, features) {
  let e = null;
  (points || []).forEach((p) => {
    const pe = { minLat: Number(p.lat), maxLat: Number(p.lat), minLng: Number(p.lng), maxLng: Number(p.lng) };
    if (Number.isFinite(pe.minLat) && Number.isFinite(pe.minLng)) e = mergeExtent(e, pe);
  });
  (features || []).forEach((f) => {
    e = mergeExtent(e, getCoordsExtentFromFeature(f));
  });
  if (!e) return null;
  const latPad = Math.max(0.02, (e.maxLat - e.minLat) * 0.12);
  const lngPad = Math.max(0.02, (e.maxLng - e.minLng) * 0.12);
  return {
    minLat: e.minLat - latPad,
    maxLat: e.maxLat + latPad,
    minLng: e.minLng - lngPad,
    maxLng: e.maxLng + lngPad,
  };
}

function makeSatelliteExportUrl(bounds, sizeW = 900, sizeH = 500) {
  const minLat = Number(bounds.minLat);
  const maxLat = Number(bounds.maxLat);
  const minLng = Number(bounds.minLng);
  const maxLng = Number(bounds.maxLng);
  const url =
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export" +
    `?bbox=${minLng},${minLat},${maxLng},${maxLat}` +
    "&bboxSR=4326&imageSR=4326" +
    `&size=${sizeW},${sizeH}` +
    "&format=png32&transparent=false&f=image";
  return { url, minLat, maxLat, minLng, maxLng };
}

async function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function fetchSatelliteMapDataUrl(bounds) {
  const cfg = makeSatelliteExportUrl(bounds);
  const res = await fetch(cfg.url);
  if (!res.ok) throw new Error("Satellite map image fetch failed.");
  const blob = await res.blob();
  const dataUrl = await blobToDataUrl(blob);
  return { dataUrl, ...cfg };
}

function createContributionPieDataUrl(rows) {
  if (!Array.isArray(rows) || !rows.length) return null;
  const canvas = document.createElement("canvas");
  canvas.width = 500;
  canvas.height = 320;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const total = rows.reduce((s, r) => s + Number(r.annual_credits_tco2e || 0), 0);
  if (total <= 0) return null;
  const cx = 150;
  const cy = 160;
  const radius = 100;
  let start = -Math.PI / 2;
  rows.forEach((r, idx) => {
    const val = Number(r.annual_credits_tco2e || 0);
    const frac = val / total;
    const end = start + frac * Math.PI * 2;
    const color = `hsl(${(idx * 67) % 360} 70% 45%)`;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, start, end);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    start = end;
  });
  ctx.font = "12px sans-serif";
  ctx.fillStyle = "#1e293b";
  ctx.fillText("Feedstock contribution share", 60, 24);
  let ly = 52;
  rows.forEach((r, idx) => {
    const color = `hsl(${(idx * 67) % 360} 70% 45%)`;
    ctx.fillStyle = color;
    ctx.fillRect(280, ly - 10, 10, 10);
    ctx.fillStyle = "#1e293b";
    const pct = total > 0 ? ((Number(r.annual_credits_tco2e || 0) / total) * 100).toFixed(2) : "0.00";
    ctx.fillText(`${String(r.feedstock || "Unknown")} (${pct}%)`, 296, ly);
    ly += 16;
  });
  return canvas.toDataURL("image/png");
}

async function downloadPreviewPdf() {
  const jspdf = window.jspdf;
  if (!jspdf || !jspdf.jsPDF) {
    alert("PDF library not loaded. Try refresh.");
    return;
  }
  const doc = new jspdf.jsPDF({ unit: "pt", format: "a4" });
  const data = getFormData();
  const methodology = getRegistryMethodologyMeta(data.registry_id);
  const lines = buildContractPreviewLines();
  const step7StartIdx = lines.findIndex((line) => String(line).trim() === "STEP 7: CREDITS");
  const linesBeforeStep7 = step7StartIdx >= 0 ? lines.slice(0, step7StartIdx) : lines.slice();
  const marginX = 40;
  let y = 52;
  const lineHeight = 14;
  const maxWidth = 515;
  const drawLink = (label, url, x, y) => {
    if (!url) return;
    const linkLabel = label || "Link";
    doc.setTextColor(29, 78, 216);
    if (typeof doc.textWithLink === "function") {
      doc.textWithLink(linkLabel, x, y, { url });
    } else {
      doc.text(linkLabel, x, y);
    }
    doc.setTextColor(30, 41, 59);
  };
  const ensureSpace = (needed = 24) => {
    if (y + needed <= 800) return;
    doc.addPage();
    y = 50;
  };
  const drawTable = (title, headers, rows, colWidths) => {
    ensureSpace(42);
    doc.setFont("helvetica", "bold");
    doc.text(title, marginX, y);
    y += 10;
    doc.setFont("helvetica", "normal");
    const tableW = colWidths.reduce((s, w) => s + w, 0);
    const rowH = 16;
    const drawHeader = () => {
      doc.setDrawColor(148, 163, 184);
      doc.setFillColor(241, 245, 249);
      doc.rect(marginX, y, tableW, rowH, "FD");
      let hx = marginX;
      headers.forEach((h, idx) => {
        doc.text(h, hx + 3, y + 11);
        hx += colWidths[idx];
        doc.line(hx, y, hx, y + rowH);
      });
      y += rowH;
    };
    drawHeader();
    rows.forEach((row) => {
      const cells = row.cells || [];
      const wrapped = cells.map((v, idx) => doc.splitTextToSize(String(v || ""), Math.max(8, colWidths[idx] - 8)));
      const maxLines = Math.max(1, ...wrapped.map((arr) => arr.length || 1));
      const dynH = Math.max(rowH, 6 + maxLines * 10);
      if (y + dynH > 800) {
        doc.addPage();
        y = 50;
        drawHeader();
      }
      doc.rect(marginX, y, tableW, dynH);
      let cx = marginX;
      wrapped.forEach((arr, idx) => {
        arr.forEach((ln, li) => doc.text(String(ln), cx + 3, y + 11 + li * 10));
        if (row.links?.[idx]) drawLink("Link", row.links[idx], cx + colWidths[idx] - 24, y + dynH - 4);
        cx += colWidths[idx];
        doc.line(cx, y, cx, y + dynH);
      });
      y += dynH;
    });
    y += 10;
  };

  doc.setFillColor(15, 118, 110);
  doc.rect(0, 0, 595, 56, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("MetaCarbonics", 40, 28);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Biochar Project Contract Preview", 40, 44);

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  const profilePointsForPdf = facilityPoints.length
    ? facilityPoints
    : [{
        lat: Number(data.facility_lat),
        lng: Number(data.facility_lng),
        start_date: data.facility_start_date || "",
        state_name: data.state_name || "",
        city_name: data.city_name || "",
      }].filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng));
  const showProfileMap = profilePointsForPdf.length > 0;
  const profileMapW = 220;
  const profileMapH = 132;
  const profileMapX = marginX + maxWidth - profileMapW;
  const profileMapY = 78;
  const profileTextWidth = showProfileMap ? maxWidth - profileMapW - 14 : maxWidth;
  y = 78;
  doc.text(`Date: ${new Date().toLocaleString()}`, marginX, y);
  y += 14;
  const projectNameWrapped = doc.splitTextToSize(`Project Name: ${inferProjectName(data)}`, profileTextWidth);
  projectNameWrapped.forEach((w) => {
    doc.text(w, marginX, y);
    y += lineHeight;
  });
  const registryWrapped = doc.splitTextToSize(
    `Registry: ${fmt(data.registry_name)} | Standard: ${fmt(methodology.standard)} | Methodology: ${fmt(methodology.methodology)}`,
    profileTextWidth
  );
  registryWrapped.forEach((w) => {
    doc.text(w, marginX, y);
    y += lineHeight;
  });
  doc.text(
    `Methodology Version (as of ${fmt(finalRegistryCredits?.methodology_version_as_of || methodology.version_as_of)}): ${fmt(finalRegistryCredits?.methodology_version || methodology.version)}`,
    marginX,
    y
  );
  y += 14;
  if (finalRegistryCredits?.methodology_version_note || methodology.version_note) {
    const versionNoteWrapped = doc.splitTextToSize(
      `Methodology Version Note: ${fmt(finalRegistryCredits?.methodology_version_note || methodology.version_note)}`,
      profileTextWidth
    );
    versionNoteWrapped.forEach((w) => {
      doc.text(w, marginX, y);
      y += lineHeight;
    });
  }
  if (methodology.references.length) {
    const refWrapped = doc.splitTextToSize(`Reference: ${methodology.references.join(" | ")}`, profileTextWidth);
    refWrapped.forEach((w) => {
      doc.text(w, marginX, y);
      y += lineHeight;
    });
  }
  if (showProfileMap) {
    const profileBounds = computePdfMapExtent(profilePointsForPdf, stateBoundaryFeatures);
    let drawn = false;
    if (profileBounds) {
      try {
        const sat = await fetchSatelliteMapDataUrl(profileBounds);
        doc.addImage(sat.dataUrl, "PNG", profileMapX, profileMapY, profileMapW, profileMapH, undefined, "FAST");
        const toX = (lng) => profileMapX + ((lng - sat.minLng) / (sat.maxLng - sat.minLng || 1e-9)) * profileMapW;
        const toY = (lat) => profileMapY + ((sat.maxLat - lat) / (sat.maxLat - sat.minLat || 1e-9)) * profileMapH;
        const drawRing = (ring) => {
          if (!Array.isArray(ring) || ring.length < 2) return;
          for (let i = 1; i < ring.length; i += 1) {
            const a = ring[i - 1];
            const b = ring[i];
            doc.line(toX(Number(a[0])), toY(Number(a[1])), toX(Number(b[0])), toY(Number(b[1])));
          }
        };
        doc.setDrawColor(234, 179, 8);
        doc.setLineWidth(0.8);
        stateBoundaryFeatures.forEach((f) => {
          const g = f?.geometry;
          if (!g) return;
          if (g.type === "Polygon") (g.coordinates || []).forEach(drawRing);
          if (g.type === "MultiPolygon") (g.coordinates || []).forEach((poly) => (poly || []).forEach(drawRing));
        });
        doc.setDrawColor(220, 38, 38);
        doc.setFillColor(220, 38, 38);
        profilePointsForPdf.forEach((pt) => {
          doc.circle(toX(Number(pt.lng)), toY(Number(pt.lat)), 3.4, "F");
        });
        drawn = true;
      } catch {
        drawn = false;
      }
    }
    if (!drawn) {
      doc.setDrawColor(148, 163, 184);
      doc.rect(profileMapX, profileMapY, profileMapW, profileMapH);
      doc.setFontSize(8);
      doc.text("Satellite image unavailable.", profileMapX + 8, profileMapY + 14);
      doc.setFillColor(220, 38, 38);
      doc.circle(profileMapX + profileMapW * 0.5, profileMapY + profileMapH * 0.5, 3.4, "F");
      doc.setFontSize(10);
    }
    y = Math.max(y, profileMapY + profileMapH + 8);
  }
  if (profilePointsForPdf.length) {
    drawTable(
      "Facility Locations",
      ["Facility", "State", "City", "Lat", "Lng", "Operation Start Date"],
      profilePointsForPdf.map((pt, idx) => ({
        cells: [
          `Facility ${idx + 1}`,
          fmt(pt.state_name),
          fmt(pt.city_name),
          Number(pt.lat).toFixed(6),
          Number(pt.lng).toFixed(6),
          fmt(pt.start_date),
        ],
      })),
      [55, 100, 100, 80, 80, 100]
    );
    const p0 = profilePointsForPdf[0];
    const mapLink = `https://www.openstreetmap.org/?mlat=${p0.lat}&mlon=${p0.lng}#map=12/${p0.lat}/${p0.lng}`;
    const mapLinkY = y;
    doc.text("Map Link:", marginX, mapLinkY);
    drawLink(mapLink, mapLink, marginX + 45, mapLinkY);
    y += lineHeight;
  }
  y += 6;
  doc.setDrawColor(203, 213, 225);
  doc.line(marginX, y, marginX + maxWidth, y);
  y += 16;
  doc.setFontSize(9);

  linesBeforeStep7.forEach((line) => {
    const wrapped = doc.splitTextToSize(line, maxWidth);
    wrapped.forEach((w) => {
        if (y > 800) {
          doc.addPage();
          y = 50;
          doc.setFillColor(248, 250, 252);
          doc.rect(0, 0, 595, 28, "F");
        doc.setTextColor(71, 85, 105);
        doc.setFontSize(9);
        doc.text("MetaCarbonics - Phase 1 Contract Preview (continued)", 40, 18);
        doc.setTextColor(30, 41, 59);
      }
      if (
        String(w).startsWith("STEP ") ||
        String(w).startsWith("METACARBONICS BIOCHAR") ||
        String(w).startsWith("Assumptions used:") ||
        String(w).startsWith("Runtime breakdown values:")
      ) {
        doc.setFont("helvetica", "bold");
      } else {
        doc.setFont("helvetica", "normal");
      }
      doc.text(w, marginX, y);
      y += lineHeight;
    });
  });

  if (finalRegistryCredits?.breakdown) {
    if (y > 680) {
      doc.addPage();
      y = 50;
    }
    y += 12;
    doc.setFont("helvetica", "bold");
    doc.text("Runtime Breakdown Diagram (tCO2e/year)", marginX, y);
    doc.setFont("helvetica", "normal");
    y += 12;

    const bars = [
      { label: "Gross", value: Number(finalRegistryCredits.breakdown.gross || 0), color: [15, 118, 110] },
      { label: "Process", value: Number(finalRegistryCredits.breakdown.process || 0), color: [185, 28, 28] },
      { label: "Transport", value: Number(finalRegistryCredits.breakdown.transport || 0), color: [185, 28, 28] },
      { label: "Leakage", value: Number(finalRegistryCredits.breakdown.leakage || 0), color: [185, 28, 28] },
      { label: "Uncertainty", value: Number(finalRegistryCredits.breakdown.uncertainty_loss || 0), color: [185, 28, 28] },
      { label: "Buffer", value: Number(finalRegistryCredits.breakdown.buffer_loss || 0), color: [185, 28, 28] },
      { label: "Issuance", value: Number(finalRegistryCredits.breakdown.issuance_loss || 0), color: [185, 28, 28] },
      { label: "Final", value: Number(finalRegistryCredits.breakdown.final || 0), color: [22, 163, 74] },
    ];
    const maxVal = Math.max(1, ...bars.map((b) => b.value));
    const chartWidth = 300;
    const barHeight = 10;
    const barGap = 12;

    bars.forEach((b) => {
      if (y > 800) {
        doc.addPage();
        y = 50;
      }
      doc.setTextColor(30, 41, 59);
      doc.text(`${b.label}`, marginX, y + 8);
      doc.setFillColor(b.color[0], b.color[1], b.color[2]);
      doc.rect(marginX + 70, y, (b.value / maxVal) * chartWidth, barHeight, "F");
      doc.setTextColor(30, 41, 59);
      doc.text(String(b.value.toFixed(2)), marginX + 380, y + 8);
      y += barGap;
    });
  }

  const rawContributions = Array.isArray(finalRegistryCredits?.feedstock_contributions) ? finalRegistryCredits.feedstock_contributions : [];
  const contributions = aggregateFeedstockContributionRows(rawContributions);
  const monitoring = Array.isArray(finalRegistryCredits?.monitoring_parameters) ? finalRegistryCredits.monitoring_parameters : [];
  const parameterValues = Array.isArray(finalRegistryCredits?.parameter_defaults_summary)
    ? finalRegistryCredits.parameter_defaults_summary
    : [];
  ensureSpace(30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("STEP 7: TENTATIVE & FINAL CREDITS (TABLES)", marginX, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  y += 12;

  drawTable(
    "Step 7 Total Summary",
    ["Metric", "Value"],
    [
      { cells: ["Tentative credits (tCO2e/year)", computeTentativeCredits().toFixed(2)] },
      { cells: ["Final credits (tCO2e/year)", finalRegistryCredits ? Number(finalRegistryCredits.final_credits_tco2e || 0).toFixed(2) : "Not calculated yet"] },
      { cells: ["Registry issuance factor", fmt(finalRegistryCredits?.issuance_factor)] },
      { cells: ["Buffer (%)", fmt(finalRegistryCredits?.buffer_percent)] },
      { cells: ["Uncertainty (%)", fmt(finalRegistryCredits?.uncertainty_percent)] },
      { cells: ["Process emissions (tCO2e/year)", fmt(finalRegistryCredits?.process_emissions_tco2e)] },
      { cells: ["Transport emissions (tCO2e/year)", fmt(finalRegistryCredits?.transport_emissions_tco2e)] },
      { cells: ["Leakage (tCO2e/year)", fmt(finalRegistryCredits?.leakage_tco2e)] },
    ],
    [250, 265]
  );

  if (contributions.length) {
    drawTable(
      "Feedstock Contribution",
      ["Feedstock", "Qty (t/yr)", "Annual credits", "Contribution %", "Source"],
      contributions.map((r) => ({
        cells: [
          fmt(r.feedstock),
          fmt(r.quantity_tpy),
          fmt(r.annual_credits_tco2e),
          fmt(r.contribution_pct),
          fmt(r?.carbon_reference?.source_label),
        ],
        links: { 4: r?.carbon_reference?.source_url || "" },
      })),
      [100, 70, 90, 80, 175]
    );
  }

  if (monitoring.length) {
    drawTable(
      "Monitoring Parameters",
      ["Parameter", "Explanation"],
      monitoring.map((m) => ({ cells: [fmt(m.parameter), fmt(m.explanation)] })),
      [170, 345]
    );
  }

  if (parameterValues.length) {
    drawTable(
      "Values Used For Calculation (with sources)",
      ["Parameter", "Value used", "Source"],
      parameterValues.map((p) => ({
        cells: [fmt(p.parameter), fmt(p.value), fmt(p.source_label)],
        links: { 2: p.source_url || "" },
      })),
      [170, 95, 250]
    );
  }

  const facilityMatricesPdf = computeFacilityMatrices();
  facilityMatricesPdf.forEach((m) => {
    const rows = m.feedstocks.map((fs) => ({
      cells: [fmt(fs.feedstock), fmt(fs.quantity_tpy), fmt(fs.q4_transport_km), fmt(fs.q1_source_supply)],
    }));
    drawTable(
      `${m.facility_label} - Detailed Matrix`,
      ["Feedstock", "Qty (t/yr)", "Distance (km)", "Biomass Source/Supply"],
      rows.length ? rows : [{ cells: ["No feedstock added", "", "", ""] }],
      [120, 80, 80, 235]
    );
  });

  const assumptions = Array.isArray(finalRegistryCredits?.assumptions_used) ? finalRegistryCredits.assumptions_used : [];
  if (assumptions.length) {
    ensureSpace(30);
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Methodology Guide Assumptions (for project development)", marginX, y);
    doc.setFont("helvetica", "normal");
    y += 14;
    assumptions.forEach((a, idx) => {
      const wrapped = doc.splitTextToSize(`${idx + 1}. ${a}`, maxWidth);
      wrapped.forEach((w) => {
        ensureSpace(20);
        doc.text(w, marginX, y);
        y += lineHeight;
      });
    });
  }

  doc.save("metacarbonics_phase1_contract_preview.pdf");
}

function renderAdditionalInfo() {
  additionalInfoList.innerHTML = "";
  if (!additionalInfoEntries.length) additionalInfoEntries.push({ text: "" });

  additionalInfoEntries.forEach((item, idx) => {
    const card = document.createElement("div");
    card.className = "questionnaire-card";
    card.innerHTML = `
      <div class="title-row">
        <label>Additional Info ${idx + 1}</label>
        <button type="button" class="btn btn-danger btn-sm" data-delete-additional-idx="${idx}">Delete</button>
      </div>
      <textarea data-idx="${idx}" rows="3">${item.text || ""}</textarea>
    `;
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

  additionalInfoList.querySelectorAll("button[data-delete-additional-idx]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.deleteAdditionalIdx);
      if (!Number.isInteger(idx) || idx < 0 || idx >= additionalInfoEntries.length) return;
      additionalInfoEntries.splice(idx, 1);
      if (!additionalInfoEntries.length) additionalInfoEntries.push({ text: "" });
      renderAdditionalInfo();
      renderSummary();
      saveUserToLocalStorage();
    });
  });
}

function updateContractLockState() {
  const locked = contractSignedCheckbox.checked;
  addFeedstockBtn.disabled = locked;
  addAdditionalInfoBtn.disabled = locked;
  openRegistryCalculatorBtn.disabled = locked;
  additionalInfoList.querySelectorAll("button[data-delete-additional-idx]").forEach((btn) => {
    btn.disabled = locked;
  });
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
    if (!previewFacilityMap) initPreviewFacilityMap();
    renderTentativeCredits();
    renderProjectPreview();
    setTimeout(() => {
      renderPreviewFacilityBlock();
      if (previewFacilityMap) previewFacilityMap.invalidateSize();
    }, 0);
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

function openRegistryCalculator() {
  if (!registrySelect.value) {
    alert("Select registry before opening calculator.");
    return;
  }
  const page = getRegistryCalculatorPage(registrySelect.value);
  if (!page) {
    alert("No calculator configured for this registry.");
    return;
  }

  const transferToken = `${Date.now()}`;
  const payload = {
    transfer_token: transferToken,
    registry_id: registrySelect.value,
    registry_name: selectedText(registrySelect),
    tentative_permanence_factor: tentativePermanenceFactor.value,
    tentative_credits_tco2e: computeTentativeCredits().toFixed(2),
    form_data: getFormData(),
  };
  sessionStorage.setItem(`${TRANSFER_STORAGE_PREFIX}${transferToken}`, JSON.stringify(payload));
  window.location.href = `./${page}?token=${encodeURIComponent(transferToken)}`;
}

function renderPreviousSectionSummary() {
  const parts = [];
  if (selectedText(countrySelect)) parts.push(`Country: ${selectedText(countrySelect)}`);
  if (isMultiStateEnabled()) {
    const ms = getBoundaryStateNames();
    if (ms.length) parts.push(`States: ${ms.join(", ")}`);
  } else if (selectedText(stateSelect)) parts.push(`State: ${selectedText(stateSelect)}`);
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
    user_id: (userIdInput?.value || "").trim(),
    country_code: countrySelect.value,
    country_name: selectedText(countrySelect),
    state_code: stateSelect.value,
    state_name: selectedText(stateSelect),
    multi_state_mode: isMultiStateEnabled() ? "yes" : "no",
    selected_states_json: JSON.stringify(isMultiStateEnabled() ? getMultiValues(multiStateSelect) : []),
    multi_state_locations_json: JSON.stringify(multiStateLocations),
    single_facility_count: String(Math.max(1, Number(singleFacilityCount?.value || 1))),
    city_name: citySelect.value,
    registry_id: registrySelect.value,
    registry_name: selectedText(registrySelect),
    facility_lat: Number.isFinite(facilityLat) ? String(facilityLat) : "",
    facility_lng: Number.isFinite(facilityLng) ? String(facilityLng) : "",
    facility_start_date: facilityPoints[0]?.start_date || "",
    facility_points_json: JSON.stringify(facilityPoints),

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
    q25_final_credits_tco2e: finalRegistryCredits ? String(finalRegistryCredits.final_credits_tco2e) : "",

    additional_info_json: JSON.stringify(additionalInfoEntries),
    contract_signed: contractSignedCheckbox.checked ? "yes" : "no",
    saved_at_utc: new Date().toISOString(),
  };
}

function renderSummary() {
  reconcileFacilitiesWithPlan();
  reconcileFeedstockWithFacilities();
  if (facilityMap) renderFacilityMarkers(false);
  renderFeedstockFacilityOptions();
  renderAllFeedstockTables();
  const data = getFormData();
  const parts = [];
  if (data.country_name) parts.push(`Country: ${data.country_name}`);
  if (data.registry_name) parts.push(`Registry: ${data.registry_name}`);
  if (facilityPoints.length) parts.push(`Facilities: ${facilityPoints.length}`);
  if (feedstockEntries.length) parts.push(`Feedstocks: ${feedstockEntries.length}`);
  parts.push(`Biomass Total: ${data.biomass_total_tpy || "0"} t/year`);
  if (data.contract_signed === "yes") parts.push("Contract: Signed");
  summary.textContent = parts.join(" | ");
  renderFacilityPlanQc();
  renderPreviousSectionSummary();
  renderFeedstockQc();
  renderFeedstockSummaryText();
  renderPyrolysisSummary();
  renderFinancialSummary();
  loadFinalRegistryCredits();
  renderTentativeCredits();
  renderStep7Tables();
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
  const userId = getStorageUserId();
  localStorage.setItem(`${STORAGE_KEY_PREFIX}${userId}`, JSON.stringify(getFormData()));
}

function loadUserFromLocalStorage() {
  const userId = getStorageUserId();
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
    if (singleFacilityCount) {
      singleFacilityCount.value = String(Math.max(1, Number(data.single_facility_count || 1)));
    }
    registrySelect.value = data.registry_id || "";
    refreshCountryOptionsForRegistry(data.country_code || "");
    if (countryEligibilityMsg && registrySelect.value && data.country_code) {
      countryEligibilityMsg.textContent = checkCountryEligibility(registrySelect.value, data.country_code).message;
    }
    facilityLat = data.facility_lat ? Number(data.facility_lat) : null;
    facilityLng = data.facility_lng ? Number(data.facility_lng) : null;
    setMultiStateEnabled(data.multi_state_mode === "yes");
    try {
      const raw = JSON.parse(data.selected_states_json || "[]");
      const selected = Array.isArray(raw) ? raw.map((v) => String(v || "")).filter(Boolean) : [];
      const stateList = getCountryStates(data.country_code || countrySelect.value || "");
      const values = selected.map((v) => {
        if (stateList.some((s) => s.isoCode === v)) return v;
        const byName = stateList.find((s) => s.name === v);
        return byName ? byName.isoCode : "";
      }).filter(Boolean);
      setMultiValues(multiStateSelect, values);
      multiStateLocations = values.map((code) => ({ state_code: code, state_name: getStateNameFromCode(countrySelect.value, code) }));
    } catch {
      multiStateLocations = [];
    }
    activeMultiStateIndex = 0;
    syncMultiStateSelectFromLocations();
    renderMultiStateLocationRows();
    try {
      const pts = JSON.parse(data.facility_points_json || "[]");
      if (Array.isArray(pts) && pts.length) {
        facilityPoints = pts
          .map((p) => ({
            id: String(p.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`),
            lat: Number(p.lat),
            lng: Number(p.lng),
            start_date: String(p.start_date || ""),
            state_code: String(p.state_code || ""),
            state_name: String(p.state_name || ""),
            city_name: String(p.city_name || ""),
          }))
          .filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng));
      } else if (Number.isFinite(facilityLat) && Number.isFinite(facilityLng)) {
        facilityPoints = [{ id: `${Date.now()}-seed`, lat: facilityLat, lng: facilityLng, start_date: "", state_code: "", state_name: "", city_name: "" }];
      } else {
        facilityPoints = [];
      }
    } catch {
      facilityPoints = Number.isFinite(facilityLat) && Number.isFinite(facilityLng)
        ? [{ id: `${Date.now()}-seed`, lat: facilityLat, lng: facilityLng, start_date: "", state_code: "", state_name: "", city_name: "" }]
        : [];
    }
    syncPrimaryFacilityPoint();
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
    if (facilityMap) {
      renderFacilityMarkers(true);
      refreshStateBoundaryLayer();
    }
    updateFacilityLocationSummary();
    loadFinalRegistryCredits();
    renderSummary();
  } catch (error) {
    console.error("Failed to load saved data", error);
  }
}

function downloadCsv() {
  const data = getFormData();
  const headers = Object.keys(data);
  const values = headers.map((k) => csvEscape(data[k]));
  const csv = `${headers.join(",")}\n${values.join(",")}\n`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const safeUser = String(data.user_id || "project").replace(/[^a-zA-Z0-9_-]/g, "_");
  link.href = url;
  link.download = `feasibility_${safeUser}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);

  saveUserToLocalStorage();
}

function loadStates(countryCode) {
  const countryStates = getCountryStates(countryCode);

  clearAndSetDefault(
    stateSelect,
    countryStates.length ? "Select state/province" : "No state data available"
  );
  stateSelect.disabled = !countryStates.length;
  countryStates.forEach((state) => stateSelect.appendChild(option(state.name, state.isoCode)));

  multiStateSelect.innerHTML = "";
  if (!countryStates.length) {
    multiStateSelect.appendChild(option("No state data available", ""));
    multiStateSelect.disabled = true;
  } else {
    countryStates.forEach((state) => multiStateSelect.appendChild(option(state.name, state.isoCode)));
    multiStateSelect.disabled = false;
  }
  syncMultiStateSelectFromLocations();
  renderMultiStateLocationRows();
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

    const [countriesRaw, statesRaw, citiesRaw] = await Promise.all([
      countryRes.json(),
      stateRes.json(),
      cityRes.json(),
    ]);
    countries = countriesRaw;
    states = statesRaw;
    cities = normalizeCities(citiesRaw);

    clearAndSetDefault(countrySelect, "Select registry first");
    [...countries]
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((country) => countrySelect.appendChild(option(country.name, country.isoCode)));

    clearAndSetDefault(stateSelect, "Select country first");
    clearAndSetDefault(citySelect, "Select state first");
    multiStateSelect.innerHTML = "";
    multiStateSelect.appendChild(option("Select country first", ""));
    multiStateSelect.disabled = true;
    countrySelect.disabled = true;
  } catch (error) {
    console.error(error);
    clearAndSetDefault(countrySelect, "Unable to load country list");
    clearAndSetDefault(stateSelect, "Unable to load state list");
    clearAndSetDefault(citySelect, "Unable to load city list");
    multiStateSelect.innerHTML = "";
    multiStateSelect.appendChild(option("Unable to load state list", ""));
    multiStateSelect.disabled = true;
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
  const eligible = checkCountryEligibility(registrySelect.value, countryCode);
  if (countryEligibilityMsg) countryEligibilityMsg.textContent = eligible.message;
  clearAndSetDefault(citySelect, "Select state first");
  citySelect.disabled = true;

  if (!countryCode) {
    clearAndSetDefault(stateSelect, "Select country first");
    stateSelect.disabled = true;
    multiStateLocations = [];
    renderMultiStateLocationRows();
    renderSummary();
    return;
  }
  if (!eligible.allowed) {
    clearAndSetDefault(stateSelect, "Country not eligible");
    stateSelect.disabled = true;
    renderSummary();
    saveUserToLocalStorage();
    return;
  }

  loadStates(countryCode);
  loadCities(countryCode);
  refreshStateBoundaryLayer();
  if (!facilityPoints.length) geocodeProjectLocation();
  renderSummary();
  saveUserToLocalStorage();
});

stateSelect.addEventListener("change", () => {
  if (!countrySelect.value) return;
  loadCities(countrySelect.value, stateSelect.value || "");
  refreshStateBoundaryLayer();
  if (!facilityPoints.length) geocodeProjectLocation();
  renderSummary();
  saveUserToLocalStorage();
});

citySelect.addEventListener("change", () => {
  if (!facilityPoints.length) geocodeProjectLocation();
  renderSummary();
  saveUserToLocalStorage();
});

if (singleFacilityCount) {
  singleFacilityCount.addEventListener("change", () => {
    renderSummary();
    saveUserToLocalStorage();
  });
}

function onMultiStateModeChange(enabled) {
  setMultiStateEnabled(enabled);
  if (enabled) {
    const selectedCodes = getSelectedStateCodes();
    if (!selectedCodes.length) {
      const fallbackCodes = [];
      if (stateSelect?.value) fallbackCodes.push(stateSelect.value);
      facilityPoints.forEach((f) => {
        if (f.state_code) fallbackCodes.push(f.state_code);
      });
      const unique = [...new Set(fallbackCodes.filter(Boolean))];
      if (unique.length) setMultiValues(multiStateSelect, unique);
    }
    multiStateEditorOpen = false;
  } else {
    multiStateEditorOpen = false;
  }
  multiStateLocations = getSelectedStateCodes().map((code) => ({
    state_code: code,
    state_name: getStateNameFromCode(countrySelect.value, code),
  }));
  renderMultiStateLocationRows();
  refreshStateBoundaryLayer();
  renderSummary();
  saveUserToLocalStorage();
}

if (multiStateModeSelect) {
  multiStateModeSelect.addEventListener("change", () => onMultiStateModeChange(multiStateModeSelect.value === "yes"));
}

if (multiStateCheckbox) {
  multiStateCheckbox.addEventListener("change", () => onMultiStateModeChange(Boolean(multiStateCheckbox.checked)));
}

if (openMultiStateEditorBtn) {
  openMultiStateEditorBtn.addEventListener("click", () => {
    if (!isMultiStateEnabled()) return;
    multiStateEditorOpen = true;
    renderMultiStateLocationRows();
    if (multiStateSelect) multiStateSelect.focus();
  });
}

if (closeMultiStateEditorBtn) {
  closeMultiStateEditorBtn.addEventListener("click", () => {
    multiStateEditorOpen = false;
    renderMultiStateLocationRows();
  });
}

multiStateSelect.addEventListener("change", () => {
  multiStateLocations = getMultiValues(multiStateSelect).map((code) => ({
    state_code: code,
    state_name: getStateNameFromCode(countrySelect.value, code),
  }));
  refreshStateBoundaryLayer();
  renderMultiStateLocationRows();
  renderSummary();
  saveUserToLocalStorage();
});

if (addMultiStateLocationBtn) {
  addMultiStateLocationBtn.addEventListener("click", () => {
    const newIdx = multiStateLocations.length;
    multiStateLocations.push({ state_code: "", state_name: "", districts: [], facility_count: 1 });
    renderMultiStateLocationRows(newIdx);
    renderSummary();
    saveUserToLocalStorage();
  });
}

registrySelect.addEventListener("change", () => {
  updateRegistryMeta();
  refreshCountryOptionsForRegistry(countrySelect.value);
  if (countryEligibilityMsg) countryEligibilityMsg.textContent = registrySelect.value ? "Select country for eligibility check." : "";
  renderFeedstockOptions(registrySelect.value);
  updateFeedstockAvailability();
  hideFeedstockForm();
  if (registrySelect.value) {
    feedstockFeedback.textContent = "Registry selected. Select a feedstock and open the form.";
  }
  loadFinalRegistryCredits();
  renderSummary();
  saveUserToLocalStorage();
});

if (userIdInput) {
  userIdInput.addEventListener("change", () => {
    loadUserFromLocalStorage();
    renderSummary();
    saveUserToLocalStorage();
  });
}

editFacilityMarkerBtn.addEventListener("click", () => {
  if (!mapEditMode) {
    updateMapEditMode(true);
    return;
  }
  updateMapEditMode(false);
  renderSummary();
  saveUserToLocalStorage();
});

if (addFacilityByCoordBtn) {
  addFacilityByCoordBtn.addEventListener("click", () => {
    const lat = Number(facilityCoordLat?.value);
    const lng = Number(facilityCoordLng?.value);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      alert("Enter valid latitude and longitude.");
      return;
    }
    const ok = setFacilityMarker(lat, lng, true);
    if (!ok) return;
    renderSummary();
    saveUserToLocalStorage();
  });
}

toFeedstockBtn.addEventListener("click", () => {
  if (!registrySelect.value) {
    feedstockFeedback.textContent = "Select a registry first, then continue to Feedstock Section.";
    registrySelect.focus();
    return;
  }
  if (!countrySelect.value) {
    feedstockFeedback.textContent = "Country is not selected yet. You can continue with feedstock and update location later.";
  }
  const plans = getFacilityPlanRows();
  if (!plans.length) {
    alert("Set facility planning first (state selection and facility count).");
    return;
  }
  const expected = plans.reduce((s, p) => s + Number(p.facility_count || 0), 0);
  if (facilityPoints.length < expected) {
    alert(`Add all planned facilities before moving to feedstock. Added ${facilityPoints.length} of ${expected}.`);
    return;
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
if (feedstockFacilitySelect) {
  feedstockFacilitySelect.addEventListener("change", () => {
    hideFeedstockForm();
    renderAllFeedstockTables();
  });
}
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
openRegistryCalculatorBtn.addEventListener("click", openRegistryCalculator);

backToStep1Btn.addEventListener("click", navigateBackByHistory);
window.addEventListener("popstate", applySectionFromUrl);
window.addEventListener("storage", (event) => {
  if (event.key === FINAL_CREDITS_STORAGE_KEY) {
    loadFinalRegistryCredits();
    renderProjectPreview();
  }
});

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
downloadPreviewPdfBtn.addEventListener("click", downloadPreviewPdf);

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
  initPreviewFacilityMap();
  renderAdditionalInfo();
  onMultiStateModeChange(multiStateModeSelect ? multiStateModeSelect.value === "yes" : false);
  loadUserFromLocalStorage();
  renderAllFeedstockTables();
  renderBiocharCriticalInfo();
  updateFeedstockAvailability();
  applySectionFromUrl();
  renderSummary();
});
