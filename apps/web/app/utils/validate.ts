import axios from "axios";
import { toast } from "react-toastify";

const validateError = (err: unknown) => {
  console.error(err);
  if (axios.isAxiosError(err)) {
    const serverMsg = err.response?.data?.message;
    console.log(serverMsg);
    toast.error(serverMsg[0] || "Something went wrong.");
  } else {
    toast.error("Unexpected error occurred.");
  }
};

export { validateError };
