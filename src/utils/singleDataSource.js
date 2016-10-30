export function singleDataSource(props) {
  const dataKeys = [];

  if (props.dataKey) dataKeys.push(props.dataKey);

  for (const field of props.fields) {
    if (field.dataKey && !dataKeys.includes(field.dataKey)) {
      dataKeys.push(field.dataKey);
    }

    if (dataKeys.length > 1) return false;
  }

  return dataKeys[0];
}
