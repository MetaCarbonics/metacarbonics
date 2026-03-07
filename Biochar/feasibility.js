const GEO_DATA_URLS = {
  countries:
    "https://cdn.jsdelivr.net/npm/country-state-city@3.2.1/lib/assets/country.json",
  states:
    "https://cdn.jsdelivr.net/npm/country-state-city@3.2.1/lib/assets/state.json",
  cities:
    "https://cdn.jsdelivr.net/npm/country-state-city@3.2.1/lib/assets/city.json",
};

const REGISTRIES = [
  {
    id: "puro",
    name: "Puro.earth",
    type: "Public",
    detail: "Public registry selected. Detailed checklist loaded for Puro.earth.",
    source: "https://registry.puro.earth/projects",
  },
];

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
const puroChecklist = document.getElementById("puroChecklist");
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
    q_feedstock_type: feedstockType.value.trim(),
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

  const completedAnswers = [
    data.q_feedstock_type,
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
    puroChecklist.classList.add("hidden");
    return;
  }

  registryMeta.innerHTML = `${selected.detail} (<a href="${selected.source}" target="_blank" rel="noreferrer">source</a>)`;
}

function showChecklistForRegistry() {
  const selected = getSelectedRegistry();
  puroChecklist.classList.add("hidden");

  if (!selected) {
    checklistTitle.textContent = "Select a registry in Step 1.";
    return;
  }

  if (selected.id === "puro") {
    checklistTitle.textContent = `Detailed checklist for ${selected.name} (${selected.type})`;
    puroChecklist.classList.remove("hidden");
    return;
  }

  checklistTitle.textContent = `Checklist for ${selected.name} will be added.`;
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
    feedstockType.value = data.q_feedstock_type || "";
    feedstockSustainable.value = data.q_feedstock_sustainable || "";
    plantCapacity.value = data.q_annual_output_tpy || "";
    monitoringPlan.value = data.q_monitoring_plan || "";
    projectTimeline.value = data.q_start_date || "";

    updateRegistryMeta();
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

loadGeoData().then(() => {
  loadUserFromLocalStorage();
  renderSummary();
});
