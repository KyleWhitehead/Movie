import { useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState("");

  async function searchChange() {
    if (!query.trim()) {
      setMovies([]);
      setStatus("");
      return;
    }
    setStatus("Searching...");
    try {
      const url = `https://www.omdbapi.com/?apikey=67c5f77b&s=${encodeURIComponent(query)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.Response === "True") {
        const list = data.Search.map((r) => ({
          id: r.imdbID,
          title: r.Title,
          year: r.Year,
          poster: r.Poster !== "N/A" ? r.Poster : "",
        }));
        setMovies(list);
        setStatus("");
      } else {
        setMovies([]);
        setStatus("No results found.");
      }
    } catch (e) {
      setStatus("Something went wrong. Please try again.");
    }
  }

  function handleFilter(mode) {
    if (!movies.length) return;
    let sorted = [...movies];
    if (mode === "az") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (mode === "za") {
      sorted.sort((a, b) => b.title.localeCompare(a.title));
    } else if (mode === "yr-desc") {
      sorted.sort((a, b) => (parseInt(b.year) || 0) - (parseInt(a.year) || 0));
    } else {
      sorted.sort((a, b) => (parseInt(a.year) || 0) - (parseInt(b.year) || 0));
    }
    setMovies(sorted);
  }

  return (
    <div className="home-container">
      <input
        id="search-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && searchChange()}
        placeholder="Search movies..."
      />
      <button className="not-loading" onClick={searchChange}>Search</button>
      <select id="filter-select" onChange={(e) => handleFilter(e.target.value)}>
        <option value="az">Title A-Z</option>
        <option value="za">Title Z-A</option>
        <option value="yr-asc">Year Asc</option>
        <option value="yr-desc">Year Desc</option>
      </select>

      {status && <div className="status">{status}</div>}

      <div id="results">
        {movies.map((m) => (
          <Link key={m.id} to={`/movie/${m.id}`}>
            <div className="movie">
              <div className="movie__poster">
                <img src={m.poster} alt={m.title} loading="lazy" />
              </div>
              <div className="movie__meta">
                <div className="movie__title">{m.title}</div>
                <div className="movie__year">{m.year}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;
