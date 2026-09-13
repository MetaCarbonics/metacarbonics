(function () {
    const LOGIN_URL = "/login.html";
    const nextPath = `${window.location.pathname || "/"}${window.location.search || ""}`;
    const style = document.createElement("style");
    style.textContent = "html.cad-auth-pending body{visibility:hidden}";
    document.head.appendChild(style);
    document.documentElement.classList.add("cad-auth-pending");

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const existing = document.querySelector(`script[src="${src}"]`);
            if (existing) {
                existing.addEventListener("load", resolve, { once: true });
                return;
            }
            const script = document.createElement("script");
            script.src = src;
            script.async = false;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    function redirectToLogin() {
        window.location.replace(`${LOGIN_URL}?next=${encodeURIComponent(nextPath)}`);
    }

    async function verifySession() {
        try {
            if (!window._supabase) {
                await loadScript("/supabase-client.js");
            }
            const { data } = await window._supabase.auth.getSession();
            if (!data?.session) {
                redirectToLogin();
                return;
            }
            const user = data.session.user;
            const result = await window._supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
            const profile = result?.data || { email: user.email, role: "user", full_name: user.email };
            const email = String(user.email || profile.email || "").toLowerCase();
            const isWarisAdmin = email === "hooda.waris0507@gmail.com" && profile.role === "admin";
            const allowedPreviews = new Set(["admin", "bd", "projectlead", "manager", "developer", "operations", "finance", "ceo", "farmer", "buyer", "investor"]);
            const requestedPreview = isWarisAdmin ? new URLSearchParams(window.location.search).get("preview") : null;
            const effectiveRole = requestedPreview && allowedPreviews.has(requestedPreview) ? requestedPreview : profile.role;
            const effectiveProfile = { ...profile, role: effectiveRole, actual_role: profile.role, is_role_preview: effectiveRole !== profile.role };
            window.MC_CURRENT_USER = { user, profile: effectiveProfile };
            document.documentElement.dataset.mcRole = effectiveRole || "user";
            window.dispatchEvent(new CustomEvent("mc-auth-ready", { detail: window.MC_CURRENT_USER }));
            document.documentElement.classList.remove("cad-auth-pending");
        } catch (_error) {
            redirectToLogin();
        }
    }

    verifySession();
})();
