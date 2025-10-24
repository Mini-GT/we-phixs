export default function drawCross(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
  borderColor: string = "black",
  borderThickness: number = 2
) {
  ctx.save();

  const arm = size * 0.2;
  const half = size / 2;

  // helper to draw the arms
  function drawArms(offset: number, fill: string) {
    ctx.fillStyle = fill;

    // Top arm
    ctx.fillRect(
      x - arm / 2 - offset,
      y - half - offset,
      arm + offset * 2,
      half - arm / 2 + offset * 2
    );

    // Bottom arm
    ctx.fillRect(
      x - arm / 2 - offset,
      y + arm / 2 - offset,
      arm + offset * 2,
      half - arm / 2 + offset * 2
    );

    // Left arm
    ctx.fillRect(
      x - half - offset,
      y - arm / 2 - offset,
      half - arm / 2 + offset * 2,
      arm + offset * 2
    );

    // Right arm
    ctx.fillRect(
      x + arm / 2 - offset,
      y - arm / 2 - offset,
      half - arm / 2 + offset * 2,
      arm + offset * 2
    );
  }

  // draw cross border
  drawArms(borderThickness, borderColor);

  // draw the actual cross
  drawArms(0, color);

  ctx.restore();
}
