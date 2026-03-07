const GEO_DATA_URLS = {
  countries:
    "https://cdn.jsdelivr.net/npm/country-state-city@3.2.1/lib/assets/country.json",
  states:
    "https://cdn.jsdelivr.net/npm/country-state-city@3.2.1/lib/assets/state.json",
  cities:
    "https://cdn.jsdelivr.net/npm/country-state-city@3.2.1/lib/assets/city.json",
};

const FEEDSTOCK_MATRIX_URL = "./feedstock-registry.csv";

const REGISTRIES = [
  {
    id: "verra",
    name: "Verra",
    type: "Public",
    detail: "Verra selected. Feedstocks filtered by Verra eligibility.",
    source: "https://verra.org/",
  },
  {
    id: "gs",
    name: "Gold Standard",
    type: "Public",
    detail: "Gold Standard selected. Feedstocks filtered by GS eligibility.",
    source: "https://www.goldstandard.org/",
  },
  {
    id: "puro",
    name: "Puro.earth",
    type: "Public",
    detail: "Puro.earth selected. Feedstocks filtered by Puro eligibility.",
    source: "https://registry.puro.earth/projects",
  },
  {
    id: "isometric",
    name: "Isometric",
    type: "Public",
    detail: "Isometric selected. Feedstocks filtered by Isometric eligibility.",
    source: "https://isometric.com/",
  },
];

const REGISTRY_COLUMN_BY_ID = {
  verra: "Verra",
  gs: "GS",
  puro: "Puro Earth",
  isometric: "Isometric",
};

const STORAGE_KEY_PREFIX = "biochar-feasibility-user:";

const userIdInput = document.getElementById("userIdInput");
const countrySelect = document.getElementById("countrySelect");
const stateSelect = document.getElementById("stateSelect");
const citySelect = document.getElementById("citySelect");
const registrySelect = document.getElementById("registrySelect");
const registryMeta = document.getElementById("registryMeta");

const summary = document.getElementById("summary");
const step1Card = document.getElementById("step1Card");
const step2Card = document.getElementById("step2Card");
const checklistTitle = document.getElementById("checklistTitle");
const registryChecklist = document.getElementById("registryChecklist");
const checklistHeading = document.getElementById("checklistHeading");

const feedstockType = document.getElementById("feedstockType");
const addFeedstockBtn = document.getElementById("addFeedstockBtn");
const feedstockQtyBody = document.getElementById("feedstockQtyBody");
const feedstockQuestionnaires = document.getElementById("feedstockQuestionnaires");

const toBiocharSectionBtn = document.getElementById("toBiocharSectionBtn");
const biocharSection = document.getElementById("biocharSection");
const plantCapacity = document.getElementById("plantCapacity");
const biocharCarbonContent = document.getElementById("biocharCarbonContent");
const biocharHcorg = document.getElementById("biocharHcorg");
const biocharCertification = document.getElementById("biocharCertification");
const biocharEndUse = document.getElementById("biocharEndUse");
const biocharEndUseShare = document.getElementById("biocharEndUseShare");
const biocharEndUserRelation = document.getElementById("biocharEndUserRelation");
const biocharTransportDistance = document.getElementById("biocharTransportDistance");
const toPyrolysisSectionBtn = document.getElementById("toPyrolysisSectionBtn");

const pyrolysisSection = document.getElementById("pyrolysisSection");
const pyroQ13 = document.getElementById("pyroQ13");
const pyroQ14 = document.getElementById("pyroQ14");
const pyroQ15 = document.getElementById("pyroQ15");
const pyroQ16 = document.getElementById("pyroQ16");
const pyroQ17 = document.getElementById("pyroQ17");
const pyroQ18 = document.getElementById("pyroQ18");
const pyroQ19 = document.getElementById("pyroQ19");
const pyroQ20 = document.getElementById("pyroQ20");
const toFinancingSectionBtn = document.getElementById("toFinancingSectionBtn");

const financingSection = document.getElementById("financingSection");
const financeQ21 = document.getElementById("financeQ21");
const financeQ22 = document.getElementById("financeQ22");
const toAdditionalInfoSectionBtn = document.getElementById("toAdditionalInfoSectionBtn");

const additionalInfoSection = document.getElementById("additionalInfoSection");
const additionalInfoList = document.getElementById("additionalInfoList");
const addAdditionalInfoBtn = document.getElementById("addAdditionalInfoBtn");
const contractSignedCheckbox = document.getElementById("contractSignedCheckbox");
const toCorcSectionBtn = document.getElementById("toCorcSectionBtn");
const corcSection = document.getElementById("corcSection");

const toStep2Btn = document.getElementById("toStep2Btn");
const backToStep1Btn = document.getElementById("backToStep1Btn");
const saveCsvBtn = document.getElementById("saveCsvBtn");

let countries = [];
let states = [];
let cities = [];
let feedstockMatrix = [];
let feedstockEntries = [];
let additionalInfoEntries = [];

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
  if (!selectEl) return [];
  return Array.from(selectEl.selectedOptions)
    .map((opt) => opt.value)
    .filter(Boolean);
}

function setMultiValues(selectEl, values) {
  if (!selectEl) return;
  const valueSet = new Set(values || []);
  Array.from(selectEl.options).forEach((opt) => {
    opt.selected = valueSet.has(opt.value);
  });
}

function getSelectedRegistry() {
  return REGISTRIES.find((item) => item.id === registrySelect.value);
}

function parseCsvLine(line) {
  return line.split(",").map((cell) => cell.trim());
}

function parseFeedstockCsv(csvText) {
  const rows = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!rows.length) return [];

  const headers = parseCsvLine(rows[0]);
  return rows.slice(1).map((line) => {
    const cells = parseCsvLine(line);
    const row = {};
    headers.forEach((header, idx) => {
      row[header] = cells[idx] || "";
    });
    return row;
  });
}

function isAccepted(value) {
  return ["yes", "y", "1", "true"].includes(String(value).toLowerCase().trim());
}

function computeTotalFeedstockQty() {
  return feedstockEntries.reduce((sum, entry) => {
    const qty = Number(entry.quantity_tpy || 0);
    return sum + (Number.isFinite(qty) ? qty : 0);
  }, 0);
}

function updatePlantCapacityFromFeedstocks() {
  const total = computeTotalFeedstockQty();
  plantCapacity.value = total > 0 ? String(total) : "";
}

function normalizeFeedstockEntries() {
  const byName = new Map();
  feedstockEntries.forEach((entry) => {
    if (!entry.feedstock) return;
    if (!byName.has(entry.feedstock)) byName.set(entry.feedstock, entry);
  });
  feedstockEntries = Array.from(byName.values());
}

function renderFeedstockQtyTable() {
  feedstockQtyBody.innerHTML = "";
  if (!feedstockEntries.length) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 2;
    td.textContent = "No feedstocks selected yet.";
    tr.appendChild(td);
    feedstockQtyBody.appendChild(tr);
    return;
  }

  feedstockEntries.forEach((entry, idx) => {
    const tr = document.createElement("tr");
    const nameTd = document.createElement("td");
    const qtyTd = document.createElement("td");
    const qtyInput = document.createElement("input");

    nameTd.textContent = entry.feedstock;
    qtyInput.type = "number";
    qtyInput.min = "0";
    qtyInput.step = "any";
    qtyInput.value = entry.quantity_tpy || "";
    qtyInput.className = "feedstock-qty-input";
    qtyInput.placeholder = "Enter quantity";

    qtyInput.addEventListener("input", () => {
      feedstockEntries[idx].quantity_tpy = qtyInput.value;
      updatePlantCapacityFromFeedstocks();
      renderSummary();
      saveUserToLocalStorage();
    });

    qtyTd.appendChild(qtyInput);
    tr.appendChild(nameTd);
    tr.appendChild(qtyTd);
    feedstockQtyBody.appendChild(tr);
  });
}

function renderFeedstockQuestionnaires() {
  feedstockQuestionnaires.innerHTML = "";
  if (!feedstockEntries.length) return;

  feedstockEntries.forEach((entry, idx) => {
    const card = document.createElement("div");
    card.className = "questionnaire-card";

    card.innerHTML = `
      <h4>${entry.feedstock}</h4>
      <label>1. Where is the biomass sourced from and how is it supplied.</label>
      <textarea data-field="q1_source_supply" data-index="${idx}" rows="3">${entry.q1_source_supply || ""}</textarea>

      <label>2. Who are the biomass supplier and the producer, what is your contractual relation.</label>
      <textarea data-field="q2_suppliers_relation" data-index="${idx}" rows="3">${entry.q2_suppliers_relation || ""}</textarea>

      <label>3. How is the waste biomass currently used in the absence of the biochar production.</label>
      <textarea data-field="q3_current_use" data-index="${idx}" rows="3">${entry.q3_current_use || ""}</textarea>

      <label>4. What is the approximate average transportation distance from the biomass source to the biochar production facility (in km)?</label>
      <input data-field="q4_transport_km" data-index="${idx}" type="number" min="0" step="any" value="${entry.q4_transport_km || ""}" />

      <label>Notes</label>
      <textarea data-field="notes" data-index="${idx}" rows="3">${entry.notes || ""}</textarea>
    `;

    feedstockQuestionnaires.appendChild(card);
  });

  feedstockQuestionnaires.querySelectorAll("[data-field]").forEach((el) => {
    el.addEventListener("input", () => {
      const index = Number(el.dataset.index);
      const field = el.dataset.field;
      if (!Number.isInteger(index) || !feedstockEntries[index]) return;
      feedstockEntries[index][field] = el.value;
      renderSummary();
      saveUserToLocalStorage();
    });
  });
}

function renderFeedstockOptions(registryId) {
  const registryColumn = REGISTRY_COLUMN_BY_ID[registryId];
  feedstockType.innerHTML = "";

  if (!registryColumn) {
    feedstockType.appendChild(option("Select a registry first", ""));
    feedstockType.disabled = true;
    return;
  }

  const allowedFeedstocks = feedstockMatrix
    .filter((row) => isAccepted(row[registryColumn]))
    .map((row) => row.feedstock)
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));

  if (!allowedFeedstocks.length) {
    feedstockType.appendChild(option("No feedstocks mapped for this registry", ""));
    feedstockType.disabled = true;
    return;
  }

  allowedFeedstocks.forEach((feedstock) => {
    feedstockType.appendChild(option(feedstock, feedstock));
  });
  feedstockType.disabled = false;
}

async function loadFeedstockMatrix() {
  try {
    const res = await fetch(FEEDSTOCK_MATRIX_URL);
    if (!res.ok) throw new Error("Failed to fetch feedstock matrix CSV.");
    const csvText = await res.text();
    feedstockMatrix = parseFeedstockCsv(csvText);
    renderFeedstockOptions(registrySelect.value);
  } catch (error) {
    console.error(error);
    feedstockType.innerHTML = "";
    feedstockType.appendChild(option("Unable to load feedstock matrix", ""));
    feedstockType.disabled = true;
  }
}

function addSelectedFeedstocks() {
  const selected = getMultiValues(feedstockType);
  if (!selected.length) {
    alert("Select one or more feedstocks to add.");
    return;
  }

  const existing = new Set(feedstockEntries.map((item) => item.feedstock));
  selected.forEach((feedstock) => {
    if (existing.has(feedstock)) return;
    feedstockEntries.push({
      feedstock,
      quantity_tpy: "",
      q1_source_supply: "",
      q2_suppliers_relation: "",
      q3_current_use: "",
      q4_transport_km: "",
      notes: "",
    });
  });

  normalizeFeedstockEntries();
  renderFeedstockQtyTable();
  renderFeedstockQuestionnaires();
  updatePlantCapacityFromFeedstocks();
  renderSummary();
  saveUserToLocalStorage();
}

function renderAdditionalInfo() {
  additionalInfoList.innerHTML = "";
  if (!additionalInfoEntries.length) {
    additionalInfoEntries.push({ text: "" });
  }

  additionalInfoEntries.forEach((item, idx) => {
    const card = document.createElement("div");
    card.className = "questionnaire-card";
    card.innerHTML = `
      <label>Additional Info ${idx + 1}</label>
      <textarea data-additional-index="${idx}" rows="3">${item.text || ""}</textarea>
    `;
    additionalInfoList.appendChild(card);
  });

  additionalInfoList.querySelectorAll("[data-additional-index]").forEach((el) => {
    el.addEventListener("input", () => {
      const idx = Number(el.dataset.additionalIndex);
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

function showSection(sectionEl) {
  sectionEl.classList.remove("hidden");
  sectionEl.scrollIntoView({ behavior: "smooth", block: "start" });
}

function updateRegistryMeta() {
  const selected = getSelectedRegistry();
  if (!selected) {
    registryMeta.innerHTML = "";
    checklistTitle.textContent = "";
    registryChecklist.classList.add("hidden");
    return;
  }

  registryMeta.innerHTML = `${selected.detail} (<a href="${selected.source}" target="_blank" rel="noreferrer">source</a>)`;
}

function showChecklistForRegistry() {
  const selected = getSelectedRegistry();
  if (!selected) {
    checklistTitle.textContent = "Select a registry in Step 1.";
    registryChecklist.classList.add("hidden");
    return;
  }

  checklistTitle.textContent = `Detailed checklist for ${selected.name} (${selected.type})`;
  checklistHeading.textContent = `${selected.name} Feasibility Questions`;
  registryChecklist.classList.remove("hidden");
}

function getFormData() {
  const totalQty = computeTotalFeedstockQty();

  return {
    user_id: userIdInput.value.trim(),
    country_code: countrySelect.value,
    country_name: selectedText(countrySelect),
    state_code: stateSelect.value,
    state_name: selectedText(stateSelect),
    city_name: citySelect.value,
    registry_id: registrySelect.value,
    registry_name: selectedText(registrySelect),
    registry_type: getSelectedRegistry()?.type || "",

    q_feedstock_entries_json: JSON.stringify(feedstockEntries),
    q_feedstock_type: feedstockEntries.map((x) => x.feedstock).join("; "),
    q_feedstock_qty: feedstockEntries
      .map((x) => `${x.feedstock}: ${x.quantity_tpy || ""}`.trim())
      .join("; "),

    q_annual_output_tpy: String(totalQty),
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

    additional_info_json: JSON.stringify(additionalInfoEntries),
    contract_signed: contractSignedCheckbox.checked ? "yes" : "no",
    saved_at_utc: new Date().toISOString(),
  };
}

function renderSummary() {
  const data = getFormData();
  const parts = [];

  if (data.user_id) parts.push(`User: ${data.user_id}`);
  if (data.country_code) parts.push(`Country: ${data.country_name}`);
  if (data.state_code) parts.push(`State/Province: ${data.state_name}`);
  if (data.city_name) parts.push(`City: ${data.city_name}`);
  if (data.registry_id) parts.push(`Registry: ${data.registry_name}`);
  if (feedstockEntries.length) parts.push(`Feedstocks Added: ${feedstockEntries.length}`);

  const totalQty = computeTotalFeedstockQty();
  if (totalQty > 0) parts.push(`Total Feedstock Qty: ${totalQty} t/year`);
  if (data.contract_signed === "yes") parts.push("Contract: Signed");

  summary.textContent = parts.length ? parts.join(" | ") : "No selections yet.";
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
  localStorage.setItem(
    `${STORAGE_KEY_PREFIX}${userId}`,
    JSON.stringify(getFormData())
  );
}

function parseStoredFeedstockEntries(data) {
  if (data.q_feedstock_entries_json) {
    try {
      const parsed = JSON.parse(data.q_feedstock_entries_json);
      if (Array.isArray(parsed)) return parsed;
    } catch (error) {
      console.error("Failed to parse q_feedstock_entries_json", error);
    }
  }
  return [];
}

function parseStoredAdditionalInfo(data) {
  if (data.additional_info_json) {
    try {
      const parsed = JSON.parse(data.additional_info_json);
      if (Array.isArray(parsed)) return parsed;
    } catch (error) {
      console.error("Failed to parse additional_info_json", error);
    }
  }
  return [];
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
    updateRegistryMeta();
    renderFeedstockOptions(registrySelect.value);

    feedstockEntries = parseStoredFeedstockEntries(data);
    normalizeFeedstockEntries();
    renderFeedstockQtyTable();
    renderFeedstockQuestionnaires();
    updatePlantCapacityFromFeedstocks();

    biocharCarbonContent.value = data.q6_biochar_carbon_content_pct || "";
    biocharHcorg.value = data.q7_biochar_h_corg_ratio || "";
    setMultiValues(
      biocharCertification,
      String(data.q8_biochar_certifications || "")
        .split(/;|,/)
        .map((v) => v.trim())
        .filter(Boolean)
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
      String(data.q18_facility_certifications || "")
        .split(/;|,/)
        .map((v) => v.trim())
        .filter(Boolean)
    );
    pyroQ19.value = data.q19_energy_used_mwh_a || "";
    pyroQ20.value = data.q20_energy_source || "";

    financeQ21.value = data.q21_no_credit_revenue_scenario || "";
    financeQ22.value = data.q22_financial_model_evidence || "";

    additionalInfoEntries = parseStoredAdditionalInfo(data);
    renderAdditionalInfo();

    contractSignedCheckbox.checked = data.contract_signed === "yes";
    updateContractLockState();

    renderSummary();
  } catch (error) {
    console.error("Failed to parse saved user data", error);
  }
}

function downloadCsv() {
  const data = getFormData();
  if (!data.user_id) {
    alert("Enter User ID/Email before saving CSV.");
    return;
  }

  const headers = Object.keys(data);
  const values = headers.map((key) => csvEscape(data[key]));
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

  countryStates.forEach((state) => {
    stateSelect.appendChild(option(state.name, state.isoCode));
  });
}

function loadCities(countryCode, stateCode = "") {
  const filteredCities = cities
    .filter((city) => {
      if (city.countryCode !== countryCode) return false;
      if (!stateCode) return true;
      return city.stateCode === stateCode;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  clearAndSetDefault(
    citySelect,
    filteredCities.length ? "Select city" : "No city data available"
  );
  citySelect.disabled = !filteredCities.length;

  filteredCities.forEach((city) => {
    citySelect.appendChild(option(city.name, city.name));
  });
}

async function loadGeoData() {
  try {
    const [countryRes, stateRes, cityRes] = await Promise.all([
      fetch(GEO_DATA_URLS.countries),
      fetch(GEO_DATA_URLS.states),
      fetch(GEO_DATA_URLS.cities),
    ]);

    if (!countryRes.ok || !stateRes.ok || !cityRes.ok) {
      throw new Error("Failed to fetch one or more geo datasets.");
    }

    [countries, states, cities] = await Promise.all([
      countryRes.json(),
      stateRes.json(),
      cityRes.json(),
    ]);

    clearAndSetDefault(countrySelect, "Select country");
    [...countries]
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((country) => {
        countrySelect.appendChild(option(country.name, country.isoCode));
      });

    clearAndSetDefault(stateSelect, "Select country first");
    clearAndSetDefault(citySelect, "Select state first");
    countrySelect.disabled = false;
  } catch (error) {
    clearAndSetDefault(countrySelect, "Unable to load country list");
    clearAndSetDefault(stateSelect, "Unable to load state list");
    clearAndSetDefault(citySelect, "Unable to load city list");
    countrySelect.disabled = true;
    stateSelect.disabled = true;
    citySelect.disabled = true;
    summary.textContent =
      "Location data failed to load. Check internet access and try again.";
    console.error(error);
  }
}

function goToStep2() {
  if (!countrySelect.value || !registrySelect.value) {
    alert("Select country and registry before continuing.");
    return;
  }

  showChecklistForRegistry();
  step1Card.classList.add("hidden");
  step2Card.classList.remove("hidden");
  renderSummary();
}

function goToStep1() {
  step2Card.classList.add("hidden");
  step1Card.classList.remove("hidden");
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
  if (stateSelect.disabled) loadCities(countryCode);
  renderSummary();
  saveUserToLocalStorage();
});

stateSelect.addEventListener("change", () => {
  const countryCode = countrySelect.value;
  if (!countryCode) return;
  loadCities(countryCode, stateSelect.value);
  renderSummary();
  saveUserToLocalStorage();
});

citySelect.addEventListener("change", () => {
  renderSummary();
  saveUserToLocalStorage();
});

registrySelect.addEventListener("change", () => {
  updateRegistryMeta();
  renderFeedstockOptions(registrySelect.value);
  showChecklistForRegistry();
  renderSummary();
  saveUserToLocalStorage();
});

addFeedstockBtn.addEventListener("click", addSelectedFeedstocks);

contractSignedCheckbox.addEventListener("change", () => {
  updateContractLockState();
  renderSummary();
  saveUserToLocalStorage();
});

addAdditionalInfoBtn.addEventListener("click", () => {
  additionalInfoEntries.push({ text: "" });
  renderAdditionalInfo();
  saveUserToLocalStorage();
});

toBiocharSectionBtn.addEventListener("click", () => {
  if (!feedstockEntries.length) {
    alert("Add at least one feedstock before proceeding.");
    return;
  }
  showSection(biocharSection);
});

toPyrolysisSectionBtn.addEventListener("click", () => showSection(pyrolysisSection));
toFinancingSectionBtn.addEventListener("click", () => showSection(financingSection));
toAdditionalInfoSectionBtn.addEventListener("click", () => showSection(additionalInfoSection));
toCorcSectionBtn.addEventListener("click", () => showSection(corcSection));

[
  userIdInput,
  biocharCarbonContent,
  biocharHcorg,
  biocharEndUse,
  biocharEndUseShare,
  biocharEndUserRelation,
  biocharTransportDistance,
  pyroQ13,
  pyroQ14,
  pyroQ15,
  pyroQ16,
  pyroQ17,
  pyroQ19,
  pyroQ20,
  financeQ21,
  financeQ22,
  biocharCertification,
  pyroQ18,
].forEach((field) => {
  field.addEventListener("change", () => {
    if (field === userIdInput) {
      loadUserFromLocalStorage();
    }
    renderSummary();
    saveUserToLocalStorage();
  });
});

toStep2Btn.addEventListener("click", goToStep2);
backToStep1Btn.addEventListener("click", goToStep1);
saveCsvBtn.addEventListener("click", downloadCsv);

Promise.all([loadGeoData(), loadFeedstockMatrix()]).then(() => {
  renderAdditionalInfo();
  updateRegistryMeta();
  updateContractLockState();
  loadUserFromLocalStorage();
  updatePlantCapacityFromFeedstocks();
  renderSummary();
});
