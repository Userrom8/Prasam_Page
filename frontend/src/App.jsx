import { useEffect, useContext } from "react";
import { Routes, Route } from "react-router-dom";

import AutoPlaySound from "./components/AutoPlaySound";
import ThemeContext from "./services/theme";
import allRoutes from "./routes"; // Import the combined route config

import "./App.css";

const App = () => {
  const { dark } = useContext(ThemeContext);

  useEffect(() => {
    const root = window.document.documentElement;
    if (dark) root.style.colorScheme = "dark";
    else root.style.colorScheme = "light";
  }, [dark]);

  return (
    <main>
      <AutoPlaySound />
      <div className="main"></div>
      <div className="app">
        <Routes>
          {allRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>
      </div>
    </main>
  );
};

export default App;
