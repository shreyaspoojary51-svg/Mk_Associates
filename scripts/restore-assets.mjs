import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
const currentDir =
  import.meta.dirname ?? dirname(fileURLToPath(import.meta.url));
const root = resolve(currentDir, "..");
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

// Patch @react-pdf/hyphenate exports if needed for Node.js / Vercel CJS compatibility
try {
  const { readdirSync } = await import("node:fs");
  function patchHyphenate(dir) {
    if (!existsSync(dir)) return;
    try {
      const entries = readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const full = resolve(dir, entry.name);
        if (entry.isDirectory()) {
          if (entry.name === "hyphenate" && dir.endsWith("@react-pdf")) {
            const pkgPath = resolve(full, "package.json");
            if (existsSync(pkgPath)) {
              const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
              let mod = false;
              if (pkg.exports) {
                if (pkg.exports["."] && !pkg.exports["."].default) {
                  pkg.exports["."].default = "./lib/index.js";
                  mod = true;
                }
                if (pkg.exports["./*"] && !pkg.exports["./*"].default) {
                  pkg.exports["./*"].default = "./lib/*.js";
                  mod = true;
                }
              }
              if (mod) {
                writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
                console.log("Patched @react-pdf/hyphenate exports at " + pkgPath);
              }
            }
          } else if (
            entry.name === "@react-pdf" ||
            entry.name === "node_modules" ||
            entry.name.startsWith(".pnpm")
          ) {
            patchHyphenate(full);
          }
        }
      }
    } catch {}
  }
  patchHyphenate(resolve(root, "node_modules"));
} catch {}
