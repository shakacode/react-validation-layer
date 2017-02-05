# react-validation-layer

[![npm version](https://img.shields.io/npm/v/react-validation-layer.svg?style=flat-square)](https://www.npmjs.com/package/react-validation-layer)
[![build status](https://img.shields.io/travis/shakacode/react-validation-layer/master.svg?style=flat-square)](https://travis-ci.org/shakacode/react-validation-layer)
[![dependencies status](https://img.shields.io/gemnasium/shakacode/react-validation-layer.svg?style=flat-square)](https://gemnasium.com/shakacode/react-validation-layer)
[![license](https://img.shields.io/npm/l/react-validation-layer.svg?style=flat-square)](https://www.npmjs.com/package/react-validation-layer)

An opinionated form validation tool for React apps.


## Why

* **Great UX out of the box**<br>
  Offers predefined set of `strategies` to provide superior user experience, incl. debounced async validations.

* **Framework agnostic**<br>
  It works with all state management tools (or without any). Only `React` is required.

* **Thin**<br>
  Layer doesn't own the form data. Don't need to change anything in the way you manage the state to start using it. Its main and only concern is form validation with superior UX.

* **Declarative**<br>
  All you have to do is to declare behavior via props and shape the look in the markup. Layer will take care of the rest.


## Table of Contents

* [Installation](#installation)
* [Usage](#usage)
* [Configuration](#configuration)
* [Rendering](#rendering)
* [Lifecycles](#lifecycles)
* [WIPs & TODOs](#wips--todos)


## Installation

Get it:

```shell
# yarn
yarn add react-validation-layer

# npm
npm install --save react-validation-layer
```


## Usage

As simple as:

```js
<ValidationLayer
  strategy="onFirstSubmit"
  data={{ email, password }}
  fields={{
    email: emailFieldConfig,
    password: passwordFieldConfig,
  }}
  handlers={{
    onChange: onChangeHandler,
    onSubmit: onSubmitHandler,
  }}
>
  {layer => (
    <form onSubmit={layer.handleSubmit}>
      <input type="text" {...layer.getPropsFor('email')} />
      <input type="text" {...layer.getPropsFor('password')} />
      <button {...layer.getSubmitButtonProps()}>
        Submit
      </button>
    </form>
  )}
</ValidationLayer>
```


## Configuration
Layer requires 3 things to handle validation of the form:
* **data** to validate and render
* **fields** list with configurations
* and **onChange + onSubmit handlers**.

Some options can be set either on the global level (i.e. for all fields), or on the `field` level. `field`-level option has priority and overrides the global one.

* [`id`](#propsid)
* [**`data`**](#propsdata)
* [**`fields`**](#propsfields)
    * [`field.strategy`](#fieldstrategy)
    * [`field.asyncStrategy`](#fieldasyncstrategy)
    * [`field.validate`](#fieldvalidate)
    * [`field.validateAsync`](#fieldvalidateasync)
    * [`field.debounceInterval`](#fielddebounceinterval)
    * [`field.linkedFields`](#fieldlinkedfields)
    * [`field.filter`](#fieldfilter)
    * [`field.transformBeforeStore`](#fieldtransformbeforestore)
    * [`field.transformBeforeRender`](#fieldtransformbeforerender)
    * [`field.handlers`](#fieldhandlers)
* [`strategy`](#propsstrategy)
* [`asyncStrategy`](#propsasyncstrategy)
* [`debounceInterval`](#propsdebounceinterval)
* [`statuses`](#propsstatuses)
* [**`handlers`**](#propshandlers)


### `props.id`

_Required: `no`_<br>
_Default: `'form'`_

```js
type LayerId = string;
```

The ID of the layer to avoid DOM ids collisions. This value is a namespace for generated DOM ids to ensure their uniqueness. Use it if you have few forms on a single page.


### `props.data`

_Required: `yes`_<br>
_Default: `—`_

```js
type Data = { [attr: string]: any };
```

Object with form data. Layer doesn't care about where and how you manage the data. You can use vanilla React, or Redux, or whatever to store the state. Just pack the data for the form fields into single object and pass it to validation layer. Object can be flat or nested (see next section). [`immutable`](https://github.com/facebook/immutable-js) structures are supported (no need to call `toJS()`).


### `props.fields`

_Required: `yes`_<br>
_Default: `—`_

```js
type Field = boolean | {
  strategy?: Strategy,
  asyncStrategy?: AsyncStrategy,
  validate?: (value: Value, data: Data) => ValidationResults,
  validateAsync?: (value: Value, data: Data) => Promise<ValidationResults>,
  debounceInterval?: number,
  linkedFields?: Array<string | KeyPath>,
  filter?: (value: DomValue, data: Data) => boolean,
  transformBeforeStore?: (value: DomValue, data: Data) => Value,
  transformBeforeRender?: (value: Value, data: Data) => DomValue,
  handlers?: Handlers,
};

type Fields = { [attribute: string]: Field | Fields };
```

Object with form fields config. If a field doesn't have validations and other special handlers, then it must be set to `true` to let the layer know that this field exists, thus it can serve props for it.

**Flat structures**<br>
In case if `data` is flat, `fields` object must also be flat:

```js
const data = {
  username: 'alex',
  email: 'alex@domain.com',
};

const fields = {
  username: true, // nothing special about this field, but letting layer know about it
  email: { validate: email => !!email }, // config for `email` field
};
```

**Nested structures**<br>
Sometimes `data` is nested, `fields` object must replicate the shape of the `data` object:

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
  username: true, // nothing special about this field, but letting layer know about it
  email: { validate: email => !!email }, // config for `email` field
  creditCard: { // replicating the shape
    number: { validate: number => !!number },
    owner: { validate: owner => !!owner },
  },
};
```


#### `field.strategy`
Can be set on global or on the field level. See [`props.strategy`](#propsstrategy) for details.


#### `field.asyncStrategy`
Can be set on global or on the field level. See [`props.asyncStrategy`](#propsasyncstrategy) for details.


#### `field.validate`

_Required: `no`_<br>
_Default: `—`_

```js
type Validate = (value: Value, data: Data) => ValidationResults;

type ValidationResults = boolean | {
  valid: boolean,
  message?: string,
  status?: string,
};
```

Validation function, which takes `value` and `data` object (the one that is passed to `<ValidationLayer />`). It can return either `boolean` or `Object`.

Object with `ValidationResults`:
* `valid`: boolean flag, tells if passed value is valid or not. Required.
* `message`: usually a text string (or i18n id of a text string) which will show up in the view, when this result will be emitted. Actually it can be whatever you want, e.g. array of strings. Not required, if you don't use it.
* `status`: suppose to identify css class, e.g. `success` or `failure` (those are defaults). Keep in mind that you can pass here any string to provide rich feedback to the user. E.g. when you validate credit card field, on successful validation instead of simple `success` status, you can pass `visa` / `mastercard` etc to display icon of the payment system. Also see [`props.statuses`](#propsstatuses). Not required, if you don't use it or fine with defaults.


#### `field.validateAsync`

_Required: `no`_<br>
_Default: `—`_

```js
type ValidateAsync = (value: Value, data: Data) => Promise<ValidationResults>;
```

Async validation function, which takes `value` and `data` object as well, but returns a `Promise`, which must be resolved with the same `ValidationResults` (see [`field.validate`](#fieldvalidate)).


#### `field.debounceInterval`
Can be set on global or on the field level. See [`props.debounceInterval`](#propsdebounceinterval) for details.



#### `field.linkedFields`

_Required: `no`_<br>
_Default: `—`_

```js
type LinkedFields = Array<string | KeyPath>;
```

Some fields might be dependent on each other and when the value of the one field is changed, another field might become valid or invalid, e.g. `password` & `passwordConfirmation`. Here you can define such relations.

How it works: when you define `linkedFields` for the field, you instruct the layer: "When the value of this field is changed, also re-validate following fields". Validators of the linked fields will receive `data` object with updated value of the parent field.


#### `field.filter`

_Required: `no`_<br>
_Default: `—`_

```js
type Filter = (value: DomValue, data: Data) => boolean;
```

Sometimes you want to filter out some user input. Filter function takes `value` and `data` object. If it returns `false`, then `handler.onChange` won't be triggered. It means that user's input will be ignored.

_NOTE: `filter` doesn't filter empty strings._


#### `field.transformBeforeStore`

_Required: `no`_<br>
_Default: `—`_

```js
type TransformBeforeStore = (value: DomValue, data: Data) => Value;
```

`event.target.value` is always a `string`. However, some attributes should be `number` by its nature or differentiate from the DOM representation in another way. To keep your data clean, you can provide transformation function, which will take string value from the DOM and transform it before send it to the data store. Here are few examples:

* `price` field must be a `number` thus it can be safely used for calculations
* in the view we want `creditCard` to be shown w/ spaces (eg `1234 5678 8765 4321`), but inside the data store it should be spaceless: `1234567887654321`.


#### `field.transformBeforeRender`

_Required: `no`_<br>
_Default: `—`_

```js
type TransformBeforeRender = (value: Value, data: Data) => DomValue;
```

In a certain way, this is opposite to previous method. If you want to format your number or represent credit card w/ spaces in the form field, you can make it happen using this hook.


#### `field.handlers`

_Required: `no`_<br>
_Default: `—`_

Can be set on global or on the field level. This object is equal to [`props.handlers`](#propshandlers), except you can't define `onSubmit` handler here.

<!-- we're done with the `field` here -->

### `props.strategy`

_Required: `no`_<br>
_Default: `'onFirstSuccessOrFirstBlur'`_

```js
type Strategy =
  | 'onFirstBlur'
  | 'onFirstChange'
  | 'onFirstSuccess'
  | 'onFirstSuccessOrFirstBlur'
  | 'onFirstSubmit'
;
```

In most cases validation feedback should be provided as soon as possible, but not too soon. The question comes down to when to start to provide the feedback. It really depends on context. Strategies below won't provide any feedback until the specific moment, e.g. the first blur from the field or the first successful validation. To understand the behavior of each strategy, add the following prefix to its name: "Start providing instant feedback on..."

#### `onFirstChange`
Validation Layer emits results for the single field as user types. Note that first feedback will be provided only after first change in this field.

#### `onFirstBlur`
Validation Layer emits results on first blur. After first results were emitted—feedback is provided on every change in this field.

#### `onFirstSuccess`
Validation Layer emits results on first successful validation. After first results were emitted—feedback is provided on every change in this field.

#### `onFirstSuccessOrFirstBlur` ✨
Validation Layer emits first results immediately on successful validation or on the first blur. After first results were emitted—feedback is provided on every change in this field.

#### `onFirstSubmit`
Validation Layer emits first results only after first submission attempt. After this results for each field are emitted on every change in this field until validation layer will be reseted or remounted.

_NOTE: After first submission of the form all fields are switched to `onFirstSubmit` strategy. It means that each field will receive feedback on every change in the field._


### `props.asyncStrategy`

_Required: `no`_<br>
_Default: `'onChange'`_

```js

type AsyncStrategy =
  | 'onBlur'
  | 'onChange'
;
```

Some validations can't be performed locally, e.g. on signup you want to validate if email from the input is available or already taken.

#### `onChange` ✨
There are 2 common ways to provide async feedback: request the server on every change or only on blur event. The first one is better in terms of UX, but creates significant load, so your client might become slow or server might feel bad. The blur option doesn't have this problem (at least not that much), but UX is definitely not the best, b/c user have to blur away from the field to get the feedback.

What can we do about it to have the best of both worlds? The answer is to debounce on change async validations. What does it mean and how does it work: when user types something in in the form field, no external requests are triggered. Instead, it's put on hold. While user types, we wait. Once he stopped and there was no activity in the certain period—request is triggered.

Validation layer does this out of the box. Just enable `onChange` async strategy and you're all set 🤘

Also, it's a good UX to provide feedback in UI, when async validation is started. E.g. show a little spinner where you show your messages. Layer will let you know when to render it via [`layer.getAsyncStatusFor`](#layergetasyncstatusfor).

#### `onBlur`
This strategy triggers async validation only on blur event. Use this if even debounced validations hurt your server (but don't forget that you can setup `debounceInterval`, it might help to reduce the load).

-

Few more things to keep in mind about async validations:
* If sync strategy doesn't emit results -> layer doesn't trigger async validation.
* If sync validation fails -> layer doesn't trigger async validation.
* If sync validation succeeded and there is async validator for the field -> results will be emitted only from async validation: when async validation is triggered, layer will notify about the start of async validation, and when results will be resolved -> layer will serve them via props (as usual).
* Layer does not perform any async validations on form submission as those validations will be performed on the server anyway within a single request (form submission). If server will reject submission and report errors, you can notify layer about it via callback, which accepts errors as argument (see [`props.handlers`](#propshandlers)).

**N.B.** Single strategy can be set for all the fields globally (root props `strategy` & `asyncStrategy` of `<ValidationLayer />`), as well as on per-field basis (`field.strategy` & `field.asyncStrategy`). Field-level strategy has higher priority, so, if it's set, it will override global strategy for current field.

-

### `props.debounceInterval`

_Required: `no`_<br>
_Default: `700`_

```js
type DebounceInterval = number;
```

Configure amount of time (in `ms`) layer should wait after last user activity before debounced async validation will be invoked.


### `props.statuses`

_Required: `no`_<br>
_Default: `{ success: 'success', failure: 'failure' }`_

```js
type Statuses = {
  success: string,
  failure: string,
};
```

These are default statuses for successful and failed validation results. Used, if no special values are provided from validators. Redefine it if you don't like the default ones.


### `props.handlers`

_Required: `yes`_<br>
_Default: `—`_

```js
type Handlers = {
  onChange?: (updatedData: UpdatedData) => void,
  onBlur?: (updatedData: UpdatedData) => void,
  onSubmit: (callbacks: OnSubmitCallbacks) => void,
};
```

Tell the layer how to handle data updates and form submission. `onChange` and `onBlur` can be defined on the field level, so if every field has its own `onChange` method, on the props level it's not required. `onBlur` is always optional, but check out its section below for gotchas. `onSubmit` can be set only here and it is required.

#### `handlers.onChange`
This is the method, which you must use to update form state in your app. It receive one argument from validation layer:

```js
type OnChange = (updatedData: UpdatedData) => void;

type UpdatedData = {
  // Attribute that was updated
  attr: string,

  // If attribute is nested, this is key path to it
  keyPath: Array<string>,

  // Next value of attribute
  value: Value,

  // Value of `checked` DOM attribute
  checked: boolean,

  // Original data object (note: doesn't contain updated value)
  data: Data,

  // Original DOM event
  event: SyntheticInputEvent,
|};
```

If `transformBeforeStore` method is defined for this field, then the `updatedData.value` will be the returned value from this method, otherwise it's just a `string` from the DOM.

**NB** `onChange` handler must put in state exactly the same `value`, that was passed to it from the layer, as layer uses it for validation.

#### `handlers.onBlur`
Usually you don't need this. So if it's the case, just ignore this handler. But if you actually want to do some stuff on blur event—don't override layer's handler in representation by putting `onBlur` prop on DOM input field directly, but provide it to the layer here and it will trigger it for you (with the same `UpdatedData` object as argument). Otherwise layer won't be able to handle blur events correctly. If you still want to redefine it from the representation, then see [`layer.notifyOnBlur`](#layernotifyonblur).

#### `handlers.onSubmit`
This method will be triggered on form submission if all fields of the form are passed validation. It receives object with 2 callbacks as argument:

```js
type OnSubmit = (callbacks: OnSubmitCallbacks) => void;

type OnSubmitCallbacks = {
  onSuccess: () => void,
  onFailure: (errors: {}) => void,
};
```

Invoke `onSuccess` after successful response from the server. It will reset internal validation layer state to its initial state.

In case if something went wrong and your API responded with errors, invoke `onFailure` callback with these errors. Layer will pass them to representation in general way. Error object must replicate the shape of the `data` / `fields` objects, e.g.:

```js
const externalErrors = {
  email: 'Bad email',
  creditCard: {
    number: 'Bad credit card number',
  },
};
```

## Rendering
Validation layer requires `children` to be a function. This function receives single argument `layer`: an interface to the data from validation layer. Here is how it looks like:

```js
<ValidationLayer {...}>
  {layer => (
    <form onSubmit={layer.handleSubmit}>
      <input type="text" {...layer.getPropsFor('email')} />
      <input type="text" {...layer.getPropsFor('password')} />
      <button {...layer.getSubmitButtonProps()}>
        Submit
      </button>
    </form>
  )}
</ValidationLayer>
```

And here is what you can get:

* [`getPropsFor`](#layergetpropsfor)
* [`getCheckboxPropsFor`](#layergetcheckboxpropsfor)
* [`getRadioButtonPropsFor`](#layergetradiobuttonpropsfor)
* [`getCustomPropsFor`](#layergetcustompropsfor)
* [`getSubmitButtonProps`](#layergetsubmitbuttonprops)
* [`getValidityFor`](#layergetvalidityfor)
* [`getStatusFor`](#layergetstatusfor)
* [`getMessageFor`](#layergetmessagefor)
* [`getAsyncStatusFor`](#layergetasyncstatusfor)
* [`getSubmissionStatus`](#layergetsubmissionstatus)
* [`getDomIdFor`](#layergetdomidfor)
* [`getFieldIdFor`](#layergetfieldidfor)
* [`notifyOnChange`](#layernotifyonchange)
* [`notifyOnBlur`](#layernotifyonblur)
* [`handleSubmit`](#layerhandlesubmit)

**Providing paths to field data**<br>
Usually you get _something_ for specific field. In case if your `data` is flat, just pass attribute name to getter:

```js
const data = { email: 'some@email.com' };

layer.getStatusFor('email')
```

If you deal with nested structures and want to get _something_ for the field, that more than 1 level deep, provide key path to it:

```js
const data = {
  user: {
    email: 'some@email.com',
  },
};

layer.getStatusFor(['user', 'email'])
```


### `layer.getPropsFor`

```js
type GetPropsFor = (attr: string | KeyPath) => FieldDomProps;

<input type="text" {...layer.getPropsFor('email')} />
```

Returns props for general input DOM element (like text input). It contains props like `value`, `onChange` etc. Apply it via spread operator.


### `layer.getCheckboxPropsFor`

```js
type GetCheckboxPropsFor = (attr: string | KeyPath) => FieldDomPropsWithChecked;

<input type="checkbox" {...layer.getCheckboxPropsFor('subscribe')} />
```

Returns props for checkbox. Same as `getPropsFor`, but with `checked` attribute.


### `layer.getRadioButtonPropsFor`

```js
type GetRadioButtonPropsFor = (attr: string | KeyPath, value: string) => FieldDomPropsWithChecked;

<input type="radio" {...layer.getRadioButtonPropsFor('paymentMethod', 'card')} />
<input type="radio" {...layer.getRadioButtonPropsFor('paymentMethod', 'paypal')} />
<input type="radio" {...layer.getRadioButtonPropsFor('paymentMethod', 'cash')} />
```

When you render radio buttons, you must render one radio button for each possible value of the attribute. So, in addition to attribute, pass `value` as a second argument to get props for radio button.


### `layer.getCustomPropsFor`

```js
type GetCustomPropsFor = (attr: string | KeyPath, options: Options) => FieldDomProps | FieldDomPropsWithChecked;

type Options = {
  value?: string,
  disabled?: ?boolean,
  getChecked?: (value: string) => boolean,
};
```

Sometimes you want to do fancy stuff in UI and involve uncommon logic. If you can't achieve what you want with standard getters, here is constructor for you. It takes attribute name/key path + object with options (all keys are optional):

* `value`: if provided, used to build radio button DOM id (**NOT as `value` DOM attribute!**). Should be a `string`. Use it only if you render radio button.
* `disabled`: if provided, will be used for `disabled` DOM attribute. Should be `boolean`.
* `getChecked`: if provided, will be used to get `checked` DOM attribute. It must be a function, which takes 1 argument: DOM `value` of the field, and returns `boolean`.


### `layer.getSubmitButtonProps`

```js
type GetSubmitButtonProps = () => SubmitButtonDomProps;

<button {...layer.getSubmitButtonProps()} />
```

Returns props for submit button. Its only purpose is to disable button on form submission to prevent multiple submissions.


### `layer.getValidityFor`

```js
type GetValidityFor = (attr: string | KeyPath) => boolean | null;
```

Returns validity for the field. Keep in mind that in case if layer, according to strategy, isn't ready yet to provide feedback, it will return `null`.


### `layer.getStatusFor`

```js
type GetStatusFor = (attr: string | KeyPath) => string;
```

Returns `status` for the field. The one that is passed (or not) via validation results. Keep in mind that in case if layer, according to strategy, isn't ready yet to provide feedback, it will return `null`.


### `layer.getMessageFor`

```js
type GetMessageFor = (attr: string | KeyPath) => string;
```

Returns `message` for the field. The one that is passed (or not) via validation results. Keep in mind that in case if layer, according to strategy, isn't ready yet to provide feedback, it will return `null`.


### `layer.getAsyncStatusFor`

```js
type GetAsyncStatusFor = (attr: string | KeyPath) => string;
```

Returns `true` if async validation is in process for the field.


### `layer.getSubmissionStatus`

```js
type GetSubmissionStatus = () => boolean;
```

Returns `true` if form is submitting.


### `layer.getDomIdFor`

```js
type GetDomIdFor = (attr: string | KeyPath, value?: string) => string;

<label htmlFor={layer.getDomIdFor('email')}>
  Email
</label>
<input type="text" {...layer.getPropsFor('email')} />
```

Returns `id` attribute of the DOM element for the field. You might need it for a various reasons, the most commonly used one is to provide DOM field `id` to `<label />` for the field. Don't forget to provide `value` as second argument if you need `id` for radio button.


### `layer.getFieldIdFor`

```js
type GetFieldIdFor = (attr: string | KeyPath) => string;
```

Returns internal `id` of the field. You might need it for custom notifiers (see below).


### `layer.notifyOnChange`

```js
type NotifyOnChange = (fieldId: FieldId, value: Value) => void;

layer.notifyOnChange(
  layer.getFieldIdFor('startDate'),
  nextStartDate,
);
```

If you do some fancy stuff with the field (e.g. update its value via JS / third-party tool, e.g. date picker), then use this method to notify layer about the change so it can perform validations.


### `layer.notifyOnBlur`

```js
type NotifyOnBlur = (
  fieldId: FieldId,
  value: Value,
  event: SyntheticInputEvent,
) => void;

layer.notifyOnBlur(
  layer.getFieldIdFor('startDate'),
  startDate,
  event,
);
```

Same as `layer.notifyOnChange`, but to notify layer about `blur` events. You might need it in case if you've redefined `onBlur` handler of the DOM node, but still want to notify layer about event, so it can use this information to figure out correct strategy. Don't forget to pass `event` as last arg.


### `layer.handleSubmit`

```js
<form onSubmit={layer.handleSubmit} />
```

^ That's all you need to do with it.


## Lifecycles
Here is the quick overview what's happening on data updates and form submission under the hood.

### Value update

* `onChange` / `onBlur` handler is triggered from the DOM
* `field.filter` is triggered `?->`
    * if `false` is returned `->` we're done
    * if `true` is returned `->` continue
* `field.transformBeforeStore` is triggered (if it's defined)
* `field.onChange` (or `props.onChange`) is triggered
* sync validation is triggered (if any) `?->`
    * if no results emitted `->` updating the state and we're done
    * if failed results emitted `->` updating the state and we're done
    * if success results emitted `?->`
        * if there is no async validation `->` updating the state and we're done
        * if there is async validation `->` updating the state with processing status and trigger async validation, when results are resolved `->` updating the state and we're done.

### Form submission

* `layer.handleSubmit` is triggered from the DOM
* Validation layer performs sync validation of all fields (no async validations performed) `?->`
    * if at least one field is invalid `->` updating the state with the errors and we're done
    * if all fields are valid `->` triggering `handlers.onSubmit` and pass object with callbacks `?->`
        * `callback.onSuccess` should be triggered when form is successfully submitted `->` resetting the layer to initial state and we're done
        * `callback.onFailure` should be triggered when something gone wrong, i.e. API returned errors, which should be passed to `callback.onFailure` `->` updating the state with the errors and we're done.


## WIPs & TODOs

Those will be figured out (sooner or later), upvote them if you need them :+1:

* [ ] Collections handling, e.g. arrays of entities ([#12](https://github.com/shakacode/react-validation-layer/issues/12))
* [ ] Refs handling, e.g. focus on first invalid input after submission ([#13](https://github.com/shakacode/react-validation-layer/issues/13))

See [issues](/issues) & [pull requests](/pulls) for more details.

## License

It's MIT.
