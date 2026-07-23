import { Poppins } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import BootstrapJs from "./utils/bootstrap";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata = {
  title: "Kuber Payss | Payments",
  description: "Fast, secure payments designed for merchants who value clarity, control, and reliability.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={10}
          toastOptions={{
            duration: 3500,
            style: {
              borderRadius: "10px",
              padding: "10px 14px",
              fontSize: "13px",
              fontWeight: 500,
              boxShadow: "0 10px 28px rgba(27, 54, 93, 0.12)",
            },
            success: {
              style: {
                background: "#ecfdf5",
                color: "#166534",
                border: "1px solid #86efac",
              },
            },
            error: {
              style: {
                background: "#fef2f2",
                color: "#991b1b",
                border: "1px solid #fecaca",
              },
            },
          }}
        />
        <div id="backdrop"></div>
        <div id="overlay"></div>
        {children}
        <BootstrapJs />
      </body>
    </html>
  );
}
