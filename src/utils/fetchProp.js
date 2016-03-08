export function fetchProp(container, attr) {
  return (
    container.get ? container.get(attr) : container[attr]
  );
}
