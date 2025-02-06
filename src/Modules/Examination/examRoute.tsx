import { Route, Routes } from "react-router-dom";
import Layout from "../../layout/Layout";
import ProtectedRoute from "../../components/Icon/ProtectedRoute";
import ExamSession from "./pages/ExamSession";
import ExamDetail from "./pages/Exam/ExamDetail";
import ExamSettings from "./pages/ExamSettings/ExamSettings";

interface RouteConfig {
  path: string;
  title: string;
  element: JSX.Element;
}

const routes: RouteConfig[] = [
  { path: "session", title: "Session", element: <ExamSession /> },
  { path: "settings", title: "Exam Settings", element: <ExamSettings /> },
  {
    path: "session/:examId/show",
    title: "Exam Session Details",
    element: <ExamDetail />,
  },
];

const ExamRoute = () => {
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

export default ExamRoute;
