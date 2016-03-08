import { defaultStatuses } from '../enums/defaultStatuses';

export function getDefaultStatuses(props) {
  return {
    success: props.successStatus || defaultStatuses.SUCCESS,
    error  : props.errorStatus || defaultStatuses.ERROR,
  };
}
