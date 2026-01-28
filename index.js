let currentResults = [];

async function searchChange() {
  const input = document.getElementById("search-input");
  const q = (input?.value || "").trim();
  const resultsEl = document.getElementById("results");
  if (!resultsEl) return;
  if (!q) {
    currentResults = [];
    resultsEl.innerHTML = "";
    return;
  }
  resultsEl.innerHTML = `<div class="status">Searching...</div>`;
  try {
    const url = `https://www.omdbapi.com/?apikey=67c5f77b&s=${encodeURIComponent(q)}`;
    const res = await fetch(url);
    const data = await res.json();
    const list = data && data.Response === "True" ? data.Search || [] : [];
    currentResults = list.map((r) => ({
      id: r.imdbID,
      title: r.Title,
      year: r.Year ? parseInt(r.Year, 10) : "",
      poster: r.Poster && r.Poster !== "N/A" ? r.Poster : "",
    }));
    renderResults(currentResults);
  } catch (e) {
    resultsEl.innerHTML = `<div class="status error">Something went wrong. Please try again.</div>`;
  }
}

function renderResults(list) {
  const resultsEl = document.getElementById("results");
  if (!resultsEl) return;
  if (!list.length) {
    resultsEl.innerHTML = `<div class="status">No results found.</div>`;
    return;
  }
  resultsEl.innerHTML = list
    .map(
      (m) => `
      <div class="movie">
        <div class="movie__poster">
          <img src="${m.poster}" alt="${m.title}" loading="lazy" />
        </div>
        <div class="movie__meta">
          <div class="movie__title">${m.title}</div>
          <div class="movie__year">${m.year || ""}</div>
        </div>
      </div>
    `
    )
    .join("");
}

function filterChange() {
  const select = document.getElementById("filter-select");
  const mode = select?.value || "az";
  if (!currentResults.length) return;
  let sorted = [...currentResults];
  if (mode === "az") {
    sorted.sort((a, b) => a.title.localeCompare(b.title));
  } else if (mode === "za") {
    sorted.sort((a, b) => b.title.localeCompare(a.title));
  } else if (mode === "yr-desc") {
    sorted.sort((a, b) => (parseInt(b.year || 0, 10)) - (parseInt(a.year || 0, 10)));
  } else {
    sorted.sort((a, b) => (parseInt(a.year || 0, 10)) - (parseInt(b.year || 0, 10)));
  }
  renderResults(sorted);
}

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("search-input");
  const btn = document.querySelector(".not-loading");
  input?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchChange();
    }
  });
  btn?.addEventListener("click", searchChange);
});
