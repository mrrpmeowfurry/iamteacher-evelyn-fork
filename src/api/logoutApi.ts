import { Elysia } from "elysia";
import { sessions, saveSessions } from "../helper/sessionStore";

export const logoutApi = new Elysia({ prefix: "/api" }).post("/logout", async ({ cookie, set }) => {
    const sessionId = cookie.sessionId?.value as string | undefined;

    if (!sessionId) {
        set.status = 400;
        return { error: "No sessionId cookie provided" };
    }

    if (process.env.DEBUG === "true") {
        console.log("LOGGING OUT SESSION ID:", sessionId);
    }

    const existed = sessions.delete(sessionId);
    await saveSessions();

    // Clear the cookie
    cookie.sessionId.remove();
    cookie.sessionId.value = "";
    cookie.sessionId.httpOnly = true;
    cookie.sessionId.path = "/";
    cookie.sessionId.maxAge = 0; // Expire immediately

    if (!existed) {
        set.status = 400;
        return { error: "Session not found" };
    }

    return { ok: true };
});