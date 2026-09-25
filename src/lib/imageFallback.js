// Attach to any <img onError={onImageError}> to gracefully fall back to the
// local placeholder if a Sanity image URL fails to load at the browser level
// (e.g. deleted asset, wrong project ID, 404 from the CDN). Without this,
// a broken remote image just shows the browser's broken-image icon forever.
export const onImageError = (e) => {
  if (e.target.dataset.fallbackApplied) return
  console.warn('Image failed to load, falling back to placeholder:', e.target.src)
  e.target.dataset.fallbackApplied = 'true'
  e.target.onerror = null
  e.target.src = '/images/shop.png'
}
