export function getHandler(field, props, handler) {
  return (
    (field.handlers && field.handlers[handler]) ||
    (props.handlers && props.handlers[handler])
  );
}
