import { Elysia } from "elysia";
import { sessions } from "./sessionStore";

export const authPlugin = new Elysia()
    .derive(({ cookie }) => {
        const sessionId = cookie.sessionId?.value as string | undefined;
        const email = sessionId ? sessions.get(sessionId) ?? null : null;

        console.log("raw headers:", cookie);
        console.log("sessionId from cookie:", sessionId);
        console.log("authenticated user email:", email);
        console.log("sessions map:", sessions);

        return {
            user: email, // string | null
            sessionId: email ? sessionId : null,
        };
    }
)