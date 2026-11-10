// FR-09: Administrator Login
// VFR-03 / VFR-04 / VFR-09: only a logged-in administrator with a valid session
// can use admin functions. Passwords are stored as SHA-256 hashes, never as plain text.
(function (root, factory) {
    const messages = (typeof module !== "undefined" && module.exports)
        ? require("./admin-messages")
        : root.AdminMessages;
    const api = factory(messages);

    if (typeof module !== "undefined" && module.exports) {
        module.exports = api;
    }
    if (root) {
        root.AdminAuth = api;
    }
}(typeof globalThis !== "undefined" ? globalThis : this, function (adminMessages) {
    "use strict";

    const AdminError = adminMessages.AdminError;
    const MESSAGES = adminMessages.MESSAGES;

    const SESSION_DURATION_MS = 30 * 60 * 1000; // 30 minutes

    // Demo administrator account. Username: admin, password: Admin@123
    const DEFAULT_ADMINS = [
        {
            username: "admin",
            passwordHash: "e86f78a8a3caf0b60d8e74e5942aa6d86dc150cd3c03338aef25b7d2d7e3acc7"
        }
    ];

    let currentSession = null;

    function toHex(buffer) {
        return Array.from(new Uint8Array(buffer))
            .map(function (b) { return b.toString(16).padStart(2, "0"); })
            .join("");
    }

    async function hashPassword(password) {
        if (typeof window === "undefined" && typeof require === "function") {
            return require("crypto").createHash("sha256").update(password).digest("hex");
        }
        const data = new TextEncoder().encode(password);
        return toHex(await crypto.subtle.digest("SHA-256", data));
    }

    function createToken() {
        if (typeof crypto !== "undefined" && crypto.randomUUID) {
            return crypto.randomUUID();
        }
        return require("crypto").randomUUID();
    }

    async function login(username, password, admins) {
        const accounts = admins || DEFAULT_ADMINS;
        const name = typeof username === "string" ? username.trim() : "";

        if (name === "" || typeof password !== "string" || password === "") {
            return { success: false, message: MESSAGES.LOGIN_REQUIRED_FIELDS };
        }

        const hash = await hashPassword(password);
        const account = accounts.find(function (a) {
            return a.username === name && a.passwordHash === hash;
        });

        if (!account) {
            currentSession = null;
            return { success: false, message: MESSAGES.LOGIN_INVALID };
        }

        currentSession = {
            username: account.username,
            token: createToken(),
            expiresAt: Date.now() + SESSION_DURATION_MS
        };
        return { success: true, token: currentSession.token, message: MESSAGES.LOGIN_SUCCESS };
    }

    function logout() {
        currentSession = null;
        return { success: true, message: MESSAGES.LOGOUT_SUCCESS };
    }

    function isAuthenticated(token) {
        return Boolean(
            currentSession &&
            token &&
            token === currentSession.token &&
            Date.now() < currentSession.expiresAt
        );
    }

    // Call at the start of every protected admin function.
    function requireAdmin(token) {
        if (currentSession && token === currentSession.token && Date.now() >= currentSession.expiresAt) {
            currentSession = null;
            throw new AdminError("SESSION_EXPIRED");
        }
        if (!isAuthenticated(token)) {
            throw new AdminError("NOT_AUTHENTICATED");
        }
        return currentSession.username;
    }

    // Used by tests to simulate an expired session.
    function _expireSessionForTest() {
        if (currentSession) {
            currentSession.expiresAt = Date.now() - 1;
        }
    }

    return {
        login: login,
        logout: logout,
        isAuthenticated: isAuthenticated,
        requireAdmin: requireAdmin,
        hashPassword: hashPassword,
        SESSION_DURATION_MS: SESSION_DURATION_MS,
        _expireSessionForTest: _expireSessionForTest
    };
}));
