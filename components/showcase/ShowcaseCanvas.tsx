"use client";

import { useEffect, useState } from "react";
import styles from "./showcase.module.css";

const POSTER_WIDTH = 1200;
const POSTER_HEIGHT = 1600;

function getScale() {
  if (typeof window === "undefined") return 1;
  return Math.min(1, (window.innerWidth - 48) / POSTER_WIDTH, (window.innerHeight - 48) / POSTER_HEIGHT);
}

export default function ShowcaseCanvas({ children }: { children: React.ReactNode }) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => setScale(getScale());
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  return (
    <main className={styles.previewSurface} aria-label="TradeLearn Product Showcase">
      <div className={styles.posterViewport} style={{ width: POSTER_WIDTH * scale, height: POSTER_HEIGHT * scale }}>
        <div
          className={styles.posterStage}
          data-poster-width={POSTER_WIDTH}
          data-poster-height={POSTER_HEIGHT}
          style={{ transform: `scale(${scale})` }}
        >
          <article className={styles.poster}>{children}</article>
        </div>
      </div>
    </main>
  );
}

export { styles as showcaseStyles };
