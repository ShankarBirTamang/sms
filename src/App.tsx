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
import DesignServicesRoute from "./DesignServices/DesignServicesRoute";
import Vehicles from "./Transportation/pages/Vehicles";
import TransportRoutes from "./Transportation/pages/TransportRoutes";
import EmployeeRoute from "./Modules/Employee/EmployeeRoute";
import ExamRoute from "./Modules/Examination/examRoute";
import AccountRoute from "./Modules/Accounts/AccountRoutes";
import Address from "./General/pages/Address/Address";
import ImportRoute from "./Modules/Import/ImportRoute";
import ExportRoute from "./Modules/Export/ExportRoute";
import { RoleProvider } from "./context/roleContext";

const App = () => {
  return (
    <StrictMode>
      <BrowserRouter>
        <RoleProvider>
          <PermissionProvider>
            <Routes>
              {/* Login route */}
              <Route path="/login" element={<Login />} />
              <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                  <Route path="/" element={<Dashboard />} />

                  {/* Include transportation routes */}
                  <Route
                    path="/transportation/vehicles/*"
                    element={<Vehicles />}
                  />
                  <Route
                    path="/transportation/routes/*"
                    element={<TransportRoutes />}
                  />

                  <Route path="address/*" element={<Address />} />
                </Route>
                <Route path="academics/*" element={<AcademicRoute />} />
                <Route path="examination/*" element={<ExamRoute />} />
                <Route
                  path="design-services/*"
                  element={<DesignServicesRoute />}
                />
                <Route path="institute/*" element={<InstituteRoute />} />
                <Route path="students/*" element={<StudentRoute />} />
                <Route path="employees/*" element={<EmployeeRoute />} />
                <Route path="accounts/*" element={<AccountRoute />} />
                <Route path="imports/*" element={<ImportRoute />} />
                <Route path="exports/*" element={<ExportRoute />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PermissionProvider>
        </RoleProvider>
      </BrowserRouter>
    </StrictMode>
  );
};

export default App;
