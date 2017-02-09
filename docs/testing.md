# Testing

## Gotchas

### Triggering validation on `change`/`blur` events
When testing sync strategies (e.g. `onFirstChange`, `onFirstBlur`) set next props **before** simulate event, that triggers validation. Otherwise obsolete props will be passed to validator:

```js
/* strategy: 'onFirstChange' */

Form.setProps({ data: { email: 'valid@email.com' } }); // <= update data first
Form.find('.input').simulate('change');                // <= trigger event -> validation
expect(/* ... */)).toBe(/* ... */);
```
