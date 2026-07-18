"use client";

import Image from "next/image";
import CatSprite from "./CatSprite";
import { useState } from "react";

type Props = {
  level: number;
  status: "won" | "lost";
  time: number;
  isTimeAttack: boolean;
  catType: 1 | 2 | 3;
  onRetry: () => void;
  onBack: () => void;
};

export default function ResultScreen({
  level,
  status,
  time,
  isTimeAttack,
  catType,
  onRetry,
  onBack,
}: Props) {
  const isWon = status === "won";
  console.log("catType:", catType);
  const imageSrc =
    status === "won"
      ? catType === 2
        ? "/doya-2.png"
        : catType === 3
          ? "/doya-3.png"
          : "/doya.png"
      : catType === 2
        ? "/yannoka-2.png"
        : catType === 3
          ? "/yannoka-3.png"
          : "/yannoka.png";

  const [cats] = useState<{ index: number; top: number; delay: number }[]>(() =>
    [0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({
      index: Math.floor(Math.random() * 16),
      top: Math.floor(Math.random() * 70),
      delay: i * 0.3,
    })),
  );

  return (
    <div className="relative">
      {isWon && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {cats.map((cat, i) => (
            <div
              key={i}
              className="absolute animate-sweep"
              style={{
                animationDelay: `${cat.delay}s`,
                top: `${cat.top}%`,
              }}
            >
              <CatSprite index={cat.index} size={40} />
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col items-center gap-3 p-6 z-10">
        <h2 className="font-dot-gothic text-2xl">
          {isWon ? "にゃいんスイーパー！" : "やんのか！"}
        </h2>
        <p className="font-dot-gothic text-sm">
          {isWon ? "にゃにゃにゃ" : "ねこふんじゃった！"}
        </p>
        <Image src={imageSrc} width={240} height={240} alt="cat" />

        <div className="font-pixel border-2 border-black px-4 py-2 text-sm">
          Lv. {level}
        </div>

        {isTimeAttack && (
          <div className="font-pixel text-sm">
            {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}
          </div>
        )}

        <button
          onClick={onRetry}
          className="font-pixel w-full border-2 border-black bg-[#555] py-4 text-white text-sm"
        >
          Retry
        </button>

        <button
          onClick={onBack}
          className="font-pixel w-full border-2 border-black bg-[#c8c8c8] py-4 text-sm"
        >
          Select Level
        </button>
      </div>
    </div>
  );
}
