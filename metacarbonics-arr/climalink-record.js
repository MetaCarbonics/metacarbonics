(function () {
  "use strict";
  const id = new URLSearchParams(location.search).get("id") || "";
  const root = document.getElementById("record");
  const esc = (v) => String(v ?? "—").replace(/[&<>\"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'\"':"&quot;","'":"&#39;"}[c]));

  function deny(message) {
    document.getElementById("roleBadge").textContent = "Access denied";
    root.innerHTML = `<article class="record-section"><p class="eyebrow">SECURE RECORD</p><h1>Record unavailable</h1><p>${esc(message)}</p><div class="privacy">No data was disclosed. Access is checked by signed-in user, role, organisation and record assignment.</div></article>`;
  }

  async function load(event) {
    const current = event?.detail || window.MC_CURRENT_USER;
    if (!current || !/^[A-Z0-9-]{3,64}$/.test(id)) return deny("The requested record is invalid or you do not have access.");
    const profile = current.profile || {};
    document.getElementById("roleBadge").textContent = `${profile.role || "user"} view`;
    const { data, error } = await window._supabase.from("portal_project_details").select("*").eq("id", id).maybeSingle();
    if (error || !data) return deny("This record is not assigned to your account or organisation.");
    const fields = Array.isArray(data.released_fields) ? data.released_fields : [];
    const details = fields.map((field) => `<div><span>${esc(field.label)}</span><b>${esc(field.value)}</b></div>`).join("");
    document.title = `${data.name} | ClimaLink`;
    root.innerHTML = `<article class="record-hero"><div class="record-status"><div><p class="eyebrow">${esc(data.category)}</p><h1>${esc(data.name)}</h1><p>${esc(data.public_reference || data.id)}</p></div><span class="pill">${esc(data.status)}</span></div></article><div class="privacy">This response was filtered server-side for ${esc(profile.organisation || profile.email)}.</div><div class="record-layout"><div><section class="record-section"><h2>Released information</h2><div class="detail-grid">${details || "<p>No detail fields have been released.</p>"}</div></section><section class="record-section"><h2>Activity and milestones</h2><div class="activity">${(data.released_activity || []).map((a) => `<div class="activity-row"><time>${esc(a.date)}</time><div><b>${esc(a.title)}</b><span>${esc(a.summary)}</span></div></div>`).join("") || "<p>No activity has been released.</p>"}</div></section></div><aside><section class="record-section"><h2>Actions</h2><div class="record-actions"><a class="primary" href="climalink.html#documents">View released documents</a><a class="secondary" href="mailto:bd@metacarbonics.com">Contact MetaCarbonics</a></div></section></aside></div>`;
  }
  window.addEventListener("mc-auth-ready", load, { once: true });
  if (window.MC_CURRENT_USER) load({ detail: window.MC_CURRENT_USER });
})();
