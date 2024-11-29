import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Layout from "./layout/Layout.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard.tsx";
import Students from "./pages/Students/Students.tsx";
import ProtectedRoute from "./components/Icon/ProtectedRoute.tsx"; // Make sure this is correctly named
import Login from "./pages/Authentication/Login.tsx";
import Test from "./pages/Test.tsx";
import AcademicLevel from "./Academics/pages/AcademicLevel/AcademicLevel.tsx";
import AcademicSession from "./Academics/pages/AcademicSession/AcademicSession.tsx";
import GradeGroup from "./Academics/pages/GradeGroup/GradeGroup.tsx";

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
            <Route
              path="academics/academic-levels"
              element={<AcademicLevel />}
            />
            <Route
              path="academics/academic-sessions"
              element={<AcademicSession />}
            />
            <Route path="academics/grade-groups" element={<GradeGroup />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
