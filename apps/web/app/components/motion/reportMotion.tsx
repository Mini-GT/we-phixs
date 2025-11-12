import { Card } from "../ui/card";
import { type RefObject } from "react";
import MotionComponent from "./motion";
import ReportForm from "../form/reportForm";
import { AlertCircle, X } from "lucide-react";
import IconButton from "../ui/iconButton";
import { useSelectedContent } from "@/context/selectedContent.context";

export default function ReportFormMotion({
  cardRef,
}: {
  cardRef: RefObject<HTMLDivElement | null>;
}) {
  const { setSelectedContent } = useSelectedContent();

  return (
    <MotionComponent>
      <Card
        ref={cardRef}
        className={`relative w-[95vw] max-w-[800px] max-h-[90vh] overflow-y-auto scrollbar-custom gap-0 p-6 bg-white border-cyan-300 rounded-4xl`}
      >
        <div className="flex items-start justify-between gap-6">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-8 h-8 text-red-500" />
              <h1 className="text-xl sm:text-3xl font-bold text-slate-800">Submit a Report</h1>
            </div>
            <p className="text-slate-600">
              Help us improve by reporting issues or sharing feedback
            </p>
          </div>
          <IconButton
            className="top-2 right-2 shadow-none border-none text-gray-600 hover:text-gray-900"
            aria-label="Close form"
            onClick={() => setSelectedContent(null)}
          >
            <X size={20} />
          </IconButton>
        </div>

        <ReportForm />
      </Card>
    </MotionComponent>
  );
}
