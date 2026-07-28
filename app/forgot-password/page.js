import Header from "../login/components/header/Header";
import SideImage from "../login/components/side-images/SideImages";
import left from "../../public/images/login/Login_screen-02.png";
import right from "../../public/images/login/Login_screen-03.png";
import styles from "../login/page.module.css";
import Footer from "../login/components/footer/Footer";
import ForgotPasswordForm from "./components/forgot-password-form/ForgotPasswordForm";

export default function ForgotPassword() {
  return (
    <div className="container-fluid">
      <Header />
      <div className={styles.sideimages}>
        <SideImage label="boy-with-charts" className="left" img={left} />
        <SideImage label="boy-with-mobile" className="right" img={right} />
      </div>
      <ForgotPasswordForm />
      <Footer />
    </div>
  );
}
