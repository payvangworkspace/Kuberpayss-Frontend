import Footer from "../login/components/footer/Footer";
import SideImage from "../login/components/side-images/SideImages";
import styles from "../login/page.module.css";
import SignupForm from "./components/SignupForm";
import left from "../../public/images/login/Login_screen-02.png";
import right from "../../public/images/login/Login_screen-03.png";
import Header from "./components/Header";

const Signup = () => {
  return (
    <div className="container-fluid">
      <Header />
      <div className={styles.sideimages}>
        <SideImage label="boy-with-charts" className="left" img={left} />
        <SideImage label="boy-with-mobile" className="right" img={right} />
      </div>
      <SignupForm />
      <Footer />
    </div>
  );
};

export default Signup;
