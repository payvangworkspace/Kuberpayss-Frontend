import dynamic from "next/dynamic";
import { pieChartOptions } from "./formatDashboardData";
import { useEffect, useState } from "react";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const PaymentTypeData = ({ data = null }) => {
  const [options, setOptions] = useState({ label: "", pieData: "" });
  useEffect(() => {
    if (data) {
      const label = pieChartOptions(Object.keys(data?.data.data || ""));
      const pieData = label.labels.map((item) =>
        parseFloat(data.data.data[item])
      );
      setOptions({ label, pieData });
    }
  }, [data]);
  if (options.label && options.pieData) {
    return (
      <div className="wrapper h-100">
        <h6>Payment Type Transaction Count</h6>
        <ApexChart
          options={options.label}
          series={options.pieData}
          type="donut"
          height={350}
        />
      </div>
    );
  }
};

export default PaymentTypeData;
