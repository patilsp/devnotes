/**
 * Logs an unexpected error from a server action and returns the message the UI
 * should show. In development the underlying reason is included so failures
 * are diagnosable from the toast instead of a generic "something failed".
 */
export function actionError(
  action: string,
  error: unknown,
  fallback: string
): string {
  console.error(`[${action}]`, error);

  if (process.env.NODE_ENV === "development") {
    const detail = error instanceof Error ? error.message : String(error);
    return detail ? `${fallback}: ${detail}` : fallback;
  }

  return fallback;
}
