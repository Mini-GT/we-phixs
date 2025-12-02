import { Brush, X } from "lucide-react";
import IconButton from "./ui/iconButton";
import PrimaryButton from "./ui/primaryButton";
import { ToolType } from "@repo/types";
import { useSound } from "react-sounds";
import { maxCharges } from "@/hooks/usePaintCharges";

const colors = [
  "#000000",
  "#3c3c3c",
  "#787878",
  "#aaaaaa",
  "#d2d2d2",
  "#ffffff",
  "#600018",
  "#a50e1e",
  "#ed1c24",
  "#fa8072",
  "#e45c1a",
  "#ff7f27",
  "#f6aa09",
  "#f9dd3b",
  "#fffabc",
  "#9c8431",
  "#c5ad31",
  "#e8d45f",
  "#4a6b3a",
  "#5a944a",
  "#84c573",
  "#0eb968",
  "#13e67b",
  "#87ff5e",
  "#0c816e",
  "#10aea6",
  "#13e1be",
  "#0f799f",
  "#60f7f2",
  "#bbfaf2",
  "#28509e",
  "#4093e4",
  "#7dc7ff",
  "#4d31b8",
  "#6b50f6",
  "#99b1fb",
  "#4a4284",
  "#7a71c4",
  "#b5aef1",
  "#780c99",
  "#aa38b9",
  "#e09ff9",
  "#cb007a",
  "#ec1f80",
  "#f38da9",
  "#9b5249",
  "#d18078",
  "#fab6a4",
  "#684634",
  "#956821",
  "#dba463",
  "#7b6352",
  "#9c846b",
  "#d6b594",
  "#d18051",
  "#f8b277",
  "#ffc5a5",
  "#6d643f",
  "#948c6b",
  "#cdc59e",
  "#333941",
  "#6d758d",
  "#b3b9d1",
  "#696969",
];

type ColorPaletteProps = {
  displaySeconds: number;
  paintCharges: number;
  selectedColor: string | null;
  setSelectedColor: (color: string) => void;
  paintBtn: (tool: ToolType["tool"]) => void;
  tool: ToolType["tool"];
};

export default function ColorPalette({
  displaySeconds,
  paintCharges,
  selectedColor,
  setSelectedColor,
  paintBtn,
  tool,
}: ColorPaletteProps) {
  const { play: playBtnSoft } = useSound("/sounds/button_soft_double.mp3", {
    rate: 1.6,
  });

  return (
    <div
      className={`absolute -bottom-4 p-4 w-screen bg-white rounded-t-4xl border-2 border-gray-300 transform transition-all duration-300 ease-out ${tool === "paint" ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}
    >
      <div className="flex items-center justify-between">
        {selectedColor && (
          <div className="flex items-center gap-2">
            <span className="text-gray-600 font-bold">Selected: </span>
            <span
              className="w-6 h-6 rounded border"
              style={{ backgroundColor: selectedColor }}
            />
            {/* <span className="text-sm">{selected}</span> */}
          </div>
        )}
        <IconButton className="text-gray-600 ml-auto border border-gray-300 border-none shadow-none">
          <X
            className="w-full h-full p-2"
            onClick={() => paintBtn("inspect")}
          />
        </IconButton>
      </div>
      <div className="h-30 md:h-full overflow-x-auto">
        <div className="grid grid-cols-10 sm:grid-cols-20 md:grid-cols-32 gap-1">
          {colors.map((color, i) => (
            <button
              key={i}
              onClick={() => {
                setSelectedColor(color);
                playBtnSoft();
              }}
              className={`
              w-full h-8 rounded-md border cursor-pointer 
              ${selectedColor === color ? "border-blue-500 border-3" : "border-gray-300"}
            `}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
      <PrimaryButton
        onClick={() => paintBtn("inspect")}
        className={`text-2xl m-auto mt-2 py-4 px-7 flex ${displaySeconds ? "w-65" : "w-55"} items-center justify-center gap-2`}
      >
        <Brush size={20} fill="white" />
        <div className="flex items-center gap-1">
          Paint <span>{paintCharges}</span>/{maxCharges}
          {paintCharges < maxCharges &&
            displaySeconds <= 30 &&
            displaySeconds > 0 && (
              <span className="text-sm">00:{displaySeconds}s</span>
            )}
        </div>
      </PrimaryButton>
    </div>
  );
}
