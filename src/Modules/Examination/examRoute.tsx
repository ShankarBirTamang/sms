import { Route, Routes } from "react-router-dom";
import Layout from "../../layout/Layout";
import ProtectedRoute from "../../components/Icon/ProtectedRoute";
import ExamSession from "./pages/ExamSession";

interface RouteConfig {
  path: string;
  title: string;
  element: JSX.Element;
}

const routes: RouteConfig[] = [
  { path: "session", title: "Session", element: <ExamSession /> },
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
