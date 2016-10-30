import onChange from './onChange';

export default function instantTouchedOnly(context, field, data, ...otherArgs) {
  if (context.touchedFields[data.fieldId]) {
    return onChange(context, field, data, ...otherArgs);
  }

  return {};
}
