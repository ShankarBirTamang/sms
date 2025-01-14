import { Route, Routes } from "react-router-dom";
import Layout from "../layout/Layout";
import ProtectedRoute from "../components/Icon/ProtectedRoute";
import AcademicLevel from "../Academics/pages/AcademicLevel/AcademicLevel";
import AcademicSession from "../Academics/pages/AcademicSession/AcademicSession";
import Grade from "../Academics/pages/Grade/Grade";
import GradeSettings from "./pages/GradeSettings/GradeSettings";
import TimeTable from "./pages/Routine/TimeTable/TimeTable";
import AddTimeTable from "./pages/Routine/TimeTable/AddTimeTable";

interface RouteConfig {
  path: string;
  title: string;
  element: JSX.Element;
}
import AcademicSessionDetail from "./pages/AcademicSession/AcademicSessionDetail";
import Subject from "./pages/Grade/Subject/Subject";
import ViewTimeTable from "./pages/Routine/TimeTable/ViewTimeTable";
import EditTimeTable from "./pages/Routine/TimeTable/EditTimeTable";
import Student from "./pages/Grade/Students/Student";

const routes: RouteConfig[] = [
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
    path: "routine/time-table",
    title: "Time Table",
    element: <TimeTable />,
  },
  {
    path: "routine/time-table/create",
    title: "Time Table",
    element: <AddTimeTable />,
  },
  {
    path: "routine/time-table/:timeTableId/view",
    title: "Time Table View",
    element: <ViewTimeTable />,
  },
  {
    path: "routine/time-table/:timeTableId/edit",
    title: "Time Table View",
    element: <EditTimeTable />,
  },
  {
    path: "grades/:gradeId/subjects",
    title: "Grade Subjects",
    element: <Subject />,
  },
  {
    path: "grades/:gradeId/students",
    title: "Grade Students",
    element: <Student />,
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
