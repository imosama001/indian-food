# Indian Food Backend

A Node.js Express backend for Indian food data, supporting CRUD operations, ingredient-based dish suggestions, and CSV/JSON data management.

## Features

- RESTful API for Indian dishes
- Suggest dishes by ingredients
- CRUD operations (Create, Read, Update, Delete)
- Data loaded from CSV and auto-reloaded on file changes
- Data persistence to CSV
- Modular MVC architecture

## Project Structure

```
indian-food-backend/
  src/
    app.js              # Express app setup
    server.js           # Server entry point
    controllers/
      dishController.js # Route handlers (controllers)
    data/
      indian_food.csv   # Main data source (CSV)
      indianFoodLoader.js # Loads and watches CSV data
    routes/
      dishes.js         # Express routes for dishes
    services/
      dishService.js    # Business/data logic (services)
    utils/
      csvToJson.js      # Utility to convert CSV to JSON
  package.json
  README.md
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Installation

1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd indian-food-backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

### Running the Server

Start the backend server:

```sh
npm start
```

The server will run on [http://localhost:8000](http://localhost:8000) by default.

### API Endpoints

- `GET    /dishes` — Get all dishes
- `GET    /dishes/:pk` — Get dish by id
- `GET    /dishes/search/:query` get dish by search
- ` GET   /dishes/:pk/similar` get similar dishes
- `POST   /dishes/suggest` — Suggest dishes by ingredients (body: `{ ingredients: ["ing1", ...] }`)
- `POST   /dishes` — Add a new dish (body: dish object)
- `PUT    /dishes/:pk` — Update a dish by id (body: updated fields)
- `DELETE /dishes/:pk` — Delete a dish by id

### Data Management

- The app loads data from `src/data/indian_food.csv` at startup and watches for changes.
- CRUD operations update the CSV file for persistence.
- Use `npm run convert` to convert the CSV to JSON (`src/data/indian_food.json`).

### Scripts

- `npm start` — Start the server with nodemon
- `npm run convert` — Convert CSV to JSON

## License

ISC

---

_For the frontend, see the `indian-food-frontend` folder._
