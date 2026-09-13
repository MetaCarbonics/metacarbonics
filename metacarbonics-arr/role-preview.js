(function () {
  "use strict";
  const roles = [
    ["admin", "Administrator"], ["bd", "BD Manager"], ["projectlead", "Project Lead"],
    ["manager", "Project Manager"], ["developer", "Project Developer"], ["operations", "Operations"],
    ["finance", "Finance"], ["ceo", "CEO"], ["farmer", "Farmer"], ["buyer", "Buyer"], ["investor", "Investor"]
  ];
  function init(event) {
    const current = event?.detail || window.MC_CURRENT_USER;
    const profile = current?.profile || {};
    const email = String(current?.user?.email || profile.email || "").toLowerCase();
    if (email !== "hooda.waris0507@gmail.com" || profile.actual_role !== "admin") return;
    const host = document.querySelector(".top-actions");
    if (!host || document.getElementById("warisRolePreview")) return;
    const label = document.createElement("label");
    label.id = "warisRolePreview";
    label.className = "sheet-link";
    label.setAttribute("aria-label", "Preview portal as role");
    label.innerHTML = `Preview as <select>${roles.map(([value,name]) => `<option value="${value}" ${value === profile.role ? "selected" : ""}>${name}</option>`).join("")}</select>`;
    host.insertBefore(label, host.firstChild);
    if (profile.is_role_preview) {
      const badge = document.getElementById("sessionRole");
      if (badge) badge.textContent = `${roles.find(([value]) => value === profile.role)?.[1] || profile.role} · Preview`;
    }
    label.querySelector("select").addEventListener("change", (e) => {
      sessionStorage.setItem("mc:waris-role-preview", e.target.value);
      location.reload();
    });
  }
  window.addEventListener("mc-auth-ready", init);
  if (window.MC_CURRENT_USER) init({ detail: window.MC_CURRENT_USER });
})();
