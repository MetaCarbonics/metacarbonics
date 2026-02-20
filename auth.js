// CONFIG
const SB_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SB_KEY = 'YOUR_ANON_PUBLIC_KEY';
const _supabase = supabase.createClient(SB_URL, SB_KEY);

// LOGIN
async function login(email, password) {
    const { error } = await _supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    window.location.href = 'dashboard.html';
}

// SIGNUP + Welcome Email
async function signUp(email, password) {
    const { error } = await _supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: 'https://metacarbonics.com/dashboard.html'
        }
    });
    if (error) throw error;
    alert("Verification email sent. Welcome to Metacarbonics 🚀");
}

// PASSWORD RESET EMAIL
async function sendReset(email) {
    const { error } = await _supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://metacarbonics.com/reset-password.html',
    });
    if (error) throw error;
    alert("Password reset email sent.");
}

// PROTECT PAGE
async function protectPage() {
    const { data: { session } } = await _supabase.auth.getSession();
    if (!session) window.location.href = "index.html";
    return session.user;
}

// PROFILE PICTURE UPLOAD (Correct Version)
async function uploadAvatar(event) {
    const file = event.target.files[0];
    const { data: { user } } = await _supabase.auth.getUser();

    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await _supabase.storage
        .from('avatars')
        .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = _supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

    await _supabase.from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', user.id);

    alert("Avatar updated!");
    location.reload();
}

// ADMIN DELETE USER
async function adminDeleteUser(userId) {
    const confirmDelete = confirm("Are you sure?");
    if (!confirmDelete) return;

    const { error } = await _supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

    if (error) alert("Only admins can delete users.");
    else location.reload();
}

async function logout() {
    await _supabase.auth.signOut();
    window.location.href = "index.html";
}