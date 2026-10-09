import Image from "next/image";
import type { ImageRef } from "@/content/types";
import { cn } from "@/lib/cn";

/**
 * Image frame with a fixed aspect ratio. Falls back to an empty, grained
 * surface when no image is set so layouts hold before real assets exist.
 */
export function Media({
  image,
  ratio,
  sizes,
  className,
  imageClassName,
  label,
}: {
  image?: ImageRef;
  ratio: string; // e.g. "4 / 3"
  sizes: string;
  className?: string;
  imageClassName?: string;
  label?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-surface", className)} style={{ aspectRatio: ratio }}>
      {image ? (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          unoptimized={image.src.endsWith(".svg")}
          className={cn("object-cover", imageClassName)}
        />
      ) : null}
      <div className="grain pointer-events-none absolute inset-0" aria-hidden="true" />
      {label ? <span className="type-label-s absolute bottom-3 left-3 text-tertiary">{label}</span> : null}
    </div>
  );
}
