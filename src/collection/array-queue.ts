export class ArrayQueue<T> extends Array<T> {
  enqueue(value: T): void {
    // Add at the end
    this.push(value);
  }
  dequeue(): undefined | T {
    // Remove first element
    return this.shift();
  }
}
