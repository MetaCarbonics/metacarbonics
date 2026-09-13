// Public browser configuration only. The anon key is intentionally non-secret;
// Supabase Row Level Security is the security boundary for every data request.
(function () {
    "use strict";
    const url = "https://trytdfqeokraxklxygnc.supabase.co";
    const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyeXRkZnFlb2tyYXhrbHh5Z25jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1OTUyMDcsImV4cCI6MjA4NzE3MTIwN30.wnDUZjmG1X84ayGgiyyON32nsQ8KAA_gnASkVLPw1ww";
    if (!window.supabase?.createClient) throw new Error("Identity service unavailable.");
    window.SB_URL = url;
    window.SB_KEY = anonKey;
    window.MC_AUTH_PROVIDER = "supabase";
    window._supabase = window.supabase.createClient(url, anonKey, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
        global: { headers: { "X-Client-Info": "metacarbonics-web/production" } }
    });
})();
