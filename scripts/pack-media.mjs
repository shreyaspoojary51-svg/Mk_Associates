import { readFileSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const currentDir = import.meta.dirname ?? dirname(fileURLToPath(import.meta.url));
const root = resolve(currentDir, "..");
const assetsDir = resolve(root, "assets");
const manifestPath = resolve(assetsDir, "manifest.json");

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

// 1. Pack film-poster.webp
const posterPath = resolve(root, "public/images/film-poster.webp");
const posterBuffer = readFileSync(posterPath);
const posterSha = createHash("sha256").update(posterBuffer).digest("hex");
const posterBase64 = posterBuffer.toString("base64");

writeFileSync(
  resolve(assetsDir, "media-04.json"),
  JSON.stringify({ data: posterBase64 })
);

const posterEntry = manifest.files.find((f) => f.path === "public/images/film-poster.webp");
if (posterEntry) {
  posterEntry.sha256 = posterSha;
  posterEntry.parts = ["media-04.json"];
  console.log(`Updated film-poster.webp in manifest: ${posterSha}`);
}

// 2. Pack studio-film.mp4
const videoPath = resolve(root, "public/images/studio-film.mp4");
const videoBuffer = readFileSync(videoPath);
const videoSha = createHash("sha256").update(videoBuffer).digest("hex");

const CHUNK_SIZE = 750 * 1024; // 750 KB raw per chunk
const parts = [];
let partIndex = 19;

for (let offset = 0; offset < videoBuffer.length; offset += CHUNK_SIZE) {
  const chunk = videoBuffer.subarray(offset, Math.min(offset + CHUNK_SIZE, videoBuffer.length));
  const chunkBase64 = chunk.toString("base64");
  const fileName = `media-${String(partIndex).padStart(2, "0")}.json`;
  writeFileSync(
    resolve(assetsDir, fileName),
    JSON.stringify({ data: chunkBase64 })
  );
  parts.push(fileName);
  console.log(`Wrote ${fileName} (${chunk.length} bytes raw)`);
  partIndex++;
}

// Clean up any old higher numbered media files if any
const allMediaFiles = readdirSync(assetsDir).filter((f) => /^media-\d+\.json$/.test(f));
for (const f of allMediaFiles) {
  const num = parseInt(f.replace("media-", "").replace(".json", ""), 10);
  if (num >= partIndex) {
    console.log(`Removing obsolete chunk: ${f}`);
    unlinkSync(resolve(assetsDir, f));
  }
}

const videoEntry = manifest.files.find((f) => f.path === "public/images/studio-film.mp4");
if (videoEntry) {
  videoEntry.sha256 = videoSha;
  videoEntry.parts = parts;
  console.log(`Updated studio-film.mp4 in manifest: ${videoSha} with ${parts.length} parts`);
}

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
console.log("Successfully updated assets/manifest.json and media chunk files.");
