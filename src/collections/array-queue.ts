export class ArrayQueue<T> extends Array<T> {
  enqueue(value: T) {
    // Add at the end
    return this.push(value);
  }
  dequeue(): undefined | T {
    // Remove first element
    return this.shift();
  }
}
