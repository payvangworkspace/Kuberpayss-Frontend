import { Poppins } from "next/font/google";
import "./globals.css";
// add bootstrap css
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import BootstrapJs from "./utils/bootstrap";
import { Toaster } from "react-hot-toast";
const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});
export const metadata = {
  title: "Kuberpayss",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Toaster />
        <div id="backdrop"></div>
        <div id="overlay"></div>
        {children}
        <BootstrapJs />
      </body>
    </html>
  );
}
