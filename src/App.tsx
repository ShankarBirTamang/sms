// App.tsx
import { StrictMode } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProtectedRoute from "./components/Icon/ProtectedRoute";
import Login from "./pages/Authentication/Login";
import AcademicRoute from "./Academics/AcademicRoute";
import { PermissionProvider } from "./context/permissionContext";
import NotFound from "./pages/error/NotFound";
import StudentRoute from "./Modules/Student/StudentRoute";
import InstituteRoute from "./General/Institute/InstituteRoute";
import Address from "./General/pages/Address/Address";
import Vehicles from "./Transportation/pages/Vehicles";
import TransportRoutes from "./Transportation/pages/TransportRoutes";
import EmployeeRoute from "./Modules/Employee/EmployeeRoute";

const App = () => {
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
                <Route
                  path="/transportation/vehicles/*"
                  element={<Vehicles />}
                />
                <Route path="transportRoutes/*" element={<TransportRoutes />} />
                <Route path="address/*" element={<Address />} />
              </Route>
              <Route path="academics/*" element={<AcademicRoute />} />
              <Route path="institute/*" element={<InstituteRoute />} />
              <Route path="students/*" element={<StudentRoute />} />
              <Route path="employees/*" element={<EmployeeRoute />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PermissionProvider>
      </BrowserRouter>
    </StrictMode>
  );
};

export default App;
