function formatDate(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr || "";
  return d.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
}

async function renderList() {
  const container = document.getElementById("post-list");

  let posts;
  try {
    const res = await fetch("posts/index.json");
    posts = await res.json();
  } catch (err) {
    container.innerHTML = `<p class="empty-state">글 목록을 불러오지 못했습니다.</p>`;
    return;
  }

  if (!posts.length) {
    container.innerHTML = `<p class="empty-state">아직 작성된 글이 없습니다.</p>`;
    return;
  }

  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  container.innerHTML = posts
    .map(
      (post) => `
      <a class="post-card" href="post.html?slug=${encodeURIComponent(post.slug)}">
        <h2 class="post-card-title">${post.title}</h2>
        <div class="post-card-date">${formatDate(post.date)}</div>
        ${post.excerpt ? `<p class="post-card-excerpt">${post.excerpt}</p>` : ""}
      </a>`
    )
    .join("");
}

renderList();
