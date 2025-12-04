import fs from "fs/promises";

export async function loadUser() {
    const raw = await fs.readFile("config/user.txt", "utf8");
    const [email, hash] = raw.trim().split(":");
    return { email, hash };
}

export function normalizeHash(hash: string) {
  return hash.startsWith("$2y$")
    ? "$2b$" + hash.substring(4)
    : hash;
}