import { Elysia, t } from "elysia";
import { openAiToken } from "./api/openAiToken";
import { userApi } from "./api/userInfo";
import { loginApi } from "./api/loginApi";

// auth helper
import { authPlugin } from "./helper/authPlugin";
import { loadSessions } from "./helper/sessionStore";
import { logoutApi } from "./api/logoutApi";

await loadSessions();

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .use(authPlugin)
  .use(openAiToken)
  .use(userApi)
  .use(loginApi)
  .use(logoutApi)
  .listen(process.env.PORT || 3000);
  

console.log(
  `\033[38;2;255;205;201m🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}\x1b[0m

✨ Registered Routes:
`
);

const maxMethod = Math.max(...app.routes.map(r => r.method.length));

for (const r of app.routes) {
  const padded = r.method.padEnd(maxMethod, " ");
  console.log(` ➡️  \033[38;2;253;121;121m[${padded}]\x1b[0m ${r.path}`);
}