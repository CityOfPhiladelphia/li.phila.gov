/** Wraps a value as a SQL string literal, doubling any apostrophes (O'NEILL ST). */
export function quote(value: string): string {
  return `'${value.replace(/'/g, "''")}'`
}

/** Returns a quoted, comma-separated list for IN (…). An empty list becomes IN ('') so it matches nothing. */
export function quoteList(values: string[]): string {
  if (values.length === 0) return "''"
  return values.map(quote).join(', ')
}
