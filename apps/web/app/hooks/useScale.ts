import { ScaleProps } from "@repo/types";

export default function getNewScale({
  canvas,
  zoomDelta,
  panOffset,
  setPanOffset,
  setScale,
  centerX,
  centerY,
}: ScaleProps) {
  setScale((prevScale) => {
    let newScale = prevScale + zoomDelta;
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
}
