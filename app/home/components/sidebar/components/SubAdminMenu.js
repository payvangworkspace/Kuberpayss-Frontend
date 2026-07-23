"use client";
import { usePathname } from "next/navigation";
import classes from "../Sidebar.module.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import useGetRequest from "@/app/hooks/useFetch";
import { endPoints } from "@/app/services/apiEndpoints";
const SubAdminMenu = ({ userId }) => {
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

  if (response) {
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
        {[
          "viewMerchant",
          "addMerchant",
          "viewAcquirer",
          "addAcquirer",
          "viewSubMerchant",
          "addReseller",
          "viewResellers",
        ].some((val) => Object.keys(response.data).includes(val)) && (
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
              {Object.keys(response.data).includes("viewMerchant") && (
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
              )}
              {Object.keys(response.data).includes("addMerchant") && (
                <li>
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
                </li>
              )}
              {Object.keys(response.data).includes("viewAcquirer") && (
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
              )}
              {Object.keys(response.data).includes("addAcquirer") && (
                <li>
                  <Link
                    href="/home/user-management/acquirers/add-acquirer"
                    className={
                      router === "/home/user-management/acquirers/add-acquirer"
                        ? classes.activelink
                        : ""
                    }
                  >
                    Add Acquirer
                  </Link>
                </li>
              )}
              {Object.keys(response.data).includes("viewResellers") && (
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
              )}
              {Object.keys(response.data).includes("addReseller") && (
                <li>
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
                </li>
              )}
              {Object.keys(response.data).includes("viewSubMerchants") && (
                <li>
                  <Link
                    href="/home/team/sub-merchants"
                    className={
                      router === "/home/team/sub-merchants"
                        ? classes.activelink
                        : ""
                    }
                  >
                    View Sub Merchant
                  </Link>
                </li>
              )}
            </ul>
          </li>
        )}

        {["viewOrders", "viewTransaction"].some((val) =>
          Object.keys(response.data).includes(val),
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
              {Object.keys(response.data).includes("viewOrders") && (
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
              {Object.keys(response.data).includes("viewTransaction") && (
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

        {/* Settings */}

        {[
          "viewCountry",
          "addCountry",
          "viewCurrency",
          "addCurrency",
          "viewPaymentType",
          "addPaymentType",
          "viewMopType",
          "addMopType",
          "viewSurcharge",
          "addSurcharge",
        ].some((val) => Object.keys(response.data).includes(val)) && (
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
              {Object.keys(response.data).includes("viewCountry") && (
                <li>
                  <Link
                    href="/home/settings/country"
                    className={
                      router === "home/settings/country"
                        ? classes.activelink
                        : ""
                    }
                  >
                    Country
                  </Link>
                </li>
              )}
              {Object.keys(response.data).includes("addCountry") && (
                <li>
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
                </li>
              )}
              {Object.keys(response.data).includes("viewCurrency") && (
                <li>
                  <Link
                    href="/home/settings/currency"
                    className={
                      router === "/home/settings/currency"
                        ? classes.activelink
                        : ""
                    }
                  >
                    Currency
                  </Link>
                </li>
              )}
              {Object.keys(response.data).includes("addCurrency") && (
                <li>
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
                </li>
              )}
              {Object.keys(response.data).includes("viewPaymentType") && (
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
              )}

              {Object.keys(response.data).includes("addPaymentType") && (
                <li>
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
                </li>
              )}

              {Object.keys(response.data).includes("viewMopType") && (
                <li>
                  <Link
                    href="/home/settings/mop-type"
                    className={
                      router === "/home/settings/mop-type"
                        ? classes.activelink
                        : ""
                    }
                  >
                    Mop Types
                  </Link>
                </li>
              )}
              {Object.keys(response.data).includes("addMopType") && (
                <li>
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
                </li>
              )}
              {Object.keys(response.data).includes("viewSurcharge") && (
                <li>
                  <Link
                    href="/home/settings/surcharge"
                    className={
                      router === "/home/settings/surcharge"
                        ? classes.activelink
                        : ""
                    }
                  >
                    Surcharge
                  </Link>
                </li>
              )}
              {Object.keys(response.data).includes("addSurcharge") && (
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
              )}
            </ul>
          </li>
        )}

        {["authSettlement", "saleSettlement", "allSettlement", "refund"].some(
          (val) => Object.keys(response.data).includes(val),
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
              {Object.keys(response.data).includes("authSettlement") && (
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
              {Object.keys(response.data).includes("saleSettlement") && (
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
              {Object.keys(response.data).includes("allSettlement") && (
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
              {Object.keys(response.data).includes("refund") && (
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
        {Object.keys(response.data).includes("viewPaymentLink") && (
          <li>
            <Link href="/home/payment-links">
              <span>
                <i className="bi bi-link-45deg mx-1"></i> Payment Link
              </span>
            </Link>
          </li>
        )}
        {Object.keys(response.data).includes("viewRemittance") && (
          <li>
            <Link href="/home/remittance">
              <span>
                <i className="bi bi-link-45deg mx-1"></i> Remittance
              </span>
            </Link>
          </li>
        )}
        {Object.keys(response.data).includes("viewChargeBack") && (
          <li>
            <Link href="/home/charge-back">
              <span>
                <i className="bi bi-link-45deg mx-1"></i> Charge Back
              </span>
            </Link>
          </li>
        )}
        {Object.keys(response.data).includes("fraudPrevention") && (
          <li>
            <Link href="/home/fraud-prevention">
              <span>
                <i className="bi bi-slash-circle mx-1"></i> Fraud Prevention
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
      </ul>
    );
  }
};

export default SubAdminMenu;
