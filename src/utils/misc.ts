export function truncateIfAddressOrLong(
  str: string,
  maxLen: number = 20,
): string {
  const isAddress = /0x[a-f0-9]{40}/i.test(str) // no checksum check
  return isAddress ? `${str.slice(0, 8)}...${str.slice(-6)}` : str.slice(0, 20)
}

/**
 * Returns timestamp as a string in the format `yyyy-MM-dd`.
 * @param timestamp
 * @returns
 */
export function timestampToDateString(timestamp: number): string {
  return new Date(timestamp).toISOString().slice(0, 10)
}

/**
 * Returns timestamp as a string in the format `yyyy-MM-dd HH:mm`.
 * @param timestamp
 * @returns
 */
export function timestampToDateHourString(timestamp: number): string {
  const pd = (nr: number) => `${nr}`.padStart(2, '0') // pad to double digit (with 0)
  const front = timestampToDateString(timestamp)
  const dt = new Date(timestamp)
  return `${front} ${pd(dt.getHours())}:${pd(dt.getMinutes())}`
}

export function numToCompactString(num: number): string {
  return Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(num)
}

export function capitalizeFirstLetters(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
