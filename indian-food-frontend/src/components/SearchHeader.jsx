import { Header, Box, TextInput, Text } from "grommet";
import { Search, Close } from "grommet-icons";
import { useLocation } from "wouter";

import { getDietIcon } from "../utils/functions";
import useSearch from "../utils/hooks/useSearch";
import LanguageSelector from "./LanguageSwitch";

function SearchHeader() {
  const {
    searchQuery,
    setSearchQuery,
    showSuggestions,
    suggestions,
    handleSuggestionClick,
    clearSearch,
  } = useSearch();
  const [, navigate] = useLocation();

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
          <LanguageSelector />
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
