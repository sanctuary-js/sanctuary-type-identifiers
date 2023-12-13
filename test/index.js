import assert from 'node:assert';

import test from 'oletus';
import show from 'sanctuary-show';
import Z from 'sanctuary-type-classes';

import {identifierOf, parseIdentifier} from 'sanctuary-type-identifiers';


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


test ('identifierOf', () => {
  eq (identifierOf (null), 'Null');
  eq (identifierOf (undefined), 'Undefined');
  eq (identifierOf ({constructor: null}), 'Object');
  eq (identifierOf ({constructor: {'@@type': null}}), 'Object');
  eq (identifierOf ({constructor: {'@@type': new String ('')}}), 'Object');
  eq (identifierOf (Identity (42)), 'my-package/Identity');
  eq (identifierOf (Identity), 'Function');
  eq (identifierOf (Identity.prototype), 'Object');
  eq (identifierOf (Nothing), 'my-package/Maybe');
  eq (identifierOf (Just (0)), 'my-package/Maybe');
  eq (identifierOf (Nothing.constructor), 'Function');

  eq (identifierOf (false), 'Boolean');
  eq (identifierOf (0), 'Number');
  eq (identifierOf (''), 'String');

  eq (identifierOf (new Boolean (false)), 'Boolean');
  eq (identifierOf (new Number (0)), 'Number');
  eq (identifierOf (new String ('')), 'String');
});

test ('parseIdentifier', () => {
  eq (parseIdentifier ('package/Type'), TypeIdentifier ('package', 'Type', 0));
  eq (parseIdentifier ('package/Type/X'), TypeIdentifier ('package/Type', 'X', 0));
  eq (parseIdentifier ('@scope/package/Type'), TypeIdentifier ('@scope/package', 'Type', 0));
  eq (parseIdentifier (''), TypeIdentifier (null, '', 0));
  eq (parseIdentifier ('/Type'), TypeIdentifier (null, '/Type', 0));
  eq (parseIdentifier ('@0'), TypeIdentifier (null, '@0', 0));
  eq (parseIdentifier ('foo/\n@1'), TypeIdentifier ('foo', '\n', 1));
  eq (parseIdentifier ('Type@1'), TypeIdentifier (null, 'Type@1', 0));
  eq (parseIdentifier ('package/Type@1'), TypeIdentifier ('package', 'Type', 1));
  eq (parseIdentifier ('package/Type@999'), TypeIdentifier ('package', 'Type', 999));
  eq (parseIdentifier ('package/Type@X'), TypeIdentifier ('package', 'Type@X', 0));
  eq (parseIdentifier ('package////@3@2@1@1'), TypeIdentifier ('package///', '@3@2@1', 1));
});
