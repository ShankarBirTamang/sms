import React, { useState } from "react";
import GradeGroup from "./GradeGroup/GradeGroup";
import Faculty from "./Faculty/Faculty";
import SubjectType from "./SubjectType/SubjectType";

const GradeSettings = () => {
  const [tab, setTab] = useState("group");

  return (
    <>
      <div className="card mb-5 mb-xl-10">
        <div className="card-body pb-0">
          <h2>
            <strong className="">Grade Settings</strong>
          </h2>
          <ul className="nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bold">
            <li className="nav-item mt-2">
              <span
                className={`nav-link text-active-primary ms-0 me-10 py-5 cursor-pointer ${
                  tab === "group" && "active"
                }`}
                onClick={() => setTab("group")}
              >
                Grade Groups
              </span>
            </li>
            <li className="nav-item mt-2">
              <span
                className={`nav-link text-active-primary ms-0 me-10 py-5 cursor-pointer  ${
                  tab === "faculty" && "active"
                }`}
                onClick={() => setTab("faculty")}
              >
                Grade Faculties
              </span>
            </li>
            <li className="nav-item mt-2">
              <span
                className={`nav-link text-active-primary ms-0 me-10 py-5 cursor-pointer  ${
                  tab === "subject" && "active"
                }`}
                onClick={() => setTab("subject")}
              >
                Subject Types
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div>
        {tab === "group" ? (
          <GradeGroup />
        ) : tab === "faculty" ? (
          <Faculty />
        ) : tab === "subject" ? (
          <SubjectType />
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default GradeSettings;
