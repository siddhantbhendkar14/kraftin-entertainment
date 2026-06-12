export function isNextNavigationError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null || !('digest' in error)) {
    return false;
  }

  const digest = (error as { digest?: string }).digest;
  return typeof digest === 'string' && digest.startsWith('NEXT_REDIRECT');
}
