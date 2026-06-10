import { useEffect, useRef, useState } from "react";
import { getOptimizedImageUrl, FALLBACK_CARD_IMAGE } from "../utils/imageOptimizer";

/**
 * Reusable image component that optimizes image delivery, implements lazy loading
 * via Intersection Observer, provides double-fallback error protection, and
 * prevents layout shifts (CLS) with skeleton placeholders.
 */
export default function OptimizedImage({
  src,
  alt = "",
  className = "",
  width = 500,
  fallbackSrc = FALLBACK_CARD_IMAGE,
  ...props
}) {
  const [isInViewport, setIsInViewport] = useState(false);
  const [srcStage, setSrcStage] = useState(0); // 0: CDN, 1: Original, 2: Fallback
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.IntersectionObserver) {
      setIsInViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" } // Load 200px before entering viewport
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    if (srcStage < 2) {
      setSrcStage((prev) => prev + 1);
    }
  };

  // Determine active source based on stage
  let activeSrc = src;
  if (srcStage === 0) {
    activeSrc = getOptimizedImageUrl(src, width);
  } else if (srcStage === 1) {
    activeSrc = src || fallbackSrc;
  } else {
    activeSrc = fallbackSrc;
  }

  return (
    <div
      ref={containerRef}
      className={`ls-image-wrapper ${isLoaded ? "is-loaded" : "is-loading"} ${className}`}
      style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}
    >
      {/* Show shimmering skeleton placeholder if not loaded */}
      {!isLoaded && (
        <div className="ls-image-skeleton" aria-hidden="true" />
      )}

      {isInViewport && (
        <img
          src={activeSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          decoding="async"
          className={`ls-optimized-img ${isLoaded ? "is-ready" : ""}`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: isLoaded ? 1 : 0,
            transition: "opacity 0.4s ease-in-out",
            willChange: "opacity"
          }}
          {...props}
        />
      )}
    </div>
  );
}
