"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const BRAND = "Kuber Pays";

const ROUTE_TITLES = [
  { match: "/login", title: "Login" },
  { match: "/signup", title: "Sign Up" },
  { match: "/terms-and-conditions", title: "Terms and Conditions" },
  { match: "/privacy-policy", title: "Privacy Policy" },
  { match: "/home/user-management/merchants/add-merchant", title: "Add Merchant" },
  { match: "/home/user-management/merchants", title: "Merchants" },
  { match: "/home/user-management/acquirers", title: "Acquirers" },
  { match: "/home/user-management/acquirer/add-acquirer", title: "Add Acquirer" },
  { match: "/home/user-management/acquirer", title: "Acquirer" },
  { match: "/home/user-management/resellers/add-reseller", title: "Add Reseller" },
  { match: "/home/user-management/resellers", title: "Resellers" },
  { match: "/home/user-management/sub-admins/add-sub-admin", title: "Add Sub Admin" },
  { match: "/home/user-management/sub-admins", title: "Sub Admins" },
  { match: "/home/team/sub-admins/add-sub-admin", title: "Add Sub Admin" },
  { match: "/home/team/sub-admins", title: "Sub Admins" },
  { match: "/home/team/sub-merchants/add-sub-merchant", title: "Add Sub Merchant" },
  { match: "/home/team/sub-merchants", title: "Sub Merchants" },
  { match: "/home/transaction/orders", title: "Orders" },
  { match: "/home/transaction/payin", title: "Payin Transactions" },
  { match: "/home/settlements/auth-settlement", title: "Authorized Settlement" },
  { match: "/home/settlements/sale-settlement", title: "Captured Settlement" },
  { match: "/home/settlements/refund", title: "Refund" },
  { match: "/home/settlements/summary", title: "Settlement Summary" },
  { match: "/home/settlements/all-settlement", title: "Settlements" },
  { match: "/home/rolling-reserve", title: "Rolling Reserve" },
  { match: "/home/payment-links", title: "Payment Links" },
  { match: "/home/charge-back", title: "Charge Back" },
  { match: "/home/remittance", title: "Remittance" },
  { match: "/home/user-accounts", title: "User Accounts" },
  { match: "/home/load-money/add-load-money", title: "Add Load Money" },
  { match: "/home/load-money", title: "Load Money" },
  { match: "/home/beneficiaries/add-beneficiary", title: "Add Beneficiary" },
  { match: "/home/beneficiaries", title: "Beneficiaries" },
  { match: "/home/transactions", title: "Payout Transactions" },
  { match: "/home/transfer-money", title: "Transfer Money" },
  { match: "/home/utility-payments", title: "Utility Payments" },
  { match: "/home/fraud-prevention", title: "Fraud Prevention" },
  { match: "/home/settings/country/add-country", title: "Add Country" },
  { match: "/home/settings/country", title: "Country Setup" },
  { match: "/home/settings/currency/add-currency", title: "Add Currency" },
  { match: "/home/settings/currency", title: "Currency Setup" },
  { match: "/home/settings/payment-type/add-payment-type", title: "Add Payment Type" },
  { match: "/home/settings/payment-type", title: "Payment Types" },
  { match: "/home/settings/mop-type/add-mop-type", title: "Add MOP Type" },
  { match: "/home/settings/mop-type", title: "MOP Types" },
  { match: "/home/settings/transfer-mode/add-transfer-mode", title: "Add Transfer Mode" },
  { match: "/home/settings/transfer-mode", title: "Transfer Modes" },
  { match: "/home/settings/surcharge/add-surcharge", title: "Add Surcharge" },
  { match: "/home/settings/surcharge", title: "Surcharge Management" },
  { match: "/home/documentation", title: "API Documentation" },
  { match: "/home/reset-password", title: "Reset Password" },
  { match: "/home/login-history", title: "Login History" },
  { match: "/home", title: "Dashboard" },
];

function resolveTitle(pathname = "") {
  if (!pathname) return BRAND;

  const exact = ROUTE_TITLES.find((route) => route.match === pathname);
  if (exact) return `${BRAND} | ${exact.title}`;

  // Prefer longer / more specific prefixes first
  const sorted = [...ROUTE_TITLES].sort(
    (a, b) => b.match.length - a.match.length,
  );
  const prefix = sorted.find(
    (route) =>
      pathname === route.match || pathname.startsWith(`${route.match}/`),
  );

  if (prefix) return `${BRAND} | ${prefix.title}`;
  return BRAND;
}

export default function DocumentTitle() {
  const pathname = usePathname();

  useEffect(() => {
    document.title = resolveTitle(pathname);
  }, [pathname]);

  return null;
}
