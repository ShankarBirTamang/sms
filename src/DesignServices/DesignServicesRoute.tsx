import { Route, Routes } from "react-router-dom";
import Layout from "../layout/Layout";
import ProtectectedRoute from "../components/Icon/ProtectedRoute";
import IdCard from "./pages/IdCards/IdCard";
import AdmitCard from "./pages/AdmitCards/AdmitCard";
import Certificate from "./pages/Certificates/Certificate";
import Marksheet from "./pages/Marksheets/Marksheet";
import AddAdmitCard from "./pages/AdmitCards/AddAdmitCard";
import AddCertificate from "./pages/Certificates/AddCertificate";
import AddIdCard from "./pages/IdCards/AddIdCard";
import EditAdmitCard from "./pages/AdmitCards/EditAdmitCard";

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
    path: "id-cards/create",
    title: "ID Cards",
    element: <AddIdCard />,
  },
  {
    path: "admit-cards",
    title: "Admit Cards",
    element: <AdmitCard />,
  },
  {
    path: "admit-cards/create",
    title: "Admit Cards",
    element: <AddAdmitCard />,
  },
  {
    path: "admit-cards/:admitCardId/edit",
    title: "Admit Cards",
    element: <EditAdmitCard />,
  },
  {
    path: "certificates",
    title: "Certificates",
    element: <Certificate />,
  },
  {
    path: "certificates/create",
    title: "Certificates",
    element: <AddCertificate />,
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
