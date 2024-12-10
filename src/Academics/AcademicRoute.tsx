import { Route, Routes } from "react-router-dom";
import Layout from "../layout/Layout";
import ProtectedRoute from "../components/Icon/ProtectedRoute";
import AcademicLevel from "../Academics/pages/AcademicLevel/AcademicLevel";
import AcademicSession from "../Academics/pages/AcademicSession/AcademicSession";
import Grade from "../Academics/pages/Grade/Grade";
import GradeSettings from "./pages/GradeSettings/GradeSettings";
import AcademicSessionDetail from "./pages/AcademicSession/AcademicSessionDetail";
import Subject from "./pages/Grade/Subject/Subject";

const routes = [
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
    path: "academic-sessions/:sessionId/show",
    title: "Academic Session Details",
    element: <AcademicSessionDetail />,
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
  {
    path: "grades/:gradeId/subjects",
    title: "Grades",
    element: <Subject />,
  },
  // {
  //   path: "subject-types",
  //   title: "Subject Types",
  //   element: <SubjectType />,
  // },
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
