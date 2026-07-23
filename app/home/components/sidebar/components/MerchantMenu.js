"use client";
import { usePathname } from "next/navigation";
import classes from "../Sidebar.module.css";
import { useState } from "react";
import Link from "next/link";

const MerchantMenu = () => {
  // Logic for active links
  const router = usePathname();
  // Logic for toggle menu
  const [toggle, setToggle] = useState(true);
  const [type, setType] = useState();
  const [submenuToggle, setSubmenuToggle] = useState(false);
  const handleToggle = (id) => {
    if (id === type) {
      setToggle(!toggle);
    } else {
      setToggle(true);
    }
    setType(id);
    setSubmenuToggle(!setSubmenuToggle);
  };
  return (
    <ul className={classes.menu}>
      <li>
        <Link
          href="/home"
          className={router === "/home" ? classes.activelink : ""}
        >
          <span>
            <i className="bi bi-grid-3x3-gap mx-1"></i> Dashboard
          </span>
        </Link>
      </li>
      <li>
        <Link href="#" onClick={() => handleToggle("U")}>
          <span>
            <i className="bi bi-person mx-1"></i> User Management
          </span>
          <i className="bi bi-chevron-right"></i>
        </Link>
        <ul
          className={
            (toggle && type === "U") ||
            router.split("/")[2] === "user-management"
              ? classes.submenu + " " + classes.active
              : classes.submenu
          }
        >
          <li>
            <Link
              href="/home/team/sub-merchants"
              className={
                router === "/home/team/sub-merchants" ? classes.activelink : ""
              }
            >
              Sub Merchants
            </Link>
          </li>
        </ul>
      </li>
      <li>
        <Link href="#" onClick={() => handleToggle("T")}>
          <span>
            <i className="bi bi-cash-coin mx-1"></i> Payin Transactions
          </span>
          <i className="bi bi-chevron-right"></i>
        </Link>
        <ul
          className={
            toggle && type === "T"
              ? classes.submenu + " " + classes.active
              : classes.submenu
          }
        >
          <li>
            <Link href="/home/transaction/orders" className={router === "/home/transaction/orders" ? classes.activelink : ""}>Orders</Link>
          </li>
          <li>
            <Link href="/home/transaction/payin" className={router === "/home/transaction/payin" ? classes.activelink : ""}>Transactions</Link>
          </li>
        </ul>
      </li>
      <li>
        <Link href="#" onClick={() => handleToggle("ST")}>
          <span>
            <i className="bi bi-hand-thumbs-up mx-1"></i> Settlement Report
          </span>
          <i className="bi bi-chevron-right"></i>
        </Link>
        <ul
          className={
            toggle && type === "ST"
              ? classes.submenu + " " + classes.active
              : classes.submenu
          }
        >
          <li>
            <Link href="/home/settlements/auth-settlement" className={router === "/home/settlements/auth-settlement" ? classes.activelink : ""}>Authorized</Link>
          </li>
          <li>
            <Link href="/home/settlements/sale-settlement" className={router === "/home/settlements/sale-settlement" ? classes.activelink : ""}>Captured(Sale)</Link>
          </li>
          <li>
            <Link href="/home/settlements/all-settlement" className={router === "/home/settlements/all-settlement" ? classes.activelink : ""}>Settlements</Link>
          </li>
          <li>
            <Link href="/home/settlements/refund" className={router === "/home/settlements/refund" ? classes.activelink : ""}>Refund</Link>
          </li>
        </ul>
      </li>
      {/* <li>
        <Link href="/home/charge-back">
          <span>
            <i className="bi bi-arrow-clockwise mx-1"></i> Charge Back
          </span>
        </Link>
      </li> */}
      <li>
        <Link href="/home/payment-links" className={router === "/home/payment-links" ? classes.activelink : ""}>
          <span>
            <i className="bi bi-link-45deg mx-1"></i> Payment Link
          </span>
        </Link>
      </li>
      <li>
        <Link href="/home/remittance" className={router === "/home/remittance" ? classes.activelink : ""}>
          <span>
            <i className="bi bi-currency-exchange mx-1"></i> Remittance
          </span>
        </Link>
      </li>
      <li>
        <Link href="/home/user-accounts" className={router === "/home/user-accounts" ? classes.activelink : ""}>
          <span>
            <i className="bi bi-currency-exchange mx-1"></i> User Accounts
          </span>
        </Link>
      </li>
      <li>
        <Link href="/home/load-money" className={router === "/home/load-money" ? classes.activelink : ""}>
          <span>
            <i className="bi bi-currency-exchange mx-1"></i> Load Money
          </span>
        </Link>
      </li>
      <li>
        <Link href="/home/beneficiaries" className={router === "/home/beneficiaries" ? classes.activelink : ""}>
          <span>
            <i className="bi bi-currency-exchange mx-1"></i> Beneficiaries
          </span>
        </Link>
      </li>
      <li>
        <Link href="/home/transactions" className={router === "/home/transactions" ? classes.activelink : ""}>
          <span>
            <i className="bi bi-currency-exchange mx-1"></i> Payout Transactions
          </span>
        </Link>
      </li>
      {/* <li>
        <Link href="/home/transfer-money">
          <span>
            <i className="bi bi-currency-exchange mx-1"></i> Transfer Money
          </span>
        </Link>
      </li> */}
      <li>
        <Link href="/home/fraud-prevention" className={router === "/home/fraud-prevention" ? classes.activelink : ""}   >
          <span>
            <i className="bi bi-slash-circle mx-1"></i> Fraud Prevention
          </span>
        </Link>
      </li>
      <li>
        <Link href="/home/documentation" className={router === "/home/documentation" ? classes.activelink : ""}>
          <span>
            <i className="bi bi-slash-circle mx-1"></i> API Documentation
          </span>
        </Link>
      </li>
      <li>
        <Link
          href="/home/reset-password" className={router === "/home/reset-password" ? classes.activelink : ""} 
        >
          <span>
            <i className="bi bi-shield-lock mx-1"></i> Reset Password
          </span>
        </Link>
      </li>
    </ul>
  );
};

export default MerchantMenu;
