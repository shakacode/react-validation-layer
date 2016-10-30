export function fetchArgsArray(args) {
  return (
    args.length === 1 && Array.isArray(args[0])
    ? args[0]
    : args
  );
}
