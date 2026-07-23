"use client";
import { usePathname } from "next/navigation";
import classes from "../Sidebar.module.css";
import { useState } from "react";
import Link from "next/link";

const AdminMenu = () => {
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
          {/* <li>
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
          </li> */}
          {/* <li>
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
          </li> */}
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
              className={
                router === "/home/team/sub-merchants" ? classes.activelink : ""
              }
              href="/home/team/sub-merchants"
            >
              Sub Merchants
            </Link>
          </li>
          {/* <li>
            <Link
              href="/home/user-management/merchants/add-merchant"
              className={
                router === "/home/user-management/merchants/add-merchant"
                  ? classes.activelink
                  : ""
              }
            >
              <span>Add Merchant</span>
            </Link>
          </li> */}
          <li>
            <Link
              href="/home/user-management/acquirers"
              className={
                router === "/home/user-management/acquirers"
                  ? classes.activelink
                  : ""
              }
            >
              Acquirers
            </Link>
          </li>
          {/* <li>
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
          </li> */}
          <li>
            <Link
              href="/home/user-management/resellers"
              className={
                router === "/home/user-management/resellers"
                  ? classes.activelink
                  : ""
              }
            >
              Resellers
            </Link>
          </li>
          {/* <li>
            <Link
              href="/home/user-management/resellers/add-reseller"
              className={
                router === "/home/user-management/resellers/add-reseller"
                  ? classes.activelink
                  : ""
              }
            >
              Add Reseller
            </Link>
          </li> */}
        </ul>
      </li>
      <li>
        <Link href="#" onClick={() => handleToggle("TE")}>
          <span>
            <i className="bi bi-people mx-1"></i> Manage Teams
          </span>
          <i className="bi bi-chevron-right"></i>
        </Link>
        <ul
          className={
            toggle && type === "TE"
              ? classes.submenu + " " + classes.active
              : classes.submenu
          }
        >
          <li>
            <Link href="/home/team/sub-admins" className={router === "/home/team/sub-admins" ? classes.activelink : ""}>Sub Admins</Link>
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
            <Link href="/home/settlements/refund" className={router === "/home/settlements/refund" ? classes.activelink : ""}>Refund</Link>
          </li>
          <li>
            <Link href="/home/settlements/summary" className={router === "/home/settlements/summary" ? classes.activelink : ""}>Summary</Link>
          </li>
          <li>
            <Link href="/home/settlements/all-settlement" className={router === "/home/settlements/all-settlement" ? classes.activelink : ""}>Settlements</Link>
          </li>
        </ul>
      </li>
      <li>
        <Link href="/home/rolling-reserve" className={router === "/home/rolling-reserve" ? classes.activelink : ""}>
          <span>
            <i className="bi-piggy-bank mx-1"></i> Rolling Reserve
          </span>
        </Link>
      </li>
      <li>
        <Link href="/home/payment-links" className={router === "/home/payment-links" ? classes.activelink : ""}>
          <span>
            <i className="bi bi-link-45deg mx-1"></i> Payment Link
          </span>
        </Link>
      </li>
      <li>
        <Link href="/home/charge-back" className={router === "/home/charge-back" ? classes.activelink : ""}>
          <span>
            <i className="bi bi-arrow-clockwise mx-1"></i> Charge Back
          </span>
        </Link>
      </li>
      {/* <li>
        <Link href="/home/refund">
          <span>
            <i className="bi bi-wallet2 mx-1"></i> Refund
          </span>
        </Link>
      </li> */}
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
        <Link href="/home/beneficiaries" className={router === "/home/beneficiaries" ? classes.activelink : ""}           >
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

      <li>
        <Link href="/home/transfer-money" className={router === "/home/transfer-money" ? classes.activelink : ""}>
          <span>
            <i className="bi bi-currency-exchange mx-1"></i> Transfer Money
          </span>
        </Link>
      </li>
      <li>
        <Link href="/home/utility-payments" className={router === "/home/utility-payments" ? classes.activelink : ""}>
          <span>
            <i className="bi bi-currency-exchange mx-1"></i> Utility Payments
          </span>
        </Link>
      </li>
      <li>
        <Link href="/home/fraud-prevention" className={router === "/home/fraud-prevention" ? classes.activelink : ""}>
          <span>
            <i className="bi bi-slash-circle mx-1"></i> Fraud Prevention
          </span>
        </Link>
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
          <li>
            <Link
              href="/home/settings/country"
              className={
                router === "home/settings/country" ? classes.activelink : ""
              }
            >
              Country
            </Link>
          </li>
          <li>
            <Link
              href="/home/settings/currency"
              className={
                router === "/home/settings/currency" ? classes.activelink : ""
              }
            >
              Currency
            </Link>
          </li>
          <li>
            <Link
              href="/home/settings/payment-type"
              className={
                router === "/home/settings/payment-type"
                  ? classes.activelink
                  : ""
              }
            >
              Payment Types
            </Link>
          </li>
          <li>
            <Link
              href="/home/settings/mop-type"
              className={
                router === "/home/settings/mop-type" ? classes.activelink : ""
              }
            >
              Mop Types
            </Link>
          </li>
          <li>
            <Link
              href="/home/settings/transfer-mode"
              className={
                router === "/home/settings/transfer-mode"
                  ? classes.activelink
                  : ""
              }
            >
              Transfer Modes
            </Link>
          </li>
          <li>
            <Link
              href="/home/settings/surcharge"
              className={
                router === "/home/settings/surcharge" ? classes.activelink : ""
              }
            >
              Surcharge
            </Link>
          </li>
          <li>
            <Link
              href="/home/settings/surcharge/add-surcharge"
              className={
                router === "/home/settings/surcharge/add-surcharge"
                  ? classes.activelink
                  : ""
              }
            >
              Add Surcharge
            </Link>
          </li>
        </ul>
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
      <li>
        <Link
          href="/home/login-history"
          className={router === "/home/login-history" ? classes.activelink : ""}
        >
          <span>
            <i className="bi bi-list-check mx-1"></i> Login History
          </span>
        </Link>
      </li>
    </ul>
  );
};

export default AdminMenu;
