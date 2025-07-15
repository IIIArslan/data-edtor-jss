import React, { useState } from "react";

function SearchBox({ data, onResults }) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    const lower = query.toLowerCase();
    const results = [];

    const walk = (node, path = []) => {
      if (typeof node !== "object" || node === null) return;

      for (const [key, value] of Object.entries(node)) {
        const currentPath = [...path, key];
        if (key.toLowerCase().includes(lower)) {
          results.push(currentPath);
        }

        if (typeof value === "object") {
          walk(value, currentPath);
        }
      }
    };

    walk(data);
    onResults(results);
  };

  return (
    <div className="search-box">
      <label>
        Arama:{" "}
        <input
          type="text"
          placeholder="Okul, şehir veya program adı..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      <button onClick={handleSearch}>Ara</button>
    </div>
  );
}

export default SearchBox;
