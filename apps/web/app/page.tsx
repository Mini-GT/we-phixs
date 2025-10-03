import { cookies } from "next/headers";
import Canvas from "./components/canvas";
import Login from "./components/loginBtn";
import User from "./components/user";

export default async function Home() {
  const token = (await cookies()).get("token")?.value;

  return (
    <div className="flex flex-col items-center border-black w-full">
      <Canvas>{!token ? <Login /> : <User />}</Canvas>
    </div>
  );
}
