
"use client";

import { useState } from "react";
import { Screen } from "@/src/types/game";
import StartScreen from "@/src/components/StartScreen";
import GameScreen from "@/src/components/GameScreen";
import ResultScreen from "@/src/components/ResultScreen";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("start");
  const [gameId, setGameId] = useState<string>("");
  const [level, setLevel] = useState<number>(1);
  const [isTimeAttack, setIsTimeAttack] =useState<boolean>(false);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-[480] border-4 border-black bg-[#c8c8c8] p-4">
        {screen === "start" && (
          <StartScreen
          onStart={(lv, timeAttack) => {
            setLevel(lv);
            setIsTimeAttack(timeAttack);
            setScreen("game");
          }}
          />
        )}
        {screen === "result" && (
          <ResultScreen
          gameId={gameId}
          level={level}
          onRetry={() => setScreen("game")}
          onBack={() => setScreen("start")}
          />
        )}
      </div>
    </main>
  );
}