import { Route, Routes } from "react-router-dom";
import Layout from "../layout/Layout";
import ProtectectedRoute from "../components/Icon/ProtectedRoute";
import Details from "./pages/Details";
import RoomHalls from "./pages/RoomHalls";
import Laboratories from "./pages/Laboratories";
import Boardings from "./pages/Boardings";

const routes = [
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
