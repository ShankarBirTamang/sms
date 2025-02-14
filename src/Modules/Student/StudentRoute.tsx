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
import Qualification from "./pages/Student/Details/Qualification";
import Documents from "./pages/Student/Details/Documents";
import ExamRecords from "./pages/Student/Details/ExamRecords";
import Subjects from "./pages/Student/Details/Subjects";

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
  {
    path: "/details/:studentId/qualification",
    title: "Qualifications",
    element: <Qualification />,
  },
  {
    path: "/details/:studentId/documents",
    title: "Documents",
    element: <Documents />,
  },
  {
    path: "/details/:studentId/examRecords",
    title: "ExamRecords",
    element: <ExamRecords />,
  },
  {
    path: "/details/:studentId/subjects",
    title: "Subjects",
    element: <Subjects />,
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
