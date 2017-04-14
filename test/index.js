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

function parsed(namespace, name, version) {
  return {namespace: namespace, name: name, version: version};
}

function named(name) {
  return parsed(null, name, null);
}

test('type', function() {
  eq(type(null), named('Null'));
  eq(type(undefined), named('Undefined'));

  eq(type({constructor: null}), named('Object'));
  eq(type(mock(null)), named('Object'));
  eq(type(mock(new String(''))), named('Object'));
  eq(type(mock('Type')), named('Type'));

  eq(type(mock('package/Type')), parsed('package', 'Type', null));
  eq(type(mock('package/Type/X')), parsed('package', 'Type/X', null));
  eq(type(mock('')), parsed(null, '', null));
  eq(type(mock('/Type')), parsed(null, '/Type', null));
  eq(type(mock('@0')), parsed(null, '@0', null));
  eq(type(mock('foo/\n@1')), parsed('foo', '\n', 1));
  eq(type(mock('Type@0')), parsed(null, 'Type', 0));
  eq(type(mock('Type@1')), parsed(null, 'Type', 1));
  eq(type(mock('Type@999')), parsed(null, 'Type', 999));
  eq(type(mock('Type@X')), parsed(null, 'Type@X', null));
  eq(type(mock('package/Type@1')), parsed('package', 'Type', 1));
  eq(type(mock('package////@3@2@1@1')), parsed('package', '///@3@2@1', 1));

  eq(type(Identity(42)), parsed('my-package', 'Identity', null));
  eq(type(Identity), named('Function'));
  eq(type(Identity.prototype), named('Object'));
  eq(type(Nothing), parsed('my-package', 'Maybe', 1));
  eq(type(Just(0)), parsed('my-package', 'Maybe', 1));
  eq(type(Nothing.constructor), named('Object'));

  eq(type(false), named('Boolean'));
  eq(type(0), named('Number'));
  eq(type(''), named('String'));

  eq(type(new Boolean(false)), named('Boolean'));
  eq(type(new Number(0)), named('Number'));
  eq(type(new String('')), named('String'));
});
