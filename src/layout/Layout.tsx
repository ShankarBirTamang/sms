import Header from "./Header/Header.tsx";
import Footer from "./Footer/Footer.tsx";
import Sidebar from "./Sidebar/Sidebar.tsx";
import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

import axiosInstance from "../../axiosConfig";
import { usePermissions } from "../hooks/usePermissions.ts";
import Loading from "../components/Loading/Loading.tsx";

const Layout = () => {
  const { setPermissions } = usePermissions();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await axiosInstance.get("/validate-token");
        if (response.status === 200) {
          setIsAuthenticated(true);
          setPermissions(response.data.permissions);
        }
      } catch (error) {
        console.error("Token validation failed", error);
        setIsAuthenticated(false);
      }
    };
    validateToken();
  }, [setPermissions]);
  if (isAuthenticated === null) {
    return (
      <div className="d-flex justify-content-center align-items-center w-100">
        <Loading />
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const title = document.title;
  return (
    <>
      <Sidebar />
      <div
        className="wrapper d-flex flex-column flex-row-fluid"
        id="kt_wrapper"
      >
        <Header title={title} />
        <div
          className="content d-flex flex-column flex-column-fluid"
          id="kt_content"
        >
          <div className="container-xxl" id="kt_content_container">
            <Outlet />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
