'use strict';

var assert = require('assert');

var Z = require('sanctuary-type-classes');

var type = require('..');


function eq(actual, expected) {
  assert.strictEqual(arguments.length, eq.length);
  assert.strictEqual(Z.toString(actual), Z.toString(expected));
  assert.strictEqual(Z.equals(actual, expected), true);
}


//  Identity :: a -> Identity a
function Identity(x) {
  if (!(this instanceof Identity)) return new Identity(x);
  this.value = x;
}

Identity['@@type'] = 'my-package/Identity';


var MaybeTypeRep = {'@@type': 'my-package/Maybe'};

//  Nothing :: Maybe a
var Nothing = {constructor: MaybeTypeRep, isNothing: true, isJust: false};

//  Just :: a -> Maybe a
function Just(x) {
  return {constructor: MaybeTypeRep, isNothing: false, isJust: true, value: x};
}


test('type', function() {
  eq(type(null), 'Null');
  eq(type(undefined), 'Undefined');
  eq(type({constructor: null}), 'Object');
  eq(type({constructor: {'@@type': null}}), 'Object');
  eq(type({constructor: {'@@type': new String('')}}), 'Object');
  eq(type(Identity(42)), 'my-package/Identity');
  eq(type(Identity), 'Function');
  eq(type(Identity.prototype), 'Object');
  eq(type(Nothing), 'my-package/Maybe');
  eq(type(Just(0)), 'my-package/Maybe');
  eq(type(Nothing.constructor), 'Object');

  eq(type(false), 'Boolean');
  eq(type(0), 'Number');
  eq(type(''), 'String');

  eq(type(new Boolean(false)), 'Boolean');
  eq(type(new Number(0)), 'Number');
  eq(type(new String('')), 'String');
});
