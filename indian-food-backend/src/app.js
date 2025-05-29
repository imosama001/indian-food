import express from "express";
import cors from "cors"; 
import dishRoutes from "./routes/dishes.js";
import "./data/indianFoodLoader.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/dishes", dishRoutes);

export default app;
