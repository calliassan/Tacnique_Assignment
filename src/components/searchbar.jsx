import React from "react";

function SearchBar({ searchText, setSearchText, perPage, setPerPage, onAdd }) {
  return (
    <div className="search-bar">
      <input
        placeholder="Search..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <select value={perPage} onChange={(e) => setPerPage(+e.target.value)}>
        <option>10</option>
        <option>25</option>
        <option>50</option>
        <option>100</option>
      </select>
      <button onClick={onAdd}>Add</button>
    </div>
  );
}

export default SearchBar;
