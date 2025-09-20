"use client"

import { MouseEventHandler, useEffect, useRef, useState } from "react";
import { useWindowSize } from "@uidotdev/usehooks";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [drawing, setDrawing] = useState(false)

  useEffect(() => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement | null
    const cellSize = 5
    const gridSize = 1500

    
    if(!canvas) return
    const ctx = canvas.getContext('2d');

    // creates canvas screen size
    canvas.width = gridSize
    canvas.height = window.innerHeight - 260

    if(!ctx) return

    // creates grid
    for (let x = 0; x < canvas.width; x++) {
      for (let y = 0; y < gridSize; y++) {
        // ctx.strokeStyle = "#eee" 
        ctx.fillStyle = '#eee'
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
      }
    }
      // ctx.fillStyle = 'green'
      // ctx.fillRect(10, 10, 200, 200)

    // adds click event to canvas
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const cellX = Math.floor(x / cellSize)
      const cellY = Math.floor(y / cellSize)

      console.log(`Clicked cell: (${cellX}, ${cellY})`)
      // ctx.fillStyle = 'green'
      // ctx.fillRect(x, y, cellSize, cellSize)
      // console.log("Canvas coords:", x, y)
      ctx.fillStyle = "green"
      ctx.fillRect(cellX * cellSize, cellY * cellSize, cellSize, cellSize)
    }
    
    canvas.addEventListener("click", handleClick)
    return () => canvas.removeEventListener("click", handleClick)
  }, [])

  // const handleMouseDown = (e: MouseEvent) => {
  //   setDrawing(true)   
  //   const { clientX, clientY } = e
  //   console.log(clientX, clientY)
  // }

  const handleMouseMove = (e: React.MouseEvent) => {
    if(!drawing) return
    const { clientX, clientY } = e
    console.log(clientX, clientY)
  }

  const handleMouseUp = () => {
    setDrawing(false)
  }

  return (
    <canvas 
      ref={canvasRef} 
      id="canvas" 
      className="bg-white"
      // width={`${width && width - 260}`}
      // height={`${height && height - 260}`}
      // onMouseDown={handleMouseDown}
      // onMouseMove={handleMouseMove}
      // onMouseUp={handleMouseUp}
    >
      Canvas
    </canvas>
  );
}