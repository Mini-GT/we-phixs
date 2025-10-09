import { cookies } from "next/headers";
import Canvas from "./components/canvas";
import Login from "./components/loginBtn";
import User from "./components/user";
import CardContent from "./components/cardContent";
import { ToastContainer } from "react-toastify";
import { getCanvasById } from "api/canvas.service";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { queryKeysType } from "@repo/types";
import { getQueryClient } from "./getQueryClient";

export const jwtsecret = process.env.jwtsecretKey;

export default async function Home() {
  const queryClient = getQueryClient();
  const hasLoginToken = (await cookies()).get("hasLoginToken")?.value;

  await queryClient.prefetchQuery({
    queryKey: queryKeysType.canvas(1),
    queryFn: async () => await getCanvasById(1),
  });

  return (
    <div className="flex flex-col items-center border-black w-full">
      <ToastContainer autoClose={3000} pauseOnHover={false} />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Canvas>{!hasLoginToken ? <Login /> : <User />}</Canvas>
      </HydrationBoundary>
      <CardContent />
    </div>
  );
}
