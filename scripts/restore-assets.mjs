import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname, sep } from "node:path";
import { createHash } from "node:crypto";
const root = resolve(import.meta.dirname, "..");
const manifest = JSON.parse(
  readFileSync(resolve(root, "assets/manifest.json"), "utf8"),
);
const publicRoot = resolve(root, "public") + sep;
for (const item of manifest.files) {
  const target = resolve(root, item.path);
  if (!target.startsWith(publicRoot))
    throw new Error("Asset outside public directory");
  if (
    existsSync(target) &&
    createHash("sha256").update(readFileSync(target)).digest("hex") ===
      item.sha256
  )
    continue;
  const bytes = Buffer.concat(
    item.parts.map((name) =>
      Buffer.from(
        JSON.parse(readFileSync(resolve(root, "assets", name), "utf8")).data,
        "base64",
      ),
    ),
  );
  if (createHash("sha256").update(bytes).digest("hex") !== item.sha256)
    throw new Error("Corrupt bundled asset: " + item.path);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, bytes);
}
console.log(
  `Restored/verified ${manifest.files.length} self-contained assets.`,
);
