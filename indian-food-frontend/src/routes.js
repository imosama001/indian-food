import { lazy } from "react";

const HomePage = lazy(() => import("./pages/HomePage"));
const DishDetailsPage = lazy(() => import("./pages/DishDetailsPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const DishSuggesterPage = lazy(() => import("./pages/DishSuggester"));

/**
 * Routes for the application
 * @type {Array<{ path: string, component: React.ComponentType }>}
 * @property {string} path - The path for the route
 * @property {React.ComponentType} component - The component to render for the route
 */

export const routes = [
  {
    path: "/",
    component: HomePage,
  },
  { path: "/dish-suggestions", component: DishSuggesterPage },
  {
    path: "/dish/:id",
    component: DishDetailsPage,
  },
  {
    path: "*",
    component: NotFoundPage,
  },
];
