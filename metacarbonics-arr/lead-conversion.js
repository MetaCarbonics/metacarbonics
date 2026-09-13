(function () {
  "use strict";
  const id = new URLSearchParams(location.search).get("id") || "";
  const allowed = new Set(["admin", "bd", "projectlead"]);
  async function init(event) {
    const profile = (event?.detail || window.MC_CURRENT_USER)?.profile || {};
    if (!id.startsWith("LD-") || !allowed.has(String(profile.role || "").toLowerCase())) return;
    const record = document.getElementById("record");
    if (!record || record.querySelector(".privacy")) return;
    const checks = ["Counterparty identified", "Relationship type identified", "Geography known", "Scale or value known", "Interest confirmed", "No obvious disqualifying issue"];
    const box = document.createElement("section");
    box.className = "conversion-box";
    box.innerHTML = `<p class="eyebrow">CONTROLLED QUALIFICATION</p><h2>Convert lead to opportunity</h2>${checks.map((x,i)=>`<label class="conversion-check"><input type="checkbox" data-check="${i}"><span><b>${x}</b><br><small>Evidence required</small></span></label>`).join("")}<label>Activity or service<input id="conversionActivity" required></label><button class="primary" id="convertLead" disabled>Convert to opportunity</button><p id="conversionStatus" class="lineage">${id} → Opportunity pending</p>`;
    record.append(box);
    const inputs = [...box.querySelectorAll("[data-check]")];
    const button = box.querySelector("#convertLead");
    inputs.forEach((input) => input.addEventListener("change", () => { button.disabled = !inputs.every((item) => item.checked); }));
    button.addEventListener("click", async () => {
      const activity = box.querySelector("#conversionActivity").value.trim();
      if (!activity) return;
      button.disabled = true;
      const { data, error } = await window._supabase.rpc("convert_lead_to_opportunity", { p_lead_id: id, p_activity: activity });
      if (error) { button.disabled = false; box.querySelector("#conversionStatus").textContent = "Not saved — " + error.message; return; }
      box.querySelector("#conversionStatus").textContent = `${id} → ${data} · Saved`;
      button.textContent = "Converted";
    });
  }
  window.addEventListener("mc-auth-ready", init, { once: true });
  if (window.MC_CURRENT_USER) init({ detail: window.MC_CURRENT_USER });
})();
