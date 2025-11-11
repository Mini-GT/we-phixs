import { X } from "lucide-react";
import { InspectCardProps } from "@repo/types";
import { useSound } from "react-sounds";
import { convertToTimeAgo } from "@/utils/formatDate";

export default function InspectCard({ inspectedCellData, setInspectedCellData }: InspectCardProps) {
  const { play } = useSound("/sounds/close_inspect_pop.mp3");

  return (
    <div
      className={`absolute bottom-4 group w-[300px] bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-md border border-gray-200 p-3.5 transform transition-all duration-300 ease-out ${inspectedCellData ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}
    >
      <div className="flex items-start justify-between gap-1">
        <div className="flex items-center gap-3 flex-1">
          {/* Animated icon */}
          <div
            className={`rounded-lg p-2 border-1 group-hover:scale-110 transition-transform`}
            style={{ backgroundColor: inspectedCellData?.color || "white" }}
          >
            <svg className="w-4 h-4 text-white" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-gray-900">
                Pixel: {inspectedCellData?.x}, {inspectedCellData?.y}
              </span>
              {inspectedCellData?.user.name && <span className="text-xs text-gray-500">•</span>}
              <span className="text-xs text-gray-500">
                {inspectedCellData?.placedAt
                  ? `(${convertToTimeAgo(inspectedCellData.placedAt)})`
                  : null}
              </span>
            </div>
            <p>
              <span className="font-semibold text-blue-600">
                {inspectedCellData?.user.name ? (
                  <>
                    <span className="text-xs text-gray-600">by: </span>
                    <span>{inspectedCellData.user.name} </span>
                  </>
                ) : (
                  <span>Not yet painted</span>
                )}
              </span>
            </p>
          </div>
        </div>

        <button
          className="p-1.5 hover:bg-gray-100 rounded-lg cursor-pointer"
          onClick={() => {
            play();
            setInspectedCellData(null);
          }}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
