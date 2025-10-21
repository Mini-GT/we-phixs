import axios from "axios";
import { toast } from "react-toastify";

export function displayError(err: unknown) {
  if (axios.isAxiosError(err)) {
    const axiosErr = err.response?.data.message;
    Array.isArray(axiosErr) ? toast.error(axiosErr[0]) : toast.error(axiosErr);
    return;
  }
  toast.error("Something went wrong");
}
