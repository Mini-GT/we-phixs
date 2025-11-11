import { ErrorContentProps } from "@repo/types";
import { AlertTriangle } from "lucide-react";

export default function ErrorContent({ message, details }: ErrorContentProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 text-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md">
        <div className="flex flex-col items-center gap-4">
          <AlertTriangle className="text-red-500 w-12 h-12" />
          <h1 className="text-2xl font-semibold text-gray-800">{message}</h1>
          <p className="text-gray-600">{details}</p>
          <a
            href="/"
            className="mt-4 inline-block bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
