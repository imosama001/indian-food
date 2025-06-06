import { useState, useEffect, useCallback, useMemo } from "react";
import { Header, Box, TextInput, Text } from "grommet";
import { Search, Close } from "grommet-icons";
import { useLocation } from "wouter";
import _ from "lodash";
import { dishesApi } from "../utils/api";
import { getDietIcon } from "../utils/functions";

function SearchHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [, navigate] = useLocation();

  const debouncedSearch = useMemo(
    () =>
      _.debounce(async (query) => {
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

  return (
    <Header
      background="white"
      pad="medium"
      border={{ side: "bottom", color: "neutral-2" }}
    >
      <Box direction="row" align="center" gap="medium" fill>
        <Box
          direction="row"
          align="center"
          gap="small"
          onClick={() => navigate("/")}
          focusIndicator={false}
          style={{ cursor: "pointer" }}
        >
          <Text size="xlarge" weight="bold" color="brand">
            🍽️
          </Text>
          <Text size="large" weight="bold" color="neutral-4">
            Indian Cuisine Explorer
          </Text>
        </Box>

        <Box flex align="center" justify="center" width="medium">
          <Box style={{ position: "relative" }} width="medium" alignSelf="end">
            <TextInput
              placeholder="Search dishes, ingredients, or regions..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              icon={<Search />}
              reverse={searchQuery && <Close onClick={clearSearch} />}
            />

            {showSuggestions && suggestions.length > 0 && (
              <Box
                style={{ position: "absolute", top: "45px" }}
                height={"300px"}
                overflow="auto"
                width="100%"
                background="white"
                flex={{ shrink: 0 }}
              >
                {suggestions.map((dish, index) => (
                  <Box
                    onClick={() => handleSuggestionClick(dish.pk)}
                    height={"65px"}
                    focusIndicator={false}
                    hoverIndicator={{ background: "wheat" }}
                    flex={{ shrink: 0 }}
                  >
                    <Box
                      key={index}
                      pad="small"
                      hoverIndicator
                      flex={{ shrink: 0 }}
                    >
                      <Text weight="bold">{dish?.name || ""}</Text>
                      <Box
                        direction="row"
                        gap="small"
                        align="center"
                        flex={{ shrink: 0 }}
                      >
                        <Text size="small" color="neutral-3">
                          {getDietIcon(dish.diet)} {dish.diet}
                        </Text>
                        <Text size="small" color="neutral-3">
                          •
                        </Text>
                        <Text size="small" color="neutral-3">
                          {dish.course}
                        </Text>
                        <Text size="small" color="neutral-3">
                          •
                        </Text>
                        <Text size="small" color="neutral-3">
                          {dish.region || "Various regions"}
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Header>
  );
}

export default SearchHeader;
