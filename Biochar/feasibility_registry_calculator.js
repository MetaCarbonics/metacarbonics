const params = new URLSearchParams(window.location.search);
const transferToken = params.get("token") || "";
const registryId = document.body.dataset.registry || "";

const TRANSFER_STORAGE_PREFIX = "biochar-feasibility-transfer:";
const FINAL_CREDITS_STORAGE_KEY = "biochar-feasibility-final-credits";

const registryNameEl = document.getElementById("registryName");
const annualBiocharEl = document.getElementById("annualBiochar");
const carbonContentEl = document.getElementById("carbonContent");
const permanenceFactorEl = document.getElementById("permanenceFactor");
const tentativeCreditsEl = document.getElementById("tentativeCredits");
const issuanceFactorEl = document.getElementById("issuanceFactor");
const bufferPercentEl = document.getElementById("bufferPercent");
const finalCreditsEl = document.getElementById("finalCredits");
const backBtn = document.getElementById("backToFeasibilityBtn");
const useResultBtn = document.getElementById("useResultBtn");

const registryDefaults = {
  verra: { issuance: 0.95, buffer: 10 },
  gs: { issuance: 0.93, buffer: 12 },
  puro: { issuance: 0.90, buffer: 8 },
  isometric: { issuance: 0.92, buffer: 10 },
};

let payload = null;

function calculateFinalCredits() {
  const tentative = Number(tentativeCreditsEl.value || 0);
  const issuance = Number(issuanceFactorEl.value || 0);
  const bufferPct = Number(bufferPercentEl.value || 0);
  const reduction = 1 - (bufferPct / 100);
  if (!Number.isFinite(tentative) || !Number.isFinite(issuance) || !Number.isFinite(reduction)) return 0;
  return Math.max(0, tentative * issuance * reduction);
}

function renderFinalCredits() {
  finalCreditsEl.value = calculateFinalCredits().toFixed(2);
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

function init() {
  payload = loadPayload();
  const defaults = registryDefaults[registryId] || registryDefaults.verra;
  issuanceFactorEl.value = String(defaults.issuance);
  bufferPercentEl.value = String(defaults.buffer);

  if (payload) {
    const d = payload.form_data || {};
    registryNameEl.textContent = payload.registry_name || registryId.toUpperCase();
    annualBiocharEl.value = d.q5_annual_biochar_t || "";
    carbonContentEl.value = d.q6_biochar_carbon_content_pct || "";
    permanenceFactorEl.value = payload.tentative_permanence_factor || "";
    tentativeCreditsEl.value = payload.tentative_credits_tco2e || "0";
  } else {
    registryNameEl.textContent = registryId.toUpperCase();
  }
  renderFinalCredits();
}

issuanceFactorEl.addEventListener("input", renderFinalCredits);
bufferPercentEl.addEventListener("input", renderFinalCredits);

backBtn.addEventListener("click", () => {
  window.location.href = "./biochar-phase1-feasibility-tool.html?section=tentative";
});

useResultBtn.addEventListener("click", () => {
  if (!payload) {
    alert("Missing transferred data. Go back and reopen calculator from Step 7.");
    return;
  }

  const result = {
    transfer_token: transferToken,
    registry_id: registryId,
    registry_name: payload.registry_name || registryId.toUpperCase(),
    final_credits_tco2e: Number(finalCreditsEl.value || 0),
    issuance_factor: Number(issuanceFactorEl.value || 0),
    buffer_percent: Number(bufferPercentEl.value || 0),
    calculated_at_utc: new Date().toISOString(),
  };

  localStorage.setItem(FINAL_CREDITS_STORAGE_KEY, JSON.stringify(result));
  window.location.href = "./biochar-phase1-feasibility-tool.html?section=tentative";
});

init();
