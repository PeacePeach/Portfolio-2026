"use client";

import { useState } from "react";
import { SceneStage } from "../SceneStage";
import { NEO_TILE } from "./frames";
import { NEO_LOOP, NeoAdvanceAnimation } from "./NeoAdvanceAnimation";

/** Review aid: the loop frozen at any moment, picked with a slider. */
export function NeoAdvanceScrubber() {
  const [time, setTime] = useState(4.4);
  return (
    <div className="flex w-full max-w-[422px] flex-col gap-4">
      <SceneStage width={NEO_TILE.width} height={NEO_TILE.height} className="rounded-[15px]">
        <NeoAdvanceAnimation at={time} />
      </SceneStage>
      <label className="flex w-full items-center gap-4 type-body-xs text-ink-muted">
        <input
          type="range"
          min={0}
          max={NEO_LOOP}
          step={0.01}
          value={time}
          onChange={(e) => setTime(Number(e.target.value))}
          className="flex-1 accent-current"
          aria-label="Time in the loop"
        />
        <span className="w-[5ch] text-right tabular-nums">{time.toFixed(2)}s</span>
      </label>
    </div>
  );
}
