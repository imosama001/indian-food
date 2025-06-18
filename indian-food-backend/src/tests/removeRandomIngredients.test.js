import { removeRandomIngredients } from "../middleware/dish";

describe("removeRandomIngredient Middleware", () => {
  let req, res, next;
  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  test("returns 400 if ingredients is not an array", () => {
    req.body.ingredients = "not-an-array";
    removeRandomIngredients(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Ingredients must be an array",
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("passes through if ingredients is an empty array", () => {
    req.body.ingredients = [];

    removeRandomIngredients(req, res, next);

    expect(req.body.removedIngredients).toEqual([]);
    expect(next).toHaveBeenCalled();
  });

  test("removes one random ingredient from array", () => {
    req.body.ingredients = ["salt", "pepper", "cumin"];

    const originalLength = req.body.ingredients.length;

    removeRandomIngredients(req, res, next);
    expect(req.body.ingredients.length).toBe(originalLength - 1);
    expect(next).toHaveBeenCalled();
  });

  test("handles array with one item", () => {
    req.body.ingredients = ["turmeric"];

    removeRandomIngredients(req, res, next);

    expect(req.body.ingredients).toEqual([]);
    expect(req.body.removedIngredients).toEqual(["turmeric"]);

    expect(req.body.ingredients.length).toBe(0);
    expect(next).toHaveBeenCalled();
  });
});
