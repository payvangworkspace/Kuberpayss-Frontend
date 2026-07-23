"use client";
import { usePathname } from "next/navigation";
import classes from "../Sidebar.module.css";
import { useState } from "react";
import Link from "next/link";

const AcquirerMenu = () => {
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
              href="/home/user-management/merchants"
              className={
                router === "/home/user-management/merchants"
                  ? classes.activelink
                  : ""
              }
            >
              <span>Merchants</span>
            </Link>
          </li>
          <li>
            <Link
              href="/home/user-management/merchants/add-merchants"
              className={
                router === "/home/user-management/merchants/add-merchants"
                  ? classes.activelink
                  : ""
              }
            >
              <span>Add Merchant</span>
            </Link>
          </li>
          <li>
            <Link
              href="/home/user-management/acquirer"
              className={
                router === "/home/user-management/acquirer"
                  ? classes.activelink
                  : ""
              }
            >
              Acquirers
            </Link>
          </li>
          <li>
            <Link
              href="/home/user-management/acquirer/add-acquirer"
              className={
                router === "/home/user-management/acquirer/add-acquirer"
                  ? classes.activelink
                  : ""
              }
            >
              Add Acquirer
            </Link>
          </li>
          <li>
            <Link
              href="/home/user-management/sub-admins"
              className={
                router === "/home/user-management/sub-admins"
                  ? classes.activelink
                  : ""
              }
            >
              Sub Admins
            </Link>
          </li>
          <li>
            <Link
              href="/home/user-management/sub-admins/add-sub-admin"
              className={
                router === "/home/user-management/sub-admins/add-sub-admin"
                  ? classes.activelink
                  : ""
              }
            >
              Add Sub Admin
            </Link>
          </li>
          <li>
            <Link
              href="/home/user-management/sub-merchants"
              className={
                router === "/home/user-management/sub-merchants"
                  ? classes.activelink
                  : ""
              }
            >
              Sub Merchants
            </Link>
          </li>
          <li>
            <Link
              href="/home/user-management/sub-merchants/add-sub-merchant"
              className={
                router ===
                "/home/user-management/sub-merchants/add-sub-merchant"
                  ? classes.activelink
                  : ""
              }
            >
              Add Sub Merchant
            </Link>
          </li>
        </ul>
      </li>
      <li>
        <Link href="#" onClick={() => handleToggle("T")}>
          <span>
            <i className="bi bi-cash-coin mx-1"></i> Transactions
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
            <Link href="/home/transaction/orders">Orders</Link>
          </li>
          <li>
            <Link href="/home/transaction/payin">Transactions</Link>
          </li>
        </ul>
      </li>

      {/* Settings */}
      <li>
        <Link href="#" onClick={() => handleToggle("S")}>
          <span>
            <i className="bi bi-gear mx-1"></i> Settings
          </span>
          <i className="bi bi-chevron-right"></i>
        </Link>
        <ul
          className={
            toggle && type === "S"
              ? classes.submenu + " " + classes.active
              : classes.submenu
          }
        >
          <Link
            href="/home/settings/country"
            className={
              router === "home/settings/country" ? classes.activelink : ""
            }
          >
            Country
          </Link>
          <Link
            href="/home/settings/country/add-country"
            className={
              router === "/home/settings/country/add-country"
                ? classes.activelink
                : ""
            }
          >
            Add Country
          </Link>
          <Link
            href="/home/settings/currency"
            className={
              router === "/home/settings/currency" ? classes.activelink : ""
            }
          >
            Currency
          </Link>
          <Link
            href="/home/settings/currency/add-currency"
            className={
              router === "/home/settings/currency/add-currency"
                ? classes.activelink
                : ""
            }
          >
            Add Currency
          </Link>
          <Link
            href="/home/settings/payment-type"
            className={
              router === "/home/settings/payment-type" ? classes.activelink : ""
            }
          >
            Payment Types
          </Link>
          <Link
            href="/home/settings/payment-type/add-payment-type"
            className={
              router === "/home/settings/payment-type/add-payment-type"
                ? classes.activelink
                : ""
            }
          >
            Add Payment Types
          </Link>
          <Link
            href="/home/settings/mop-type"
            className={
              router === "/home/settings/mop-type" ? classes.activelink : ""
            }
          >
            Mop Types
          </Link>
          <Link
            href="/home/settings/mop-type/add-mop-type"
            className={
              router === "/home/settings/mop-type/add-mop-type"
                ? classes.activelink
                : ""
            }
          >
            Add MOP Type
          </Link>
        </ul>
      </li>
      <li>
        <Link href="/home/settlements">
          <span>
            <i className="bi bi-hand-thumbs-up mx-1"></i> Settlements
          </span>
        </Link>
      </li>
      <li>
        <Link href="/home/payment-links">
          <span>
            <i className="bi bi-link-45deg mx-1"></i> Payment Link
          </span>
        </Link>
      </li>
      <li>
        <Link href="/home/fraud-prevention">
          <span>
            <i className="bi bi-slash-circle mx-1"></i> Fraud Prevention
          </span>
        </Link>
      </li>
      <li>
        <Link
          href="/home/reset-password"
          className={
            router === "/home/reset-password" ? classes.activelink : ""
          }
        >
          <span>
            <i className="bi bi-shield-lock mx-1"></i> Reset Password
          </span>
        </Link>
      </li>
    </ul>
  );
};

export default AcquirerMenu;
