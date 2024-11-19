// import { ComponentPreviews, useInitial } from "./dev";
// import { DevSupport } from "@react-buddy/ide-toolbox";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Layout from "./layout/Layout.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard.tsx";
import Students from "./pages/Students/Students.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path={"/"} element={<Dashboard />} />
          <Route path={"students"} element={<Students />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
