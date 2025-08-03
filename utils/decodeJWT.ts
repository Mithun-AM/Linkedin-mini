// utils/decodeJWT.ts
export function decodeJWT(token: string): { id: string } | null {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return { id: decoded.id };
  } catch (err) {
    return null;
  }
}
