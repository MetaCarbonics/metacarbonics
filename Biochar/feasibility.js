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
const toStep2Btn = document.getElementById("toStep2Btn");
const backToStep1Btn = document.getElementById("backToStep1Btn");
const saveCsvBtn = document.getElementById("saveCsvBtn");

const feedstockType = document.getElementById("feedstockType");
const feedstockSustainable = document.getElementById("feedstockSustainable");
const plantCapacity = document.getElementById("plantCapacity");
const monitoringPlan = document.getElementById("monitoringPlan");
const projectTimeline = document.getElementById("projectTimeline");

let countries = [];
let states = [];
let cities = [];
let feedstockMatrix = [];

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

function getSelectedFeedstocks() {
  return Array.from(feedstockType.selectedOptions)
    .map((opt) => opt.value)
    .filter(Boolean);
}

function setSelectedFeedstocks(selectedValues) {
  const selectedSet = new Set(selectedValues);
  Array.from(feedstockType.options).forEach((opt) => {
    opt.selected = selectedSet.has(opt.value);
  });
}

function parseStoredFeedstocks(value) {
  if (!value) return [];
  return String(value)
    .split(/;|,/)
    .map((v) => v.trim())
    .filter(Boolean);
}

function renderFeedstockOptions(registryId, preselected = []) {
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
  setSelectedFeedstocks(preselected);
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
    registry_type: getSelectedRegistry()?.type || "",
    q_feedstock_type: getSelectedFeedstocks().join("; "),
    q_feedstock_sustainable: feedstockSustainable.value,
    q_annual_output_tpy: plantCapacity.value,
    q_monitoring_plan: monitoringPlan.value,
    q_start_date: projectTimeline.value,
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
  if (data.registry_id) {
    parts.push(`Registry: ${data.registry_name}`);
    parts.push(`Type: ${data.registry_type}`);
  }

  const selectedFeedstocks = getSelectedFeedstocks();
  if (selectedFeedstocks.length) {
    parts.push(`Feedstocks: ${selectedFeedstocks.length}`);
  }

  const completedAnswers = [
    selectedFeedstocks.length ? "yes" : "",
    data.q_feedstock_sustainable,
    data.q_annual_output_tpy,
    data.q_monitoring_plan,
    data.q_start_date,
  ].filter(Boolean).length;

  if (completedAnswers) parts.push(`Checklist Answers: ${completedAnswers}/5`);
  summary.textContent = parts.length ? parts.join(" | ") : "No selections yet.";
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
  registryChecklist.classList.add("hidden");

  if (!selected) {
    checklistTitle.textContent = "Select a registry in Step 1.";
    return;
  }

  checklistTitle.textContent = `Detailed checklist for ${selected.name} (${selected.type})`;
  checklistHeading.textContent = `${selected.name} Feasibility Questions`;
  registryChecklist.classList.remove("hidden");
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
    renderFeedstockOptions(registrySelect.value, parseStoredFeedstocks(data.q_feedstock_type));

    feedstockSustainable.value = data.q_feedstock_sustainable || "";
    plantCapacity.value = data.q_annual_output_tpy || "";
    monitoringPlan.value = data.q_monitoring_plan || "";
    projectTimeline.value = data.q_start_date || "";

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
  if (stateSelect.disabled) {
    loadCities(countryCode);
  }
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
  renderSummary();
  saveUserToLocalStorage();
});

[
  userIdInput,
  feedstockType,
  feedstockSustainable,
  plantCapacity,
  monitoringPlan,
  projectTimeline,
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
  loadUserFromLocalStorage();
  renderSummary();
});
