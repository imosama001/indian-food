import {
  getAllDishes,
  getDishByName,
  getDishesByIngredients,
  addDish,
  updateDish,
  deleteDish,
} from "../services/dishService.js";

export function getAllDishesController(_req, res) {
  try {
    res.json(getAllDishes());
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export function getDishByNameController(req, res) {
  try {
    const dish = getDishByName(req.params.name);
    if (!dish) return res.status(404).json({ message: "Dish not found" });
    res.json(dish);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export function suggestDishesController(req, res) {
  try {
    const { ingredients } = req.body || {};
    if (!Array.isArray(ingredients)) {
      console.error("Invalid ingredients format:", ingredients);
      return res.status(400).json({ message: "Ingredients must be an array" });
    }
    console.log("Suggesting dishes for ingredients:", ingredients);
    const matches = getDishesByIngredients(ingredients || []);
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export function addDishController(req, res) {
  try {
    const newDish = req.body;
    if (!newDish || !newDish.name) {
      return res
        .status(400)
        .json({ message: "Dish data with 'name' is required" });
    }
    const existing = getDishByName(newDish.name);
    if (existing) {
      return res.status(409).json({ message: "Dish already exists" });
    }
    const created = addDish(newDish);
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export function updateDishController(req, res) {
  try {
    const updated = updateDish(req.params.name, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Dish not found" });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export function deleteDishController(req, res) {
  try {
    const deleted = deleteDish(req.params.name);
    if (!deleted) {
      return res.status(404).json({ message: "Dish not found" });
    }
    res.json({ message: "Dish deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
