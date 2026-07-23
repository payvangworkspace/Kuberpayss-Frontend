import React from "react";
import SettlementSummary from "./components/SettlementSummary";
import { adminRole, resellerRole, userEmail } from "@/app/services/storageData";

const Summary = () => {
  return (
    <SettlementSummary
      role={adminRole()}
    //   isMerchant={merchant}
      resellerRole={resellerRole()}
      userId={userEmail()}
    />
  );
};

export default Summary;
