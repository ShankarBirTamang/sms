import React, { useState } from "react";
import Email from "./Email";
import Address from "../../../../General/pages/Address/Address";

interface GroupProps {
  name: string;
  slug: string;
  component: React.ReactElement;
}

const GeneralSettings = () => {
  const [tab, setTab] = useState("roles");

  const groups: GroupProps[] = [
    {
      name: "Roles/Permission",
      slug: "roles",
      component: <Address />,
    },
    {
      name: "Email Config",
      slug: "email",
      component: <Email />,
    },
    {
      name: "Address",
      slug: "address",
      component: <Address />,
    },
  ];

  return (
    <>
      <div className="card mb-5 mb-xl-10">
        <div className="card-body pb-0">
          <h2>
            <strong className="">System Settings</strong>
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

export default GeneralSettings;
