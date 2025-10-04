import { cookies } from "next/headers";
import Canvas from "./components/canvas";
import Login from "./components/loginBtn";
import User from "./components/user";
import CardContent from "./components/cardContent";

export default async function Home() {
  const hasLoginToken = (await cookies()).get("hasLoginToken")?.value;

  return (
    <div className="flex flex-col items-center border-black w-full">
      <Canvas>{!hasLoginToken ? <Login /> : <User />}</Canvas>
      <CardContent />
    </div>
  );
}
