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

const step1Card = document.getElementById("step1Card");
const toFeedstockBtn = document.getElementById("toFeedstockBtn");
const feedstockSection = document.getElementById("feedstockSection");

const feedstockType = document.getElementById("feedstockType");
const copyPreviousCheckbox = document.getElementById("copyPreviousCheckbox");
const addFeedstockBtn = document.getElementById("addFeedstockBtn");
const activeFeedstockCard = document.getElementById("activeFeedstockCard");
const activeFeedstockTitle = document.getElementById("activeFeedstockTitle");

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
const biocharCriticalInfo = document.getElementById("biocharCriticalInfo");
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
const additionalInfoList = document.getElementById("additionalInfoList");
const addAdditionalInfoBtn = document.getElementById("addAdditionalInfoBtn");
const contractSignedCheckbox = document.getElementById("contractSignedCheckbox");
const toCorcSectionBtn = document.getElementById("toCorcSectionBtn");
const corcSection = document.getElementById("corcSection");

const backToStep1Btn = document.getElementById("backToStep1Btn");
const saveCsvBtn = document.getElementById("saveCsvBtn");

let countries = [];
let states = [];
let cities = [];
let feedstockMatrix = [];
let feedstockEntries = [];
let activeFeedstockName = "";
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
  return selectEl.selectedOptions[0]?.textContent || "";
}

function getMultiValues(selectEl) {
  return Array.from(selectEl.selectedOptions)
    .map((opt) => opt.value)
    .filter(Boolean);
}

function setMultiValues(selectEl, values) {
  const set = new Set(values || []);
  Array.from(selectEl.options).forEach((opt) => {
    opt.selected = set.has(opt.value);
  });
}

function parseCsvLine(line) {
  return line.split(",").map((v) => v.trim());
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

function computeTotalBiomass() {
  return feedstockEntries.reduce((sum, entry) => {
    const qty = Number(entry.quantity_tpy || 0);
    return sum + (Number.isFinite(qty) ? qty : 0);
  }, 0);
}

function updatePlantCapacityFromBiomass() {
  const total = computeTotalBiomass();
  plantCapacity.value = total > 0 ? String(total) : "";
}

function renderFeedstockTable(tbodyEl) {
  tbodyEl.innerHTML = "";
  if (!feedstockEntries.length) {
    const tr = document.createElement("tr");
    tr.innerHTML = '<td colspan="3">No feedstock added yet.</td>';
    tbodyEl.appendChild(tr);
    return;
  }

  feedstockEntries.forEach((entry) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${entry.feedstock}</td><td>${entry.quantity_tpy || ""}</td><td>${entry.q4_transport_km || ""}</td>`;
    tbodyEl.appendChild(tr);
  });
}

function renderAllFeedstockTables() {
  renderFeedstockTable(feedstockTableBodyFeedstock);
  renderFeedstockTable(feedstockTableBodyBiochar);
  renderFeedstockTable(feedstockTableBodyPyro);

  const total = computeTotalBiomass();
  biomassTotalFeedstock.textContent = String(total);
  biomassTotalBiochar.textContent = String(total);
  biomassTotalPyro.textContent = String(total);

  updatePlantCapacityFromBiomass();
}

function getActiveFeedstockIndex() {
  return feedstockEntries.findIndex((x) => x.feedstock === activeFeedstockName);
}

function setActiveFeedstock(feedstockName) {
  activeFeedstockName = feedstockName;
  const idx = getActiveFeedstockIndex();
  if (idx < 0) {
    activeFeedstockCard.classList.add("hidden");
    return;
  }

  const entry = feedstockEntries[idx];
  activeFeedstockCard.classList.remove("hidden");
  activeFeedstockTitle.textContent = `Feedstock Questionnaire: ${entry.feedstock}`;

  q1SourceSupply.value = entry.q1_source_supply || "";
  q2SupplierRelation.value = entry.q2_suppliers_relation || "";
  q3CurrentUse.value = entry.q3_current_use || "";
  q4TransportKm.value = entry.q4_transport_km || "";
  feedstockQty.value = entry.quantity_tpy || "";
  feedstockNotes.value = entry.notes || "";
}

function updateActiveFeedstockField(field, value) {
  const idx = getActiveFeedstockIndex();
  if (idx < 0) return;
  feedstockEntries[idx][field] = value;
  renderAllFeedstockTables();
  renderSummary();
  saveUserToLocalStorage();
}

function renderBiocharCriticalInfo() {
  const certs = getMultiValues(biocharCertification).join(", ") || "N/A";
  const content = biocharCarbonContent.value || "N/A";
  const hcorg = biocharHcorg.value || "N/A";
  const annual = plantCapacity.value || "0";

  biocharCriticalInfo.textContent = `Annual biochar (t): ${annual} | Carbon content (%): ${content} | H/Corg: ${hcorg} | Certifications: ${certs}`;
}

function renderAdditionalInfo() {
  additionalInfoList.innerHTML = "";
  if (!additionalInfoEntries.length) {
    additionalInfoEntries.push({ text: "" });
  }

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

function showSectionsFor(sectionName) {
  const showFeedstock = sectionName === "feedstock";
  const showBiochar = sectionName === "biochar";
  const showPyrolysis = sectionName === "pyrolysis";
  const showCorc = sectionName === "corc";

  step1Card.classList.toggle("hidden", showBiochar || showPyrolysis || showCorc);
  feedstockSection.classList.toggle("hidden", !showFeedstock);
  biocharSection.classList.toggle("hidden", !showBiochar);
  pyrolysisSection.classList.toggle("hidden", !showPyrolysis);
  corcSection.classList.toggle("hidden", !showCorc);

  if (showPyrolysis) {
    renderBiocharCriticalInfo();
  }
}

function getCurrentSectionFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const section = params.get("section") || "feedstock";
  if (["feedstock", "biochar", "pyrolysis", "corc"].includes(section)) {
    return section;
  }
  return "feedstock";
}

function navigateToSection(sectionName) {
  const currentSection = getCurrentSectionFromUrl();
  const url = new URL(window.location.href);
  url.searchParams.set("section", sectionName);
  url.searchParams.set("prev", currentSection);
  window.location.href = `${url.pathname}?${url.searchParams.toString()}`;
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

  allowed.forEach((name) => feedstockType.appendChild(option(name, name)));
  feedstockType.disabled = false;
}

function addSelectedFeedstock() {
  const selected = feedstockType.value;
  if (!selected) {
    alert("Select one feedstock type first.");
    return;
  }

  const existingIdx = feedstockEntries.findIndex((x) => x.feedstock === selected);
  if (existingIdx >= 0) {
    setActiveFeedstock(selected);
    return;
  }

  const previous = feedstockEntries[feedstockEntries.length - 1] || null;
  const copy = copyPreviousCheckbox.checked && previous;
  const newEntry = {
    feedstock: selected,
    quantity_tpy: copy ? previous.quantity_tpy : "",
    q1_source_supply: copy ? previous.q1_source_supply : "",
    q2_suppliers_relation: copy ? previous.q2_suppliers_relation : "",
    q3_current_use: copy ? previous.q3_current_use : "",
    q4_transport_km: copy ? previous.q4_transport_km : "",
    notes: copy ? previous.notes : "",
  };

  feedstockEntries.push(newEntry);
  setActiveFeedstock(selected);
  renderAllFeedstockTables();
  renderSummary();
  saveUserToLocalStorage();
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
  if (feedstockEntries.length) parts.push(`Feedstocks: ${feedstockEntries.length}`);
  parts.push(`Biomass Total: ${data.biomass_total_tpy || "0"} t/year`);
  if (data.contract_signed === "yes") parts.push("Contract: Signed");
  summary.textContent = parts.join(" | ");
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
    updateRegistryMeta();
    renderFeedstockOptions(registrySelect.value);

    try {
      feedstockEntries = JSON.parse(data.feedstock_entries_json || "[]");
      if (!Array.isArray(feedstockEntries)) feedstockEntries = [];
    } catch {
      feedstockEntries = [];
    }

    renderAllFeedstockTables();
    if (feedstockEntries.length) {
      setActiveFeedstock(feedstockEntries[feedstockEntries.length - 1].feedstock);
    }

    plantCapacity.value = data.q5_annual_biochar_t || "";
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

    try {
      additionalInfoEntries = JSON.parse(data.additional_info_json || "[]");
      if (!Array.isArray(additionalInfoEntries)) additionalInfoEntries = [];
    } catch {
      additionalInfoEntries = [];
    }
    renderAdditionalInfo();

    contractSignedCheckbox.checked = data.contract_signed === "yes";
    updateContractLockState();

    renderBiocharCriticalInfo();
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
  const filteredCities = cities
    .filter((city) => {
      if (city.countryCode !== countryCode) return false;
      if (!stateCode) return true;
      return city.stateCode === stateCode;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

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
  const params = new URLSearchParams(window.location.search);
  const section = getCurrentSectionFromUrl();

  if ((section === "biochar" || section === "pyrolysis" || section === "corc") && !feedstockEntries.length) {
    showSectionsFor("feedstock");
    return;
  }

  if (["feedstock", "biochar", "pyrolysis", "corc"].includes(section)) {
    showSectionsFor(section);
  } else {
    showSectionsFor("feedstock");
  }
}

function navigateBackByHistory() {
  const params = new URLSearchParams(window.location.search);
  const prev = params.get("prev");
  if (prev && ["feedstock", "biochar", "pyrolysis", "corc"].includes(prev)) {
    navigateToSection(prev);
    return;
  }

  const current = getCurrentSectionFromUrl();
  const fallbackPrev = {
    corc: "pyrolysis",
    pyrolysis: "biochar",
    biochar: "feedstock",
    feedstock: "feedstock",
  }[current];
  navigateToSection(fallbackPrev);
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
  if (!countrySelect.value) return;
  loadCities(countrySelect.value, stateSelect.value);
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
  renderSummary();
  saveUserToLocalStorage();
});

userIdInput.addEventListener("change", () => {
  loadUserFromLocalStorage();
  renderSummary();
  saveUserToLocalStorage();
});

toFeedstockBtn.addEventListener("click", () => {
  if (!countrySelect.value || !registrySelect.value) {
    alert("Select country and registry before continuing.");
    return;
  }
  showSectionsFor("feedstock");
});

addFeedstockBtn.addEventListener("click", addSelectedFeedstock);

toBiocharPageBtn.addEventListener("click", () => {
  if (!feedstockEntries.length) {
    alert("Add at least one feedstock before moving to Biochar section.");
    return;
  }
  navigateToSection("biochar");
});

toPyrolysisPageBtn.addEventListener("click", () => {
  navigateToSection("pyrolysis");
});

toCorcSectionBtn.addEventListener("click", () => {
  navigateToSection("corc");
});

backToStep1Btn.addEventListener("click", () => {
  navigateBackByHistory();
});

[
  q1SourceSupply,
  q2SupplierRelation,
  q3CurrentUse,
  q4TransportKm,
  feedstockQty,
  feedstockNotes,
].forEach((el) => {
  el.addEventListener("input", () => {
    const idx = getActiveFeedstockIndex();
    if (idx < 0) return;

    updateActiveFeedstockField("q1_source_supply", q1SourceSupply.value);
    updateActiveFeedstockField("q2_suppliers_relation", q2SupplierRelation.value);
    updateActiveFeedstockField("q3_current_use", q3CurrentUse.value);
    updateActiveFeedstockField("q4_transport_km", q4TransportKm.value);
    updateActiveFeedstockField("quantity_tpy", feedstockQty.value);
    updateActiveFeedstockField("notes", feedstockNotes.value);
  });
});

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
  renderAdditionalInfo();
  loadUserFromLocalStorage();
  renderAllFeedstockTables();
  renderBiocharCriticalInfo();
  applySectionFromUrl();
  renderSummary();
});
