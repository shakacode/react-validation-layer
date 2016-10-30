import DefaultStatus from '../enums/DefaultStatus';

export function getDefaultStatuses(props) {
  return {
    success: props.successStatus || DefaultStatus.SUCCESS,
    error: props.errorStatus || DefaultStatus.ERROR,
  };
}
