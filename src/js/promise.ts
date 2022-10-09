export function createPromise<T>() {
  let resolve!: (result: T) => void;
  let reject!: (error: any) => void;
  const promise = new Promise<T>(
    (res, rej) => {
      // Executed synchronously
      resolve = res;
      reject = rej;
    });
  return {promise, resolve, reject};
}
