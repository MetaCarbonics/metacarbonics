const API = "http://localhost:8787/api";

const state = {
  token: localStorage.getItem("dmrv_token") || "",
  user: null,
  projectId: "",
  lastResult: {}
};

const map = L.map("map").setView([20, 78], 5);
const osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

const satellite = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  { attribution: "Tiles &copy; Esri" }
);

const baseMaps = {
  OSM: osm,
  Imagery: satellite
};
L.control.layers(baseMaps, {}).addTo(map);

const drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

const drawControl = new L.Control.Draw({
  edit: { featureGroup: drawnItems },
  draw: {
    marker: false,
    circle: false,
    rectangle: false,
    polyline: false,
    circlemarker: false,
    polygon: true
  }
});
map.addControl(drawControl);

map.on(L.Draw.Event.CREATED, (event) => {
  const layer = event.layer;
  const activeLayerName = document.getElementById("activeLayer").value || "default";
  const featureName = `Polygon-${Date.now()}`;
  layer.feature = {
    type: "Feature",
    properties: { name: featureName, layer: activeLayerName },
    geometry: layer.toGeoJSON().geometry
  };
  drawnItems.addLayer(layer);
});

map.on(L.Draw.Event.EDITED, (event) => {
  event.layers.eachLayer((layer) => {
    if (!layer.feature) layer.feature = { type: "Feature", properties: {}, geometry: null };
    layer.feature.geometry = layer.toGeoJSON().geometry;
  });
});

function setResult(payload) {
  state.lastResult = payload;
  document.getElementById("resultBox").textContent = JSON.stringify(payload, null, 2);
}

function setAuthState(text) {
  document.getElementById("authState").textContent = text;
}

function getHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${state.token}`
  };
}

async function api(path, method = "GET", body) {
  const response = await fetch(`${API}${path}`, {
    method,
    headers: state.token ? getHeaders() : { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined
  });

  const contentType = response.headers.get("content-type") || "";
  if (!response.ok) {
    const err = contentType.includes("application/json") ? await response.json() : { error: await response.text() };
    throw new Error(err.error || "Request failed");
  }

  if (contentType.includes("application/json")) return response.json();
  return response.blob();
}

function featureCollection() {
  const features = [];
  drawnItems.eachLayer((layer) => {
    const gj = layer.toGeoJSON();
    const props = {
      ...(layer.feature?.properties || {}),
      layer: document.getElementById("activeLayer").value || layer.feature?.properties?.layer || "default"
    };
    features.push({ type: "Feature", geometry: gj.geometry, properties: props });
  });
  return { type: "FeatureCollection", features };
}

function loadFeatureCollection(fc) {
  drawnItems.clearLayers();
  L.geoJSON(fc, {
    onEachFeature: (feature, layer) => {
      layer.feature = feature;
      drawnItems.addLayer(layer);
    }
  });
}

async function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const result = await api("/auth/register", "POST", { email, password });
  state.token = result.token;
  localStorage.setItem("dmrv_token", state.token);
  setAuthState(`Logged in as ${result.user.email}`);
  await refreshProjects();
}

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const result = await api("/auth/login", "POST", { email, password });
  state.token = result.token;
  localStorage.setItem("dmrv_token", state.token);
  setAuthState(`Logged in as ${result.user.email}`);
  await refreshProjects();
}

async function refreshProjects() {
  const projects = await api("/projects");
  const select = document.getElementById("projectSelect");
  select.innerHTML = "";

  for (const p of projects) {
    const option = document.createElement("option");
    option.value = p.id;
    option.textContent = `${p.name} (${p.features?.length || 0} polygons)`;
    select.appendChild(option);
  }

  if (projects.length) {
    state.projectId = projects[0].id;
    select.value = state.projectId;
    await loadProjectFeatures();
  }
}

async function createProject() {
  const name = document.getElementById("projectName").value;
  const p = await api("/projects", "POST", { name });
  state.projectId = p.id;
  await refreshProjects();
}

async function loadProjectFeatures() {
  const projectId = state.projectId || document.getElementById("projectSelect").value;
  if (!projectId) throw new Error("Select a project first");
  const project = await api(`/projects/${projectId}`);
  loadFeatureCollection({ type: "FeatureCollection", features: project.features || [] });
  setResult({ info: `Loaded ${project.features?.length || 0} polygons` });
}

async function saveFeatures() {
  const projectId = state.projectId || document.getElementById("projectSelect").value;
  if (!projectId) throw new Error("Select a project first");

  const layerNames = new Set();
  drawnItems.eachLayer((layer) => {
    const name = layer.feature?.properties?.layer;
    if (name) layerNames.add(name);
  });

  const payload = {
    featureCollection: featureCollection(),
    layers: Array.from(layerNames)
  };

  const result = await api(`/projects/${projectId}/features`, "PUT", payload);
  setResult({ saved: result.features.length, layers: result.layers });
}

async function uploadKml() {
  const fileInput = document.getElementById("kmlFile");
  const file = fileInput.files[0];
  if (!file) throw new Error("Select a KML file");

  const projectId = state.projectId || document.getElementById("projectSelect").value;
  if (!projectId) throw new Error("Select a project first");

  const kml = await file.text();
  const result = await api(`/projects/${projectId}/import-kml`, "POST", { kml });
  setResult(result);
  await loadProjectFeatures();
}

async function exportKml() {
  const projectId = state.projectId || document.getElementById("projectSelect").value;
  if (!projectId) throw new Error("Select a project first");

  const blob = await api(`/projects/${projectId}/export-kml`);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "project-export.kml";
  a.click();
  URL.revokeObjectURL(url);
}

async function addLulcSource() {
  const year = Number(document.getElementById("lulcYear").value);
  const statsUrl = document.getElementById("lulcUrl").value;
  const result = await api("/lulc/sources", "POST", { year, statsUrl });
  setResult(result);
}

async function runLulcTotal() {
  const sources = await api("/lulc/sources");
  const years = sources.map((s) => s.year);
  const result = await api("/lulc/analyze-total", "POST", { years });
  setResult(result);
}

async function runLulcTransition() {
  const transitionUrl = document.getElementById("lulcTransitionUrl").value;
  const result = await api("/lulc/analyze-transition", "POST", { transitionUrl });
  setResult(result);
}

async function addBiomassSource() {
  const year = Number(document.getElementById("biomassYear").value);
  const statsUrl = document.getElementById("biomassUrl").value;
  const result = await api("/biomass/sources", "POST", { year, statsUrl });
  setResult(result);
}

async function runBiomass() {
  const sources = await api("/biomass/sources");
  const years = sources.map((s) => s.year);
  const result = await api("/biomass/analyze", "POST", { years, forestThresholdTpha: 10 });
  setResult(result);
}

async function downloadPdf() {
  const title = document.getElementById("reportTitle").value || "DMRV Analysis Report";

  const response = await fetch(`${API}/reports/pdf`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      title,
      payload: state.lastResult,
      filename: "dmrv-analysis.pdf"
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "PDF generation failed");
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "dmrv-analysis.pdf";
  a.click();
  URL.revokeObjectURL(url);
}

function bind(id, handler) {
  document.getElementById(id).addEventListener("click", async () => {
    try {
      await handler();
    } catch (error) {
      setResult({ error: error.message });
    }
  });
}

bind("registerBtn", register);
bind("loginBtn", login);
bind("createProjectBtn", createProject);
bind("saveFeaturesBtn", saveFeatures);
bind("loadFeaturesBtn", loadProjectFeatures);
bind("uploadKmlBtn", uploadKml);
bind("exportKmlBtn", exportKml);
bind("addLulcSourceBtn", addLulcSource);
bind("runLulcTotalBtn", runLulcTotal);
bind("runLulcTransitionBtn", runLulcTransition);
bind("addBiomassSourceBtn", addBiomassSource);
bind("runBiomassBtn", runBiomass);
bind("downloadPdfBtn", downloadPdf);

document.getElementById("projectSelect").addEventListener("change", async (event) => {
  state.projectId = event.target.value;
  try {
    await loadProjectFeatures();
  } catch (error) {
    setResult({ error: error.message });
  }
});

(async function bootstrap() {
  if (!state.token) return;
  try {
    const me = await api("/me");
    setAuthState(`Logged in as ${me.email}`);
    await refreshProjects();
  } catch {
    localStorage.removeItem("dmrv_token");
    state.token = "";
  }
})();
