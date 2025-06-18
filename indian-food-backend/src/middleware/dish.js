export function removeRandomIngredients(req, res, next) {
  const { ingredients } = req.body || {};

  if (!Array.isArray(ingredients)) {
    return res.status(400).json({ message: "Ingredients must be an array" });
  }

  if (ingredients.length === 0) {
    req.body.removedIngredients = [];
    return next();
  }

  // Remove one random item
  const randomIndex = Math.floor(Math.random() * ingredients.length);
  const removed = ingredients.splice(randomIndex, 1);

  req.body.removedIngredients = removed;
  return next();
}
