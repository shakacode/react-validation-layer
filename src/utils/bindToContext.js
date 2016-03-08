import * as formUtils from '../utils';

export function bindToContext(context, ...methods) {
  formUtils
    .fetchArgsArray(methods)
    .forEach(method => {
      context[method] = context[method].bind(context);
    })
  ;
}
