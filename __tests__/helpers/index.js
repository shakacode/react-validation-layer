export const dummyFunction = value => value;


export const mockLayerProps = (props) => {
  if (!props.data) throw new Error('`data` is required');
  if (!props.fields) throw new Error('`fields` are required');

  if (
    !props.feedbackStrategy &&
    !props.fields.every(field => field.feedbackStrategy)
  ) {
    throw new Error('`feedbackStrategy` is required');
  }

  const defaultProps = {
    dataKey: 'data',
    handlers: {
      onChange: v => v,
      onSubmit: v => v,
    },
  };

  return { ...defaultProps, ...props };
};


export const printValidity = (valid) => {
  switch (valid) {
    case true: return 'valid';
    case false: return 'invalid';
    default: return 'none';
  }
};
