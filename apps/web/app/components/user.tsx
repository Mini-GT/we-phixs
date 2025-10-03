import { getQueryClient } from "@/getQueryClient";
import { verifyJwt } from "@/utils/jwt";
import { queryKeysType } from "@repo/types";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getMe } from "api/user.service";
import { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import Avatar from "./avatar";

const jwtsecret = process.env.jwtsecretKey;

export default async function User() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const queryClient = getQueryClient();
  let userId: string | null = null;

  if (token) {
    const decoded = verifyJwt(token, jwtsecret!) as JwtPayload;
    userId = decoded.id;

    // verify expiration
    if (decoded.exp) {
      if (decoded.exp * 1000 > Date.now()) {
        // prefetch get me data
        await queryClient.prefetchQuery({
          queryKey: queryKeysType.me(userId!),
          queryFn: () => getMe(userId!),
        });
      }
    }
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Avatar userId={userId} />
    </HydrationBoundary>
  );
}
