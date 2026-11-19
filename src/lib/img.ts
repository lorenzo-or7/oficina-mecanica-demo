const WIDTHS = [480, 768, 1080, 1440, 1920]

/** URL do CDN do Unsplash com formato automático (AVIF/WebP) e recorte. */
export function unsplashUrl(id: string, width: number, quality = 70) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=${quality}`
}

export function unsplashSrcSet(id: string, max = 1920) {
  return WIDTHS.filter((w) => w <= max)
    .map((w) => `${unsplashUrl(id, w)} ${w}w`)
    .join(', ')
}
