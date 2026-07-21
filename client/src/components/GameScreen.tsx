"use client";

import { useState, useEffect, useCallback } from "react";
import { Game } from "@/src/types/game";
import CatSprite from "@/src/components/CatSprite";
import { LEVEL_INFO } from "../constants/game";
import Image from "next/image";

type Props = {
  level: number;
  isTimeAttack: boolean;
  onGameOver: (id: string, status: "won" | "lost", time: number) => void;
};

export default function GameScreen({ level, isTimeAttack, onGameOver }: Props) {
  const [game, setGame] = useState<Game | null>(null);
  const [isMarkMode, setIsMarkMode] = useState(false);
  const [time, setTime] = useState(0);
  const [catIndexes, setCatIndexes] = useState<number[][]>([]);

  const startGame = useCallback(async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/game/new`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ level }),
    });
    const data: Game = await res.json();
    setGame(data);
    // セルに入る猫　サイズ　柄ランダム
    const size = data.board.length;
    const indexes = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => Math.floor(Math.random() * 16)),
    );
    setCatIndexes(indexes);
  }, [level]);

  useEffect(() => {
    (async () => {
      await startGame();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isTimeAttack || game?.status !== "playing") return;
    const timer = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [game?.status, isTimeAttack]);

  const handleCellClick = async (row: number, col: number) => {
    const endpoint = isMarkMode ? "mark" : "open";
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/game/${game!.id}/${endpoint}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ row, col }),
      },
    );
    const data: Game = await res.json();
    setGame(data);

    if (data.status !== "playing") {
      const delay = data.status === "lost" ? 2500 : 0;
      setTimeout(() => {
        onGameOver(data.id, data.status as "won" | "lost", time);
      }, delay);
    }
  };

  if (!game) return <div className="font-Pixel p-4">読み込み中🐾🐾🐾</div>;

  const cellSize = Math.floor(420 / game.board[0].length);

  return (
    <div className="flex flex-col gap-4">
      {/*  ヘッダー */}
      {isTimeAttack && (
        <div className="font-pixel text-xs">
          {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="font-pixel border-2 border-black px-3 py-2 text-sm">
          Lv. {game.level}
        </div>
        <button onClick={startGame} className="bg-[#c8c8c8]">
          <Image src="/reicon.png" width={48} height={48} alt="rest" />
        </button>
      </div>

      {/* 盤面 */}
      <div
        className="grid gap-0.5"
        style={{
          gridTemplateColumns: `repeat(${game.board[0].length}, 1fr)`,
        }}
      >
        {game.board.map((row, r) =>
          row.map((cell, c) => (
            <button
              key={`${r}-${c}`}
              onClick={() => handleCellClick(r, c)}
              className={`aspect-square border border-black text-xs font-pixel flex items-center justify-center  ${
                cell.isOpen ? "bg-[#b0b0b0]" : "bg-[#c8c8c8]"
              }`}
            >
              {cell.hasMine && catIndexes[r]?.[c] !== undefined && (
                <CatSprite index={catIndexes[r][c]} size={cellSize - 4} />
              )}
              {!cell.hasMine && cell.isOpen && cell.adjacent > 0 && (
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
              {!cell.hasMine && cell.isMarked && !cell.isOpen && (
                <Image
                  src="/paw.png"
                  width={cellSize - 8}
                  height={cellSize - 8}
                  alt="paw"
                />
              )}
            </button>
          )),
        )}
      </div>

      {/* 探す */}
      <div className="flex gap-2">
        <button
          onClick={() => setIsMarkMode(!isMarkMode)}
          className="font-pixel border-2 border-black bg-[#c8c8c8] py-2 text-xs w-40"
        >
          🐾　Mark:{isMarkMode ? "ON" : "OFF"}
        </button>
        <div className="font-pixel border-2 border-black bg-[#c8c8c8] px-3 py-2 text-xs flex items-center gap-1">
          <Image
            src="/paw.png"
            width={16}
            height={16}
            alt="paw"
            className="inline mr-1"
          />
          {LEVEL_INFO[game.level - 1].mines -
            game.board.flat().filter((c) => c.isMarked).length}
        </div>
      </div>
    </div>
  );
}
