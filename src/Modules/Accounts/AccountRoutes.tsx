import { Route, Routes } from "react-router-dom";
import Layout from "../../layout/Layout";
import ProtectectedRoute from "../../components/Icon/ProtectedRoute";
import AccountGroup from "./pages/Masters/AccountGroup/AccountGroup";
import { FiscalYear } from "./pages/Masters/FiscalYear/FiscalYear";
import { TaxCategory } from "./pages/Masters/TaxCategory/TaxCategory";
import ItemGroup from "./pages/Masters/ItemGroup/ItemGroup";
import Item from "./pages/Masters/Item/Item";

interface RouteConfig {
  path: string;
  title: string;
  element: JSX.Element;
}

const routes: RouteConfig[] = [
  {
    path: "masters/fiscal-years",
    title: "Fiscal year",
    element: <FiscalYear />,
  },
  {
    path: "masters/account-groups",
    title: "Account Groups",
    element: <AccountGroup />,
  },
  {
    path: "masters/tax-categories",
    title: "Tax Categories",
    element: <TaxCategory />,
  },
  {
    path: "masters/item-groups",
    title: "Account Groups",
    element: <ItemGroup />,
  },
  {
    path: "masters/items",
    title: "Account Groups",
    element: <Item />,
  },
];

const AccountRoute = () => {
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

export default AccountRoute;
