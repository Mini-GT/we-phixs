import React, { useEffect, useState } from "react";
import { Search, Filter, Calendar, User, MessageSquare } from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import { getCategoryColor } from "@/utils/getCategoryColor";
import { keepPreviousData, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { queryKeysType, ReportsDataType } from "@repo/types";
import { getReports } from "api/reports.service";
import FetchLoading from "./loading/fetchLoading";
import { getQueryClient } from "@/getQueryClient";
import IconButton from "./ui/iconButton";
import { displayError } from "@/utils/displayError";

export default function Reports() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [page, setPage] = useState(1);
  const queryClient = getQueryClient();

  const { data, isFetching, isPlaceholderData, isError, error } = useQuery<ReportsDataType>({
    queryKey: queryKeysType.reports(page),
    queryFn: () => getReports(page),
    placeholderData: keepPreviousData,
    staleTime: 5000,
  });

  if (isError) {
    displayError(error);
  }

  useEffect(() => {
    if (!isPlaceholderData && data?.hasMore) {
      queryClient.prefetchQuery({
        queryKey: queryKeysType.reports(page + 1),
        queryFn: () => getReports(page + 1),
      });
    }
  }, [data, isPlaceholderData, page, queryClient]);

  if (isFetching || !data) {
    return <FetchLoading />;
  }

  const categories = ["all", ...new Set(data.reports.map((r) => r.category).filter(Boolean))];

  const filteredReports = data.reports.filter((report) => {
    const matchesSearch =
      report.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.user.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === "all" || report.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col justify-between gap-2 w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 p-1 rounded-xl">
      <div className="w-full overflow-y-auto">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
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

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Total Reports</p>
                <p className="text-3xl font-bold text-slate-800">{data.reports.length}</p>
              </div>
              <MessageSquare className="w-10 h-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Filtered Results</p>
                <p className="text-3xl font-bold text-slate-800">{filteredReports.length}</p>
              </div>
              <Filter className="w-10 h-10 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Categories</p>
                <p className="text-3xl font-bold text-slate-800">{categories.length - 1}</p>
              </div>
              <Calendar className="w-10 h-10 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 text-lg">No reports found</p>
            </div>
          ) : (
            filteredReports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(report.category)}`}
                      >
                        {report.category || "Uncategorized"}
                      </span>
                      <span className="text-xs text-slate-500">ID: #{report.id}</span>
                    </div>

                    <h3 className="text-xl font-semibold text-slate-800 mb-2">
                      {report.subject || "No Subject"}
                    </h3>

                    <p className="text-slate-600 mb-4">{report.message || "No message provided"}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{report.user.name}</span>
                        {/* <span className="text-slate-400">({report.user.email})</span> */}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(report.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap">
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
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
