# react-validation-layer

[![npm version](https://img.shields.io/npm/v/react-validation-layer.svg?style=flat-square)](https://www.npmjs.com/package/react-validation-layer)
[![build status](https://img.shields.io/travis/shakacode/react-validation-layer/master.svg?style=flat-square)](https://travis-ci.org/shakacode/react-validation-layer)
[![dependencies status](https://img.shields.io/gemnasium/shakacode/react-validation-layer.svg?style=flat-square)](https://gemnasium.com/shakacode/react-validation-layer)
[![license](https://img.shields.io/npm/l/react-validation-layer.svg?style=flat-square)](https://www.npmjs.com/package/react-validation-layer)

Form validation layer for React apps.


## Installation

Get it:

```shell
# yarn
yarn add react-validation-layer

# npm
npm install --save react-validation-layer
```


## Usage

[ ... WIP: move all docs to `website/docs` ... ]

```js
<ValidationLayer
  strategy="onFirstBlur"
  data={{ email, password }}
  fields={{
    email: emailFieldParams,
    password: passwordFieldParams,
  }}
>
  {layer => (
    <form onSubmit={layer.handleSubmit}>
      <input type="text" {...layer.getPropsFor('email')} />
      <input type="text" {...layer.getPropsFor('password')} />
      {/* ... */}
    </form>
  )}
</ValidationLayer>
```


### Configure

#### `data`
Object w/ form data.

```js
type Data = { [key: string]: any };
```

#### `fields`
Object with form fields params.

```js
type Field = boolean | {
  strategy?: Strategy,
  validate?: (value: Value, props: Props) => boolean | ValidationResults,
  validateAsync?: (value: Value, props: Props) => Promise,
  filter?: (value: DomValue, props: Props) => boolean,
  transformBeforeStore?: (value: DomValue, props: Props) => Value,
  transformBeforeRender?: (value: Value, props: Props) => DomValue,
  handlers?: Handlers,
};

type Fields = { [attribute: string]: Field | Fields };
```

If a field doesn't have validations and other special handlers, then its field value should be set to `true` to let the layer know that this field exists, thus it can serve props for it.

**Flat structures**<br>
In case if `data` is flat, `fields` object will also be flat:

```js
const data = {
  username: 'alex',
  email: 'alex@domain.com',
};

const fields = {
  username: true, // no params, but letting layer know about this field
  email: { validate: email => !!email }, // params for `email` field
};
```

**Nested structures**<br>
Sometimes `data` is nested, `fields` object must alter the shape of the `data` object:

```js
const data = {
  username: 'alex',
  email: 'alex@domain.com',
  creditCard: {
    number: '1234567890',
    owner: 'ALEX FEDOSEEV',
  },
};

const fields = {
  username: true, // no params, but letting layer know about this field
  email: { validate: email => !!email }, // params for `email` field
  creditCard: {
    number: { validate: number => !!number },
    owner: { validate: owner => !!owner },
  },
};
```

##### `field.strategy`
See [#strategies](#strategies).

```js
strategy?: Strategy

type Strategy = (
    'instant'
  | 'instantTouchedOnly'
  | 'onFirstChange'
  | 'onFirstBlur'
  | 'onFirstSuccess'
  | 'onFirstSuccessOrFirstBlur'
  | 'onFirstSubmit'
);
```

##### `field.validate`
Validation function, which takes value and props object (this is props that were passed to `<ValidationLayer />`). It can return boolean or object:

```js
validate?: (value: Value, props: Props) => ValidationResults

type ValidationResults = boolean | {
  valid: boolean,
  message?: string,
  status?: string,
};
```

##### `field.validateAsync`
`TODO`

##### `field.filter`
Sometimes we want to filter out some user input. Filter function takes value and props object. If it returns `false`, then `handler.onChange` won't be triggered. It means that user's input will be ignored.

```js
filter?: (value: DomValue, props: Props) => boolean
```

##### `field.transformBeforeStore`
`event.target.value` is always a `string`. However some attributes should be `number` by its nature or differentiate from view layer representation in another way. To keep your data clean, you can provide transformation function, which will take string value from the DOM and transform it before send it to the data store. Here are few examples:

* `price` field must be a `number` so it can be safely used for calculations
* in the view we want `creditCard` to be shown w/ spaces (eg `1234 5678 8765 4321`), but inside the data store it should be spaceless: `1234567887654321`.

```js
transformBeforeStore?: (value: DomValue, props: Props) => Value
```

##### `field.transformBeforeRender`
In a certain way, this is opposite to previous method. If you want to format your number or represent credit card w/ spaces in the form field—you can make it happen using this hook.

```js
transformBeforeRender?: (value: Value, props: Props) => DomValue
```

##### `field.handlers`
`TODO`


### Sync strategies

#### `instant` sync strategies
Instant strategies validate and emit results for all fields on every props update (i.e. re-render).

##### `instant`
Validation Layer emits results immediately for all fields right on component mount. Results will be emitted instantly for all fields on every change in every field.

##### `instantTouchedOnly`
Validation Layer emits results instantly for all fields that were touched by the user (`changed` or `focused then-> blured`).


#### `on` sync strategies
In most cases validation feedback should be provided as soon as possible, but not too soon. The question comes down to when start to provide this feedback. Strategies below trigger immediate feedback at the specific moment, e.g. on first blur from the field or on first successful validation. To get the meaning of each strategy add the following prefix to its name: "Start to provide as-user-types feedback on..."

##### `onFirstChange`
Validation Layer emits results for the single field as user types. Note that first validation will be performed only after first change.

##### `onFirstBlur`
Validation Layer emits results on first blur. After first results were emitted—feedback is instant.

##### `onFirstSuccess`
Validation Layer emits results on first successful validation. After first results were emitted—feedback is instant.

##### `onFirstSuccessOrFirstBlur`
Validation Layer emits first results immediately on successful validation or on first blur. After first results were emitted—feedback is instant.

##### `onFirstSubmit`
Validation Layer emits first results only after first submission attempt. After this all fields are switched to instant feedback strategy until validation layer will be reseted or remounted.

-

**N.B.** Keep in mind that single strategy can be set for all the fields globally (root prop `strategy` of `<ValidationLayer />`), as well as on per-field basis (`fields[field].strategy`). Field-level strategy has higher priority, so, if it's set, it will override global strategy for current field.


## License

It's MIT.
