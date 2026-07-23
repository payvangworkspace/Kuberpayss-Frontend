import Sidebar from "./components/sidebar/Sidebar";
import Footer from "../login/components/footer/Footer";

const Layout = ({ children }) => {
  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "#eef2f7" }}>
      <Sidebar />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
