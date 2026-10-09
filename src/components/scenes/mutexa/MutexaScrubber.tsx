"use client";

import { useState } from "react";
import { SceneStage } from "../SceneStage";
import { LOOP, TILE } from "./track";
import { MutexaAnimation } from "./MutexaAnimation";

/** Review aid: the loop frozen at any moment, picked with a slider. */
export function MutexaScrubber() {
  const [time, setTime] = useState(2.1);
  return (
    <div className="flex w-full max-w-[422px] flex-col gap-4">
      <SceneStage
        width={TILE.width}
        height={TILE.height}
        className="rounded-[15px]"
      >
        <MutexaAnimation at={time} />
      </SceneStage>
      <label className="flex w-full items-center gap-4 type-body-xs text-tertiary">
        <input
          type="range"
          min={0}
          max={LOOP}
          step={0.01}
          value={time}
          onChange={(e) => setTime(Number(e.target.value))}
          className="flex-1 accent-current"
          aria-label="Time in the loop"
        />
        <span className="w-[5ch] text-right tabular-nums">
          {time.toFixed(2)}s
        </span>
      </label>
    </div>
  );
}
