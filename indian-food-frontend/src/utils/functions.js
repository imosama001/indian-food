import _ from "lodash";

// Utility functions
export const formatTime = (minutes) => {
  if (!minutes || minutes === 0 || isNaN(minutes)) return "N/A";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} ${hours === 1 ? "hour" : "hours"}`;
  }

  return `${hours}h ${remainingMinutes}m`;
};

export const getDietColor = (diet) => {
  switch (diet?.toLowerCase()) {
    case "vegetarian":
      return "accent-1";
    case "non vegetarian":
      return "status-critical";
    default:
      return "neutral-3";
  }
};

export const getFlavorColor = (flavor) => {
  switch (flavor?.toLowerCase()) {
    case "sweet":
      return "accent-2";
    case "spicy":
      return "status-critical";
    case "bitter":
      return "neutral-3";
    default:
      return "neutral-3";
  }
};

export const getDietIcon = (diet) => {
  switch (diet?.toLowerCase()) {
    case "vegetarian":
      return "🌿";
    case "non vegetarian":
      return "🍖";
    default:
      return "";
  }
};

export const getFlavorIcon = (flavor) => {
  switch (flavor?.toLowerCase()) {
    case "sweet":
      return "🍯";
    case "spicy":
      return "🌶️";
    case "bitter":
      return "🌿";
    default:
      return "";
  }
};

export const parseIngredients = (ingredientsString) => {
  return _.map(ingredientsString.split(","), (ingredient) =>
    _.trim(ingredient)
  );
};

export const calculateMatchPercentage = (
  dishIngredients,
  selectedIngredients
) => {
  const dishIngredientsArray = _.map(
    parseIngredients(dishIngredients.toLowerCase()),
    (ingredient) => ingredient
  );
  const selectedIngredientsLower = _.map(selectedIngredients, (ingredient) =>
    ingredient.toLowerCase()
  );

  const matchingIngredients = _.filter(selectedIngredientsLower, (selected) =>
    _.some(dishIngredientsArray, (dish) => dish.includes(selected))
  );

  return Math.round(
    (matchingIngredients.length / selectedIngredients.length) * 100
  );
};

export const getMatchingIngredients = (
  dishIngredients,
  selectedIngredients
) => {
  const dishIngredientsArray = _.map(
    parseIngredients(dishIngredients.toLowerCase()),
    (ingredient) => ingredient
  );
  const selectedIngredientsLower = _.map(selectedIngredients, (ingredient) =>
    ingredient.toLowerCase()
  );

  return _.filter(selectedIngredientsLower, (selected) =>
    _.some(dishIngredientsArray, (dish) => dish.includes(selected))
  );
};
