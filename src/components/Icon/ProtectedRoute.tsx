import { Navigate, Outlet } from "react-router-dom";

// interface ProtectedRouteProps {
//   children: React.ReactNode;
// }

const ProtectectedRoute = () => {
  const isAuthenticated = Boolean(localStorage.getItem("authToken"));

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }
  return <Outlet />;
};

export default ProtectectedRoute;
