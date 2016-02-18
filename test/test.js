'use strict';

let assert = require('assert');
let expect = require('chai').expect;
let H = require('../dist/hanuman');

// Data
let numbers, odds, fruit, users, user;

// Functions
let addTwo, addThree, isEven;

before(function(){

  numbers = [1, 2, 3, 4, 5, 6];
  odds = [1, 3, 5, 7, 9, 11];

  fruit = ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig'];

  users = [
  	{id: '1ad3x', name: {first: 'Albert', last: 'King'}, age: 44},
  	{id: '4jde2', name: {first: 'Joe', last: 'Brown'}, age: 26},
  	{id: '7ssc1', name: {first: 'Susan', last: 'Wellington'}, age: 62}
  ];

  addTwo = (a,b) => a + b;

  addThree = (a,b,c) => a + b + c;

  isEven = v => v % 2 === 0;

});

describe('Hanuman#curry', function(){

  it('curries a single argument', () => {
  	let fn = H.curry(addThree)(10)
    assert.equal(fn(1,2), 13);
  });

  it('curries multiple arguments', () => {
  	let fn = H.curry(addThree)(10,11);
    assert.equal(fn(3), 24);
  });

  it('preserves context', () => {
    let context = {c: 22};
    let fn = H.curry(function(a,b) {return a + b + this.c});
    expect(fn.call(context, 1, 2)).to.equal(25);
  });

  // it should preserve original function length
});

describe('Hanuman#forEach', () => {

  it('applies the supplied function to each item in an array', () => {
  	let list = [];
    let fn = (v,i) => { list.push({i, v}); }
    H.forEach(fn, fruit);
    assert.equal(list[3].i, 3);
    assert.equal(list[4].v, 'elderberry');
  });

  it('applies the supplied function to each key-value pair in an object', () => {
    let obj = {};
  	let fn = (v,k) => { obj[k] = v;}
    H.forEach(fn, users[0]);
    assert.equal(obj.name.first, 'Albert');
    assert.equal(obj.name.last, 'King');
  });
});

describe('Hanuman#map', () => {

  let fn = v => v * 10;

  it('creates a new list using the supplied function', () => {
    let output = H.map(fn, numbers)
    assert.equal(output[2], numbers[2] * 10);
  });

  it('returns an empty list if the input list is empty', () => {
    assert.equal(H.map(fn, []).length, 0);
  });

});

describe('Hanuman#filter', () => {

  let isEven = v => v % 2 === 0;

  it('returns a new list containing values that satisfy the provided predicate', () => {
    let output = H.filter(isEven, numbers)
    assert.equal(output.length, 3);
    assert.equal(output[2], 6);
  });

  it('returns an empty list if none of the items in the list satisfy the predicate', () => {
    let output = H.filter(isEven, odds);
    assert.equal(output.length, 0);
  });

});

describe('Hanuman#reduce', () => {

  it('folds a function over an array with the provided accumulator', () => {
    expect(H.reduce(addTwo, 0, numbers)).to.equal(21);
  });

  it('returns an object when provided with an object as an accumulator', () => {

    let addEvenSquare = (acc, v) => {
        if ( isEven(v) ) {
          acc[v] = v * v;
        }
        return acc;
    };

    let evenSquares = H.reduce(addEvenSquare, {}, numbers);
    expect(evenSquares).to.include.keys('2','4','6');
  });
  //
  // it('should return a list when provided with an array as an accumulator', () => {
  //   let output = H.filter(isEven, numbers)
  //   assert(output.length === 3, output[2] === 6);
  // });
  //
  // it('should return an object when provided with an object as an accumulator', () => {
  //   let output = H.filter(isEven, odds);
  //   assert.equal(output.length, 0);
  // });

});

// afterEach(function (done) {
//     setTimeout(done, 50);
// });
