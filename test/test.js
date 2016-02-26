'use strict';

// Dependencies
let assert = require('assert');
let expect = require('chai').expect;
let H = require('../dist/hanuman');

// Data
let numbers, odds, evens, fruit, users;

// Functions
let addTwo, addThree, isEven, double, subtractTen;

before(function(){

  numbers = [1, 2, 3, 4, 5, 6];
  evens = [2, 4, 6, 8, 10, 12];
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

  double = x => x * 2;

  subtractTen = x => x - 10;

});

describe('Hanuman#curry', function(){

  it('curries a single argument', () => {
  	let fn = H.curry(addThree)(10);
    expect(fn(1,2)).to.equal(13);
    expect(fn(1)(2)).to.equal(13);
  });

  it('curries multiple arguments', () => {
  	let fn = H.curry(addThree)(10,11);
    expect(fn(3)).to.equal(24);
  });

  it('preserves context', () => {
    let context = {c: 22};
    let fn = H.curry(function(a,b) {return a + b + this.c});
    expect(fn.call(context, 1, 2)).to.equal(25);
  });

});

describe('Hanuman#forEach', () => {

  it('applies the supplied function to each item in an array', () => {
  	let list = [];
    let fn = (v,i) => { list.push({i, v}); }
    H.forEach(fn, fruit);
    expect(list[3].i).to.equal(3);
    expect(list[4].v).to.equal('elderberry');
  });

  it('applies the supplied function to each key-value pair in an object', () => {
    let obj = {};
  	let fn = (v,k) => { obj[k] = v;}
    H.forEach(fn, users[0]);
    expect(obj.name.first).to.equal('Albert');
    expect(obj.name.last).to.equal('King');
  });
});

describe('Hanuman#map', () => {

  let fn = v => v * 10;

  it('creates a new list using the supplied function', () => {
    let output = H.map(fn, numbers);
    expect(output[2]).to.equal(fn(numbers[2]));
    expect(output).to.contain(10, 20, 30, 40, 50, 60);
  });

  it('returns an empty list if the input list is empty', () => {
    expect(H.map(fn, [])).to.be.empty;
  });

});

describe('Hanuman#filter', () => {

  let isEven = v => v % 2 === 0;

  it('returns a new list containing values that satisfy the provided predicate', () => {
    let output = H.filter(isEven, numbers);
    expect(output).to.have.lengthOf(3)
    expect(output[2]).to.equal(6);
  });

  it('returns an empty list if none of the items in the list satisfy the predicate', () => {
    let output = H.filter(isEven, odds);
    expect(output).to.be.empty;
  });

});

describe('Hanuman#reduce', () => {

  it('folds a function over an array with the provided accumulator', () => {
    expect(H.reduce(addTwo, 0, numbers)).to.equal(21);
  });

  it('passes the indices to the reducer function', () => {

    let convertToObj = (acc, v, i) => {
      acc[i] = v;
      return acc;
    };

    let output = H.reduce(convertToObj, {}, numbers);
    expect(output).to.include.keys('0','1','2','3','4','5');
    expect(output[0]).to.equal(1);
    expect(output[4]).to.equal(5);
  });

  it('returns an object when provided with an object as an accumulator', () => {

    let buildEvenSquaresHash = (acc, v) => {
        if ( isEven(v) ) {
          acc[v] = v * v;
        }
        return acc;
    };

    let evenSquares = H.reduce(buildEvenSquaresHash, {}, numbers);
    expect(evenSquares).to.include.keys('2','4','6');
    expect(evenSquares).to.not.include.keys('1','3','5');
  });

  it('returns a list when provided with an array as an accumulator', () => {

    let buildEvenSquaresArray = (acc, v) => {
        if ( isEven(v) ) {
          acc.push(v);
        }
        return acc;
    };

    let evenSquares = H.reduce(buildEvenSquaresArray, [], numbers);
    expect(evenSquares).to.contain(4, 16, 36);
    expect(evenSquares).to.not.contain(1, 9, 25);
  });

});

describe('Hanuman#path', () => {

  it('accepts a string and returns the object property', () => {
    expect(H.path('a', { a: 44})).to.equal(44);
  });

  it('accepts a string and returns undefined if the property does not exist', () => {
    expect(H.path('a', { b: 55 })).to.be.undefined;
  });

  it('accepts an array of keys and returns the nested property', () => {
    expect(H.path(['a', 'b', 'c'], { a: { b: { c: 44 } } })).to.equal(44);
  });

  it('accepts an array of keys and returns undefined if the nested property does not exist', () => {
    expect(H.path(['a', 'b', 'c'], { a: { b: { x: 1 }}})).to.be.undefined;
  });

  it('works with arrays', () => {
    expect(H.path([0, 'a'], [{ a: 44 }, { a: 55 }])).to.equal(44);
  });

});

describe('Hanuman#pick', () => {

  it('creates a new object from list of supplied properties', () => {
    expect(H.pick(['a', 'b'], { a: 44, b: 55, c: 66 })).to.deep.equal({ a: 44, b: 55 });
  });

  it('does not copy properties not contained in the supplied object', () => {
    expect(H.pick(['a', 'b'], { a: 44, c: 66 })).to.deep.equal({ a: 44 });
  });

});

describe('Hanuman#pickAll', () => {

  it('creates a new object from list of supplied properties', () => {
    expect(H.pickAll(['a', 'b'], { a: 44, b: 55, c: 66 })).to.deep.equal({ a: 44, b: 55 });
  });

  it('copies all supplied properties whether or not they are contained in the supplied object', () => {
    expect(H.pickAll(['a', 'b', 'c'], { a: 44, c: 66 })).to.deep.equal({ a: 44, b: undefined, c: 66 });
  });

});

describe('Hanuman#pipe', () => {

  it('creates a left-to-right composed function', () => {

    expect(H.pipe(subtractTen, double)(22)).to.equal(24);

  });

  it('accepts curried functions', () => {

    expect(H.pipe(H.path(0), double, subtractTen)(evens)).to.equal(-6);
    expect(H.pipe(H.path(0), double, H.curry(addTwo)(44))(evens)).to.equal(48);

  });

});

afterEach(function (done) {
    setTimeout(done, 25);
});
