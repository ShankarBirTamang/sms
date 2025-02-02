import React from "react";
import { Route, Routes } from "react-router-dom";
import Employee from "./pages/Employee";
import Layout from "../../layout/Layout";
import ProtectectedRoute from "../../components/Icon/ProtectedRoute";
import CreateEmployee from "./pages/CreateEmployee";
import Overview from "./pages/ShowEmployee/Overview";
import ShowEmployeeLayout from "./pages/ShowEmployee/ShowEmployeeLayout";
import EditEmployee from "./pages/EditEmployee";

const routes = [
  {
    path: "/",
    title: "Employees",
    element: <Employee />,
  },
  {
    path: "/create",
    title: "Add Employee",
    element: <CreateEmployee />,
  },
  {
    path: "/:employeeId/edit",
    title: "Edit Employee",
    element: <EditEmployee />,
  },
];

const employeeDetailsRoutes = [
  {
    path: "/details/:employeeId/overview",
    title: "Employee Overview",
    element: <Overview />,
  },
];
const EmployeeRoute = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route element={<ProtectectedRoute />}>
          {routes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
          <Route element={<ShowEmployeeLayout />}>
            {employeeDetailsRoutes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default EmployeeRoute;
