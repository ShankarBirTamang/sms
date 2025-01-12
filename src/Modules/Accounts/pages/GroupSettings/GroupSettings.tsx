import React, { useState } from "react";
import AccountGroup from "../Masters/AccountGroup/AccountGroup";
import ItemGroup from "../Masters/ItemGroup/ItemGroup";
import Item from "../Masters/Item/Item";
import TaxCategory from "../Masters/TaxCategory/TaxCategory";

interface GroupProps {
  name: string;
  slug: string;
  component: React.ReactElement;
}

const GroupSettings = () => {
  const [tab, setTab] = useState("account-group"); // Set default tab to "account-group"

  const groups: GroupProps[] = [
    {
      name: "Account Group",
      slug: "account-group",
      component: <AccountGroup />,
    },
    {
      name: "Tax Categories",
      slug: "tax-cats",
      component: <TaxCategory />,
    },
    {
      name: "Payment Group",
      slug: "payment-gr",
      component: <ItemGroup />,
    },
    {
      name: "Payment Types",
      slug: "pay-type",
      component: <ItemGroup />,
    },
    {
      name: "Fee Group",
      slug: "fee-group",
      component: <ItemGroup />,
    },
    {
      name: "Fees/Payables",
      slug: "fees-payables",
      component: <Item />,
    },
  ];

  return (
    <>
      <div className="card mb-5 mb-xl-10">
        <div className="card-body pb-0">
          <h2>
            <strong className="">Account Settings</strong>
          </h2>
          <ul className="nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bold">
            {groups.map((group, index) => (
              <li key={index} className="nav-item mt-2">
                <span
                  className={`nav-link text-active-primary ms-0 me-10 py-5 cursor-pointer ${
                    tab === group.slug && "active"
                  }`}
                  onClick={() => setTab(group.slug)}
                >
                  {group.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {groups.map(
        (group) =>
          tab === group.slug && <div key={group.slug}>{group.component}</div>
      )}
    </>
  );
};

export default GroupSettings;
