// Creates .env from .env.template on first install.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const envPath = path.join(root, ".env");
const templatePath = path.join(root, ".env.template");
if (fs.existsSync(templatePath) && !fs.existsSync(envPath)) {
  fs.copyFileSync(templatePath, envPath);
}
