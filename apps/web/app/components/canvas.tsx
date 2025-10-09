"use client";
import { useRef, useEffect, useState } from "react";
import PrimaryButton from "./ui/primaryButton";
import IconButton from "./ui/iconButton";
import { Brush, FileLock, ZoomInIcon, ZoomOutIcon } from "lucide-react";
import { CanvasType, Cell, queryKeysType } from "@repo/types";
import { useAppSounds } from "@/hooks/useSounds";
import ColorPalette from "./colorPalette";
import { useWindowSize } from "@react-hook/window-size";
import { useSelectedContent } from "@/context/selectedContent.context";
import Image from "next/image";
import { useUser } from "@/context/user.context";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { getCanvasById, updateCanvasPixel } from "api/canvas.service";
import { getQueryClient } from "@/getQueryClient";

type CanvasProp = {
  children: React.ReactNode;
};

export default function Canvas({ children }: CanvasProp) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState<number>(1);
  const [filledCells, setFilledCells] = useState<Cell[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [totalPaints, setTotalPaints] = useState<number>(50);
  const [countdown, setCountdown] = useState<number>(30);
  const [shouldCountDown, setShouldCountDown] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const sounds = useAppSounds();
  const [width, height] = useWindowSize();
  const { setSelectedContent } = useSelectedContent();
  const { user } = useUser();

  const queryClient = getQueryClient();

  // Optimistic update
  const mutation = useMutation({
    mutationFn: updateCanvasPixel,
    onMutate: async (newPixel) => {
      // invalidate query
      await queryClient.cancelQueries({ queryKey: ["canvas", canvasData.id] });

      const prevData = queryClient.getQueryData<any>(["canvas", canvasData.id]);
      console.log(prevData);
      queryClient.setQueryData(["canvas", canvasData.id], (old: any) => {
        if (!old) return old;

        const updatedPixels = old.pixels.some((p: any) => p.x === newPixel.x && p.y === newPixel.y)
          ? old.pixels.map((p: any) =>
              p.x === newPixel.x && p.y === newPixel.y
                ? { ...p, color: newPixel.color, userId: newPixel.userId }
                : p
            )
          : [...old.pixels, newPixel];

        return { ...old, pixels: updatedPixels };
      });

      return { prevData };
    },

    // rollback on error: If API fails, cache is restored.
    onError: (_err, _newPixel, context) => {
      if (context?.prevData) {
        queryClient.setQueryData(["canvas", canvasData.id], context.prevData);
      }
    },

    // refetch on settle
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["canvas", canvasData.id] });
    },
  });

  const { data: canvasData } = useSuspenseQuery<CanvasType>({
    queryKey: queryKeysType.canvas(1),
    queryFn: () => getCanvasById(1),
  });

  const cellSize = 10;
  const gridSize = 300;

  // draw everything
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

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
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, gridSize * cellSize, gridSize * cellSize);
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
    canvasData.pixels.forEach((cell) => {
      ctx.fillStyle = cell.color || "";
      ctx.fillRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);
    });

    ctx.restore();
  }, [panOffset, scale, width, height, canvasData.pixels]);

  // handle clicks -> add cell
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleClick = (e: MouseEvent) => {
      if (isDragging || !totalPaints || !selectedColor) return;
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
      if (cellX < 0 || cellY < 0 || cellX >= gridSize || cellY >= gridSize) return;

      // API call to update the canvas
      // updateCanvasPixel({canvasData.id, cellX, cellY, selectedColor, user?.id});
      mutation.mutate({
        canvasId: canvasData.id,
        x: cellX,
        y: cellY,
        color: selectedColor,
        userId: user?.id,
      });

      // store in state
      // ---- commented as we are using the mutation for optimistic ui instead of using state ----
      // setFilledCells((prev) => {
      //   // overwrite if its filled with color instead of placing it on top
      //   const existingIndex = prev.findIndex((c) => c.x === cellX && c.y === cellY);

      //   if (existingIndex !== -1) {
      //     const updated = [...prev];
      //     const existingCell = updated[existingIndex]!; // non-null assertion, safe because of the check
      //     updated[existingIndex] = {
      //       x: existingCell.x,
      //       y: existingCell.y,
      //       color: selectedColor,
      //     };
      //     return updated;
      //   }

      //   return [...prev, { x: cellX, y: cellY, color: selectedColor }];
      // });

      setTotalPaints((prev) => prev - 1);
    };

    canvas.addEventListener("click", handleClick);
    return () => canvas.removeEventListener("click", handleClick);
  }, [panOffset, scale, isDragging, selectedColor, totalPaints]);

  // start countdown (we are separating this to stop the countdown from freezing the timer whenever user clicks)
  useEffect(() => {
    totalPaints < 50 ? setShouldCountDown(true) : setShouldCountDown(false);
  }, [totalPaints]);

  // refill paints if its less than 50 every 30 secs
  useEffect(() => {
    if (!shouldCountDown) return;

    let timer: NodeJS.Timeout;
    timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setTotalPaints((current) => (current < 50 ? current + 1 : current));
          sounds.playSuccess();
          return 30; // reset countdown
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [shouldCountDown]);

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

      setScale((prevScale) => {
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

        // adjust pan offset to keep the world point under the mouse
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

  // set drag to false so the cursor gets change
  useEffect(() => {
    if (!isPanning) setIsDragging(false);
  }, [isPanning]);

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
      setIsDragging(true);
    }

    setPanOffset((prev) => ({
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

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    setScale((prevScale) => {
      let newScale = prevScale + zoomDelta;
      if (newScale < 0.2) newScale = 0.2;
      if (newScale > 5) newScale = 5;

      const scaleWidth = canvas.width * prevScale;
      const scaleHeight = canvas.height * prevScale;
      const scaleOffSetX = (scaleWidth - canvas.width) / 2;
      const scaleOffSetY = (scaleHeight - canvas.height) / 2;

      const worldX = (centerX + scaleOffSetX - panOffset.x * prevScale) / prevScale;
      const worldY = (centerY + scaleOffSetY - panOffset.y * prevScale) / prevScale;

      const newScaleWidth = canvas.width * newScale;
      const newScaleHeight = canvas.height * newScale;
      const newScaleOffSetX = (newScaleWidth - canvas.width) / 2;
      const newScaleOffSetY = (newScaleHeight - canvas.height) / 2;

      const newPanX = (centerX + newScaleOffSetX - worldX * newScale) / newScale;
      const newPanY = (centerY + newScaleOffSetY - worldY * newScale) / newScale;

      setPanOffset({ x: newPanX, y: newPanY });

      return newScale;
    });
  };

  const paintBtn = () => {
    setIsOpen((prev) => !prev);
    isOpen ? sounds.playPnlExpand() : sounds.playPnlCollapse();
  };

  return (
    <div>
      <div className="absolute flex flex-col gap-2 m-4 right-0">
        {children}
        <div className="flex flex-col gap-2 items-end">
          {/* <IconButton>
            <Search className="w-5 h-5 text-gray-600" />
          </IconButton> */}
          <IconButton onClick={() => setSelectedContent("leaderboard")}>
            <Image width={24} height={24} src="/leaderboard.svg" alt="Leaderboard" />
          </IconButton>

          {user && user.role === "ADMIN" && (
            <IconButton onClick={() => setSelectedContent("adminPanel")}>
              <FileLock />
            </IconButton>
          )}

          <IconButton onClick={() => zoomToCenter(0.1)}>
            <ZoomInIcon className="text-gray-500" />
          </IconButton>

          <IconButton onClick={() => zoomToCenter(-0.1)}>
            <ZoomOutIcon className="text-gray-500" />
          </IconButton>
        </div>
      </div>

      <div className="absolute flex flex-col left-1/2 right-1/2 items-center justify-center bottom-0">
        <ColorPalette
          countdown={countdown}
          totalPaints={totalPaints}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          isOpen={isOpen}
          paintBtn={paintBtn}
        />
        {!isOpen && (
          <PrimaryButton
            className="text-2xl py-4 px-7 flex max-w-fit bottom-0 mb-4 items-center gap-2"
            onClick={paintBtn}
          >
            <Brush size={20} fill="white" />
            <div className="flex items-center gap-1">
              Paint <span>{totalPaints}</span>/50
              {totalPaints < 50 && <span className="text-sm">{`(00:${countdown})`}</span>}
            </div>
          </PrimaryButton>
        )}
      </div>
      <canvas
        ref={canvasRef}
        className={`bg-[#F5F2EE] border w-full h-screen square-cursor ${isDragging ? "dragging" : ""}`}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
}
