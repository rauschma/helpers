import { randomInteger } from './number.js';

/**
 * @see https://en.wikipedia.org/wiki/Fisher–Yates_shuffle#The_modern_algorithm
 */
export function shuffleArray<T>(arr: Array<T>): Array<T> {
  for (let i = arr.length-1; i >= 1; i--) {
    const j = randomInteger(0, i);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function arrayToChunks<T>(arr: Array<T>, chunkLen: number): Array<Array<T>> {
  const result = [];
  const chunkCount = Math.ceil(arr.length / chunkLen);
  for (let i=0; i<chunkCount; i++) {
    const start = i * chunkLen;
    const end = Math.min((i+1) * chunkLen, arr.length);
    result.push(arr.slice(start, end));
  }
  return result;
}