function formatDate(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr || "";
  return d.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
}

async function renderPost() {
  const params = new URLSearchParams(location.search);
  const slug = params.get("slug");
  const container = document.getElementById("post");

  if (!slug) {
    container.innerHTML = `<p class="empty-state">글을 찾을 수 없습니다.</p>`;
    return;
  }

  try {
    const { meta, html } = await loadPost(slug);
    document.title = `${meta.title || slug} · My-blog`;
    container.innerHTML = `
      <header class="post-header">
        <h1 class="post-title">${meta.title || slug}</h1>
        <div class="post-date">${formatDate(meta.date)}</div>
      </header>
      <div class="post-content">${html}</div>
    `;
  } catch (err) {
    container.innerHTML = `<p class="empty-state">글을 불러오지 못했습니다.</p>`;
  }
}

renderPost();
