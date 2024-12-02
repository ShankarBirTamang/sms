import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProtectedRoute from "./components/Icon/ProtectedRoute";
import Login from "./pages/Authentication/Login";
import AcademicRoute from "./Academics/AcademicRoute";
import { PermissionProvider } from "./context/permissionContext";
import Address from "./pages/Address/Address";

const App: React.FC = () => {
  return (
    <StrictMode>
      <BrowserRouter>
        <PermissionProvider>
          <Routes>
            {/* Login route */}
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                {/* Include academic routes */}
                <Route path="general/address" element={<Address />} />
              </Route>
              <Route path="academics/*" element={<AcademicRoute />} />
            </Route>
          </Routes>
        </PermissionProvider>
      </BrowserRouter>
    </StrictMode>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
