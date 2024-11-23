import Header from "./Header/Header.tsx";
import Footer from "./Footer/Footer.tsx";
import Sidebar from "./Sidebar/Sidebar.tsx";
import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

import axiosInstance from "../../axiosConfig";

// interface Props {
//   children?: ReactNode;
// }

// const baseUrl = import.meta.env.VITE_API_URL;

const Layout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await axiosInstance.get("/validate-token");
        if (response.status === 200) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Token validation failed", error);
        setIsAuthenticated(false);
      }
    };
    validateToken();
  }, []);
  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Show loading indicator while validating
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return (
    <>
      <Sidebar />
      <div
        className="wrapper d-flex flex-column flex-row-fluid"
        id="kt_wrapper"
      >
        <Header />
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
