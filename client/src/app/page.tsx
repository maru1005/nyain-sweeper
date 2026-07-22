"use client";

import { useState } from "react";
import { Screen } from "@/src/types/game";
import StartScreen from "@/src/components/StartScreen";
import GameScreen from "@/src/components/GameScreen";
import ResultScreen from "@/src/components/ResultScreen";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("start");

  const [level, setLevel] = useState<number>(1);
  const [isTimeAttack, setIsTimeAttack] = useState<boolean>(false);
  const [gameStatus, setGameStatus] = useState<"won" | "lost">("lost");
  const [gameTime, setGameTime] = useState(0);
  const [catType, setCatType] = useState<1 | 2 | 3>(1);

  return (
    <main className="flex h-full items-center justify-center overflow-y-auto">
      <div className="w-120 border-4 border-black bg-[#c8c8c8] p-4">
        {screen === "start" && (
          <StartScreen
            onStart={(lv, timeAttack) => {
              setLevel(lv);
              setIsTimeAttack(timeAttack);
              setCatType((Math.floor(Math.random() * 3) + 1) as 1 | 2 | 3);
              setScreen("game");
            }}
          />
        )}
        {screen === "game" && (
          <GameScreen
            level={level}
            isTimeAttack={isTimeAttack}
            onGameOver={(id, status, time) => {
              setGameStatus(status);
              setGameTime(time);
              setScreen("result");
            }}
          />
        )}
        {screen === "result" && (
          <ResultScreen
            level={level}
            status={gameStatus}
            time={gameTime}
            isTimeAttack={isTimeAttack}
            catType={catType}
            onRetry={() => setScreen("game")}
            onBack={() => setScreen("start")}
          />
        )}
      </div>
    </main>
  );
}
