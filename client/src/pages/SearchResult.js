import React from "react";
import { useLocation } from "react-router-dom";
import AllServices from "./AllServices"; // Reuse the AllServices component

const SearchResult = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");

  return (
    <div className="search-result">
      <h2>Search Results for: "{query}"</h2>
      <AllServices searchQuery={query} />
    </div>
  );
};

export default SearchResult;