"use client";
import { useRef, useEffect, useState } from "react";
import PrimaryButton from "./ui/primaryButton";
import IconButton from "./ui/iconButton";
import {
  Brush,
  FileLock,
  MessageSquareWarning,
  ZoomInIcon,
  ZoomOutIcon,
} from "lucide-react";
import {
  CanvasType,
  Coordinantes,
  queryKeysType,
  ToolType,
  UpdateCanvasPixelProps,
} from "@repo/types";
import ColorPalette from "./colorPalette";
// import { useWindowSize } from "@react-hook/window-size";
import { useSelectedContent } from "@/context/selectedContent.context";
import Image from "next/image";
import { useUser } from "@/context/user.context";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { getCanvasById, updateCanvasPixel } from "api/canvas.service";
import { getQueryClient } from "@/getQueryClient";
import usePaintCharges, { PaintChargesDataType } from "@/hooks/usePaintCharges";
import { useSound } from "react-sounds";
import useSocket from "@/hooks/useSocket";
import useInspect from "@/hooks/useInspect";
import drawCross from "@/utils/drawcross";
import InspectCard from "./inspectCard";
import { displayError } from "@/utils/displayError";
import getNewScale from "@/hooks/useScale";
import { getTouchCenter, getTouchDistance } from "@/utils/touches";
import { getCellKey } from "@/utils/getCellKey";
import { adjustColorOpacity } from "@/utils/adjustColorOpacity";

type CanvasProp = {
  children: React.ReactNode;
  hasLoginToken: string | undefined;
};

export default function Canvas({ children, hasLoginToken }: CanvasProp) {
  // initialize socket
  const { filledCells, setFilledCells } = useSocket(hasLoginToken);

  const queryClient = getQueryClient();

  const { user } = useUser();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [panOffset, setPanOffset] = useState<Coordinantes>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [lastMouse, setLastMouse] = useState<Coordinantes>({ x: 0, y: 0 });
  const [scale, setScale] = useState<number>(1);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  // const [width, height] = useWindowSize();
  const { setSelectedContent } = useSelectedContent();
  const { paintCharges, setPaintCharges, setCooldownUntil, displaySeconds } =
    usePaintCharges(hasLoginToken || "");

  const { play: playPnlExpand } = useSound("/sounds/panel_expand.mp3");
  const { play: playPnlCollapse } = useSound("/sounds/panel_collapse.mp3");
  const { play: playPop } = useSound("/sounds/pop.mp3", {
    volume: 0.3,
  });
  const [tool, setTool] = useState<ToolType["tool"]>("inspect");
  const { inspectMutation, inspectedCellData, setInspectedCellData } =
    useInspect();
  const cellSize = 10;
  const gridSize = 300;
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(
    null
  );
  const [lastTouchCenter, setLastTouchCenter] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [optimisticCells, setOptimisticCells] = useState<
    Map<
      string,
      { x: number; y: number; color: string; previousColor: string | null }
    >
  >(new Map());

  // Optimistic update

  const mutation = useMutation({
    mutationFn: updateCanvasPixel,

    // -------- commented optimistic ui cause we are relying the updated canvas cell to the api (might uncomment this in the future... we'll see) --------
    onMutate: async (newPixel: UpdateCanvasPixelProps) => {
      // cancel any outgoing refetches for this canvas invalidate query
      await queryClient.cancelQueries({ queryKey: ["canvas", canvasData.id] });

      // get prev cache data
      const prevData: CanvasType = queryClient.getQueryData<any>([
        "canvas",
        canvasData.id,
      ]);

      // set a new cache data for optimistic ui
      const cellKey = getCellKey(newPixel.x, newPixel.y);

      // Check if this cell already has a color (from socket data)
      const existingCell = filledCells.find(
        (cell) => cell.x === newPixel.x && cell.y === newPixel.y
      );

      // Store the previous color for rollback (null if cell was empty)
      const previousColor = existingCell?.color || null;

      // Add optimistic cell with reduced opacity
      setOptimisticCells((prev) => {
        const newMap = new Map(prev);
        newMap.set(cellKey, {
          x: newPixel.x,
          y: newPixel.y,
          color: adjustColorOpacity(newPixel.color),
          previousColor: previousColor,
        });
        return newMap;
      });

      // return context for rollback
      return { prevData, cellKey, previousColor };
    },

    // rollback on error if API fails, cache is restored.
    onError: (err, newPixel, context) => {
      console.error(err);

      displayError(err);

      if (context?.cellKey) {
        // rollback to remove optimistic cell
        setOptimisticCells((prev) => {
          const newMap = new Map(prev);
          newMap.delete(context.cellKey);
          return newMap;
        });

        // if we rollback and there was a previous color, restore it in filledCells
        if (context.previousColor) {
          setFilledCells((prev) => {
            // check if the cell still exists in current state
            const cellExists = prev.some(
              (cell) => cell.x === newPixel.x && cell.y === newPixel.y
            );

            // if cell exist restore the previous color
            if (cellExists) {
              return prev.map((cell) =>
                cell.x === newPixel.x && cell.y === newPixel.y
                  ? { ...cell, color: context.previousColor! }
                  : cell
              );
            }

            return prev;
          });
        }
      }
    },
    onSuccess: (data: PaintChargesDataType) => {
      setPaintCharges(data.charges);
      setCooldownUntil(data.cooldownUntil);
      playPop();
    },
  });

  const { data: canvasData } = useSuspenseQuery<CanvasType>({
    queryKey: queryKeysType.canvas(1),
    queryFn: () => getCanvasById(1),
  });

  useEffect(() => {
    setFilledCells(canvasData.pixels);
  }, [canvasData, setFilledCells]);

  // draw everything
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctxRef.current = ctx;

    // use the canvas internal size as useWindowSize will have a different width and height in desktop and mobile size
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // calculate scaled zoom out/in offset
    const scaleWidth = canvas.width * scale;
    const scaleHeight = canvas.height * scale;
    const scaleOffSetX = (scaleWidth - canvas.width) / 2;
    const scaleOffSetY = (scaleHeight - canvas.height) / 2;

    ctx.save();
    ctx.translate(
      panOffset.x * scale - scaleOffSetX,
      panOffset.y * scale - scaleOffSetY
    );
    ctx.scale(scale, scale);

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, gridSize * cellSize, gridSize * cellSize);

    // create a set of confirmed cells
    const confirmedCellKeys = new Set(
      filledCells.map((cell) => getCellKey(cell.x, cell.y))
    );

    // create a map of cell coordinates to their colors for easy lookup
    const cellColorMap = new Map(
      filledCells.map((cell) => [getCellKey(cell.x, cell.y), cell])
    );

    // draw all cells
    const cellsToRemove: string[] = [];

    filledCells.forEach((cell) => {
      const cellKey = getCellKey(cell.x, cell.y);

      // if there is an optimistic update for this cell, skip drawing the original
      // (we will draw the optimistic version instead)
      if (!optimisticCells.has(cellKey)) {
        ctx.fillStyle = cell.color || "";
        ctx.fillRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);
      }
    });

    // draw optimistic cells on top
    optimisticCells.forEach((cell, cellKey) => {
      if (confirmedCellKeys.has(cellKey)) {
        // check if the confirmed color matches what we're expecting
        const confirmedCell = cellColorMap.get(cellKey);

        // if socket has updated with a different color (the real color from API),
        // remove the optimistic cell
        if (confirmedCell && confirmedCell.color !== cell.previousColor) {
          cellsToRemove.push(cellKey);
          // draw the confirmed cell instead
          ctx.fillStyle = confirmedCell.color || "";
          ctx.fillRect(
            cell.x * cellSize,
            cell.y * cellSize,
            cellSize,
            cellSize
          );
        } else {
          // wait for the real update then draw optimistic
          ctx.fillStyle = cell.color;
          ctx.fillRect(
            cell.x * cellSize,
            cell.y * cellSize,
            cellSize,
            cellSize
          );
        }
      } else {
        // cell not confirmed yet, draw optimistic
        ctx.fillStyle = cell.color;
        ctx.fillRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);
      }
    });

    // clean up confirmed optimistic cells outside the render loop
    if (cellsToRemove.length > 0) {
      setOptimisticCells((prev) => {
        const newMap = new Map(prev);
        cellsToRemove.forEach((key) => newMap.delete(key));
        return newMap;
      });
    }
    // draw fetched filled cells
    // canvasData.pixels.forEach((cell) => {
    //   ctx.fillStyle = cell.color || "";
    //   ctx.fillRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);
    // });

    ctx.restore();

    if (inspectedCellData && tool === "inspect") {
      const { x, y } = inspectedCellData;

      // calculate cell's center x and y
      const cellCenterX =
        x * cellSize * scale +
        panOffset.x * scale -
        (canvas.width * (scale - 1)) / 2 +
        (cellSize * scale) / 2;

      const cellCenterY =
        y * cellSize * scale +
        panOffset.y * scale -
        (canvas.height * (scale - 1)) / 2 +
        (cellSize * scale) / 2;

      // draw cross when inspecting a cell
      const crossSize = (cellSize * scale) / 1.25;
      drawCross(ctx, cellCenterX, cellCenterY, crossSize, "white");
    }
  }, [panOffset, scale, filledCells, inspectedCellData, tool, optimisticCells]);

  // handle clicks -> add cell / inspect cell
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // const handleClick = (e: MouseEvent) => {
    const handleInteraction = (clientX: number, clientY: number) => {
      if (isDragging) return;

      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      // calculate scaled zoom out/in offset
      const scaleWidth = canvas.width * scale;
      const scaleHeight = canvas.height * scale;
      const scaleOffSetX = (scaleWidth - canvas.width) / 2;
      const scaleOffSetY = (scaleHeight - canvas.height) / 2;

      const adjustedX = (x + scaleOffSetX - panOffset.x * scale) / scale;
      const adjustedY = (y + scaleOffSetY - panOffset.y * scale) / scale;

      const cellX = Math.floor(adjustedX / cellSize);
      const cellY = Math.floor(adjustedY / cellSize);
      // console.log(`Clicked cell: (${cellX}, ${cellY})`);

      // check bounds
      if (cellX < 0 || cellY < 0 || cellX >= gridSize || cellY >= gridSize)
        return;

      // update canvas cell when user clicks
      if (tool === "paint" && selectedColor) {
        // if (!paintCharges) {
        //   toast.error("No charges left");
        //   return
        // }
        // API call to update the canvas
        mutation.mutate({
          canvasId: canvasData.id,
          x: cellX,
          y: cellY,
          color: selectedColor,
        });
      }

      // inspect a cell
      if (tool === "inspect") {
        inspectMutation.mutate({
          canvasId: 1,
          x: cellX,
          y: cellY,
        });
      }
    };

    const handleClick = (e: MouseEvent) => {
      handleInteraction(e.clientX, e.clientY);
    };

    const handleTouchTap = (e: TouchEvent) => {
      if (isDragging) return;
      // use changedTouches to get the touch that just ended
      const touch = e.changedTouches[0];
      if (!touch) return;

      // prevent the simulated mouse event
      e.preventDefault();

      handleInteraction(touch.clientX, touch.clientY);
    };

    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("touchend", handleTouchTap);

    return () => {
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("touchend", handleTouchTap);
    };
  }, [
    panOffset,
    scale,
    isDragging,
    selectedColor,
    tool,
    canvasData.id,
    inspectMutation,
    mutation,
  ]);

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
      const zoomDelta = event.deltaY * -zoomIntensity;

      getNewScale({
        canvas,
        zoomDelta,
        panOffset,
        setPanOffset,
        setScale,
        centerX,
        centerY,
      });
    };

    canvas.addEventListener("wheel", handleWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", handleWheel);
  }, [panOffset]);

  // set drag to false so the cursor gets change
  useEffect(() => {
    if (!isPanning) setIsDragging(false);
  }, [isPanning]);

  // ---------- desktop mouse pan/zoom ----------
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

    // divide by scale so panning feels consistent across all devices
    setPanOffset((prev) => ({
      x: prev.x + dx / scale,
      y: prev.y + dy / scale,
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

    getNewScale({
      canvas,
      zoomDelta,
      panOffset,
      setPanOffset,
      setScale,
      centerX,
      centerY,
    });
  };

  // ---------- mobile touch pan/zoom ----------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (!e.touches || e.touches.length === 0) return;

      if (e.touches.length === 1) {
        const touch = e.touches[0];
        if (!touch) return;
        setIsPanning(true);
        setIsDragging(false);
        setLastMouse({ x: touch.clientX, y: touch.clientY });
      } else if (e.touches.length === 2) {
        const touch0 = e.touches[0];
        const touch1 = e.touches[1];
        if (!touch0 || !touch1) return;
        e.preventDefault();
        const distance = getTouchDistance(touch0, touch1);
        const center = getTouchCenter(touch0, touch1);
        setLastTouchDistance(distance);
        setLastTouchCenter(center);
        setIsPanning(false);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches || e.touches.length === 0) return;

      if (e.touches.length === 1 && isPanning) {
        const touch = e.touches[0];
        if (!touch) return;
        const dx = touch.clientX - lastMouse.x;
        const dy = touch.clientY - lastMouse.y;

        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
          setIsDragging(true);
        }

        // divide by scale so panning feels consistent across all devices
        setPanOffset((prev) => ({
          x: prev.x + dx / scale,
          y: prev.y + dy / scale,
        }));

        setLastMouse({ x: touch.clientX, y: touch.clientY });
      } else if (e.touches.length === 2) {
        setIsDragging(true);
        const touch0 = e.touches[0];
        const touch1 = e.touches[1];
        if (!touch0 || !touch1) return;
        e.preventDefault();

        if (lastTouchDistance === null || lastTouchCenter === null) return;

        const currentDistance = getTouchDistance(touch0, touch1);
        const currentCenter = getTouchCenter(touch0, touch1);

        const distanceRatio = currentDistance / lastTouchDistance;
        const zoomDelta = (distanceRatio - 1) * scale * 0.5;

        const rect = canvas.getBoundingClientRect();
        const centerX = currentCenter.x - rect.left;
        const centerY = currentCenter.y - rect.top;

        getNewScale({
          canvas,
          zoomDelta,
          panOffset,
          setPanOffset,
          setScale,
          centerX,
          centerY,
        });

        setLastTouchDistance(currentDistance);
        setLastTouchCenter(currentCenter);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length === 0) {
        setIsPanning(false);
        setLastTouchDistance(null);
        setLastTouchCenter(null);
      } else if (e.touches.length === 1) {
        const touch = e.touches[0];
        if (!touch) return;
        setLastTouchDistance(null);
        setLastTouchCenter(null);
        setIsPanning(true);
        setLastMouse({ x: touch.clientX, y: touch.clientY });
      }
    };

    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, [
    isPanning,
    lastMouse,
    lastTouchDistance,
    lastTouchCenter,
    scale,
    panOffset,
  ]);

  const paintBtn = (tool: ToolType["tool"]) => {
    setTool(tool);
    if (tool === "paint") {
      playPnlExpand();
    } else {
      playPnlCollapse();
    }
  };

  return (
    <div className="w-full">
      <div className="absolute flex flex-col gap-2 m-4 right-0">
        {children}
        <div className="flex flex-col gap-2 items-end">
          {/* <IconButton>
            <Search className="w-5 h-5 text-gray-600" />
          </IconButton> */}
          <IconButton onClick={() => setSelectedContent("leaderboard")}>
            <Image
              width={24}
              height={24}
              src="/leaderboard.svg"
              alt="Leaderboard"
            />
          </IconButton>

          {user && (
            <>
              <IconButton onClick={() => setSelectedContent("guild")}>
                <Image src="/guild.svg" width={24} height={24} alt="Guild" />
              </IconButton>
              <IconButton onClick={() => setSelectedContent("report")}>
                <MessageSquareWarning />
              </IconButton>
            </>
          )}

          {user?.role === "ADMIN" && (
            <>
              <IconButton onClick={() => setSelectedContent("adminPanel")}>
                <FileLock />
              </IconButton>
            </>
          )}

          <IconButton onClick={() => zoomToCenter(0.1)}>
            <ZoomInIcon className="text-gray-500" />
          </IconButton>

          <IconButton onClick={() => zoomToCenter(-0.1)}>
            <ZoomOutIcon className="text-gray-500" />
          </IconButton>
        </div>
      </div>

      <div className="absolute flex flex-col left-1/2 right-1/2 items-center justify-center bottom-4">
        {user && (
          <ColorPalette
            paintCharges={paintCharges}
            displaySeconds={displaySeconds}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            paintBtn={paintBtn}
            tool={tool}
          />
        )}

        {user && tool === "inspect" && !inspectedCellData && (
          <PrimaryButton
            className={`text-2xl py-4 px-7 flex ${displaySeconds > 0 ? "w-65" : "w-55"} items-center justify-center gap-2`}
            onClick={() => paintBtn("paint")}
          >
            <Brush size={20} fill="white" />
            <div className="flex items-center gap-1">
              Paint <span>{paintCharges}</span>/30
              {paintCharges < 30 &&
                displaySeconds <= 30 &&
                displaySeconds > 0 && (
                  <span className="text-sm">00:{displaySeconds}s</span>
                )}
            </div>
          </PrimaryButton>
        )}
      </div>

      <div className="flex items-center justify-center bottom-4">
        <InspectCard
          inspectedCellData={inspectedCellData}
          setInspectedCellData={setInspectedCellData}
        />
      </div>
      <canvas
        ref={canvasRef}
        className={`bg-[#F5F2EE] border w-full h-screen square-cursor ${isDragging ? "dragging" : ""}`}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        // onTouchStart={handleTouchStart}
        // onTouchMove={handleTouchMove}
        // onTouchEnd={handleTouchEnd}
        style={{ touchAction: "none" }}
      />
    </div>
  );
}
