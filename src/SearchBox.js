import React from "react";

function SearchBox({ arama, setArama }) {
  return (
    <input
      className="arama-kutusu"
      type="text"
      placeholder="Ara"
      value={arama}
      onChange={(e) => setArama(e.target.value)}
    />
  );
}

export default SearchBox;
