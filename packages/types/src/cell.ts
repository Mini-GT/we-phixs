type Cell = { x: number; y: number; color: string | null };

type PixelType = {
  x: number;
  y: number;
  color: string;
  user: {
    name: string;
    discord: {
      username: string;
    };
  };
  faction: {
    name: string | null;
  };
  placedAt: Date;
};

export type { Cell, PixelType };
