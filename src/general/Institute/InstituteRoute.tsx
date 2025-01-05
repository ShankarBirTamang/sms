import { Route, Routes } from "react-router-dom";

import Layout from "../../layout/Layout";
import Details from "./pages/details/Details";
import RoomHalls from "./pages/room-halls/RoomHalls";
import Laboratories from "./pages/laboratory/Laboratory";
import Boardings from "./pages/boardings/Boardings";
import ProtectectedRoute from "../../components/Icon/ProtectedRoute";
interface RouteConfig {
  path: string;
  title: string;
  element: JSX.Element;
}

const routes: RouteConfig[] = [
  {
    path: "details",
    title: "Institute Details",
    element: <Details />,
  },
  {
    path: "room-halls",
    title: "Room/Halls",
    element: <RoomHalls />,
  },
  {
    path: "laboratories",
    title: "Laboratories",
    element: <Laboratories />,
  },
  {
    path: "boardings",
    title: "Boardings",
    element: <Boardings />,
  },
];

const InstituteRoute = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route element={<ProtectectedRoute />}>
          {routes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>
      </Route>
    </Routes>
  );
};

export default InstituteRoute;
