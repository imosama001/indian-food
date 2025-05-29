import application from "./app.js";
const PORT = process.env.PORT || 8080;

application.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
