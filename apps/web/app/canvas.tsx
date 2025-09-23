"use client";
import { useRef, useEffect, useState } from "react";
import { usePressedKeys } from "./hooks/presskeys";

type Cell = { x: number; y: number; color: string };

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [filledCells, setFilledCells] = useState<Cell[]>([]);
  const [tool, setTool] = useState<"draw" | "move" | null>(null)
  const pressKeys = usePressedKeys()
  const [isDragging, setIsDragging] = useState(false)

  const cellSize = 10;
  const gridSize = 300;

  // draw everything
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // calculate scaled zoom out/in offset
    const scaleWidth = canvas.width * scale;
    const scaleHeight = canvas.height * scale;
    const scaleOffSetX = (scaleWidth - canvas.width) / 2;
    const scaleOffSetY = (scaleHeight - canvas.height) / 2;

    ctx.save();
    ctx.translate(panOffset.x * scale - scaleOffSetX, panOffset.y * scale - scaleOffSetY);
    ctx.scale(scale, scale);

    // draw grid
    ctx.strokeStyle = "white";
    ctx.fillStyle = "white"
    ctx.fillRect(0 , 0, gridSize * cellSize, gridSize * cellSize)
    for (let x = 0; x <= gridSize; x++) {
      ctx.beginPath();
      ctx.moveTo(x * cellSize, 0);
      ctx.lineTo(x * cellSize, gridSize * cellSize);
      ctx.stroke();
    }
    for (let y = 0; y <= gridSize; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * cellSize);
      ctx.lineTo(gridSize * cellSize, y * cellSize);
      ctx.stroke();
    }

    // draw filled cells
    filledCells.forEach(cell => {
      ctx.fillStyle = cell.color;
      ctx.fillRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);
    });

    ctx.restore();
  }, [panOffset, scale, filledCells]);

  // handle clicks -> add cell
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleClick = (e: MouseEvent) => {
      if(isDragging) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // calculate scaled zoom out/in offset
      const scaleWidth = canvas.width * scale;
      const scaleHeight = canvas.height * scale;
      const scaleOffSetX = (scaleWidth - canvas.width) / 2;
      const scaleOffSetY = (scaleHeight - canvas.height) / 2;

      const adjustedX = (x + scaleOffSetX - panOffset.x * scale) / scale;
      const adjustedY = (y + scaleOffSetY - panOffset.y * scale) / scale;

      const cellX = Math.floor(adjustedX / cellSize);
      const cellY = Math.floor(adjustedY / cellSize);
      console.log(`Clicked cell: (${cellX}, ${cellY})`);

      // check bounds
      if(cellX < 0 || cellY < 0 || cellX >= gridSize || cellY >= gridSize) return;

      // store in state
      setFilledCells(prev => [...prev, { x: cellX, y: cellY, color: "yellow" }]);
    };

    canvas.addEventListener("click", handleClick);
    return () => canvas.removeEventListener("click", handleClick);
  }, [panOffset, scale, isDragging]);

  // wheel pan/zoom
  useEffect(() => {
  const handleWheel = (event: WheelEvent) => {
    event.preventDefault();
    const zoomIntensity = 0.001; // smoother zoom
    const delta = event.deltaY * -zoomIntensity;

    setScale(prev => {
      let newScale = prev + delta;
      if (newScale < 0.2) newScale = 0.2; // prevent zoom too small
      if (newScale > 5) newScale = 5;     // prevent infinite zoom
      return newScale;
    });
  };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  // mouse drag panning
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true);
    setIsDragging(false);
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    const dx = e.clientX - lastMouse.x;
    const dy = e.clientY - lastMouse.y;

    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) { 
      setIsDragging(true); // mark as drag
    }

    setPanOffset(prev => ({
      x: prev.x + dx,
      y: prev.y + dy,
    }));

    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  return (
    <div>
      <div className="flex gap-2 bg-white mb-2 text-black p-2">
        <button
          className="border px-2"
          onClick={() => setScale(prev => Math.max(0.2, prev - 0.1))}
        >
          -
        </button>
        <span>{new Intl.NumberFormat("en-GB",{ style: "percent" }).format(scale)}</span>
        <button
          className="border px-2"
          onClick={() => setScale(prev => prev + 0.1)}
        >
          +
        </button>
      </div>
      <canvas 
        ref={canvasRef} 
        className={`bg-black border w-full h-screen ${isDragging ? "dragging" : ""}`} 
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
}
