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
  const dish = { ...newDish, pk: dishes.length + 1 };
  dishes.push(dish);
  saveToCSV();
  return dish;
}

// READ
export function getAllDishes() {
  return dishes;
}

export function getDishByName(name) {
  return dishes.find((dish) => dish.name.toLowerCase() === name.toLowerCase());
}

// Example: get dishes by ingredients
export function getDishesByIngredients(ingredientsPayload) {
  return dishes.filter((dish) => {
    const dishIngredients = dish.ingredients
      ? dish.ingredients.split(",").map((ing) => ing.trim().toLowerCase())
      : [];

    return dishIngredients.every((ing) =>
      ingredientsPayload.map((i) => i.toLowerCase()).includes(ing)
    );
  });
}

// UPDATE
export function updateDish(name, updatedFields) {
  const dish = getDishByName(name);
  if (!dish) return null;
  Object.assign(dish, updatedFields);
  saveToCSV();
  return dish;
}

// DELETE
export function deleteDish(name) {
  const index = dishes.findIndex(
    (dish) => dish.name.toLowerCase() === name.toLowerCase()
  );
  if (index === -1) return false;
  dishes.splice(index, 1);
  saveToCSV();
  return true;
}
