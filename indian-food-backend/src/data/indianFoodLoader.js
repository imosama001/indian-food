import fs from "fs";
import csv from "csv-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvPath = path.join(__dirname, "indian_food.csv");

let indianFoodData = [];

function loadIndianFood() {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on("data", (data) => results.push({ ...data, pk: results.length + 1 }))
      .on("end", () => {
        indianFoodData = results;
        resolve(results);
      })
      .on("error", (err) => {
        console.error("[indianFoodLoader] CSV load error:", err);
        reject(err);
      });
  });
}

// Initial load
await loadIndianFood();

// Watch for changes and reload
fs.watchFile(csvPath, { interval: 1000 }, async (curr, prev) => {
  if (curr.mtime !== prev.mtime) {
    console.log("[indianFoodLoader] CSV file changed, reloading...");
    await loadIndianFood();
  }
});

export function getIndianFoodData() {
  return indianFoodData;
}
