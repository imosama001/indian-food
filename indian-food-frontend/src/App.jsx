import { Grommet, Main, Box } from "grommet";
import { Switch, Route } from "wouter";
import { Suspense } from "react";
import SearchHeader from "./components/SearchHeader";
import { theme } from "./theme";
import { routes } from "./routes";

function Router() {
  return (
    <Main background="neutral-1" fill>
      <SearchHeader />
      <Box flex height={{ max: "calc(100vh - 64px)" }} overflow="auto">
        <Suspense fallback={<div></div>}>
          <Switch>
            {routes.map(({ path, component: Component }) => (
              <Route key={path} path={path} component={Component} />
            ))}
          </Switch>
        </Suspense>
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
