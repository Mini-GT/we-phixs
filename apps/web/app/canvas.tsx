"use client";
import { useRef, useEffect, useState } from "react";
import { usePressedKeys } from "./hooks/presskeys";
import PrimaryButton from "./ui/primaryButton";
import IconButton from "./ui/iconButton";
import { BarChart, Brush, Icon, Search } from "lucide-react";
import ColorPalette from "./components/colorPalette";

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
  const [selected, setSelected] = useState<string | null>(null)
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
    // ctx.strokeStyle = "white";
    // ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.fillStyle = "white"
    ctx.fillRect(0 , 0, gridSize * cellSize, gridSize * cellSize)
    // for (let x = 0; x <= gridSize; x++) {
    //   ctx.beginPath();
    //   ctx.moveTo(x * cellSize, 0);
    //   ctx.lineTo(x * cellSize, gridSize * cellSize);
    //   ctx.stroke();
    // }
    // for (let y = 0; y <= gridSize; y++) {
    //   ctx.beginPath();
    //   ctx.moveTo(0, y * cellSize);
    //   ctx.lineTo(gridSize * cellSize, y * cellSize);
    //   ctx.stroke();
    // }

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
      const scaleWidth = canvas.width * scale + 10; // fix: x offset when placing a cell (not long term as it only fixes the center of the screen and not the sides)
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
      setFilledCells(prev => {
        // overwrite if its filled with color instead of placing it on top
        const existingIndex = prev.findIndex(c => c.x === cellX && c.y === cellY);

        if (existingIndex !== -1) {
          const updated = [...prev];
          const existingCell = updated[existingIndex]!; // non-null assertion, safe because of the check
          updated[existingIndex] = {
            x: existingCell.x,
            y: existingCell.y,
            color: selected || "black"
          };
          return updated;
        }

        return [...prev, { x: cellX, y: cellY, color: selected || "black" }];
      });

    };

    canvas.addEventListener("click", handleClick);
    return () => canvas.removeEventListener("click", handleClick);
  }, [panOffset, scale, isDragging, selected]);

  // wheel pan/zoom
  useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const handleWheel = (event: WheelEvent) => {
    event.preventDefault();
    
    const rect = canvas.getBoundingClientRect();
    const centerX = event.clientX - rect.left;
    const centerY = event.clientY - rect.top;
    
    const zoomIntensity = 0.001;
    const delta = event.deltaY * -zoomIntensity;
    
    setScale(prevScale => {
      let newScale = prevScale + delta;
      if (newScale < 0.2) newScale = 0.2;
      if (newScale > 5) newScale = 5;
      
      // calculate world coordinates under the mouse BEFORE scaling
      const scaleWidth = canvas.width * prevScale;
      const scaleHeight = canvas.height * prevScale;
      const scaleOffSetX = (scaleWidth - canvas.width) / 2;
      const scaleOffSetY = (scaleHeight - canvas.height) / 2;
      
      const worldX = (centerX + scaleOffSetX - panOffset.x * prevScale) / prevScale;
      const worldY = (centerY + scaleOffSetY - panOffset.y * prevScale) / prevScale;
      
      // calculate new offsets after scaling
      const newScaleWidth = canvas.width * newScale;
      const newScaleHeight = canvas.height * newScale;
      const newScaleOffSetX = (newScaleWidth - canvas.width) / 2;
      const newScaleOffSetY = (newScaleHeight - canvas.height) / 2;
      
      // Adjust pan offset to keep the world point under the mouse
      const newPanX = (centerX + newScaleOffSetX - worldX * newScale) / newScale;
      const newPanY = (centerY + newScaleOffSetY - worldY * newScale) / newScale;
      
      setPanOffset({ x: newPanX, y: newPanY });
      
      return newScale;
    });
  };

    canvas.addEventListener("wheel", handleWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", handleWheel);
  }, [panOffset]);

  // useEffect(() => {
  //   const handleWheel = (event: WheelEvent) => {
  //     event.preventDefault();
  //     const zoomIntensity = 0.001; // smoother zoom
  //     const delta = event.deltaY * -zoomIntensity;

  //     setScale(prev => {
  //       let newScale = prev + delta;
  //       if (newScale < 0.2) newScale = 0.2; // prevent zoom too small
  //       if (newScale > 5) newScale = 5;     // prevent infinite zoom
  //       return newScale;
  //     });
  //   };

  //   window.addEventListener("wheel", handleWheel, { passive: false });
  //   return () => window.removeEventListener("wheel", handleWheel);
  // }, []);

  // mouse drag panning
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true);
    setIsDragging(false);
    setLastMouse({ x: e.clientX, y: e.clientY});
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    const dx = e.clientX - lastMouse.x;
    const dy = e.clientY - lastMouse.y;

    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) { 
      setIsDragging(true);
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

  const zoomToCenter = (zoomDelta: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use center of canvas as zoom point
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    setScale(prevScale => {
      let newScale = prevScale + zoomDelta;
      if (newScale < 0.2) newScale = 0.2;
      if (newScale > 5) newScale = 5;
      
      // Calculate world coordinates at center BEFORE scaling
      const scaleWidth = canvas.width * prevScale;
      const scaleHeight = canvas.height * prevScale;
      const scaleOffSetX = (scaleWidth - canvas.width) / 2;
      const scaleOffSetY = (scaleHeight - canvas.height) / 2;
      
      const worldX = (centerX + scaleOffSetX - panOffset.x * prevScale) / prevScale;
      const worldY = (centerY + scaleOffSetY - panOffset.y * prevScale) / prevScale;
      
      // Calculate new offsets after scaling
      const newScaleWidth = canvas.width * newScale;
      const newScaleHeight = canvas.height * newScale;
      const newScaleOffSetX = (newScaleWidth - canvas.width) / 2;
      const newScaleOffSetY = (newScaleHeight - canvas.height) / 2;
      
      // Adjust pan offset to keep the center point centered
      const newPanX = (centerX + newScaleOffSetX - worldX * newScale) / newScale;
      const newPanY = (centerY + newScaleOffSetY - worldY * newScale) / newScale;
      
      setPanOffset({ x: newPanX, y: newPanY });
      
      return newScale;
    });
  };

  return (
    <div>
      <div className="absolute flex flex-col gap-2 m-2 right-0">
        <PrimaryButton>Log in</PrimaryButton>
        <div className="flex flex-col gap-2 items-end">
          {/* <IconButton>
            <Search className="w-5 h-5 text-gray-600" />
          </IconButton> */}
          <IconButton>
            <BarChart className="w-5 h-5 text-gray-600" />
          </IconButton>

          <IconButton
            onClick={() => zoomToCenter(-0.1)}
          >
            <span className="font-bold text-gray-600">-</span>
          </IconButton>

          <IconButton
            onClick={() => zoomToCenter(0.1)}
          >
            <span className="font-bold text-gray-600">+</span>
          </IconButton>
        </div>
      </div>

      <div className="absolute flex justify-center w-full bottom-0">
        {/* <PrimaryButton className="text-2xl py-4 px-7 flex items-center gap-2"><Brush size={20} fill="white"/>Paint</PrimaryButton> */}
        <ColorPalette selected={selected} setSelected={setSelected} />
      </div>
      <canvas 
        ref={canvasRef} 
        className={`bg-[#F5F2EE] border w-full h-screen ${isDragging ? "dragging" : ""}`} 
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
}
