const LOCK = /(package-lock\.json|pnpm-lock\.yaml|yarn\.lock|Cargo\.lock|uv\.lock)$/;

export function isLowImpactPath(path: string): boolean {
  if (LOCK.test(path)) return true;
  if (path.endsWith('.snap')) return true;
  if (path.includes('generated')) return true;
  if (path.endsWith('.min.js') || path.endsWith('.map')) return true;
  return false;
}
