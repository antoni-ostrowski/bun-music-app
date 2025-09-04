import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function getCurrentUnixTimestamp(): number {
  return Math.floor(Date.now() / 1000)
}
export function getUnixTimestamp(date: Date): number {
  return Math.floor(date.getTime() / 1000)
}
type Success<T> = [T, null]
type Failure<E> = [null, E]
type Result<T, E = Error> = Success<T> | Failure<E>

export async function tryCatch<T, E = Error>(
  promise: Promise<T>
): Promise<Result<T, E>> {
  try {
    const data = await promise
    return [data, null]
  } catch (error) {
    return [null, error as E]
  }
}
export function tryCatchSync<T, E = Error>(func: () => T): Result<T, E> {
  try {
    const data = func()
    return [data, null]
  } catch (error) {
    return [null, error as E]
  }
}

export function makeArtworkUrl(filePath: string) {
  return `http://localhost:3000/artwork/${encodeURIComponent(filePath)}`
}
export function makeImageUrl(filePath: string) {
  return `http://localhost:3000/image/${encodeURIComponent(filePath)}`
}
export function makeMusicUrl(filePath: string) {
  return `http://localhost:3000/music/${encodeURIComponent(filePath)}`
}
export function formatSongLength(totalSeconds: number): string {
  // Ensure the input is a valid non-negative number.
  if (
    typeof totalSeconds !== 'number' ||
    totalSeconds < 0 ||
    !isFinite(totalSeconds)
  ) {
    console.warn(
      `Invalid input for formatSongLength: ${totalSeconds}. Returning '00:00'.`
    )
    return '00:00'
  }

  // Calculate minutes and seconds from the total seconds.
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = Math.floor(totalSeconds % 60) // Use Math.floor to handle decimals

  // Pad single-digit minutes and seconds with a leading zero.
  const formattedMinutes = String(minutes).padStart(2, '0')
  const formattedSeconds = String(seconds).padStart(2, '0')

  return `${formattedMinutes}:${formattedSeconds}`
}
