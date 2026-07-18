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
            document.documentElement.classList.remove("cad-auth-pending");
        } catch (_error) {
            redirectToLogin();
        }
    }

    verifySession();
})();
