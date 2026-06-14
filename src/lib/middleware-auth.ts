export const PUBLIC_PATHS = ["/"];

export function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.includes(pathname);
}

export function shouldRedirectToLogin(pathname: string, token?: string): boolean {
  if (isPublicPath(pathname)) {
    return false;
  }

  return !token;
}
