import { useState, type CSSProperties } from 'react'
import type { ImageAsset } from '../../config/site'
import { unsplashSrcSet, unsplashUrl } from '../../lib/img'

type Props = {
  image: ImageAsset
  sizes: string
  className?: string
  style?: CSSProperties
  priority?: boolean
  maxWidth?: number
}

/** Imagem responsiva (AVIF/WebP via CDN), lazy por padrão, com fade ao carregar. */
export function Img({ image, sizes, className = '', style, priority = false, maxWidth = 1920 }: Props) {
  const [loaded, setLoaded] = useState(false)
  return (
    <img
      src={unsplashUrl(image.unsplashId, 1080)}
      srcSet={unsplashSrcSet(image.unsplashId, maxWidth)}
      sizes={sizes}
      alt={image.alt}
      width={image.width}
      height={image.height}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      onLoad={() => setLoaded(true)}
      ref={(el) => {
        if (el?.complete && el.naturalWidth > 0 && !loaded) setLoaded(true)
      }}
      className={`h-full w-full object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
      style={{ objectPosition: image.focus, ...style }}
    />
  )
}
