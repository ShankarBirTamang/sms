import React from "react";
import { Route, Routes } from "react-router-dom";
import Student from "./pages/Student/Student";
import StudentAddEdit from "./pages/Student/StudentAddEdit";
import Layout from "../../layout/Layout";
import ProtectectedRoute from "../../components/Icon/ProtectedRoute";

const routes = [
  {
    path: "/",
    title: "Students",
    element: <Student />,
  },
  {
    path: "/create-edit",
    title: "Students",
    element: <StudentAddEdit />,
  },
];
const StudentRoute = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route element={<ProtectectedRoute />}>
          {routes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>
      </Route>
    </Routes>
  );
};

export default StudentRoute;
