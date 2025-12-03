import axios from "axios";
import { toast } from "react-toastify";

export function displayError(err: unknown) {
  if (axios.isAxiosError(err)) {
    const axiosErr = err.response?.data.message;
    if (Array.isArray(axiosErr)) {
      toast.error(axiosErr[0]);
    } else {
      toast.error(axiosErr);
    }
    return;
  }

  if (err instanceof Error) {
    toast.error(err.message);
    return;
  }

  toast.error("Something went wrong");
}
