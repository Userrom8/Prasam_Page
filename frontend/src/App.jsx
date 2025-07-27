import { useEffect, useContext, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import ThemeContext from "./services/theme";
import allRoutes from "./routes";
import { AuthProvider } from "./services/AuthProvider";

import "./App.css";

const App = () => {
  const { dark } = useContext(ThemeContext);

  useEffect(() => {
    const root = window.document.documentElement;
    if (dark) root.style.colorScheme = "dark";
    else root.style.colorScheme = "light";
  }, [dark]);

  return (
    <AuthProvider>
      <main>
        <div className="main"></div>
        <Suspense>
          <Routes>
            {allRoutes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </Routes>
        </Suspense>
      </main>
    </AuthProvider>
  );
};

export default App;
