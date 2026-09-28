import { useState } from "react";
import { ImageOff } from "lucide-react";
import { mediaImage, type OfficialImage } from "./officialSite";

/**
 * Renders a self-hosted official Westin photograph at the sizes produced by
 * scripts/fetch-official-media.mjs. Alt text comes from the content data, and
 * the fallback keeps layout intact if a file is missing.
 */
export function OfficialPhoto({
  mediaKey,
  alt,
  className = "",
  sizes = "(max-width: 767px) calc(100vw - 44px), 50vw",
  priority = false,
}: {
  mediaKey: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const image: OfficialImage = mediaImage(mediaKey);
  const [failed, setFailed] = useState(false);
  return (
    <div className={`sk-photo ${className}`}>
      {failed ? (
        <div className="sk-media-unavailable" role="img" aria-label={alt}>
          <ImageOff aria-hidden="true" />
          <span>Image currently unavailable</span>
        </div>
      ) : (
        <img
          src={image.src}
          srcSet={
            Array.isArray(image.srcSet) ? image.srcSet.join(", ") : image.srcSet
          }
          sizes={sizes}
          width={image.width}
          height={image.height}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
