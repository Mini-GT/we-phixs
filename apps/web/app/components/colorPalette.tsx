import { useState } from "react"

const colors = [
  "#000000", "#4a4a4a", "#7a7a7a", "#a0a0a0", "#d1d1d1", "#ffffff",
  "#b91c1c", "#7f1d1d", "#ef4444", "#f87171", "#ea580c", "#f97316",
  "#f59e0b", "#facc15", "#fef08a", "#a16207", "#4d7c0f", "#16a34a",
  "#22c55e", "#10b981", "#14b8a6", "#0891b2", "#0ea5e9", "#38bdf8",
  "#60a5fa", "#2563eb", "#4338ca", "#6d28d9", "#a855f7", "#d946ef",
  "#ec4899", "#f43f5e", "#78350f", "#92400e", "#b45309", "#eab308",
  "#a3e635", "#65a30d", "#3f6212", "#166534", "#14532d", "#064e3b",
  "#075985", "#1e3a8a", "#334155", "#64748b", "#94a3b8", "#e2e8f0",
]

type ColorPaletteProps = {
  selected: string | null
  setSelected: (color: string) => void;
}

export default function ColorPalette({ selected, setSelected }: ColorPaletteProps) {

  return (
    <div className="p-4 w-full bg-white rounded-t-xl border border-2 border-gray-300">
      {/* <h2 className="text-lg font-semibold mb-2">Paint pixel</h2> */}
      <div className="grid grid-cols-30 gap-1">
        {colors.map((color, i) => (
          <button
            key={i}
            onClick={() => setSelected(color)}
            className={`
              w-full h-8 rounded-md border cursor-pointer 
              ${selected === color ? "border-blue-500 border-3" : "border-gray-300"}
            `}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      {selected && (
        <div className="mt-3 flex items-center gap-2">
          <span className="w-6 h-6 rounded border" style={{ backgroundColor: selected }} />
          <span className="text-sm">{selected}</span>
        </div>
      )}
    </div>
  )
}