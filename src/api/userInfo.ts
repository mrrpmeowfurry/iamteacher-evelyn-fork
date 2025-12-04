import { Elysia } from "elysia";
import { sessions } from "../helper/sessionStore";

export const userApi = new Elysia({ prefix: "/api" })
  .get("/me", ({ cookie, set }) => {
    // debugging line
    if (process.env.DEBUG === "true") {
      console.log("COOKIE IN /api/me:", cookie);
    }
    
    const sessionId = cookie.sessionId?.value as string | undefined;

    if (!sessionId) {
      set.status = 401;
      return { error: "Not authenticated", reason: "(no sessionId cookie)" };
    }

    const email = sessions.get(sessionId) ?? null;

    if (!email) {
      set.status = 401;
      return { error: "Not authenticated", reason: "(invalid session)" };
    }

    return {
      email,
      sessionId
    };
  });
