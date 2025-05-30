import fs from "fs";
import path from "path";

import { getIndianFoodData } from "../data/indianFoodLoader.js";

const csvPath = path.resolve("src/data/indian_food.csv");
let dishes = getIndianFoodData();

function saveToCSV() {
  const headers = Object.keys(dishes[0]).join(",");
  const rows = dishes.map((dish) =>
    Object.values(dish)
      .map((val) => `"${String(val).replace(/"/g, '""')}"`)
      .join(",")
  );
  fs.writeFileSync(csvPath, [headers, ...rows].join("\n"));
}

// CREATE
export function addDish(newDish) {
  const dish = {
    ...newDish,
    pk: dishes.length ? Math.max(...dishes.map((d) => d.pk || 0)) + 1 : 1,
  };
  dishes.push(dish);
  saveToCSV();
  return dish;
}

// READ
export function getAllDishes() {
  return { results: dishes, count: dishes.length };
}

export function getDishByPk(pk) {
  return dishes.find((dish) => Number(dish.pk) === Number(pk));
}

export function getDishByName(name) {
  return dishes.find(
    (dish) => dish.name && dish.name.toLowerCase() === name.toLowerCase()
  );
}

// Example: get dishes by ingredients
export function getDishesByIngredients(ingredientsPayload) {
  const arr = dishes.filter((dish) => {
    const dishIngredients = dish.ingredients
      ? dish.ingredients.split(",").map((ing) => ing.trim().toLowerCase())
      : [];

    return dishIngredients.every((ing) =>
      ingredientsPayload.map((i) => i.toLowerCase()).includes(ing)
    );
  });
  return { results: arr, count: arr.length };
}

export function filterSimilarDishes(dishId) {
  const targetDish = getDishByPk(dishId);
  if (!targetDish) return [];

  return dishes
    .filter(
      (dish) =>
        dish.pk !== dishId &&
        (dish.course === targetDish.course ||
          dish.diet === targetDish.diet ||
          dish.flavor_profile === targetDish.flavor_profile ||
          dish.region === targetDish.region)
    )
    .slice(0, 3); // Limit to 3 similar dishes
}
export async function searchDishes(query) {
  const searchLower = query.toLowerCase();
  return dishes
    .filter(
      (dish) =>
        dish.name?.toLowerCase().includes(searchLower) ||
        dish.ingredients?.toLowerCase().includes(searchLower) ||
        dish.state?.toLowerCase().includes(searchLower) ||
        dish.region?.toLowerCase().includes(searchLower)
    )
    .slice(0, 10); // Limit to 10 suggestions
}

// UPDATE
export function updateDish(pk, updatedFields) {
  const dish = getDishByPk(pk);
  if (!dish) return null;
  Object.assign(dish, updatedFields);
  saveToCSV();
  return dish;
}

// DELETE
export function deleteDish(pk) {
  const index = dishes.findIndex((dish) => Number(dish.pk) === Number(pk));
  if (index === -1) return false;
  dishes.splice(index, 1);
  saveToCSV();
  return true;
}
