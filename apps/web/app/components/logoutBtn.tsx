import { logoutUser } from "api/auth.service";
import IconButton from "./ui/iconButton";
import { toast } from "react-toastify";

export default function LogoutBtn() {
  const handleLogout = async () => {
    const res = await logoutUser();

    if (typeof res === "string") {
      toast.info(res);
    } else if (!res) {
      toast.error("Couldn't logout");
    }
  };

  return (
    <IconButton className="w-full border-none hover:scale-97">
      <div
        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-2 px-4 rounded-full transition-all shadow-lg hover:shadow-blue-500/30 cursor-pointer"
        onClick={handleLogout}
      >
        Logout
      </div>
    </IconButton>
  );
}
