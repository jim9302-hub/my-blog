import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const postsDir = path.join(rootDir, "..", "posts");

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return {};

  const meta = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    value = value.replace(/^["']|["']$/g, "");
    meta[key] = value;
  }
  return meta;
}

async function main() {
  const files = (await readdir(postsDir)).filter((f) => f.endsWith(".md"));

  const posts = [];
  for (const file of files) {
    const raw = await readFile(path.join(postsDir, file), "utf-8");
    const meta = parseFrontmatter(raw);
    const slug = file.replace(/\.md$/, "");
    posts.push({
      slug,
      title: meta.title || slug,
      date: meta.date || "",
      excerpt: meta.excerpt || "",
    });
  }

  await writeFile(path.join(postsDir, "index.json"), JSON.stringify(posts, null, 2) + "\n");
  console.log(`posts/index.json 생성 완료 (${posts.length}개 글)`);
}

main();
