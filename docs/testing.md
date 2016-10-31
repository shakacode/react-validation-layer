# Testing

## Gotchas

### Triggering validation on `change`/`blur` events
When testing `on` strategies (e.g. `onChange`, `onBlur`) set next props **before** simulate event, that triggers validation. Otherwise obsolete props will be passed to validator:

```js
/* feedbackStrategy: 'onChange' */

Form.setProps({ data: { email: 'valid@email.com' } }); // <= update data first
Form.find('.input').simulate('change');                // <= trigger event -> validation
expect(/* ... */)).toBe(/* ... */);
```

Since `instant` strategies validate all fields on props update (in lifecycle hooks), just setting next props should be fine.
