import application from "./app.js";
const PORT = process.env.PORT || 8000;

application.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
