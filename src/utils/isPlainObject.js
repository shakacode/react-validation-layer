export function isPlainObject(value) {
  return (
    typeof value === 'object'
    && Object.prototype.toString.call(value) === '[object Object]'
  );
}
