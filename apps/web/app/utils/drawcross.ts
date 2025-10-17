export default function drawCross(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
  borderColor: string = "black",
  borderThickness: number = 2
) {
  // ctx.save();

  // ctx.fillStyle = color;

  // const arm = size * 0.2;
  // const half = size / 2;

  // // Top arm
  // ctx.fillRect(x - arm / 2, y - half, arm, half - arm / 2);

  // // Bottom arm
  // ctx.fillRect(x - arm / 2, y + arm / 2, arm, half - arm / 2);

  // // Left arm
  // ctx.fillRect(x - half, y - arm / 2, half - arm / 2, arm);

  // // Right arm
  // ctx.fillRect(x + arm / 2, y - arm / 2, half - arm / 2, arm);
  // ctx.restore();

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

  // Draw border first (slightly bigger)
  drawArms(borderThickness, borderColor);

  // Draw the actual cross (normal size)
  drawArms(0, color);

  ctx.restore();
}
