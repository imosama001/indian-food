import {
  getAllDishes,
  getDishByPk,
  getDishByName,
  getDishesByIngredients,
  addDish,
  updateDish,
  deleteDish,
  filterSimilarDishes,
  searchDishes,
} from "../services/dishService.js";

// GET all dishes or by name query
export function getDishByNameQueryController(req, res) {
  try {
    const { name } = req.query;
    if (name) {
      const dish = getDishByName(name);
      if (!dish) return res.status(404).json({ message: "Dish not found" });
      return res.json(dish);
    }
    res.json(getAllDishes());
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// GET dish by pk
export function getDishByPkController(req, res) {
  try {
    const pk = parseInt(req.params.pk, 10);
    if (isNaN(pk)) return res.status(400).json({ message: "Invalid pk" });
    const dish = getDishByPk(pk);
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
      return res.status(400).json({ message: "Ingredients must be an array" });
    }
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

// PUT update a dish by pk
export function updateDishController(req, res) {
  try {
    const pk = parseInt(req.params.pk, 10);
    if (isNaN(pk)) return res.status(400).json({ message: "Invalid pk" });
    const updated = updateDish(pk, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Dish not found" });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// DELETE a dish by pk
export function deleteDishController(req, res) {
  try {
    const pk = parseInt(req.params.pk, 10);
    if (isNaN(pk)) return res.status(400).json({ message: "Invalid pk" });
    const deleted = deleteDish(pk);
    if (!deleted) {
      return res.status(404).json({ message: "Dish not found" });
    }
    res.json({ message: "Dish deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export const getSimilarDishesController = async (req, res) => {
  try {
    const id = parseInt(req.params.pk);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid dish ID" });
    }

    const similarDishes = filterSimilarDishes(id);
    res.json({ results: similarDishes, count: similarDishes?.length });
  } catch (error) {
    console.error("Error fetching similar dishes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getDishBySearchController = async (req, res) => {
  try {
    const query = req.params.query.toLowerCase();

    const filteredDishes = await searchDishes(query);

    res.json({ results: filteredDishes, count: filteredDishes.length });
  } catch (error) {
    console.error("Error searching dishes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
