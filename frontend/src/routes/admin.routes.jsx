import { AdminPage, LoginPage } from "../pages";
import ProtectedRoute from "../components/ProtectedRoute";

const adminRoutes = [
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
];

export default adminRoutes;
