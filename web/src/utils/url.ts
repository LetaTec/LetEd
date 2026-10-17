// Only same-origin absolute paths are accepted as post-login destinations.
export const resolveInternalPath = (
  path: string | null | undefined,
  fallback: string,
): string => (path && /^\/(?!\/)/.test(path) ? path : fallback);
