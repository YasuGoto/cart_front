export function normalizeError(err: unknown): string {
  if (!err) return 'エラーが発生しました'
  if (typeof err === 'string') return err
  if (typeof err === 'object' && 'message' in err) {
    const m = (err as { message?: unknown }).message
    if (typeof m === 'string') return m
  }
  return 'エラーが発生しました'
}
