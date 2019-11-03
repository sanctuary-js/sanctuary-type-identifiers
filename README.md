# sanctuary-type-identifiers

A type is a set of values. Boolean, for example, is the type comprising
`true` and `false`. A value may be a member of multiple types (`42` is a
member of Number, PositiveNumber, Integer, and many other types).

In certain situations it is useful to divide JavaScript values into
non-overlapping types. The language provides two constructs for this
purpose: the [`typeof`][1] operator and [`Object.prototype.toString`][2].
Each has pros and cons, but neither supports user-defined types.

sanctuary-type-identifiers comprises:

  - an npm and browser -compatible package for deriving the
    _type identifier_ of a JavaScript value; and
  - a specification which authors may follow to specify type
    identifiers for their types.

### Specification

For a type to be compatible with the algorithm:

  - every member of the type MUST have a `@@type` property
    (the _type identifier_); and

  - the type identifier MUST be a string primitive and SHOULD have
    format `'<namespace>/<name>[@<version>]'`, where:

      - `<namespace>` MUST consist of one or more characters, and
        SHOULD equal the name of the npm package which defines the
        type (including [scope][3] where appropriate);

      - `<name>` MUST consist of one or more characters, and SHOULD
        be the unique name of the type; and

      - `<version>` MUST consist of one or more digits, and SHOULD
        represent the version of the type.

If the type identifier does not conform to the format specified above,
it is assumed that the entire string represents the _name_ of the type;
_namespace_ will be `null` and _version_ will be `0`.

If the _version_ is not given, it is assumed to be `0`.

### Usage

```javascript
const type = require ('sanctuary-type-identifiers');
```

```javascript
> const Identity$prototype = {
.   '@@type': 'my-package/Identity@1',
.   '@@show': function() {
.     return 'Identity (' + show (this.value) + ')';
.   }
. }

> const Identity = value =>
.   Object.assign (Object.create (Identity$prototype), {value})

> type (Identity (0))
'my-package/Identity@1'

> type.parse (type (Identity (0)))
{namespace: 'my-package', name: 'Identity', version: 1}
```

### API

#### <a name="type" href="https://github.com/sanctuary-js/sanctuary-type-identifiers/blob/v3.0.0/index.js#L115">`type :: Any -⁠> String`</a>

Takes any value and returns a string which identifies its type. If the
value conforms to the [specification][4], the custom type identifier is
returned.

```javascript
> type (null)
'Null'

> type (true)
'Boolean'

> type (Identity (0))
'my-package/Identity@1'
```

#### <a name="type.parse" href="https://github.com/sanctuary-js/sanctuary-type-identifiers/blob/v3.0.0/index.js#L141">`type.parse :: String -⁠> { namespace :: Nullable String, name :: String, version :: Number }`</a>

Takes any string and parses it according to the [specification][4],
returning an object with `namespace`, `name`, and `version` fields.

```javascript
> type.parse ('my-package/List@2')
{namespace: 'my-package', name: 'List', version: 2}

> type.parse ('nonsense!')
{namespace: null, name: 'nonsense!', version: 0}

> type.parse (type (Identity (0)))
{namespace: 'my-package', name: 'Identity', version: 1}
```

[1]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof
[2]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString
[3]: https://docs.npmjs.com/misc/scope
[4]: #specification
