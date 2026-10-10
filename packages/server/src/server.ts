import { buildApp } from "./app";
import { registerWebApp } from "./web";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const app = buildApp();
const dist = join(dirname(fileURLToPath(import.meta.url)), "../../web/dist");
registerWebApp(app, dist);
app.listen({ port: Number(process.env.PORT) || 3000, host: "0.0.0.0" }).then(() => console.log("listening"));
