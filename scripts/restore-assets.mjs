import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from "node:fs";
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

// Patch pdfkit to inline standard font metrics so Vercel Serverless never fails on missing Helvetica.cjs
try {
  const { createRequire } = await import("node:module");
  const { readdirSync } = await import("node:fs");
  const req = createRequire(import.meta.url);

  const stdFontNames = {
    Courier: "Courier",
    "Courier-Bold": "CourierBold",
    "Courier-BoldOblique": "CourierBoldOblique",
    "Courier-Oblique": "CourierOblique",
    Helvetica: "Helvetica",
    "Helvetica-Bold": "HelveticaBold",
    "Helvetica-BoldOblique": "HelveticaBoldOblique",
    "Helvetica-Oblique": "HelveticaOblique",
    Symbol: "Symbol",
    "Times-Bold": "TimesBold",
    "Times-BoldItalic": "TimesBoldItalic",
    "Times-Italic": "TimesItalic",
    "Times-Roman": "TimesRoman",
    ZapfDingbats: "ZapfDingbats",
  };

  let fontMap = null;
  function getFontMap() {
    if (fontMap) return fontMap;
    fontMap = {};
    for (const [key, sub] of Object.entries(stdFontNames)) {
      try {
        fontMap[key] = req("pdfkit/standard-fonts/" + sub);
      } catch {}
    }
    return fontMap;
  }

  function patchPdfkitFile(filePath) {
    if (!existsSync(filePath)) return;
    try {
      let code = readFileSync(filePath, "utf8");
      if (code.includes("__inlinedStdFonts")) return;

      const targetLoaderStart = "registerStdFontLoaders({";
      if (!code.includes(targetLoaderStart)) return;

      const fMap = getFontMap();
      if (!fMap || !fMap.Helvetica) return;

      const inlinedData = JSON.stringify(fMap);
      const replacement = `const __inlinedStdFonts = ${inlinedData};
registerStdFontLoaders({
  Courier: () => { try { return require$1('#standard-fonts/Courier'); } catch (e) { return __inlinedStdFonts['Courier']; } },
  'Courier-Bold': () => { try { return require$1('#standard-fonts/CourierBold'); } catch (e) { return __inlinedStdFonts['Courier-Bold']; } },
  'Courier-BoldOblique': () => { try { return require$1('#standard-fonts/CourierBoldOblique'); } catch (e) { return __inlinedStdFonts['Courier-BoldOblique']; } },
  'Courier-Oblique': () => { try { return require$1('#standard-fonts/CourierOblique'); } catch (e) { return __inlinedStdFonts['Courier-Oblique']; } },
  Helvetica: () => { try { return require$1('#standard-fonts/Helvetica'); } catch (e) { return __inlinedStdFonts['Helvetica']; } },
  'Helvetica-Bold': () => { try { return require$1('#standard-fonts/HelveticaBold'); } catch (e) { return __inlinedStdFonts['Helvetica-Bold']; } },
  'Helvetica-BoldOblique': () => { try { return require$1('#standard-fonts/HelveticaBoldOblique'); } catch (e) { return __inlinedStdFonts['Helvetica-BoldOblique']; } },
  'Helvetica-Oblique': () => { try { return require$1('#standard-fonts/HelveticaOblique'); } catch (e) { return __inlinedStdFonts['Helvetica-Oblique']; } },
  Symbol: () => { try { return require$1('#standard-fonts/Symbol'); } catch (e) { return __inlinedStdFonts['Symbol']; } },
  'Times-Bold': () => { try { return require$1('#standard-fonts/TimesBold'); } catch (e) { return __inlinedStdFonts['Times-Bold']; } },
  'Times-BoldItalic': () => { try { return require$1('#standard-fonts/TimesBoldItalic'); } catch (e) { return __inlinedStdFonts['Times-BoldItalic']; } },
  'Times-Italic': () => { try { return require$1('#standard-fonts/TimesItalic'); } catch (e) { return __inlinedStdFonts['Times-Italic']; } },
  'Times-Roman': () => { try { return require$1('#standard-fonts/TimesRoman'); } catch (e) { return __inlinedStdFonts['Times-Roman']; } },
  ZapfDingbats: () => { try { return require$1('#standard-fonts/ZapfDingbats'); } catch (e) { return __inlinedStdFonts['ZapfDingbats']; } }
});`;

      const reg = /registerStdFontLoaders\(\{[\s\S]*?\}\);/;
      if (reg.test(code)) {
        code = code.replace(reg, replacement);
        writeFileSync(filePath, code);
        console.log("Patched pdfkit standard fonts at " + filePath);
      }
    } catch (err) {
      console.error("Failed to patch " + filePath, err);
    }
  }

  function patchPdfkitDir(dir, depth = 0) {
    if (depth > 6 || !existsSync(dir)) return;
    try {
      const entries = readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const full = resolve(dir, entry.name);
        let isDir = false;
        try {
          isDir = statSync(full).isDirectory();
        } catch {}
        if (isDir) {
          if (entry.name === "pdfkit") {
            patchPdfkitFile(resolve(full, "js/pdfkit.js"));
            patchPdfkitFile(resolve(full, "js/pdfkit.node.mjs"));
          } else if (
            entry.name === "node_modules" ||
            entry.name.startsWith(".pnpm") ||
            entry.name.includes("pdfkit") ||
            entry.name === "@react-pdf"
          ) {
            patchPdfkitDir(full, depth + 1);
          }
        }
      }
    } catch {}
  }

  patchPdfkitDir(resolve(root, "node_modules"));
} catch (err) {
  console.error("Pdfkit patch step error:", err);
}
