import React from "react";
import { Route, Routes } from "react-router-dom";
import Student from "./pages/Student/Student";
import Layout from "../../layout/Layout";
import ProtectectedRoute from "../../components/Icon/ProtectedRoute";
import Overview from "./pages/Student/Details/Overview";
import StudentDetailLayout from "./pages/Student/Details/StudentDetailLayout";
import StudentPhotograph from "./pages/StudentServices/Photograph/StudentPhotograph";
import StudentBulkEdit from "./pages/StudentServices/BulkEdit/StudentBulkEdit";
import StudentCreate from "./pages/Student/StudentCreate";
import StudentEdit from "./pages/Student/StudentEdit";

const routes = [
  {
    path: "/",
    title: "Students",
    element: <Student />,
  },

  {
    path: "/create",
    title: "Add Student",
    element: <StudentCreate />,
  },
  {
    path: "/:studentId/edit",
    title: "Edit Student",
    element: <StudentEdit />,
  },
  {
    path: "/photographs",
    title: "Student Photographs",
    element: <StudentPhotograph />,
  },
  {
    path: "/bulk-edit",
    title: "Student Photographs",
    element: <StudentBulkEdit />,
  },
];

const studentDetailsRoutes = [
  {
    path: "/details/:studentId/overview",
    title: "Students",
    element: <Overview />,
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
          <Route element={<StudentDetailLayout />}>
            {studentDetailsRoutes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default StudentRoute;
