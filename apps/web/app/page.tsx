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
import { logoutUser } from "api/logout.service";
import { getGuildByUserId } from "api/guild.service";

export default async function Home() {
  const jwtsecret = process.env.jwtsecretKey;
  const queryClient = getQueryClient();
  const cookieStore = await cookies();

  const hasLoginToken = cookieStore.get("hasLoginToken")?.value;
  const loginToken = cookieStore.get("loginToken")?.value;
  const guildInvitationCode = cookieStore.get("guildInvite")?.value;

  if (loginToken && jwtsecret) {
    const { id, exp } = verifyJwt(loginToken, jwtsecret) as {
      id: string;
      exp: number;
    };
    const isExpired = isTokenExpired(exp);

    if (isExpired) {
      await logoutUser();
    } else {
      await Promise.allSettled([
        await queryClient.prefetchQuery({
          queryKey: queryKeysType.canvas(1),
          queryFn: async () => await getCanvasById(1),
        }),
        // --- not prefetching cause i wanna flex the cool loading ui hehe ---
        // await queryClient.prefetchQuery({
        //   queryKey: queryKeysType.allLeaderboard,
        //   queryFn: async () => await getAllLeaderboard(),
        // }),
        await queryClient.prefetchQuery({
          queryKey: queryKeysType.paintCharges,
          queryFn: () => getPaintCharges(),
        }),
        await queryClient.prefetchQuery({
          queryKey: queryKeysType.guildByUserId(id),
          queryFn: () => getGuildByUserId(),
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
        <Canvas hasLoginToken={hasLoginToken}>
          {!hasLoginToken ? <Login /> : <User />}
        </Canvas>
        <CardContent guildInvitationCode={guildInvitationCode} />
      </div>
    </HydrationBoundary>
  );
}
