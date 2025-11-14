import { Role } from "@repo/types";

const getRoleColor = (status: Role) => {
  switch (status?.toLocaleLowerCase()) {
    case "leader":
      return "bg-yellow-100 text-green-800";
    case "member":
      return "bg-blue-300 text-black";
    default:
      return null;
  }
};

export { getRoleColor };
