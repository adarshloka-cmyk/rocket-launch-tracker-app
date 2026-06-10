export const FALLBACK_CARD_IMAGE =
  "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80";

export const FALLBACK_HERO_IMAGE =
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80";

/**
 * Transforms an image URL to load through wsrv.nl CDN resizing proxy.
 *
 * @param {string} imageUrl - The original raw image URL.
 * @param {number} width - The target width in pixels.
 * @returns {string} - The optimized CDN URL.
 */
export function getOptimizedImageUrl(imageUrl, width) {
  if (!imageUrl) return FALLBACK_CARD_IMAGE;

  // Don't proxy local paths or SVGs/data URLs
  if (!imageUrl.startsWith("http") || imageUrl.includes(".svg")) {
    return imageUrl;
  }

  // Strip protocol to pass cleaner URL to wsrv.nl
  const cleanUrl = imageUrl.replace(/^https?:\/\//, "");

  // Use wsrv.nl to resize, cache, and convert to webp format on-the-fly
  return `https://wsrv.nl/?url=${encodeURIComponent(cleanUrl)}&w=${width}&output=webp&q=75`;
}
