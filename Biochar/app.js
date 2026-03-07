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
    id: "verra",
    name: "Verra VCS",
    detail: "VM0044 Biochar utilization in soil and non-soil applications",
    source:
      "https://verra.org/methodologies/vm0044-biochar-utilization-in-soil-and-non-soil-applications-v1-2/",
  },
  {
    id: "puro",
    name: "Puro.earth Registry",
    detail: "Includes Biochar methodology projects in the registry",
    source: "https://registry.puro.earth/projects",
  },
  {
    id: "car",
    name: "Climate Action Reserve",
    detail: "US & Canada Biochar Protocol",
    source: "https://climateactionreserve.org/how/protocols/ncs/biochar/",
  },
  {
    id: "csi",
    name: "Carbon Standards International (C-Sink)",
    detail: "Global Biochar C-Sink standard and registry",
    source:
      "https://www.carbon-standards.com/en/standards/service-501~global-biochar-c-sink.html",
  },
  {
    id: "isometric",
    name: "Isometric Registry",
    detail: "Biochar requirements available in the registry framework",
    source: "https://registry.isometric.com/requirements/biochar",
  },
];

const countrySelect = document.getElementById("countrySelect");
const stateSelect = document.getElementById("stateSelect");
const citySelect = document.getElementById("citySelect");
const registrySelect = document.getElementById("registrySelect");
const registryMeta = document.getElementById("registryMeta");
const summary = document.getElementById("summary");

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

function renderSummary() {
  const countryName = countrySelect.selectedOptions[0]?.textContent || "";
  const stateName = stateSelect.selectedOptions[0]?.textContent || "";
  const cityName = citySelect.selectedOptions[0]?.textContent || "";
  const selectedRegistryName = registrySelect.selectedOptions[0]?.textContent || "";

  const parts = [];
  if (countrySelect.value) parts.push(`Country: ${countryName}`);
  if (stateSelect.value) parts.push(`State/Province: ${stateName}`);
  if (citySelect.value) parts.push(`City: ${cityName}`);
  if (registrySelect.value) {
    parts.push(`Registry: ${selectedRegistryName}`);
  }

  summary.textContent = parts.length ? parts.join(" | ") : "No selections yet.";
}

function renderRegistries() {
  clearAndSetDefault(registrySelect, "Select registry");
  REGISTRIES.forEach((registry) => {
    registrySelect.appendChild(option(registry.name, registry.id));
  });

  registrySelect.addEventListener("change", () => {
    const selected = REGISTRIES.find((registry) => registry.id === registrySelect.value);
    if (!selected) {
      registryMeta.innerHTML = "";
      renderSummary();
      return;
    }

    registryMeta.innerHTML = `
      ${selected.detail}
      (<a href="${selected.source}" target="_blank" rel="noreferrer">source</a>)
    `;
    renderSummary();
  });
}

function loadCountries() {
  clearAndSetDefault(countrySelect, "Select country");
  const sortedCountries = [...countries].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  sortedCountries.forEach((country) => {
    countrySelect.appendChild(option(country.name, country.isoCode));
  });

  countrySelect.disabled = false;
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

    loadCountries();
    clearAndSetDefault(stateSelect, "Select country first");
    clearAndSetDefault(citySelect, "Select state first");
  } catch (error) {
    clearAndSetDefault(countrySelect, "Unable to load country list");
    clearAndSetDefault(stateSelect, "Unable to load state list");
    clearAndSetDefault(citySelect, "Unable to load city list");
    countrySelect.disabled = true;
    stateSelect.disabled = true;
    citySelect.disabled = true;
    summary.textContent =
      "Location data failed to load. Check internet access and try again.";
    // Keep this visible in console for quick debugging.
    console.error(error);
  }
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
});

stateSelect.addEventListener("change", () => {
  const countryCode = countrySelect.value;
  const stateCode = stateSelect.value;

  if (!countryCode) {
    clearAndSetDefault(citySelect, "Select country first");
    citySelect.disabled = true;
    renderSummary();
    return;
  }

  loadCities(countryCode, stateCode);
  renderSummary();
});

citySelect.addEventListener("change", renderSummary);

renderRegistries();
loadGeoData();
