import Header from "./Header/Header.tsx";
import Footer from "./Footer/Footer.tsx";
import Sidebar from "./Sidebar/Sidebar.tsx";
import { Outlet } from "react-router-dom";

// interface Props {
//   children?: ReactNode;
// }

const Layout = () => {
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
