// Temporary local auth client used while the hosted Supabase project is unavailable.
// It preserves the subset of the Supabase browser API used by the MetaCarbonics site.
(function () {
    const USERS_KEY = "mc:local-auth:users";
    const SESSION_KEY = "mc:local-auth:session";
    const PROFILES_KEY = "mc:local-auth:profiles";
    const DELETION_REQUESTS_KEY = "mc:local-auth:account-deletion-requests";
    const STORAGE_KEY = "mc:local-auth:storage";
    const RESET_KEY = "mc:local-auth:password-resets";
    const ADMIN_EMAILS = new Set([
        "admin@metacarbonics.com",
        "info@metacarbonics.com",
        "waris@metacarbonics.com"
    ]);

    window.SB_URL = "local-auth-fallback";
    window.SB_KEY = "local-auth-fallback";
    window.MC_AUTH_PROVIDER = "local-fallback";

    function readJson(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (_err) {
            return fallback;
        }
    }

    function writeJson(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function makeError(message, status = 400) {
        const error = new Error(message);
        error.status = status;
        return error;
    }

    function uid(prefix) {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    }

    function loadUsers() {
        return readJson(USERS_KEY, []);
    }

    function saveUsers(users) {
        writeJson(USERS_KEY, users);
    }

    function loadProfiles() {
        return readJson(PROFILES_KEY, []);
    }

    function saveProfiles(profiles) {
        writeJson(PROFILES_KEY, profiles);
    }

    function getSessionObject() {
        return readJson(SESSION_KEY, null);
    }

    function setSessionObject(session) {
        if (!session) {
            localStorage.removeItem(SESSION_KEY);
            return;
        }
        writeJson(SESSION_KEY, session);
    }

    function sanitizeUser(user) {
        if (!user) return null;
        return {
            id: user.id,
            email: user.email,
            user_metadata: user.user_metadata || {},
            app_metadata: user.app_metadata || {},
            confirmed_at: user.confirmed_at || new Date().toISOString(),
            created_at: user.created_at || new Date().toISOString()
        };
    }

    function getCurrentUser() {
        const session = getSessionObject();
        if (!session?.user?.id) return null;
        const users = loadUsers();
        const user = users.find((entry) => entry.id === session.user.id);
        return sanitizeUser(user || session.user);
    }

    function ensureProfile(user) {
        if (!user?.id) return null;
        const profiles = loadProfiles();
        const existing = profiles.find((profile) => profile.id === user.id);
        if (existing) return existing;
        const profile = {
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.user_metadata?.name || "",
            role: ADMIN_EMAILS.has(String(user.email || "").toLowerCase()) ? "admin" : "user",
            avatar_url: ""
        };
        profiles.push(profile);
        saveProfiles(profiles);
        return profile;
    }

    function buildSession(user) {
        const safeUser = sanitizeUser(user);
        return {
            access_token: uid("token"),
            token_type: "bearer",
            expires_in: 86400,
            expires_at: Math.floor(Date.now() / 1000) + 86400,
            refresh_token: uid("refresh"),
            user: safeUser
        };
    }

    function fileToDataUrl(file) {
        return new Promise((resolve, reject) => {
            if (typeof FileReader === "undefined") {
                reject(makeError("File uploads are not supported in this browser.", 500));
                return;
            }
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result || ""));
            reader.onerror = () => reject(makeError("Unable to read selected file.", 500));
            reader.readAsDataURL(file);
        });
    }

    class QueryBuilder {
        constructor(tableName) {
            this.tableName = tableName;
            this.filters = [];
            this.mode = "select";
            this.payload = null;
            this.selectColumns = "*";
            this.resultMode = "many";
        }

        select(columns = "*") {
            this.mode = "select";
            this.selectColumns = columns;
            return this;
        }

        eq(column, value) {
            this.filters.push({ column, value });
            return this;
        }

        maybeSingle() {
            this.resultMode = "maybeSingle";
            return this;
        }

        single() {
            this.resultMode = "single";
            return this;
        }

        insert(payload) {
            this.mode = "insert";
            this.payload = payload;
            return this;
        }

        upsert(payload) {
            this.mode = "upsert";
            this.payload = payload;
            return this;
        }

        update(payload) {
            this.mode = "update";
            this.payload = payload;
            return this;
        }

        delete() {
            this.mode = "delete";
            return this;
        }

        _readRows() {
            switch (this.tableName) {
                case "profiles":
                    return loadProfiles();
                case "account_deletion_requests":
                    return readJson(DELETION_REQUESTS_KEY, []);
                default:
                    return [];
            }
        }

        _writeRows(rows) {
            switch (this.tableName) {
                case "profiles":
                    saveProfiles(rows);
                    break;
                case "account_deletion_requests":
                    writeJson(DELETION_REQUESTS_KEY, rows);
                    break;
                default:
                    break;
            }
        }

        _applyFilters(rows) {
            return rows.filter((row) => this.filters.every((filter) => row?.[filter.column] === filter.value));
        }

        _normalizeResult(rows) {
            if (this.resultMode === "single") {
                if (!rows.length) throw makeError(`No rows found in ${this.tableName}.`, 404);
                return rows[0];
            }
            if (this.resultMode === "maybeSingle") {
                return rows[0] || null;
            }
            return rows;
        }

        async execute() {
            try {
                const rows = this._readRows();
                if (this.mode === "select") {
                    return { data: this._normalizeResult(this._applyFilters(rows)), error: null };
                }

                if (this.mode === "insert") {
                    const incoming = Array.isArray(this.payload) ? this.payload : [this.payload];
                    const nextRows = rows.concat(incoming);
                    this._writeRows(nextRows);
                    return { data: incoming, error: null };
                }

                if (this.mode === "upsert") {
                    const incoming = Array.isArray(this.payload) ? this.payload : [this.payload];
                    const nextRows = [...rows];
                    incoming.forEach((entry) => {
                        const index = nextRows.findIndex((row) => row.id === entry.id);
                        if (index >= 0) nextRows[index] = { ...nextRows[index], ...entry };
                        else nextRows.push(entry);
                    });
                    this._writeRows(nextRows);
                    return { data: incoming, error: null };
                }

                if (this.mode === "update") {
                    const nextRows = rows.map((row) => {
                        const matched = this.filters.every((filter) => row?.[filter.column] === filter.value);
                        return matched ? { ...row, ...this.payload } : row;
                    });
                    this._writeRows(nextRows);
                    return { data: this._normalizeResult(this._applyFilters(nextRows)), error: null };
                }

                if (this.mode === "delete") {
                    const retained = rows.filter((row) => !this.filters.every((filter) => row?.[filter.column] === filter.value));
                    this._writeRows(retained);
                    return { data: null, error: null };
                }

                return { data: null, error: null };
            } catch (error) {
                return { data: null, error };
            }
        }

        then(resolve, reject) {
            return this.execute().then(resolve, reject);
        }
    }

    const localClient = {
        auth: {
            async getSession() {
                return { data: { session: getSessionObject() }, error: null };
            },
            async getUser() {
                const user = getCurrentUser();
                return { data: { user }, error: null };
            },
            async signInWithPassword({ email, password }) {
                const users = loadUsers();
                const user = users.find((entry) => entry.email.toLowerCase() === String(email || "").toLowerCase());
                if (!user || user.password !== password) {
                    return { data: { session: null, user: null }, error: makeError("Invalid email or password.", 401) };
                }
                const session = buildSession(user);
                setSessionObject(session);
                ensureProfile(user);
                return { data: { session, user: session.user }, error: null };
            },
            async signUp({ email, password, options = {} }) {
                const users = loadUsers();
                const normalizedEmail = String(email || "").trim().toLowerCase();
                if (!normalizedEmail || !password) {
                    return { data: { user: null, session: null }, error: makeError("Email and password are required.") };
                }
                if (users.some((entry) => entry.email.toLowerCase() === normalizedEmail)) {
                    return { data: { user: null, session: null }, error: makeError("This email is already registered.") };
                }
                const user = {
                    id: uid("user"),
                    email: normalizedEmail,
                    password,
                    confirmed_at: new Date().toISOString(),
                    created_at: new Date().toISOString(),
                    user_metadata: options.data || {},
                    app_metadata: {}
                };
                users.push(user);
                saveUsers(users);
                ensureProfile(user);
                return { data: { user: sanitizeUser(user), session: null }, error: null };
            },
            async resend() {
                return { data: { user: null }, error: null };
            },
            async resetPasswordForEmail(email) {
                const requests = readJson(RESET_KEY, []);
                requests.push({ email, requested_at: new Date().toISOString() });
                writeJson(RESET_KEY, requests);
                return { data: {}, error: null };
            },
            async updateUser({ password, data }) {
                const session = getSessionObject();
                if (!session?.user?.id) {
                    return { data: { user: null }, error: makeError("No active session.", 401) };
                }
                const users = loadUsers();
                const index = users.findIndex((entry) => entry.id === session.user.id);
                if (index < 0) {
                    return { data: { user: null }, error: makeError("User not found.", 404) };
                }
                users[index] = {
                    ...users[index],
                    password: password || users[index].password,
                    user_metadata: data ? { ...(users[index].user_metadata || {}), ...data } : users[index].user_metadata
                };
                saveUsers(users);
                const sessionUpdate = buildSession(users[index]);
                setSessionObject(sessionUpdate);
                ensureProfile(users[index]);
                return { data: { user: sessionUpdate.user }, error: null };
            },
            async signOut(options = {}) {
                if (options.scope === "others") {
                    return { error: null };
                }
                setSessionObject(null);
                return { error: null };
            }
        },
        from(tableName) {
            return new QueryBuilder(tableName);
        },
        storage: {
            from(bucketName) {
                return {
                    async upload(path, file) {
                        try {
                            const storage = readJson(STORAGE_KEY, {});
                            if (file && typeof File !== "undefined" && file instanceof File) {
                                storage[`${bucketName}:${path}`] = await fileToDataUrl(file);
                            } else {
                                storage[`${bucketName}:${path}`] = String(file || "");
                            }
                            writeJson(STORAGE_KEY, storage);
                            return { data: { path }, error: null };
                        } catch (error) {
                            return { data: null, error };
                        }
                    },
                    getPublicUrl(path) {
                        const storage = readJson(STORAGE_KEY, {});
                        return { data: { publicUrl: storage[`${bucketName}:${path}`] || "" } };
                    }
                };
            }
        }
    };

    window._supabase = localClient;
})();
