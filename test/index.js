'use strict';

const assert = require ('assert');

const show = require ('sanctuary-show');
const Z = require ('sanctuary-type-classes');

const type = require ('..');


function eq(actual, expected) {
  assert.strictEqual (arguments.length, eq.length);
  assert.strictEqual (show (actual), show (expected));
  assert.strictEqual (Z.equals (actual, expected), true);
}


//  Identity :: a -> Identity a
function Identity(x) {
  if (!(this instanceof Identity)) return new Identity (x);
  this.value = x;
}

Identity.prototype['@@type'] = 'my-package/Identity';


const maybeTypeIdent = 'my-package/Maybe';

//  Nothing :: Maybe a
const Nothing = {
  '@@type': maybeTypeIdent,
  'isNothing': true,
  'isJust': false,
};

//  Just :: a -> Maybe a
const Just = x => ({
  '@@type': maybeTypeIdent,
  'isNothing': false,
  'isJust': true,
  'value': x,
});

const TypeIdentifier = (namespace, name, version) => ({
  namespace,
  name,
  version,
});


test ('type', () => {
  eq (type (null), 'Null');
  eq (type (undefined), 'Undefined');
  eq (type ({constructor: null}), 'Object');
  eq (type ({constructor: {'@@type': null}}), 'Object');
  eq (type ({constructor: {'@@type': new String ('')}}), 'Object');
  eq (type (Identity (42)), 'my-package/Identity');
  eq (type (Identity), 'Function');
  eq (type (Identity.prototype), 'Object');
  eq (type (Nothing), 'my-package/Maybe');
  eq (type (Just (0)), 'my-package/Maybe');
  eq (type (Nothing.constructor), 'Function');

  eq (type (false), 'Boolean');
  eq (type (0), 'Number');
  eq (type (''), 'String');

  eq (type (new Boolean (false)), 'Boolean');
  eq (type (new Number (0)), 'Number');
  eq (type (new String ('')), 'String');
});

test ('parse', () => {
  eq (type.parse ('package/Type'), TypeIdentifier ('package', 'Type', 0));
  eq (type.parse ('package/Type/X'), TypeIdentifier ('package/Type', 'X', 0));
  eq (type.parse ('@scope/package/Type'), TypeIdentifier ('@scope/package', 'Type', 0));
  eq (type.parse (''), TypeIdentifier (null, '', 0));
  eq (type.parse ('/Type'), TypeIdentifier (null, '/Type', 0));
  eq (type.parse ('@0'), TypeIdentifier (null, '@0', 0));
  eq (type.parse ('foo/\n@1'), TypeIdentifier ('foo', '\n', 1));
  eq (type.parse ('Type@1'), TypeIdentifier (null, 'Type@1', 0));
  eq (type.parse ('package/Type@1'), TypeIdentifier ('package', 'Type', 1));
  eq (type.parse ('package/Type@999'), TypeIdentifier ('package', 'Type', 999));
  eq (type.parse ('package/Type@X'), TypeIdentifier ('package', 'Type@X', 0));
  eq (type.parse ('package////@3@2@1@1'), TypeIdentifier ('package///', '@3@2@1', 1));
});
