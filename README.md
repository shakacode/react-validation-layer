# react-validation-layer

[![npm version](https://img.shields.io/npm/v/react-validation-layer.svg?style=flat-square)](https://www.npmjs.com/package/react-validation-layer)
[![build status](https://img.shields.io/travis/shakacode/react-validation-layer/master.svg?style=flat-square)](https://travis-ci.org/shakacode/react-validation-layer)
[![dependencies status](https://img.shields.io/gemnasium/shakacode/react-validation-layer.svg?style=flat-square)](https://gemnasium.com/shakacode/react-validation-layer)
[![license](https://img.shields.io/npm/l/react-validation-layer.svg?style=flat-square)](https://www.npmjs.com/package/react-validation-layer)

Form validation layer for every React based app.

## Installation

Get it:

```shell
# yarn
yarn add react-validation-layer

# npm
npm install --save react-validation-layer
```

## Usage

[... WIP ...]

```js
<ValidationLayer
  data={{ email, password }}
  fields={[ emailParams, passwordParams ]}
  feedbackStrategy="onChange"
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
Array w/ form fields params.

```js
type Fields = {
  name: string | Array<string>,
  feedbackStrategy?: FeedbackStrategy,
  validate?: (value: Value, props: Props) => boolean | ValidationResults,
  validateAsync?: (value: Value, props: Props) => Promise,
  filter?: (value: DomValue, props: Props) => boolean,
  transformBeforeStore?: (value: DomValue) => Value,
  transformBeforeRender?: (value: Value) => DomValue,
  handlers?: Handlers,
  omitDomId?: boolean,
  omitRef?: boolean,
  omitOnChange?: boolean,
  omitOnBlur?: boolean,
};
```

##### `field.name`
Name of the field — `string` or `Array<string>`. ValidationLayer will use it to get the value for this field: `props.data[field.name]`.
`name` can be array of strings, which is key path to nested attribute in case if `data` object has nested entities (it's not yet implemented).

```js
name: string | Array<string>
```

##### `field.feedbackStrategy`
See [#strategies](#strategies).

```js
feedbackStrategy?: FeedbackStrategy

type FeedbackStrategy = (
  | 'instant'
  | 'instantTouchedOnly'
  | 'onChange'
  | 'onBlurOnly'
  | 'onFirstBlur'
  | 'onSuccess'
  | 'onSuccessOrFirstBlur'
  | 'onSubmit'
);
```

##### `field.validate`
Validation function, which takes value and props object (this is props that were passed to `<ValidationLayer />`). It can return boolean or object:

```js
validate?: (value: Value, props: Props) => boolean | ValidationResults

type ValidationResults = {
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
transformBeforeStore?: (value: DomValue) => Value
```

##### `field.transformBeforeRender`
In a certain way this is opposite to previous method. If you want to format your number or represent credit card w/ spaces in the form field—you can make it happen w/ this function.

```js
transformBeforeRender?: (value: Value) => DomValue
```


##### `field.handlers`
`TODO`

##### `field.omitDomId`
`TODO`

##### `field.omitRef`
`TODO`

##### `field.omitOnChange`
`TODO`

##### `field.omitOnBlur`
`TODO`


### Strategies

#### `instant`
Validation Layer emits results immediately for all fields right on component mount. Results will be emitted instantly for all fields on every change in every field.

#### `instantTouchedOnly`
Validation Layer emits results instantly for all fields that were touched by the user (`changed` or `focused -> blured`).

#### `onChange`
Validation Layer emits results for the single field on every change. Note that first validation will be performed only after first change.

#### `onSuccess`
Validation Layer emits results on first successful validation. After first results were emitted—feedback is instant.

#### `onFirstBlur`
Validation Layer emits results on first blur. After first results were emitted—feedback is instant.

#### `onBlurOnly`
Validation Layer emits results only on blur.

#### `onSuccessOrFirstBlur`
Validation Layer emits first results immediately on successful validation or on first blur. After first results were emitted—feedback is instant.

#### `onSubmit`
Validation Layer emits first results only after first submission attempt. After this all fields are switched to instant feedback strategy until validation layer will be reseted or remounted.

-

**N.B.** Keep in mind that single strategy can be set for all the fields globally (root prop `feedbackStrategy` of `<ValidationLayer />`), as well as on per-field basis (`fields[field].feedbackStrategy`). Field-level strategy has higher priority, so, if it's set, it will override global strategy for current field.


## TODO

### Required
* [ ] Add tests!

### Bugs
* [ ] Fix messages emitting (should be in sync w/ `status`)

### API
* [ ] Get rid of `dataKey`, pass `data` directly
* [ ] Rename `field.attr` to `field.name`
* [ ] Add `layerId` to namespace domIds

### Features
* [ ] Add async validations
* [ ] Add button props
* [ ] Add collections handling
* [ ] Add refs -> focus on first invalid node on submit

### Optimizations
* [ ] Pass callback to `setState` (instead of plain object)
* [ ] Use Flow


## License

It's MIT.
