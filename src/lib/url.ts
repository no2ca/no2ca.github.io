/**
 * Prefix an internal path with Astro's configured base.
 * The base is injected at build time (`astro build --base ...`), so internal
 * links must not be hardcoded to the site root.
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const rest = path.replace(/^\//, "");
  return `${base}/${rest}`.replace(/\/$/, "") || "/";
}
