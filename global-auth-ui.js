(function () {
    const PUBLIC_PAGES = new Set(["", "index.html", "login.html", "signup.html", "reset-password.html"]);
    const LOGIN_PAGE = "login.html";
    const WRAPPER_ID = "globalAuthBar";

    function currentFileName() {
        const path = window.location.pathname || "";
        const file = path.split("/").pop() || "";
        return file;
    }

    function isPublicPage() {
        return PUBLIC_PAGES.has(currentFileName());
    }

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const existing = document.querySelector(`script[src="${src}"]`);
            if (existing) {
                existing.addEventListener("load", () => resolve(), { once: true });
                if (existing.getAttribute("data-loaded") === "true") resolve();
                return;
            }
            const s = document.createElement("script");
            s.src = src;
            s.async = false;
            s.onload = () => {
                s.setAttribute("data-loaded", "true");
                resolve();
            };
            s.onerror = reject;
            document.head.appendChild(s);
        });
    }

    function renderFallbackBar(session, name) {
        let wrap = document.getElementById(WRAPPER_ID);
        if (!wrap) {
            wrap = document.createElement("div");
            wrap.id = WRAPPER_ID;
            wrap.style.position = "fixed";
            wrap.style.top = "12px";
            wrap.style.right = "12px";
            wrap.style.zIndex = "9999";
            wrap.style.display = "flex";
            wrap.style.alignItems = "center";
            wrap.style.gap = "8px";
            wrap.style.fontFamily = "Inter, sans-serif";
            document.body.appendChild(wrap);
        }

        if (session) {
            wrap.innerHTML = `
                <span style="background:#0b3d2e;color:#fff;padding:8px 12px;border-radius:9999px;font-weight:600;">
                    Hi, ${name}
                </span>
                <button id="globalLogoutBtn" style="background:#0f5f44;color:#fff;border:none;padding:8px 12px;border-radius:9999px;font-weight:600;cursor:pointer;">
                    Logout
                </button>
            `;
            const btn = document.getElementById("globalLogoutBtn");
            if (btn) {
                btn.addEventListener("click", async () => {
                    try {
                        await window.metaAuth.logout();
                    } catch (err) {
                        console.error("Logout failed:", err?.message || err);
                    }
                });
            }
        } else {
            wrap.innerHTML = `
                <a href="login.html" style="background:#fff;color:#0b3d2e;padding:8px 12px;border-radius:9999px;font-weight:600;text-decoration:none;border:1px solid #0b3d2e;">
                    Login
                </a>
            `;
        }
    }

    function renderHomeNav(session, name) {
        const authNavSlot = document.getElementById("authNavSlot");
        if (!authNavSlot) return false;

        if (!session) {
            authNavSlot.innerHTML = '<a href="login.html" class="bg-white text-primary-dark font-semibold py-1 px-4 rounded-full hover:bg-gray-200 transition duration-150">Login</a>';
            return true;
        }

        const safeName = String(name).replace(/</g, "&lt;").replace(/>/g, "&gt;");
        authNavSlot.innerHTML = `
            <span class="text-white font-semibold mr-2">Hi, ${safeName}</span>
            <a href="profile.html" class="bg-white text-primary-dark font-semibold py-1 px-3 rounded-full hover:bg-gray-200 transition duration-150 mr-2">My Account</a>
            <button id="logoutRightBtn" class="bg-primary-mid text-white font-semibold py-1 px-3 rounded-full hover:bg-primary-dark transition duration-150">Logout</button>
        `;

        const logoutRightBtn = document.getElementById("logoutRightBtn");
        if (logoutRightBtn) {
            logoutRightBtn.addEventListener("click", async () => {
                try {
                    await window.metaAuth.logout();
                } catch (error) {
                    console.error("Logout failed:", error?.message || error);
                }
            });
        }
        return true;
    }

    async function init() {
        if (!window.supabase) {
            await loadScript("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2");
        }
        if (!window._supabase) {
            await loadScript("supabase-client.js");
        }
        if (!window.metaAuth) {
            await loadScript("auth.js");
        }

        const { data } = await window._supabase.auth.getSession();
        const session = data?.session || null;

        if (!session && !isPublicPage()) {
            const next = encodeURIComponent(window.location.pathname.split("/").pop() || "index.html");
            window.location.href = `${LOGIN_PAGE}?next=${next}`;
            return;
        }

        let name = "User";
        if (session) {
            try {
                await window.metaAuth.ensureProfileForCurrentUser();
                window.metaAuth.startSessionGuards();
                const current = await window.metaAuth.getCurrentUserWithProfile();
                name = current?.profile?.full_name || current?.user?.user_metadata?.full_name || current?.user?.email || "User";
            } catch (err) {
                console.warn("Profile load failed:", err?.message || err);
            }
        }

        const renderedInHomeNav = renderHomeNav(session, name);
        if (!renderedInHomeNav) {
            renderFallbackBar(session, name);
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        init().catch((err) => console.error("Global auth init failed:", err?.message || err));
    });
})();
