import Header from "../login/components/header/Header";
import SideImage from "../login/components/side-images/SideImages";
import left from "../../public/images/login/Login_screen-02.png";
import right from "../../public/images/login/Login_screen-03.png";
import styles from "../login/page.module.css";
import Footer from "../login/components/footer/Footer";
import ResetPasswordForm from "./components/ResetPasswordForm";
import { Suspense } from "react";

export default function ResetPassword() {
  return (
    <div className="container-fluid">
      <Header />
      <div className={styles.sideimages}>
        <SideImage label="boy-with-charts" className="left" img={left} />
        <SideImage label="boy-with-mobile" className="right" img={right} />
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <div className={styles.loginbox}>
          <ResetPasswordForm />
        </div>
      </Suspense>
      <Footer />
    </div>
  );
}
