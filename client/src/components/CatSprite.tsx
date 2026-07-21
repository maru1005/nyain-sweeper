type Props = {
  index: number;
  size?: number;
};

export default function CatSprite({ index, size = 32 }: Props) {
  const col = index % 4;
  const row = Math.floor(index / 4);

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundImage: "url('/koma.png')",
        backgroundSize: `${size * 4}px ${size * 4}px`,
        backgroundPosition: `-${col * size}px -${row * size}px`,
        backgroundRepeat: "no-repeat",
        display: "inline-block",
      }}
      className="mx-auto my-auto"
    />
  );
}
