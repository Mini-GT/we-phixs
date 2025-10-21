import { cookies } from "next/headers";
import Canvas from "./components/canvas";
import Login from "./components/loginBtn";
import User from "./components/user";
import CardContent from "./components/cardContent";
import { Slide, ToastContainer } from "react-toastify";
import { getCanvasById } from "api/canvas.service";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { queryKeysType } from "@repo/types";
import { getQueryClient } from "./getQueryClient";
import { getPaintCharges } from "api/user.service";
import { isTokenExpired, verifyJwt } from "./utils/jwt";
import { getAllLeaderboard } from "api/leaderboard.service";
import { logoutUser } from "api/logout.service";

export const jwtsecret = process.env.jwtsecretKey;

export default async function Home() {
  const queryClient = getQueryClient();

  const hasLoginToken = (await cookies()).get("hasLoginToken")?.value;
  const loginToken = (await cookies()).get("loginToken")?.value;

  if (loginToken && jwtsecret) {
    const { id, exp } = verifyJwt(loginToken, jwtsecret) as { id: string; exp: number };
    const isExpired = isTokenExpired(exp);

    if (isExpired) {
      await logoutUser();
    } else {
      await Promise.all([
        await queryClient.prefetchQuery({
          queryKey: queryKeysType.canvas(1),
          queryFn: async () => await getCanvasById(1),
        }),
        await queryClient.prefetchQuery({
          queryKey: queryKeysType.allLeaderboard,
          queryFn: async () => await getAllLeaderboard(),
        }),
        await queryClient.prefetchQuery({
          queryKey: queryKeysType.paintCharges,
          queryFn: () => getPaintCharges(id),
        }),
      ]);
    }
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col items-center border-black w-full">
        <ToastContainer
          autoClose={3000}
          pauseOnHover={false}
          position="top-left"
          transition={Slide}
          closeButton={false}
          stacked
        />
        <Canvas hasLoginToken={hasLoginToken}>{!hasLoginToken ? <Login /> : <User />}</Canvas>
        <CardContent />
      </div>
    </HydrationBoundary>
  );
}
