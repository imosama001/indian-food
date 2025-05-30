import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Heading,
  Select,
  Button,
  DataTable,
  Text,
  Pagination,
  Tag,
  Spinner,
} from "grommet";
import { Clear, Up, Down } from "grommet-icons";
import { Link } from "wouter";
import _ from "lodash";
import { dishesApi } from "../utils/api";
import { formatTime, getDietColor, getFlavorColor } from "../utils/functions";

const itemsPerPage = 20;

function HomePage() {
  const [dishes, setDishes] = useState([]);
  const [allDishes, setAllDishes] = useState([]); // Store all dishes fetched from the backend
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    diet: "",
    course: "",
    region: "",
    flavor_profile: "",
  });
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const loadDishes = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await dishesApi.getAll(); // Fetch all dishes at once
      setAllDishes(resp?.results || []);
    } catch (error) {
      setAllDishes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDishes();
  }, [loadDishes]);

  useEffect(() => {
    // Apply filters
    let filteredDishes = allDishes.filter((dish) => {
      return (
        (!filters.diet ||
          dish.diet?.toLowerCase() === filters.diet.toLowerCase()) &&
        (!filters.course ||
          dish.course?.toLowerCase() === filters.course.toLowerCase()) &&
        (!filters.region ||
          dish.region?.toLowerCase() === filters.region.toLowerCase()) &&
        (!filters.flavor_profile ||
          dish.flavor_profile?.toLowerCase() ===
            filters.flavor_profile.toLowerCase())
      );
    });

    // Apply sorting
    filteredDishes = _.orderBy(filteredDishes, [sortField], [sortOrder]);

    // Apply pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedDishes = filteredDishes.slice(
      startIndex,
      startIndex + itemsPerPage
    );

    setDishes(paginatedDishes);
    setTotal(filteredDishes.length);
  }, [allDishes, filters, sortField, sortOrder, currentPage]);

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value === "all" ? "" : value }));
    setCurrentPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      diet: "",
      course: "",
      region: "",
      flavor_profile: "",
    });
    setCurrentPage(1);
  }, []);

  const handleSort = useCallback(
    (field) => {
      if (sortField === field) {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      } else {
        setSortField(field);
        setSortOrder("asc");
      }
      setCurrentPage(1);
    },
    [sortField, sortOrder]
  );

  const getSortIcon = useCallback(
    (field) => {
      if (sortField === field) {
        return sortOrder === "asc" ? <Up /> : <Down />;
      }
      return null;
    },
    [sortField, sortOrder]
  );

  const columns = useMemo(
    () => [
      {
        property: "name",
        header: (
          <Button
            plain
            onClick={() => handleSort("name")}
            icon={getSortIcon("name")}
            reverse
            label="Dish Name"
          />
        ),
        render: (dish) => (
          <Link href={`/dish/${dish.pk}`}>
            <Button plain color="brand" label={dish.name} />
          </Link>
        ),
      },
      {
        property: "diet",
        header: "Diet",
        render: (dish) => (
          <Tag value={dish.diet} background={getDietColor(dish.diet)} />
        ),
      },
      {
        property: "prep_time",
        header: (
          <Button
            plain
            onClick={() => handleSort("prep_time")}
            icon={getSortIcon("prep_time")}
            reverse
            label="Prep Time"
          />
        ),
        render: (dish) => formatTime(dish.prep_time),
      },
      {
        property: "cook_time",
        header: (
          <Button
            plain
            onClick={() => handleSort("cook_time")}
            icon={getSortIcon("cook_time")}
            reverse
            label="Cook Time"
          />
        ),
        render: (dish) => formatTime(dish.cook_time),
      },
      {
        property: "course",
        header: "Course",
        render: (dish) => _.capitalize(dish.course),
      },
      {
        property: "region",
        header: "Region",
        render: (dish) => dish.region || "Various",
      },
      {
        property: "flavor_profile",
        header: "Flavor",
        render: (dish) =>
          dish.flavor_profile ? (
            <Tag
              value={dish.flavor_profile}
              background={getFlavorColor(dish.flavor_profile)}
            />
          ) : (
            <Text size="small" color="neutral-3">
              N/A
            </Text>
          ),
      },
    ],
    [getSortIcon, handleSort]
  );

  const hasActiveFilters = _.some(filters, (value) => value && value !== "");

  return (
    <Box fill pad="medium" gap="medium">
      <Box>
        <Heading level={2} margin="none">
          Indian Dishes
        </Heading>
        <Text>
          Explore {total} authentic Indian dishes from various regions
        </Text>
      </Box>

      {/* Filters */}
      <Box
        direction="row-responsive"
        gap="small"
        align="center"
        pad="medium"
        background="neutral-1"
        round="small"
        wrap
      >
        <Box width="small">
          <Text size="small" weight="bold">
            Diet:
          </Text>
          <Select
            options={["all", "vegetarian", "non vegetarian"]}
            value={filters.diet || "all"}
            onChange={({ option }) => handleFilterChange("diet", option)}
            labelKey={(option) =>
              option === "all" ? "All" : _.startCase(option)
            }
          />
        </Box>

        <Box width="small">
          <Text size="small" weight="bold">
            Course:
          </Text>
          <Select
            options={["all", "main course", "dessert", "snack", "starter"]}
            value={filters.course || "all"}
            onChange={({ option }) => handleFilterChange("course", option)}
            labelKey={(option) =>
              option === "all" ? "All" : _.startCase(option)
            }
          />
        </Box>

        <Box width="small">
          <Text size="small" weight="bold">
            Region:
          </Text>
          <Select
            options={[
              "all",
              "North",
              "South",
              "East",
              "West",
              "Central",
              "North East",
            ]}
            value={filters.region || "all"}
            onChange={({ option }) => handleFilterChange("region", option)}
            labelKey={(option) => (option === "all" ? "All" : option)}
          />
        </Box>

        <Box width="small">
          <Text size="small" weight="bold">
            Flavor:
          </Text>
          <Select
            options={["all", "sweet", "spicy", "bitter"]}
            value={filters.flavor_profile || "all"}
            onChange={({ option }) =>
              handleFilterChange("flavor_profile", option)
            }
            labelKey={(option) =>
              option === "all" ? "All" : _.startCase(option)
            }
          />
        </Box>

        {hasActiveFilters && (
          <Button
            margin={{ top: "16px" }}
            icon={<Clear />}
            label="Clear Filters"
            onClick={clearFilters}
            secondary
          />
        )}
      </Box>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <Box direction="row" gap="small" wrap>
          {_.map(filters, (value, key) => {
            if (value && value !== "") {
              return (
                <Tag
                  key={key}
                  value={`${_.startCase(key)}: ${_.startCase(value)}`}
                  onRemove={() => handleFilterChange(key, "")}
                />
              );
            }
            return null;
          })}
        </Box>
      )}

      {/* Content */}
      <Box flex>
        {loading ? (
          <Box align="center" justify="center" pad="large">
            <Spinner size="medium" />
            <Text margin={{ top: "small" }}>Loading dishes...</Text>
          </Box>
        ) : dishes?.length > 0 ? (
          <>
            <DataTable
              columns={columns}
              data={dishes}
              border={{ color: "neutral-2", side: "all" }}
              background={{
                header: "neutral-1",
                body: ["white", "neutral-1"],
              }}
            />

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

export default HomePage;
