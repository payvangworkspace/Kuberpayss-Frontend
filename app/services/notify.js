import toast from "react-hot-toast";

export function successMsg(msg) {
  return toast.success(msg);
}
export function errorMsg(msg) {
  return toast.error(msg);
}
