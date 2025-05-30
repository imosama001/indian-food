import { Grommet, Main, Box } from "grommet";
import { Switch, Route } from "wouter";
import HomePage from "./pages/HomePage";
import DishDetailsPage from "./pages/DishDetailsPage";
import NotFoundPage from "./pages/NotFoundPage";
import SearchHeader from "./components/SearchHeader";
import { theme } from "./theme";

function Router() {
  return (
    <Main background="neutral-1" fill>
      <SearchHeader />
      <Box flex height={{max:"calc(100vh - 64px)"}} overflow="auto">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/dish/:id" component={DishDetailsPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </Box>
    </Main>
  );
}

function App() {
  return (
    <Grommet theme={theme} full>
      <Router />
    </Grommet>
  );
}

export default App;
