import * as utils from '../utils';

export function getFieldIdParts(props, field) {
  const dataKey = field.dataKey || props.dataKey;
  const entity = props[dataKey];

  const entityId = (
    props.isMultiEntities
    ? utils.fetchProp(entity, 'id')
    : null
  );

  const { attr } = field;

  return { dataKey, entity, entityId, attr };
}
