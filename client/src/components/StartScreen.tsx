"use client";

import { useState } from "react";
import { LEVEL_INFO } from "../constants/game";

type Props = {
  onStart: (level: number, isTimeAttack: boolean) => void;
};

export default function StartScreen({ onStart }: Props) {
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [isTimeAttack, setIsTimeAttack] = useState(false);

  const info = LEVEL_INFO[selectedLevel - 1];

  return (
    <div className="flex flex-col  gap-6 p-4">
      <h1 className="font-dot-gothic text-center text-2xl leading-loose">
        にゃいん
        <br />
        スイーパー
      </h1>
      <p className="font-dot-gothic text-center text-xs">ねこ踏まにゃい！</p>
      <div>
        <p className="font-pixel text-xs mb-3">▶︎　レベルを選ぶ</p>
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((lv) => (
            <button
              key={lv}
              onClick={() => setSelectedLevel(lv)}
              className={`font-pixel border-2 border-black p-3 text-sm ${
                selectedLevel === lv
                  ? "bg-[#555] text-white"
                  : "bg-[#c8c8c8] text-black"
              }`}
            >
              {lv}
            </button>
          ))}
        </div>
        <p className="font-pixel text-center text-sm mt-3">
          {info.size}×{info.size} ・　ねこ　{info.mines}にゃん
        </p>
      </div>

      <div className="flex items-center justify-between border-2 border-black p-3">
        <span className="font-pixel text-xs">⏱ タイムアタック</span>
        <button
          onClick={() => setIsTimeAttack(!isTimeAttack)}
          className="font-pixel border-2 border-black bg=[#c8c8c8] px-3 py-1 text-xs"
        >
          {isTimeAttack ? "ON" : "OFF"}
        </button>
      </div>

      <button
        onClick={() => onStart(selectedLevel, isTimeAttack)}
        className="font-pixel border-2 border-black bg-[#555] py-4 text-white text-sm"
      >
        スタート
      </button>
    </div>
  );
}
