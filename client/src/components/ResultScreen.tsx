"use client";

type Props = {
  level: number;
  status: "won" | "lost";
  onRetry: () => void;
  onBack: () => void;
};

export default function ResultScreen({
  level,
  status,
  onRetry,
  onBack,
}: Props) {
  const isWon = status === "won";

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <h2 className="font-dot-gothic text-2xl">
        {isWon ? "クリア" : "やんのか！"}
      </h2>
      <p className="font-dot-gothic text-sm">
        {isWon ? "にゃいんスイーパー！" : "ねこふんじゃった！"}
      </p>

      <div className="font-pixel border-2 border-black px-4 py-2 text-sm">
        Lv. {level}
      </div>

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
  );
}
