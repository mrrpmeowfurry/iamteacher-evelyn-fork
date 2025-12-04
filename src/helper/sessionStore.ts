import fs from "fs/promises";

const SESSION_FILE = "users/sessions.json";

type SessionMap = Map<string, string>;
export const sessions: SessionMap = new Map();

export async function loadSessions() {
    try {
        const file = await fs.readFile(SESSION_FILE, "utf-8");
        const obj = JSON.parse(file) as Record<string, string>;

        for (const [id, email] of Object.entries(obj) as [string, string][]) {
            sessions.set(id, email);
        }

        Object.entries(obj).forEach(([id, email]) => {
            sessions.set(id, email);
        });

        console.log(`Loaded ${sessions.size} sessions from ${SESSION_FILE}`);
    } catch (error: any) {
        if (error.code === "ENOENT") {
            console.log(`${SESSION_FILE} not found, starting with empty sessions`);
            return;
        } else {
            console.error("Error loading sessions:", error);
        }
    }
}

export async function saveSessions() {
    const obj: Record<string, string> = {};
    for (const [id, email] of sessions.entries()) {
        obj[id] = email;
    }

    await fs.mkdir("users", { recursive: true });
    await fs.writeFile(SESSION_FILE, JSON.stringify(obj, null, 2), "utf8");
    console.log(`Saved ${sessions.size} sessions to ${SESSION_FILE}`);
}