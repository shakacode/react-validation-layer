export function getField(props, domData) {
  const { fields, dataKey } = props;

  return (
    fields.find(v => v.dataKey === domData.dataKey && v.attr === domData.attr) ||
    fields.find(v => dataKey === domData.dataKey && v.attr === domData.attr)
  );
}
