type NewErrorsType = {
  category: string;
  subject: string;
  message: string;
};

type CreateReportType = NewErrorsType & { userId: string };

type ReportData = {
  id: number;
  category: "Bug Report" | "Feature Request" | "Other";
  message: string;
  subject: string;
  createdAt: Date;
  user: {
    name: string;
  };
};

type ReportsDataType = {
  reports: ReportData[];
  hasMore: number;
};

export type { NewErrorsType, CreateReportType, ReportsDataType };
