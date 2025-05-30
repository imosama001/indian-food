import { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Tag,
  Button,
  Grid,
  Card,
  CardBody,
  Spinner,
} from "grommet";
import { Previous, Clock, Restaurant } from "grommet-icons";
import { useRoute, Link } from "wouter";
import _ from "lodash";
import { dishesApi } from "../utils/api";
import {
  formatTime,
  getDietColor,
  getFlavorColor,
  getDietIcon,
  getFlavorIcon,
  parseIngredients,
} from "../utils/functions";

function DishDetailsPage() {
  const [temp, params] = useRoute("/dish/:id");
  const [dish, setDish] = useState(null);
  const [similarDishes, setSimilarDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dishId = params?.id ? parseInt(params.id) : null;

  useEffect(() => {
    const loadDish = async () => {
      if (!dishId) return;

      setLoading(true);
      setError(null);

      try {
        const [dishData, similarData] = await Promise.all([
          dishesApi.getById(dishId),
          dishesApi.getSimilar(dishId),
        ]);

        setDish(dishData);
        setSimilarDishes(similarData);
      } catch (error) {
        console.error("Error loading dish:", error);
        setError("Dish not found");
      } finally {
        setLoading(false);
      }
    };

    loadDish();
  }, [dishId]);

  if (!dishId) {
    return (
      <Box fill pad="medium" align="center" justify="center">
        <Text size="large" color="status-critical">
          Invalid dish ID
        </Text>
        <Link href="/">
          <Button
            label="Back to All Dishes"
            primary
            margin={{ top: "medium" }}
          />
        </Link>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box fill pad="medium" align="center" justify="center">
        <Spinner size="medium" />
        <Text margin={{ top: "small" }}>Loading dish details...</Text>
      </Box>
    );
  }

  if (error || !dish) {
    return (
      <Box fill pad="medium" align="center" justify="center">
        <Text size="large" color="status-critical">
          Dish not found
        </Text>
        <Text color="neutral-3">
          The dish you're looking for could not be found.
        </Text>
        <Link href="/">
          <Button
            label="Back to All Dishes"
            primary
            margin={{ top: "medium" }}
          />
        </Link>
      </Box>
    );
  }

  const totalTime = (+dish.prep_time || 0) + (+dish.cook_time || 0);
  const ingredients = parseIngredients(dish.ingredients);

  return (
    <Box fill pad="medium" gap="medium">
      {/* Back Navigation */}
      <Box>
        <Link href="/">
          <Button icon={<Previous />} label="Back to All Dishes" plain />
        </Link>
      </Box>

      {/* Main Content */}
      <Box gap="large">
        <Grid columns={{ count: "fit", size: "medium" }} gap="large">
          {/* Left Column - Basic Info */}
          <Box gap="medium">
            <Box>
              <Heading level={1} margin="none">
                {dish.name}
              </Heading>
            </Box>

            <Box gap="small">
              <Box direction="row" align="center" gap="small">
                <Text weight="bold" size="small">
                  Diet Type:
                </Text>
                <Tag
                  value={`${getDietIcon(dish.diet)} ${dish.diet}`}
                  background={getDietColor(dish.diet)}
                />
              </Box>

              <Box direction="row" align="center" gap="small">
                <Text weight="bold" size="small">
                  Course:
                </Text>
                <Text>{_.capitalize(dish.course)}</Text>
              </Box>

              {dish.flavor_profile && (
                <Box direction="row" align="center" gap="small">
                  <Text weight="bold" size="small">
                    Flavor:
                  </Text>
                  <Tag
                    value={`${getFlavorIcon(dish.flavor_profile)} ${
                      dish.flavor_profile
                    }`}
                    background={getFlavorColor(dish.flavor_profile)}
                  />
                </Box>
              )}

              <Box direction="row" align="center" gap="small">
                <Text weight="bold" size="small">
                  Origin:
                </Text>
                <Text>
                  {dish.state && dish.region
                    ? `${dish.state}, ${dish.region} India`
                    : dish.region
                    ? `${dish.region} India`
                    : "Various regions"}
                </Text>
              </Box>
            </Box>
          </Box>

          {/* Right Column - Timing Info */}
          <Box gap="medium">
            <Box>
              <Text weight="bold" margin={{ bottom: "small" }}>
                <Restaurant /> Cooking Information
              </Text>
            </Box>

            <Grid columns="2" gap="small">
              <Card background="neutral-1">
                <CardBody align="center" pad="medium">
                  <Box align="center" gap="small">
                    <Clock color="brand" size="medium" />
                    <Text size="large" weight="bold" color="brand">
                      {formatTime(dish.prep_time)}
                    </Text>
                    <Text size="small">Prep Time</Text>
                  </Box>
                </CardBody>
              </Card>

              <Card background="neutral-1">
                <CardBody align="center" pad="medium">
                  <Box align="center" gap="small">
                    <Restaurant color="brand" size="medium" />
                    <Text size="large" weight="bold" color="brand">
                      {formatTime(dish.cook_time)}
                    </Text>
                    <Text size="small">Cook Time</Text>
                  </Box>
                </CardBody>
              </Card>
            </Grid>

            <Card background="accent-2">
              <CardBody align="center" pad="medium">
                <Box align="center" gap="small">
                  <Text size="large" weight="bold" color="white">
                    {formatTime(totalTime)}
                  </Text>
                  <Text size="small" color="white">
                    Total Time
                  </Text>
                </Box>
              </CardBody>
            </Card>
          </Box>
        </Grid>

        {/* Ingredients Section */}
        <Box gap="small">
          <Heading level={3} margin="none">
            Ingredients
          </Heading>
          <Card background="neutral-1">
            <CardBody pad="medium">
              <Box direction="row" wrap gap="small">
                {ingredients.map((ingredient, index) => (
                  <Tag
                    key={index}
                    value={ingredient}
                    background="white"
                    border={{ color: "neutral-2" }}
                  />
                ))}
              </Box>
            </CardBody>
          </Card>
        </Box>

        {/* Similar Dishes */}
        <Box gap="small">
          <Heading level={3} margin="none">
            Similar Dishes
          </Heading>

          {similarDishes.length > 0 ? (
            <Grid columns={{ count: "fill", size: "medium" }} gap="medium">
              {similarDishes.map((similarDish) => (
                <Card key={similarDish.id} hoverIndicator>
                  <CardBody pad="medium">
                    <Link href={`/dish/${similarDish.id}`}>
                      <Button plain fill>
                        <Box gap="small">
                          <Text weight="bold" color="brand">
                            {similarDish.name}
                          </Text>
                          <Text size="small" color="neutral-3">
                            {similarDish.course} •{" "}
                            {similarDish.region || "Various regions"}
                          </Text>
                          <Box direction="row" gap="small">
                            <Tag
                              value={similarDish.diet}
                              background={getDietColor(similarDish.diet)}
                              size="small"
                            />
                            {similarDish.flavor_profile && (
                              <Tag
                                value={similarDish.flavor_profile}
                                background={getFlavorColor(
                                  similarDish.flavor_profile
                                )}
                                size="small"
                              />
                            )}
                          </Box>
                          <Box direction="row" gap="medium">
                            <Text size="small" color="neutral-3">
                              <Clock size="small" /> Prep:{" "}
                              {formatTime(similarDish.prep_time)}
                            </Text>
                            <Text size="small" color="neutral-3">
                              <Restaurant size="small" /> Cook:{" "}
                              {formatTime(similarDish.cook_time)}
                            </Text>
                          </Box>
                        </Box>
                      </Button>
                    </Link>
                  </CardBody>
                </Card>
              ))}
            </Grid>
          ) : (
            <Box align="center" pad="large">
              <Text size="large">🍽️</Text>
              <Text color="neutral-3">No similar dishes found.</Text>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default DishDetailsPage;
