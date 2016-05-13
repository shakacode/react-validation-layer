import onChange from './onChange';

export default function instantChangedOnly(context, field, data, ...otherArgs) {
  if (context.changedFields.includes(data.fieldId)) {
    return onChange(context, field, data, ...otherArgs);
  }

  return {};
}
