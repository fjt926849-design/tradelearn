"use client";

interface FlashCardProps {
  flipped: boolean;
  onFlip: () => void;
  front: React.ReactNode;
  back: React.ReactNode;
}

export default function FlashCard({
  flipped,
  onFlip,
  front,
  back,
}: FlashCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={flipped ? "点击翻回正面" : "点击翻转查看答案"}
      className="perspective-1000 w-full cursor-pointer select-none"
      onClick={onFlip}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onFlip();
        }
      }}
    >
      <div
        className="relative w-full min-h-[300px] transition-transform duration-500 transform-style-3d"
        style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        {/* Front */}
        <div
          aria-hidden={flipped}
          className="absolute inset-0 backface-hidden rounded-lg border flex flex-col items-center justify-center p-8"
          style={{ borderColor: "var(--color-border)", background: "var(--color-bg)" }}
        >
          {front}
        </div>

        {/* Back */}
        <div
          aria-hidden={!flipped}
          className="absolute inset-0 backface-hidden rounded-lg border flex flex-col items-center justify-center p-8"
          style={{
            borderColor: "var(--color-border)",
            background: "var(--color-bg)",
            transform: "rotateY(180deg)",
          }}
        >
          {back}
        </div>
      </div>
    </div>
  );
}
