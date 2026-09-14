/**
 * Image with graceful fallback: if a source ever fails, we render a warm
 * gradient tile with the product initial so the storefront never looks broken.
 */
import { useState } from "react";
import { Cake } from "lucide-react";

export default function SmartImage({ src, alt, className = "", fallbackLabel = "" }) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-gradient-to-br from-gold/70 via-cream to-primary/20 ${className}`}
      >
        <div className="flex flex-col items-center gap-1 text-primary/60">
          <Cake className="h-8 w-8" aria-hidden />
          <span className="font-display text-sm font-semibold">{fallbackLabel || alt}</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
