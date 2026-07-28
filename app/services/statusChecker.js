import { errorMsg, successMsg } from "@/app/services/notify";

export const statusChecker = (response) => {
  const { status } = response;
  if (response.status >= 200 && response.status < 300) {
    switch (status) {
      case 201:
        successMsg(response.data.message || "Data Added Successfully");
        break;
      case 202:
        successMsg(response.data.message || "Data Deleted Successfully");
        break;
      case 200:
        const { status, message } = response.data;
        if (status === "fail")
          errorMsg(message || "Some internal server issue");
        break;
      default:
        break;
    }
    return response;
  } else {
    throw new Error(response.statusText);
  }
};
