import { HomePage, AllPhotosPage } from "../pages";

const mainRoutes = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/gallery",
    element: <AllPhotosPage />,
  },
];

export default mainRoutes;
