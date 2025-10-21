import { MapPin, X } from "lucide-react";
import IconButton from "./ui/iconButton";
import { InspectCardProps } from "@repo/types";
import { useSound } from "react-sounds";
import { convertToTimeAgo } from "@/utils/formatDate";

export default function InspectCard({ inspectedCellData, setInspectedCellData }: InspectCardProps) {
  const { play } = useSound("/sounds/close_inspect_pop.mp3");

  return (
    <div
      className={`absolute bottom-4 p-4 w-full max-w-1/5 bg-white rounded-4xl border-2 border-gray-300 transform transition-all duration-300 ease-out ${inspectedCellData ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}
    >
      <div className="flex">
        <div className="flex items-center gap-1 text-sm">
          <MapPin size={24} className="w-5 text-blue-600" />
          <span className="font-medium text-lg">
            Pixel: {inspectedCellData?.x}, {inspectedCellData?.y}
          </span>
          <span>
            {inspectedCellData?.placedAt
              ? `(${convertToTimeAgo(inspectedCellData.placedAt)})`
              : null}
          </span>
        </div>
        <IconButton className="text-gray-600 w-1 h-1 ml-auto border-none shadow-none">
          <X
            className="w-full h-full p-2"
            onClick={() => {
              play();
              setInspectedCellData(null);
            }}
          />
        </IconButton>
      </div>

      {/* Left section */}
      <div className="flex flex-col">
        <span className="text-md font-semibold text-gray-500 mt-0.5">
          {inspectedCellData?.user.name ? (
            <span> Painted by: {inspectedCellData.user.name} </span>
          ) : (
            <span>Not yet painted</span>
          )}
        </span>

        <div className="mt-2 flex items-center gap-2"></div>
      </div>
    </div>
  );
}
