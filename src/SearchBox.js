import React from "react";
import { Search } from "lucide-react"; // Büyüteç ikonu eklendi

function SearchBox({ arama, setArama }) {
  return (
    <div className="arama-kapsayici">
      <Search className="arama-ikon" size={16} />
      <input
        className="arama-kutusu"
        type="text"
        placeholder="Ara"
        value={arama}
        onChange={(e) => setArama(e.target.value)}
      />
    </div>
  );
}

export default SearchBox;
