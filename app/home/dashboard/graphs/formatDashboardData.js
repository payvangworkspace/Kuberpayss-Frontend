export const formatDashboardData = (data, yaxis, type, min, max) => {
  const keys = Object.keys(data);
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
        height: 400,
        type: "line",
        dropShadow: {
          enabled: true,
          color: "#000",
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.5,
        },
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      colors: ["#6ddf6d", "#fc9587", "#f8c76a", "#a0a0a0"],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: `24Hrs Transaction ${yaxis} Analysis`,
        align: "left",
      },
      grid: {
        borderColor: "#e7e7e7",
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      markers: {
        size: 1,
      },
      xaxis: {
        categories: Object.keys(data),
        title: {
          text: "Date and Time",
        },
      },
      yaxis: {
        title: {
          text: yaxis,
        },
        min: min,
        max: max,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
    },
  };
  return chartSettings;
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

export const pieChartOptions = (label) => {
  return {
    chart: {
      type: "donut", // Pie chart type
    },
    labels: label,
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "left",
          },
        },
      },
    ],
  };
};
