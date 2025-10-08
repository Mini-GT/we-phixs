import axios from "axios";
import { toast } from "react-toastify";

const validateError = (err: unknown) => {
  if (axios.isAxiosError(err)) {
    const serverMsg = err.response?.data?.message;
    toast.error(serverMsg || "Something went wrong.");
  } else {
    toast.error("Unexpected error occurred.");
  }
};

export { validateError };
