import Image from "next/image";
import type { NeoThemeFrame as Frame } from "@/content/neoHiFiThemes";

/** Natural-size screen layers; the frame reserves the largest layer's canvas. */
export function NeoThemeFrame({ frame }: { frame: Frame }) {
  return (
    <div className="relative w-full" style={{ aspectRatio: `${frame.width} / ${frame.height}` }}>
      {frame.layers.map((layer, index) => (
        <Image
          key={layer.src}
          src={layer.src}
          alt={layer.alt}
          width={layer.width}
          height={layer.height}
          unoptimized
          className={`block h-auto w-full ${index ? "absolute top-0 left-0" : ""}`}
        />
      ))}
    </div>
  );
}
