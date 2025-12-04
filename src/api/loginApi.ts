import { Elysia } from "elysia";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import { loadUser, normalizeHash } from "../helper/loadUser";
import { sessions, saveSessions } from "../helper/sessionStore";

export const loginApi = new Elysia({ prefix: "/api" }).post("/login", async ({ body, cookie, set }) => {
    const { email, password } = body as { email: string; password: string };

    // mind, please use database next time
    const user = await loadUser();

    if (email !== user.email) {
        set.status = 401;
        return { error: "Invalid credentials" };
    }

    const hash = normalizeHash(user.hash);

    const ok = await bcrypt.compare(password, hash);
    if (!ok) {
        set.status = 401;
        return { error: "Invalid credentials" };
    }

    const sessionId = crypto.randomBytes(32).toString("hex");
    sessions.set(sessionId, email);
    await saveSessions();

    if (process.env.DEBUG === "true") {
        console.log("SETTING COOKIE", sessionId);
        console.log("cookie before:", cookie.sessionId);
    }

    cookie.sessionId.value = sessionId
    cookie.sessionId.httpOnly = true
    cookie.sessionId.path = "/"
    cookie.sessionId.maxAge = 60 * 60 * 24 * 7

    console.log("cookie after:", cookie.sessionId);


    return { ok: true };
});
