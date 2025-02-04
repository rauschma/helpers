export function wrapElement(element: Element, wrapper: Element): void {
  const parentNode = element.parentNode;
  if (parentNode !== null) {
    parentNode.insertBefore(wrapper, element);
    wrapper.appendChild(element);
  }
}