import Sidebar from "./components/sidebar/Sidebar";
import Footer from "../login/components/footer/Footer";
const Layout = ({ children }) => {
  return (
    <div className="d-flex">
      <Sidebar />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
