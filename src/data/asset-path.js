// Resolve public assets correctly on localhost, GitHub project pages, or a custom domain.
export function assetPath(path) {
  if (!path || !path.startsWith('/') || path.startsWith('//')) return path;
  return (import.meta.env?.BASE_URL || '/') + path.slice(1);
}
