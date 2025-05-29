import { Router } from "express";
import {
  getAllDishesController,
  getDishByNameController,
  suggestDishesController,
  addDishController,
  updateDishController,
  deleteDishController,
} from "../controllers/dishController.js";

const router = Router();

// GET all dishes
router.get("/", getAllDishesController);

// GET dish by name
router.get("/:name", getDishByNameController);

// POST suggest dishes by ingredients
router.post("/suggest", suggestDishesController);

// POST create a new dish
router.post("/", addDishController);

// PUT update a dish by name
router.put("/:name", updateDishController);

// DELETE a dish by name
router.delete("/:name", deleteDishController);

export default router