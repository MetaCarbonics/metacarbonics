// Shared Supabase client config for auth pages.
window.SB_URL = "https://trytdfqeokraxklxygnc.supabase.co";
window.SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyeXRkZnFlb2tyYXhrbHh5Z25jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1OTUyMDcsImV4cCI6MjA4NzE3MTIwN30.wnDUZjmG1X84ayGgiyyON32nsQ8KAA_gnASkVLPw1ww";

window._supabase = window.supabase.createClient(window.SB_URL, window.SB_KEY, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
    }
});
