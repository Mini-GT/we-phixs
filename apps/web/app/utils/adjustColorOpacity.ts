export const adjustColorOpacity = (color: string): string => {
  const hex = color.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  // Blend with white (50% opacity = 50% original + 50% white)
  const blend = (c: number) => Math.round(c * 0.5 + 255 * 0.5);

  return `#${blend(r).toString(16).padStart(2, "0")}${blend(g).toString(16).padStart(2, "0")}${blend(b).toString(16).padStart(2, "0")}`;
};
