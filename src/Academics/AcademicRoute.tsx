import { Route, Routes } from "react-router-dom";
import Layout from "../layout/Layout";
import ProtectedRoute from "../components/Icon/ProtectedRoute";
import Dashboard from "../pages/Dashboard/Dashboard";
import Students from "../pages/Students/Students";
import AcademicLevel from "../Academics/pages/AcademicLevel/AcademicLevel";
import AcademicSession from "../Academics/pages/AcademicSession/AcademicSession";
import GradeGroup from "../Academics/pages/GradeGroup/GradeGroup";
import Grade from "../Academics/pages/Grade/Grade";
import GradeSettings from "./GradeSettings/GradeSettings";

const routes = [
  {
    path: "students",
    title: "Students",
    element: <Students />,
  },
  {
    path: "academic-levels",
    title: "Academic Levels",
    element: <AcademicLevel />,
  },
  {
    path: "academic-sessions",
    title: "Academic Sessions",
    element: <AcademicSession />,
  },
  {
    path: "grade-settings",
    title: "Grade Settings",
    element: <GradeSettings />,
  },
  {
    path: "grades",
    title: "Grades",
    element: <Grade />,
  },
];

const AcademicRoute = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route element={<ProtectedRoute />}>
          {routes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>
      </Route>
    </Routes>
  );
};

export default AcademicRoute;
