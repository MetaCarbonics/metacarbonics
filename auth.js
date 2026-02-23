if (!window._supabase) {
    throw new Error("Supabase client is not initialized. Load supabase-client.js before auth.js");
}
const _supabase = window._supabase;

async function ensureProfileForCurrentUser() {
    const {
        data: { user },
        error: userError
    } = await _supabase.auth.getUser();

    if (userError || !user) return;
    const metadataName = user.user_metadata?.full_name || user.user_metadata?.name || null;

    const { error: profileError } = await _supabase
        .from("profiles")
        .upsert(
            { id: user.id, email: user.email, full_name: metadataName, role: "user" },
            { onConflict: "id" }
        );

    if (profileError) {
        console.warn("Profile upsert skipped:", profileError.message);
    }
}

// LOGIN
async function login(email, password) {
    const { error } = await _supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    await ensureProfileForCurrentUser();
    window.location.href = 'index.html';
}

// SIGNUP + Welcome Email
async function signUp(email, password, fullName) {
    const { data, error } = await _supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName || null
            },
            emailRedirectTo: 'https://metacarbonics.com/login.html'
        }
    });
    if (error) {
        if (error.message && error.message.toLowerCase().includes("already registered")) {
            throw new Error("This email is already registered. Try login, reset password, or resend verification.");
        }
        throw error;
    }

    // When email confirmation is disabled and session exists, profile can be created now.
    if (data.session?.user) {
        await ensureProfileForCurrentUser();
    }

    alert("Verification email sent. Please confirm your email before logging in.");
}

async function resendVerification(email) {
    const { error } = await _supabase.auth.resend({
        type: "signup",
        email,
        options: {
            emailRedirectTo: "https://metacarbonics.com/login.html"
        }
    });
    if (error) throw error;
    return true;
}

// PASSWORD RESET EMAIL
async function sendReset(email) {
    const { error } = await _supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://metacarbonics.com/reset-password.html',
    });
    if (error) throw error;
    alert("Password reset email sent.");
}

async function getCurrentUserWithProfile() {
    const {
        data: { user },
        error: userError
    } = await _supabase.auth.getUser();

    if (userError || !user) return null;

    const { data: profile } = await _supabase
        .from("profiles")
        .select("id, email, full_name, role, avatar_url")
        .eq("id", user.id)
        .maybeSingle();

    return {
        user,
        profile
    };
}

async function requestAccountDeletion(reason) {
    const current = await getCurrentUserWithProfile();
    if (!current?.user) {
        throw new Error("You must be logged in to request account deletion.");
    }

    const { user, profile } = current;

    const payload = {
        user_id: user.id,
        email: user.email,
        full_name: profile?.full_name || user.user_metadata?.full_name || null,
        reason: reason || null,
        status: "requested"
    };

    const { error } = await _supabase
        .from("account_deletion_requests")
        .insert([payload]);

    if (error) throw error;
    return true;
}

// PROTECT PAGE
async function protectPage() {
    const { data: { session } } = await _supabase.auth.getSession();
    if (!session) window.location.href = "index.html";
    await ensureProfileForCurrentUser();
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

window.metaAuth = {
    login,
    signUp,
    resendVerification,
    ensureProfileForCurrentUser,
    getCurrentUserWithProfile,
    requestAccountDeletion,
    sendReset,
    protectPage,
    uploadAvatar,
    adminDeleteUser,
    logout
};
