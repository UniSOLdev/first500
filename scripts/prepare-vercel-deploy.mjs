import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const IGNORE = new Set(["node_modules", ".next", ".git", "scripts"]);
const BINARY_EXT = new Set([
  ".ico",
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".woff",
  ".woff2",
]);

function walk(dir, base = "") {
  const files = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORE.has(ent.name)) continue;
    const rel = base ? `${base}/${ent.name}` : ent.name;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) files.push(...walk(full, rel));
    else files.push(rel);
  }
  return files;
}

const relPaths = walk(ROOT).filter((f) => !f.startsWith("agent-tools"));

const files = relPaths.map((rel) => {
  const full = path.join(ROOT, rel);
  const ext = path.extname(rel).toLowerCase();
  if (BINARY_EXT.has(ext)) {
    return {
      file: rel,
      data: fs.readFileSync(full).toString("base64"),
      encoding: "base64",
    };
  }
  return { file: rel, data: fs.readFileSync(full, "utf8") };
});

const payload = {
  target: process.argv[2] ?? "production",
  name: "first500",
  teamId: "team_Gc1dMM739MlNSaDsoW5fnXi2",
  files,
};

fs.writeFileSync("/tmp/vercel-deploy-payload.json", JSON.stringify(payload));
console.log(`Prepared ${files.length} files (${(fs.statSync("/tmp/vercel-deploy-payload.json").size / 1024 / 1024).toFixed(2)} MB)`);
