/** Query param that sign-in links use to carry the page a user signed in from. */
export const RETURN_TO_PARAM = "next";

const AUTH_PATHS = ["/login", "/register", "/verify-otp", "/forgot-password", "/reset-password"];

function isAuthPath(pathname: string): boolean {
  return AUTH_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

/**
 * Returns the value only when it is a same-origin relative path (never `//host`, `/\host`,
 * or a URL) and not an auth page, so sign-in cannot redirect off-site or loop.
 */
export function safeReturnPath(value: string | string[] | undefined): string | undefined {
  if (typeof value !== "string" || !value.startsWith("/")) {
    return undefined;
  }
  if (value.startsWith("//") || value.startsWith("/\\")) {
    return undefined;
  }
  let url: URL;
  try {
    url = new URL(value, "http://turath.local");
  } catch {
    return undefined;
  }
  // Browsers drop tabs and newlines, so "/\t/host" parses as "//host"; the origin check catches it.
  if (url.origin !== "http://turath.local" || isAuthPath(url.pathname)) {
    return undefined;
  }
  return `${url.pathname}${url.search}${url.hash}`;
}

/** Adds the return param to an auth page link; a missing or unsafe return path is dropped. */
export function withReturnTo(authPath: string, returnTo: string | undefined): string {
  const safe = safeReturnPath(returnTo);
  return safe ? `${authPath}?${RETURN_TO_PARAM}=${encodeURIComponent(safe)}` : authPath;
}
