import { Route, Routes } from "react-router-dom";
import Layout from "../layout/Layout";
import ProtectectedRoute from "../components/Icon/ProtectedRoute";
import IdCard from "./pages/IdCards/IdCard";
import AdmitCard from "./pages/AdmitCards/AdmitCard";
import Certificate from "./pages/Certificates/Certificate";
import Marksheet from "./pages/Marksheets/Marksheet";

type RouteConfig = {
  path: string;
  title: string;
  element: JSX.Element;
};

const routes: RouteConfig[] = [
  {
    path: "id-cards",
    title: "ID Cards",
    element: <IdCard />,
  },
  {
    path: "admit-cards",
    title: "Admit Cards",
    element: <AdmitCard />,
  },
  {
    path: "certificates",
    title: "Certificates",
    element: <Certificate />,
  },
  {
    path: "marksheets",
    title: "Marksheet",
    element: <Marksheet />,
  },
];

const DesignServicesRoute = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route element={<ProtectectedRoute />}>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
      </Route>
    </Routes>
  );
};

export default DesignServicesRoute;
