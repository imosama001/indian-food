import express from "express";
import cors from "cors";
import dishRoutes from "./routes/dishes.js";
import "./data/indianFoodLoader.js";

const app = express();
// const allowedOrigins = ["http://localhost:3000", "http://localhost:3000/", "*"]; // Add all allowed origins here

app.use(
  //   cors({
  //     origin: function (origin, callback) {
  //       if (!origin || allowedOrigins.includes(origin)) {
  //         callback(null, true);
  //       } else {
  //         callback(new Error("Not allowed by CORS"));
  //       }
  //     },
  //     // origin: "http://localhost:3000",

  //     credentials: false,
  //   })
  cors()
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/dishes", dishRoutes);

export default app;
