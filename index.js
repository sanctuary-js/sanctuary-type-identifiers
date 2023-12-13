/*
        @@@@@@@            @@@@@@@         @@
      @@       @@        @@       @@      @@@
    @@   @@@ @@  @@    @@   @@@ @@  @@   @@@@@@ @@   @@@  @@ @@@      @@@@
   @@  @@   @@@   @@  @@  @@   @@@   @@   @@@   @@   @@@  @@@   @@  @@@   @@
   @@  @@   @@@   @@  @@  @@   @@@   @@   @@@   @@   @@@  @@@   @@  @@@@@@@@
   @@  @@   @@@  @@   @@  @@   @@@  @@    @@@   @@   @@@  @@@   @@  @@@
    @@   @@@ @@@@@     @@   @@@ @@@@@      @@@    @@@ @@  @@@@@@      @@@@@
      @@                 @@                           @@  @@
        @@@@@@@            @@@@@@@               @@@@@    @@
                                                          */
//. # sanctuary-type-identifiers
//.
//. A type is a set of values. Boolean, for example, is the type comprising
//. `true` and `false`. A value may be a member of multiple types (`42` is a
//. member of Number, PositiveNumber, Integer, and many other types).
//.
//. In certain situations it is useful to divide JavaScript values into
//. non-overlapping types. The language provides two constructs for this
//. purpose: the [`typeof`][1] operator and [`Object.prototype.toString`][2].
//. Each has pros and cons, but neither supports user-defined types.
//.
//. sanctuary-type-identifiers comprises:
//.
//.   - an npm and browser -compatible package for deriving the
//.     _type identifier_ of a JavaScript value; and
//.   - a specification which authors may follow to specify type
//.     identifiers for their types.
//.
//. ### Specification
//.
//. For a type to be compatible with the algorithm:
//.
//.   - every member of the type MUST have a `@@type` property
//.     (the _type identifier_); and
//.
//.   - the type identifier MUST be a string primitive and SHOULD have
//.     format `'<namespace>/<name>[@<version>]'`, where:
//.
//.       - `<namespace>` MUST consist of one or more characters, and
//.         SHOULD equal the name of the npm package which defines the
//.         type (including [scope][3] where appropriate);
//.
//.       - `<name>` MUST consist of one or more characters, and SHOULD
//.         be the unique name of the type; and
//.
//.       - `<version>` MUST consist of one or more digits, and SHOULD
//.         represent the version of the type.
//.
//. If the type identifier does not conform to the format specified above,
//. it is assumed that the entire string represents the _name_ of the type;
//. _namespace_ will be `null` and _version_ will be `0`.
//.
//. If the _version_ is not given, it is assumed to be `0`.

export {identifierOf, parseIdentifier};

//  $$type :: String
const $$type = '@@type';

//  pattern :: RegExp
const pattern = /^(?<namespace>.+)[/](?<name>.+?)(@(?<version>[0-9]+))?$/s;

//. ### Usage
//.
//. ```javascript
//. import {identifierOf, parseIdentifier} from 'sanctuary-type-identifiers';
//. ```
//.
//. ```javascript
//. > const Identity$prototype = {
//. .   '@@type': 'my-package/Identity@1',
//. .   '@@show': function() {
//. .     return 'Identity (' + show (this.value) + ')';
//. .   },
//. . }
//.
//. > const Identity = value => (
//. .   Object.assign (Object.create (Identity$prototype), {value})
//. . )
//.
//. > identifierOf (Identity (0))
//. 'my-package/Identity@1'
//.
//. > parseIdentifier (identifierOf (Identity (0)))
//. {namespace: 'my-package', name: 'Identity', version: 1}
//. ```
//.
//. ### API
//.
//# identifierOf :: Any -> String
//.
//. Takes any value and returns a string which identifies its type. If the
//. value conforms to the [specification][4], the custom type identifier is
//. returned.
//.
//. ```javascript
//. > identifierOf (null)
//. 'Null'
//.
//. > identifierOf (true)
//. 'Boolean'
//.
//. > identifierOf (Identity (0))
//. 'my-package/Identity@1'
//. ```
const identifierOf = x => (
  x != null &&
  x.constructor != null &&
  x.constructor.prototype !== x &&
  typeof x[$$type] === 'string'
  ? x[$$type]
  : (Object.prototype.toString.call (x)).slice ('[object '.length, -']'.length)
);

//# parseIdentifier :: String -> { namespace :: Nullable String, name :: String, version :: Number }
//.
//. Takes any string and parses it according to the [specification][4],
//. returning an object with `namespace`, `name`, and `version` fields.
//.
//. ```javascript
//. > parseIdentifier ('my-package/List@2')
//. {namespace: 'my-package', name: 'List', version: 2}
//.
//. > parseIdentifier ('nonsense!')
//. {namespace: null, name: 'nonsense!', version: 0}
//.
//. > parseIdentifier (identifierOf (Identity (0)))
//. {namespace: 'my-package', name: 'Identity', version: 1}
//. ```
const parseIdentifier = s => {
  const match = pattern.exec (s);
  if (match == null) {
    return {namespace: null, name: s, version: 0};
  } else {
    const {namespace, name, version = '0'} = match.groups;
    return {namespace, name, version: Number (version)};
  }
};

//. [1]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof
//. [2]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString
//. [3]: https://docs.npmjs.com/misc/scope
//. [4]: #specification
