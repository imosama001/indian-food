import { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "wouter";
import { debounce } from "lodash";

import { dishesApi } from "../api";

const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [, navigate] = useLocation();

  const debouncedSearch = useMemo(
    () =>
      debounce(async (query) => {
        if (query.length >= 2) {
          try {
            const resp = await dishesApi.search(query);
            setSuggestions(resp?.results || []);
            setShowSuggestions(true);
          } catch (error) {
            console.error("Search error:", error);
            setSuggestions([]);
          }
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, debouncedSearch]);

  const handleSuggestionClick = useCallback(
    (dishId) => {
      navigate(`/dish/${dishId}`);
      setSearchQuery("");
      setShowSuggestions(false);
    },
    [navigate]
  );

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    showSuggestions,
    suggestions,
    handleSuggestionClick,
    clearSearch,
  };
};

export default useSearch;
