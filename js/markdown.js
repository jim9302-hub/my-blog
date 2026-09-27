function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) {
    return { meta: {}, body: raw };
  }

  const meta = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    value = value.replace(/^["']|["']$/g, "");
    meta[key] = value;
  }

  return { meta, body: match[2] };
}

async function loadPost(slug) {
  const res = await fetch(`posts/${slug}.md`);
  if (!res.ok) {
    throw new Error(`글을 찾을 수 없습니다: ${slug}`);
  }
  const raw = await res.text();
  const { meta, body } = parseFrontmatter(raw);
  return { meta, html: marked.parse(body) };
}
