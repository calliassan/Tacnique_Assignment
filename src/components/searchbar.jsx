import React from "react";

function SearchBar({
  searchText,
  setSearchText,
  perPage,
  setPerPage,
  onAdd,
  onFilter,
}) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <select value={perPage} onChange={(e) => setPerPage(+e.target.value)}>
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </select>
      <button type="button" onClick={onAdd}>
        Add
      </button>
      <button type="button" onClick={onFilter}>
        Filter
      </button>
    </div>
  );
}

export default SearchBar;
