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
