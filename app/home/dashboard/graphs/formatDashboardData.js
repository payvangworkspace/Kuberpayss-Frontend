export const formatDashboardData = (data, yaxis, type, min, max, color = "#3b82f6") => {
  const keys = Object.keys(data || {});
  const mappeddata = keys.map((key) => data[key]);
  const successData = filterData(mappeddata, "SUCCESS", type);
  const failedData = filterData(mappeddata, "FAILED", type);
  const pendingData = filterData(mappeddata, "PENDING", type);
  const attemptedData = filterData(mappeddata, "ATTEMPTED", type);

  const chartSettings = {
    series: [
      {
        name: "Success",
        data: successData,
      },
      {
        name: "Failed",
        data: failedData,
      },
      {
        name: "Pending",
        data: pendingData,
      },
      {
        name: "Attempted",
        data: attemptedData,
      },
    ],
    options: {
      chart: {
        height: 360,
        type: "area",
        fontFamily: "Poppins, system-ui, sans-serif",
        dropShadow: {
          enabled: false,
        },
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      colors: ["#3b82f6", "#ef4444", "#f59e0b", "#94a3b8"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 2.5,
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.35,
          opacityTo: 0.05,
          stops: [0, 90, 100],
        },
      },
      title: {
        text: undefined,
      },
      grid: {
        borderColor: "#eef2f7",
        strokeDashArray: 4,
        row: {
          colors: ["transparent", "transparent"],
          opacity: 0.5,
        },
      },
      markers: {
        size: 3,
        strokeWidth: 2,
        hover: {
          size: 5,
        },
      },
      xaxis: {
        categories: keys,
        title: {
          text: "Date and Time",
          style: {
            color: "#94a3b8",
            fontSize: "10px",
            fontWeight: 600,
          },
        },
        labels: {
          style: {
            colors: "#94a3b8",
            fontSize: "10px",
          },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        title: {
          text: yaxis,
          style: {
            color: "#94a3b8",
            fontSize: "10px",
            fontWeight: 600,
          },
        },
        min: min,
        max: max,
        labels: {
          style: {
            colors: "#94a3b8",
            fontSize: "10px",
          },
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
        floating: false,
        fontSize: "11px",
        markers: {
          width: 7,
          height: 7,
          radius: 7,
        },
      },
      tooltip: {
        theme: "light",
        style: {
          fontSize: "12px",
        },
      },
    },
    primaryColor: color,
  };
  return chartSettings;
};

export const summarizeSeries = (series = [], categories = []) => {
  if (!series.length || !series[0]?.data?.length) {
    return {
      total: 0,
      average: 0,
      peak: 0,
      lowest: 0,
      peakLabel: "",
      lowestLabel: "",
    };
  }
  const len = series[0].data.length;
  const perSlot = Array.from({ length: len }, (_, i) =>
    series.reduce((acc, s) => acc + (Number(s.data?.[i]) || 0), 0)
  );
  const total = perSlot.reduce((a, b) => a + b, 0);
  const peak = Math.max(...perSlot);
  const lowest = Math.min(...perSlot);
  const average = Math.round(total / len);
  const peakLabel = categories[perSlot.indexOf(peak)] || "";
  const lowestLabel = categories[perSlot.indexOf(lowest)] || "";
  return { total, average, peak, lowest, peakLabel, lowestLabel };
};

const isSuccessfulTransactionStatus = (status) => {
  const normalizedStatus = String(status || "").trim().toUpperCase();
  return normalizedStatus === "CAPTURED" || normalizedStatus === "SUCCESS";
};

const matchesGraphStatus = (itemStatus, type) => {
  const normalizedStatus = String(itemStatus || "").trim().toUpperCase();
  if (type === "SUCCESS") {
    return isSuccessfulTransactionStatus(normalizedStatus);
  }
  return normalizedStatus === type;
};

const filterData = (data, type, keyType) => {
  const returndata = data.map((value) =>
    value.reduce((acc, item) => {
      if (matchesGraphStatus(item.transactionStatus, type)) {
        return parseInt(item[`${keyType}`]) + acc;
      }
      return acc;
    }, 0),
  );
  return returndata;
};

const PIE_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#f43f5e", "#8b5cf6", "#14b8a6"];

export const pieChartOptions = (label) => {
  return {
    chart: {
      type: "donut",
      fontFamily: "Poppins, system-ui, sans-serif",
    },
    labels: label,
    colors: PIE_COLORS,
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val.toFixed(1)}%`,
      style: {
        fontSize: "11px",
        fontWeight: 700,
        colors: ["#ffffff"],
      },
      dropShadow: { enabled: false },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "58%",
          labels: {
            show: false,
            name: {
              show: false,
            },
            value: {
              show: false,
            },
            total: {
              show: false,
            },
          },
        },
      },
    },
    stroke: {
      width: 2,
      colors: ["#fff"],
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 220,
          },
        },
      },
    ],
  };
};

export const getPieColors = () => PIE_COLORS;
