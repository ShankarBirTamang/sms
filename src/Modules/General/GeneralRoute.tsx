import { Route, Routes } from "react-router-dom";
import ProtectectedRoute from "../../components/Icon/ProtectedRoute";
import Layout from "../../layout/Layout";
import GeneralSettings from "./pages/Settings/GeneralSettings";

const routes = [
  {
    path: "/system/settings",
    title: "Settings",
    element: <GeneralSettings />,
  },
];

const GeneralRoute = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route element={<ProtectectedRoute />}>
          {routes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
          {/* <Route element={<StudentDetailLayout />}>
            {studentDetailsRoutes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
          </Route> */}
        </Route>
      </Route>
    </Routes>
  );
};

export default GeneralRoute;
