import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { formatDashboardData } from "./formatDashboardData";

const TransactionCount = ({ data }) => {
  useEffect(() => {
    if (data) {
      const chartData = formatDashboardData(
        data,
        "Count",
        "totalCount",
        0,
        1000
      );
      setState(chartData);
    }
  }, [data]);

  const [state, setState] = useState(null);
  if (state && data) {
    return (
      <div className="mt-4">
        <h6>Transaction Count</h6>
        <ApexChart
          options={state?.options}
          series={state?.series}
          type="line"
          height={350}
        />
      </div>
    );
  }
};

export default TransactionCount;
