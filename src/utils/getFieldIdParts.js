import * as formUtils from '../utils';

export function getFieldIdParts(props, field) {
  const dataKey = field.dataKey || props.dataKey;
  const entity  = props[dataKey];

  const entityId = (
    props.isMultiEntities ?
    formUtils.fetchProp(entity, 'id') :
    null
  );

  const { attr } = field;

  return { dataKey, entity, entityId, attr };
}
