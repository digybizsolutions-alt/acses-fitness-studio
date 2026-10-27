/** Resolve a file in /public against the deploy base path (e.g. "/" or "/acses-fitness-studio/"). */
export function asset(path: string): string {
  return import.meta.env.BASE_URL + path.replace(/^\//, '');
}
