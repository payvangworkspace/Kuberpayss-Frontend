"use client";
import { usePathname } from "next/navigation";
import classes from "../Sidebar.module.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import useGetRequest from "@/app/hooks/useFetch";
import { endPoints } from "@/app/services/apiEndpoints";
const ResellerMenu = ({ userId }) => {
  const { getData, response, loading, error } = useGetRequest();
  useEffect(() => {
    getData(endPoints.settings.getPermission + userId);
  }, []);

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

  if (response && response?.data) {
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
        {["viewOrders", "viewTransaction"].some((val) =>
          Object.keys(response?.data).includes(val)
        ) && (
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
              {Object.keys(response?.data).includes("viewOrders") && (
                <li>
                  <Link
                    href="/home/transaction/orders"
                    className={
                      router === "/home/transaction/orders"
                        ? classes.activelink
                        : ""
                    }
                  >
                    Orders
                  </Link>
                </li>
              )}
              {Object.keys(response?.data).includes("viewTransaction") && (
                <li>
                  <Link
                    href="/home/transaction/payin"
                    className={
                      router === "/home/transaction/payin"
                        ? classes.activelink
                        : ""
                    }
                  >
                    Transactions
                  </Link>
                </li>
              )}
            </ul>
          </li>
        )}

        {["authSettlement", "saleSettlement", "allSettlement", "refund"].some(
          (val) => Object.keys(response?.data).includes(val)
        ) && (
          <li>
            <Link href="#" onClick={() => handleToggle("ST")}>
              <span>
                <i className="bi bi-gear mx-1"></i> Settlement Report
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
              {Object.keys(response?.data).includes("authSettlement") && (
                <li>
                  <Link
                    href="/home/settlements/auth-settlement"
                    className={
                      router === "/home/settlements/auth-settlement"
                        ? classes.activelink
                        : ""
                    }
                  >
                    Authorized
                  </Link>
                </li>
              )}
              {Object.keys(response?.data).includes("saleSettlement") && (
                <li>
                  <Link
                    href="/home/settlements/sale-settlement"
                    className={
                      router === "/home/settlements/sale-settlement"
                        ? classes.activelink
                        : ""
                    }
                  >
                    Captured(Sale)
                  </Link>
                </li>
              )}
              {Object.keys(response?.data).includes("allSettlement") && (
                <li>
                  <Link
                    href="/home/settlements/all-settlement"
                    className={
                      router === "/home/settlements/all-settlement"
                        ? classes.activelink
                        : ""
                    }
                  >
                    Settlements
                  </Link>
                </li>
              )}
              {Object.keys(response?.data).includes("refund") && (
                <li>
                  <Link
                    href="/home/settlements/refund"
                    className={
                      router === "/home/settlements/refund"
                        ? classes.activelink
                        : ""
                    }
                  >
                    Refund
                  </Link>
                </li>
              )}
            </ul>
          </li>
        )}
        {/* {Object.keys(response?.data).includes("viewPaymentLink") && (
          <li>
            <Link href="/home/payment-links">
              <span>
                <i className="bi bi-link-45deg mx-1"></i> Payment Link
              </span>
            </Link>
          </li>
        )} */}

        {Object.keys(response?.data).includes("viewRemittance") && (
          <li>
            <Link href="/home/remittance">
              <span>
                <i className="bi bi-link-45deg mx-1"></i> Remittance
              </span>
            </Link>
          </li>
        )}
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
          <Link href="/home/documentation">
            <span>
              <i className="bi bi-slash-circle mx-1"></i> API Documentation
            </span>
          </Link>
        </li>
      </ul>
    );
  }
};

export default ResellerMenu;
