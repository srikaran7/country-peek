function SearchBar({ query, onQueryChange }) {
  return (
    <div className="search-bar">
      <input
        className="search-bar__input"
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Search for a country..."
        aria-label="Search for a country"
      />
    </div>
  );
}

export default SearchBar;