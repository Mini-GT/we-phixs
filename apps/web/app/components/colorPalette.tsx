import { Brush, X } from "lucide-react";
import IconButton from "./ui/iconButton";
import PrimaryButton from "./ui/primaryButton";
import { useAppSounds } from "../hooks/useSounds";
import { maxPaintCharges } from "./canvas";

const colors = [
  "#000000",
  "#4a4a4a",
  "#7a7a7a",
  "#a0a0a0",
  "#d1d1d1",
  "#ffffff",
  "#b91c1c",
  "#7f1d1d",
  "#ef4444",
  "#f87171",
  "#ea580c",
  "#f97316",
  "#f59e0b",
  "#facc15",
  "#fef08a",
  "#a16207",
  "#4d7c0f",
  "#16a34a",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#0891b2",
  "#0ea5e9",
  "#38bdf8",
  "#60a5fa",
  "#2563eb",
  "#4338ca",
  "#6d28d9",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
  "#78350f",
  "#92400e",
  "#b45309",
  "#eab308",
  "#a3e635",
  "#65a30d",
  "#3f6212",
  "#166534",
  "#14532d",
  "#064e3b",
  "#075985",
  "#1e3a8a",
  "#334155",
  "#64748b",
  "#94a3b8",
  "#e2e8f0",
];

type ColorPaletteProps = {
  cooldown: number;
  paintCharges: number;
  selectedColor: string | null;
  setSelectedColor: (color: string) => void;
  isOpen: boolean;
  paintBtn: () => void;
};

export default function ColorPalette({
  cooldown,
  paintCharges,
  selectedColor,
  setSelectedColor,
  isOpen,
  paintBtn,
}: ColorPaletteProps) {
  const { playBtnSoft } = useAppSounds();

  return (
    <div
      className={`absolute bottom-0 p-4 w-screen bg-white rounded-t-4xl border-2 border-gray-300 transform transition-all duration-300 ease-out ${isOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}
    >
      <div className="flex items-center justify-between">
        {selectedColor && (
          <div className="flex items-center gap-2">
            <span className="text-gray-600 font-bold">Selected: </span>
            <span className="w-6 h-6 rounded border" style={{ backgroundColor: selectedColor }} />
            {/* <span className="text-sm">{selected}</span> */}
          </div>
        )}
        <IconButton className="text-gray-600 w-1 h-1 ml-auto border border-gray-300">
          <X className="w-full h-full p-2" onClick={paintBtn} />
        </IconButton>
      </div>
      <div className="grid grid-cols-30 mt-3 mb-4 gap-1">
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
      <PrimaryButton
        onClick={paintBtn}
        className="text-2xl m-auto py-4 px-7 flex items-center gap-2"
      >
        <Brush size={20} fill="white" />
        <div className="flex items-center gap-2">
          Paint <span>{paintCharges}</span>/30
          {paintCharges < maxPaintCharges && <span className="text-sm">{`(00:${cooldown})`}</span>}
        </div>
      </PrimaryButton>
    </div>
  );
}
