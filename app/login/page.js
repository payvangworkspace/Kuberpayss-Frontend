import Header from "./components/header/Header";
import SideImage from "./components/side-images/SideImages";
import left from "../../public/images/login/Login_screen-02.png";
import right from "../../public/images/login/Login_screen-03.png";
import styles from "./page.module.css";
import Footer from "./components/footer/Footer";
import LoginForm from "./components/login-form/LoginForm";
export default function Login() {
  return (
    <div className="container-fluid">
      <Header />
      <div className={styles.sideimages}>
        <SideImage label="boy-with-charts" className="left" img={left} />
        <SideImage label="boy-with-mobile" className="right" img={right} />
      </div>
      <LoginForm />
      <Footer />
    </div>
  );
}
