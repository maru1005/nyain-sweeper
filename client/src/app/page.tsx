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

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-120 border-4 border-black bg-[#c8c8c8] p-4">
        {screen === "start" && (
          <StartScreen
            onStart={(lv, timeAttack) => {
              setLevel(lv);
              setIsTimeAttack(timeAttack);
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
            onRetry={() => setScreen("game")}
            onBack={() => setScreen("start")}
          />
        )}
      </div>
    </main>
  );
}
