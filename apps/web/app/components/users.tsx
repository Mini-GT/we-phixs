import { useEffect, useState } from "react";
// import { Search } from "lucide-react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { queryKeysType, UsersDataType } from "@repo/types";
import FetchLoading from "./loading/fetchLoading";
import { getQueryClient } from "@/getQueryClient";
import IconButton from "./ui/iconButton";
import { displayError } from "@/utils/displayError";
import { getAllUsers } from "api/user.service";
import TableComponent from "./leaderboard/table";

export default function UsersComponent() {
  // const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const queryClient = getQueryClient();

  const { data, isFetching, isPlaceholderData, isError, error } =
    useQuery<UsersDataType>({
      queryKey: queryKeysType.getAllUsers(page),
      queryFn: () => getAllUsers(page),
      placeholderData: keepPreviousData,
      staleTime: 5000,
    });

  if (isError) {
    displayError(error);
  }

  useEffect(() => {
    if (!isPlaceholderData && data?.hasMore) {
      queryClient.prefetchQuery({
        queryKey: queryKeysType.getAllUsers(page + 1),
        queryFn: () => getAllUsers(page + 1),
      });
    }
  }, [data, isPlaceholderData, page, queryClient]);

  if (isFetching || !data) {
    return <FetchLoading />;
  }

  return (
    <div className="flex flex-col justify-between gap-2 w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 p-1 rounded-xl">
      <div className="w-full overflow-y-auto">
        {/* Filters */}
        {/* <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div> */}

        {/* Users List */}
        <TableComponent users={data.users} isFetching={isFetching} />
      </div>

      {/* Buttons */}
      <div className="flex justify-between gap-5">
        <IconButton
          className="bg-amber-50 w-full"
          onClick={() => setPage((old) => Math.max(old - 1, 0))}
          disabled={page === 1}
        >
          Previous
        </IconButton>
        <IconButton
          className="bg-amber-200 w-full"
          onClick={() => {
            setPage((old) => (data?.hasMore ? old + 1 : old));
          }}
          disabled={isPlaceholderData || !data?.hasMore}
        >
          Next
        </IconButton>
      </div>
    </div>
  );
}
