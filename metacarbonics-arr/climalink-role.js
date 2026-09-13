(function () {
  "use strict";
  const main = document.getElementById("main");
  const roleSelect = document.getElementById("role");
  const externalRoles = new Set(["buyer", "investor"]);
  const esc = (v) => String(v ?? "").replace(/[&<>\"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'\"':"&quot;","'":"&#39;"}[c]));

  function failClosed(message) {
    main.innerHTML = `<div class="page-head"><div><p class="eyebrow">SECURE PORTAL</p><h1>Authorised data unavailable</h1><p>${esc(message)}</p></div></div><div class="access-note">No project, counterparty, financial or document data has been disclosed.</div>`;
  }

  function card(row) {
    return `<article class="portfolio-card" data-record="${esc(row.id)}"><span class="pill">${esc(row.status)}</span><h3>${esc(row.name)}</h3><p>${esc(row.public_reference || row.id)}</p><div class="row"><b>${esc(row.primary_metric || "—")}</b><span>${esc(row.milestone || "—")}</span></div></article>`;
  }

  async function renderExternal(current) {
    const profile = current.profile || {};
    const role = String(profile.role || "").toLowerCase();
    if (!externalRoles.has(role) || !profile.organisation_id) return failClosed("Your account has no approved organisation access scope. Contact MetaCarbonics BD.");
    const { data, error } = await window._supabase.from("portal_projects").select("id,name,status,category,primary_metric,milestone,public_reference").order("updated_at", { ascending: false });
    if (error) return failClosed("The secure project service is not available. Contact MetaCarbonics BD; access was denied safely.");
    const rows = data || [];
    document.body.dataset.portalRole = role;
    document.querySelectorAll("[data-internal]").forEach((el) => { el.hidden = true; });
    document.querySelectorAll("[data-external]").forEach((el) => { el.hidden = false; });
    document.getElementById("workspaceLabel").textContent = role === "buyer" ? "Buyer portal" : "Investor portal";
    document.getElementById("workspaceUser").textContent = profile.organisation || profile.full_name || profile.email;
    main.innerHTML = `<section class="external-hero"><div><p class="eyebrow">${role.toUpperCase()} PORTAL</p><h1>${role === "buyer" ? "Your carbon procurement workspace" : "Your carbon investment portfolio"}</h1><p>Only records explicitly released to your organisation are returned by the secure data service.</p></div><div class="external-hero-badge"><span>Access scope</span><b>${esc(profile.organisation || "Approved organisation")}</b></div></section><div class="access-note">Server-side organisation policies apply to every list, detail and document request.</div><div class="section-title"><h2>My authorised projects</h2><span class="pill">${rows.length} records</span></div><div class="portfolio-grid">${rows.length ? rows.map(card).join("") : '<article class="panel"><h3>No released records</h3><p>Projects will appear after MetaCarbonics approves access.</p></article>'}</div>`;
    main.querySelectorAll("[data-record]").forEach((el) => el.addEventListener("click", () => { location.href = `climalink-record.html?id=${encodeURIComponent(el.dataset.record)}`; }));
  }

  function apply(event) {
    const current = event?.detail || window.MC_CURRENT_USER;
    if (!current) return;
    const role = String(current.profile?.role || "user").toLowerCase();
    if (roleSelect) roleSelect.value = ({buyer:"Buyer",investor:"Investor"})[role] || roleSelect.value;
    if (externalRoles.has(role)) renderExternal(current);
  }
  window.addEventListener("mc-auth-ready", apply);
  if (window.MC_CURRENT_USER) apply({ detail: window.MC_CURRENT_USER });
})();
