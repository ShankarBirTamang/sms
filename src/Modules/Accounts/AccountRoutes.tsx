import { Route, Routes } from "react-router-dom";
import Layout from "../../layout/Layout";
import ProtectectedRoute from "../../components/Icon/ProtectedRoute";
import AccountGroup from "./pages/Masters/AccountGroup/AccountGroup";
import { FiscalYear } from "./pages/Masters/FiscalYear/FiscalYear";
import Item from "./pages/Masters/Item/Item";
import FeeStructure from "./pages/Masters/FeeStructure/FeeStructure";
import StudentAccount from "./pages/Masters/Account/StudentAccount";
import GroupSettings from "./pages/GroupSettings/GroupSettings";
import Account from "./pages/Masters/Account/Account";
import Voucher from "./pages/Voucher/Voucher";

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
    path: "masters/group-setup",
    title: "Setup Groups",
    element: <GroupSettings />,
  },
  {
    path: "masters/items",
    title: "Fees/Payables",
    element: <Item />,
  },
  {
    path: "masters/fee-structures",
    title: "Fee Structure",
    element: <FeeStructure />,
  },
  {
    path: "masters/accounts",
    title: "Accounts",
    element: <Account />,
  },
  {
    path: "masters/student-accounts",
    title: "Setup Student Accounts",
    element: <StudentAccount />,
  },
  {
    path: "vouchers/create",
    title: "Add Voucher",
    element: <Voucher />,
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
