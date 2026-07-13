"use client";

import { useState, useEffect, useCallback } from "react";
import { Game } from "@/src/types/game";

type Props = {
  level: number;
  isTimeAttack: boolean;
  onGameOver: (id: string, status: "won" | "lost") => void;
};

export default function GameScreen({ level, isTimeAttack, onGameOver }: Props) {
  const [game, setGame] = useState<Game | null>(null);
  const [isMarkMode, setIsMarkMode] = useState(false);

  const startGame = useCallback(async () => {
    const res = await fetch("http://localhost:8080/game/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ level }),
    });
    const data: Game = await res.json();
    setGame(data);
  }, [level]);

  useEffect(() => {
    startGame().catch(console.error);
  }, [startGame]);

  const handleCellClick = async (row: number, col: number) => {
    const endpoint = isMarkMode ? "mark" : "open";
    const res = await fetch(
      `http://localhost:8080/game/${game!.id}/${endpoint}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ row, col }),
      },
    );
    const data: Game = await res.json();
    setGame(data);

    if (data.status !== "playing") {
      onGameOver(data.id, data.status as "won" | "lost");
    }
  };

  if (!game) return <div className="font-Pixel p-4">読み込み中🐾🐾🐾</div>;

  return (
    <div className="flex flex-col gap-4">
      {/*  ヘッダー */}
      <div className="flex items-center justify-between">
        <div className="font-picel border-2 border-black px-3 py-2 text-sm">
          🐾 {game.board.flat().filter((c) => c.isMarked).length}
        </div>
        <div className="font-pixel border-2 border-black px-3 py-2 text-sm">
          Lv. {game.level}
        </div>
        <button
          onClick={startGame}
          className="border-2 border-black bg-[#c8c8c8] px-3 py-2 text-sm"
        >
          🔄
        </button>
      </div>

      {/* 盤面 */}
      <div
        className="grid gap-0.5"
        style={{ gridTemplateColumns: `repeat(${game.board[0].length}, 1fr)` }}
      >
        {game.board.map((row, r) =>
          row.map((cell, c) => (
            <button
              key={`${r}-${c}`}
              onClick={() => handleCellClick(r, c)}
              className={`aspect-square border border-black text-xs font-pixel flex items-center justify-center ${
                cell.isOpen ? "bg-[#b0b0b0]" : "bg-[#c8c8c8]"
              }`}
            >
              {cell.isOpen && cell.adjacent > 0 && (
                <span
                  className={
                    cell.adjacent === 1
                      ? "text-blue-600"
                      : cell.adjacent === 2
                        ? "text-green-600"
                        : "text-red-600"
                  }
                >
                  {cell.adjacent}
                </span>
              )}
              {cell.isMarked && !cell.isOpen && "🐾"}
            </button>
          )),
        )}
      </div>

      {/* 探す */}
      <button
        onClick={() => setIsMarkMode(!isMarkMode)}
        className="font-pixel border-2 border-black bg-[#c8c8c8] py-2 text-xs"
      >
        🐾探すモード :{isMarkMode ? "ON" : "OFF"}
      </button>
    </div>
  );
}
