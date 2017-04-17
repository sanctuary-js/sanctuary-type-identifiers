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
//. This package exports a function which derives a _type identifier_ from any
//. JavaScript value, and a [specification][3] for customizing the type
//. identifier of a value.
//.
//. ### Specification
//.
//. For an algebraic data type to be compatible with the algorithm:
//.
//.   - every member of the type MUST have a `constructor` property pointing
//.     to an object known as the _type representative_;
//.
//.   - the type representative MUST have a `@@type` property;
//.
//.   - the type representative's `@@type` property (the _type identifier_)
//.     MUST be a string primitive; and
//.
//.   - the `@@type` property SHOULD have format:
//.     `'<namespace>/<name>[@<version>]'` - where `namespace` SHOULD equal
//.     the NPM package name which defines the type, `name` SHOULD be the
//.     unique name of the type, and `version` MUST be a numeric value which
//.     SHOULD represent the version of the type.
//.
//.       - If the property does not conform to the format specified above, it
//.         is assumed that the entire string represents the *name* of the
//.         type, and *namespace* will be `null`.
//.
//. For example:
//.
//. ```javascript
//. //  Identity :: a -> Identity a
//. function Identity(x) {
//.   if (!(this instanceof Identity)) return new Identity(x);
//.   this.value = x;
//. }
//.
//. Identity['@@type'] = 'my-package/Identity';
//. ```
//.
//. Note that by using a constructor function the `constructor` property is set
//. implicitly for each value created. Constructor functions are convenient for
//. this reason, but are not required. This definition is also valid:
//.
//. ```javascript
//. //  IdentityTypeRep :: TypeRep Identity
//. var IdentityTypeRep = {
//.   '@@type': 'my-package/Identity'
//. };
//.
//. //  Identity :: a -> Identity a
//. function Identity(x) {
//.   return {constructor: IdentityTypeRep, value: x};
//. }
//. ```
//.

(function(f) {

  'use strict';

  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = f();
  } else if (typeof define === 'function' && define.amd != null) {
    define([], f);
  } else {
    self.sanctuaryTypeIdentifiers = f();
  }

}(function() {

  'use strict';

  //  $$type :: String
  var $$type = '@@type';

  //  RPARSE :: RegExp
  var RPARSE = /^(?:([^/\n\r]+)\/)?([^]+?)(?:@(\d+))?$/;

  //       TypeIdentifier :: (a, b, c) -> TypeIdentifier a b c
  function TypeIdentifier(namespace, name, version) {
    return {
      namespace: namespace,
      name: name,
      version: version
    };
  }

  //       parseTypeIdentifier :: String
  //                           -> TypeIdentifier String? String Number?
  function parseTypeIdentifier(s) {
    if (!s.length) return TypeIdentifier(null, s, null);
    var parsed = RPARSE.exec(s);
    return TypeIdentifier(
      parsed[1] || null,
      parsed[2],
      parsed[3] ? parseInt(parsed[3], 10) : null
    );
  }

  //       parseNativeType :: Any -> TypeIdentifier Null String Null
  function parseNativeType(x) {
    return TypeIdentifier(
      null,
      Object.prototype.toString.call(x).slice('[object '.length, -']'.length),
      null
    );
  }

  //. ### Usage
  //.
  //. #### With native types
  //.
  //. ```javascript
  //. > type(null);
  //. {namespace: null, name: 'Null', version: null}
  //. > type(true);
  //. {namespace: null, name: 'Boolean', version: null}
  //. > type([1, 2, 3]);
  //. {namespace: null, name: 'Array', version: null}
  //. ```
  //.
  //. #### With custom types
  //.
  //. ```javascript
  //. > var IdentityTypeRep = {'@@type': 'my-package/Identity'};
  //. > function Identity(x) { this.value = x; }
  //. > Identity.prototype.constructor = IdentityTypeRep;
  //. > type(Identity);
  //. {namespace: null, name: 'Function', version: null}
  //. > type(new Identity(0));
  //. {namespace: 'my-package', name: 'Identity', version: null}
  //. ```
  //
  //       type :: Any -> String
  function type(x) {
    return x != null &&
           x.constructor != null &&
           x.constructor.prototype !== x &&
           typeof x.constructor[$$type] === 'string' ?
      parseTypeIdentifier(x.constructor[$$type]) :
      parseNativeType(x);
  }

  return type;

}));

//.
//. [1]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof
//. [2]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString
//. [3]: #specification
