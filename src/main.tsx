import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Layout from "./layout/Layout.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard.tsx";
import Students from "./pages/Students/Students.tsx";
import ProtectedRoute from "./components/Icon/ProtectedRoute.tsx"; // Make sure this is correctly named
import Login from "./pages/Authentication/Login.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          {/* Login page route */}

          {/* ProtectedRoute wraps protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="students" element={<Students />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
