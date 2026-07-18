// src/tyeps/game.ts

export type Cell = {
  hasMine?: boolean;
  isOpen: boolean;
  isMarked: boolean;
  adjacent: number;
};

export type Game = {
  id: string;
  board: Cell[][];
  status: "playing" | "won" | "lost";
  level: number;
  catType: string;
};

export type Screen = "start" | "game" | "result";
