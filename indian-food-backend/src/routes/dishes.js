import { Router } from "express";
import {
  getDishByPkController,
  getDishByNameQueryController,
  suggestDishesController,
  addDishController,
  updateDishController,
  deleteDishController,
  getSimilarDishesController,
  getDishBySearchController,
} from "../controllers/dishController.js";

const router = Router();

// GET all dishes or by name query
router.get("/", getDishByNameQueryController);

// GET dish by pk
router.get("/:pk/", getDishByPkController);

// Get Dish by search query
router.get("/search/:query",getDishBySearchController);

// // GET similar dishes by dish pk
router.get("/:pk/similar", getSimilarDishesController);

// POST suggest dishes by ingredients
router.post("/suggest", suggestDishesController);

// POST create a new dish
router.post("/", addDishController);

// PUT update a dish by pk
router.put("/:pk", updateDishController);

// DELETE a dish by pk
router.delete("/:pk", deleteDishController);

export default router;
