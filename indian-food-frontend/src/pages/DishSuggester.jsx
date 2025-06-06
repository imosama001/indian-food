import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Heading,
  Button,
  Text,
  Pagination,
  Tag,
  Spinner,
  Card,
  Grid,
  CardBody,
} from "grommet";
import { Clock, Restaurant } from "grommet-icons";

import { Link } from "wouter";
import { dishesApi } from "../utils/api";
import { formatTime, getDietColor, getFlavorColor } from "../utils/functions";
import { FormClose } from "grommet-icons";
import { ingredients } from "../utils/constants";
import { debounce } from "lodash"; // Import debounce from lodash

const itemsPerPage = 20;

const debouncedLoadDishes = debounce(
  async ({ selected, cache, setCache, setAllDishes, setLoading }) => {
    setLoading(true);
    const cacheKey = selected.sort().join(","); // Generate a consistent key for caching

    if (cache[cacheKey]) {
      // Use cached data if available
      setAllDishes(cache[cacheKey]);
      setLoading(false);
      return;
    }

    try {
      const resp = await dishesApi.getDishByIngredients(selected || []); // Fetch all dishes at once
      const fetchedDishes = resp?.results || [];

      // Update cache with the fetched data
      setCache((prevCache) => ({
        ...prevCache,
        [cacheKey]: fetchedDishes,
      }));

      setAllDishes(fetchedDishes);
    } catch (error) {
      setAllDishes([]);
    } finally {
      setLoading(false);
    }
  },
  300
);

function DishSuggester() {
  const [dishes, setDishes] = useState([]);
  const [allDishes, setAllDishes] = useState([]); // Store all dishes fetched from the backend
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState([]);
  const [cache, setCache] = useState({});

  const loadDishes = useCallback(
    (selected) => {
      debouncedLoadDishes({
        selected,
        cache,
        setCache,
        setAllDishes,
        setLoading,
      });
    },
    [cache, setCache, setAllDishes, setLoading]
  );

  useEffect(() => {
    if (selected.length > 0) {
      // Filter dishes based on selected ingredients
      loadDishes(selected);
    } else setLoading(false);
  }, [loadDishes, selected]);

  useEffect(() => {
    // Apply pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedDishes = allDishes.slice(
      startIndex,
      startIndex + itemsPerPage
    );

    setDishes(paginatedDishes);
    setTotal(allDishes.length);
  }, [allDishes, currentPage]);

  const toggleIngredient = (ingredient) => {
    setSelected((prev) =>
      prev.includes(ingredient)
        ? prev.filter((ing) => ing !== ingredient)
        : [...prev, ingredient]
    );
  };

  return (
    <Box fill pad="medium" gap="medium">
      <Box>
        <Heading level={2} margin="none">
          Indian Dishes
        </Heading>
        <Text>Make Various Indian Dishes from the Selected Ingredients</Text>
      </Box>

      <Box
        gap="small"
        align="center"
        background="neutral-1"
        round="small"
        margin={{ top: "small", bottom: "medium" }}
      >
        <Text weight="bold" size="medium" alignSelf="start" pad="small">
          Select Ingredients
        </Text>
        <Box
          pad="medium"
          gap="medium"
          width="100%"
          height={"300px"}
          overflow={"auto"}
        >
          <Box direction="row" wrap gap="small">
            {ingredients.map((ingredient) => (
              <Button
                key={ingredient}
                onClick={() => toggleIngredient(ingredient)}
                plain
                style={{ padding: "6px" }}
              >
                <Box
                  pad={{ vertical: "xsmall", horizontal: "small" }}
                  background={
                    selected.includes(ingredient) ? "brand" : "light-3"
                  }
                  round="medium"
                  border={{
                    color: selected.includes(ingredient) ? "brand" : "border",
                  }}
                >
                  <Text
                    size="small"
                    color={selected.includes(ingredient) ? "white" : "dark-1"}
                  >
                    {ingredient}
                  </Text>
                </Box>
              </Button>
            ))}
          </Box>
        </Box>
        <Box
          direction="row"
          align="center"
          justify="between"
          pad="small"
          width={"100%"}
        >
          <Text weight="bold" size="medium" alignSelf="start" pad="small">
            Selected Ingredients
          </Text>
          <Button
            label="Clear"
            onClick={() => {
              setSelected([]);
              setAllDishes([]);
              if (loading) setLoading(false);
            }}
          />
        </Box>
        <Box
          pad="medium"
          gap="medium"
          width="100%"
          height={{ max: "200px" }}
          overflow={"auto"}
        >
          {selected.length > 0 && (
            <>
              <Box direction="row" wrap gap="small">
                {selected.map((ingredient) => (
                  <Box
                    key={ingredient}
                    direction="row"
                    align="center"
                    background="accent-1"
                    round="medium"
                    pad={"6px"}
                    margin={"6px"}
                  >
                    <Text size="small">{ingredient}</Text>
                    <Button
                      icon={<FormClose size="small" />}
                      onClick={() => toggleIngredient(ingredient)}
                      plain
                    />
                  </Box>
                ))}
              </Box>
            </>
          )}
        </Box>
      </Box>

      {/* Content */}
      <Box flex>
        {loading ? (
          <Box align="center" justify="center" pad="large">
            <Spinner size="medium" />
            <Text margin={{ top: "small" }}>Loading dishes...</Text>
          </Box>
        ) : dishes?.length > 0 ? (
          <>
            <Text
              weight="bold"
              size="medium"
              alignSelf="start"
              pad="medium"
              margin={{ bottom: "small", left: "16px" }}
            >
              Dishes
            </Text>
            <Grid columns={{ count: "fill", size: "medium" }} gap="medium">
              {dishes.map((dish) => (
                <Card key={dish.pk} hoverIndicator>
                  <CardBody pad="medium">
                    <Link href={`/dish/${dish.pk}`}>
                      <Button plain fill>
                        <Box gap="small">
                          <Text weight="bold" color="brand">
                            {dish.name}
                          </Text>
                          <Text size="small" color="neutral-3">
                            {dish.course} • {dish.region || "Various regions"}
                          </Text>
                          <Box direction="row" gap="small">
                            <Tag
                              value={dish.diet}
                              background={getDietColor(dish.diet)}
                              size="small"
                            />
                            {dish.flavor_profile && (
                              <Tag
                                value={dish.flavor_profile}
                                background={getFlavorColor(dish.flavor_profile)}
                                size="small"
                              />
                            )}
                          </Box>
                          <Box direction="row" gap="medium">
                            <Text size="small" color="neutral-3">
                              <Clock size="small" /> Prep:{" "}
                              {formatTime(dish.prep_time)}
                            </Text>
                            <Text size="small" color="neutral-3">
                              <Restaurant size="small" /> Cook:{" "}
                              {formatTime(dish.cook_time)}
                            </Text>
                          </Box>
                        </Box>
                      </Button>
                    </Link>
                  </CardBody>
                </Card>
              ))}
            </Grid>

            {total > itemsPerPage && (
              <Box align="center" margin={{ top: "medium" }}>
                <Pagination
                  numberItems={total}
                  page={currentPage}
                  step={itemsPerPage}
                  onChange={({ page }) => setCurrentPage(page)}
                />
              </Box>
            )}
          </>
        ) : (
          <Box align="center" justify="center" pad="large">
            <Text size="large" color="neutral-3">
              🍽️
            </Text>
            <Text margin={{ top: "small" }}>No dishes found</Text>
            <Text size="small" color="neutral-3">
              Try adjusting your filters
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default DishSuggester;
