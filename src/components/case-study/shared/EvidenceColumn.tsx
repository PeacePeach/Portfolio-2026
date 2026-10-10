import { EvidencePill } from "./EvidencePill";
import { EvidenceBullet, type EvidenceBulletData } from "./EvidenceBullet";
import { EvidenceReveal } from "./CaseStudyMotion";

export type EvidenceImage = { src: string; alt: string; width?: number; height?: number; overlay?: string; baseHeight?: number };

export type EvidenceColumnData = {
  label?: string;
  images: readonly EvidenceImage[];
  bullets: readonly EvidenceBulletData[];
};

export function EvidenceColumn({ data, label, emphasis = "secondary", imageLayout = "stack" }: { data: EvidenceColumnData; label: string; emphasis?: "primary" | "secondary"; imageLayout?: "stack" | "pair" }) {
  return <EvidenceReveal>
    <div className="cs-column" data-emphasis={emphasis} data-image-layout={imageLayout}>
      <EvidencePill label={data.label ?? label} emphasis={emphasis} />
      <div className="cs-evidence-images">
        {data.images.map((image, index) => (
          // Intrinsic aspect ratio supports config-only image swaps; no fixed phone crop.
          <div key={`${image.src}-${index}`} className="cs-evidence-frame" style={{ width: image.width, height: image.height }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.src} alt={image.alt} loading="lazy" decoding="async" className="cs-evidence-image" style={{ width: image.width, height: image.baseHeight ?? image.height }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {image.overlay && <img src={image.overlay} alt="" className="cs-evidence-overlay" style={{ width: image.width, height: image.height }} />}
          </div>
        ))}
      </div>
      <ul className="cs-bullets">{data.bullets.map((bullet, index) => <EvidenceBullet key={index} {...bullet} />)}</ul>
    </div>
  </EvidenceReveal>;
}
