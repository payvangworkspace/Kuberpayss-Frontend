import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { formatDashboardData } from "./formatDashboardData";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const TransactionAmount = ({ data }) => {
  useEffect(() => {
    if (data) {
      const chartData = formatDashboardData(
        data,
        "Amount",
        "totalAmount",
        0,
        1000000
      );
      setState(chartData);
    }
  }, [data]);

  const [state, setState] = useState(null);
  if (state && data) {
    return (
      <div>
        <h6>Transaction Amount</h6>
        <ApexChart
          options={state.options}
          series={state.series}
          type="line"
          height={350}
        />
      </div>
    );
  }
};

export default TransactionAmount;
