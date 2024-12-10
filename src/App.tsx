// App.tsx
import { StrictMode } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProtectedRoute from "./components/Icon/ProtectedRoute";
import Login from "./pages/Authentication/Login";
import AcademicRoute from "./Academics/AcademicRoute";
import { PermissionProvider } from "./context/permissionContext";
import InstituteRoute from "./Institute/InstituteRoute";
import NotFound from "./pages/error/NotFound";
import StudentRoute from "./Modules/Student/StudentRoute";

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
              </Route>
              <Route path="academics/*" element={<AcademicRoute />} />
              <Route path="institute/*" element={<InstituteRoute />} />
              <Route path="students/*" element={<StudentRoute />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PermissionProvider>
      </BrowserRouter>
    </StrictMode>
  );
};

export default App;
