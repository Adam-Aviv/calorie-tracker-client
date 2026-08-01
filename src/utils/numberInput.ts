export function isValidDecimalInput(value: string): boolean {
  return value === "" || /^\d*\.?\d*$/.test(value);
}

export function parseDecimalInput(value: string, fallback = 0): number {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function formatDecimalField(value: number): string {
  return String(value);
}
