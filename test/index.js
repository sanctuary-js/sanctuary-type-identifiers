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


var MaybeTypeRep = {'@@type': 'my-package/Maybe@1'};

//  Nothing :: Maybe a
var Nothing = {constructor: MaybeTypeRep, isNothing: true, isJust: false};

//  Just :: a -> Maybe a
function Just(x) {
  return {constructor: MaybeTypeRep, isNothing: false, isJust: true, value: x};
}

function mock($$type) {
  return {constructor: {'@@type': $$type}};
}

function TypeIdentifier(namespace, name, version) {
  return {namespace: namespace, name: name, version: version};
}

function named(name) {
  return TypeIdentifier(null, name, 0);
}

test('type', function() {
  eq(type(null), named('Null'));
  eq(type(undefined), named('Undefined'));

  eq(type({constructor: null}), named('Object'));
  eq(type(mock(null)), named('Object'));
  eq(type(mock(new String(''))), named('Object'));
  eq(type(mock('Type')), named('Type'));

  eq(type(mock('package/Type')), TypeIdentifier('package', 'Type', 0));
  eq(type(mock('package/Type/X')), TypeIdentifier('package', 'Type/X', 0));
  eq(type(mock('@scope/package/Type')), TypeIdentifier('@scope/package', 'Type', 0));
  eq(type(mock('')), TypeIdentifier(null, '', 0));
  eq(type(mock('/Type')), TypeIdentifier(null, '/Type', 0));
  eq(type(mock('@0')), TypeIdentifier(null, '@0', 0));
  eq(type(mock('foo/\n@1')), TypeIdentifier('foo', '\n', 1));
  eq(type(mock('Type@0')), TypeIdentifier(null, 'Type', 0));
  eq(type(mock('Type@1')), TypeIdentifier(null, 'Type', 1));
  eq(type(mock('Type@999')), TypeIdentifier(null, 'Type', 999));
  eq(type(mock('Type@X')), TypeIdentifier(null, 'Type@X', 0));
  eq(type(mock('package/Type@1')), TypeIdentifier('package', 'Type', 1));
  eq(type(mock('package////@3@2@1@1')), TypeIdentifier('package', '///@3@2@1', 1));

  eq(type(Identity(42)), TypeIdentifier('my-package', 'Identity', 0));
  eq(type(Identity), named('Function'));
  eq(type(Identity.prototype), named('Object'));
  eq(type(Nothing), TypeIdentifier('my-package', 'Maybe', 1));
  eq(type(Just(0)), TypeIdentifier('my-package', 'Maybe', 1));
  eq(type(Nothing.constructor), named('Object'));

  eq(type(false), named('Boolean'));
  eq(type(0), named('Number'));
  eq(type(''), named('String'));

  eq(type(new Boolean(false)), named('Boolean'));
  eq(type(new Number(0)), named('Number'));
  eq(type(new String('')), named('String'));
});
