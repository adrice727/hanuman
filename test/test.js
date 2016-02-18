var assert = require('assert');
var H = require('../dist/hanuman');

// Data
var numberList, fruitList, userList, user;

// Functions
var add;

before(function(){

  numberList = [1, 2, 3, 4, 5, 6];

  fruitList = ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig'];

  userList = [
  	{id: '1ad3x', name: {first: 'Albert', last: 'King'}, age: 44},
  	{id: '4jde2', name: {first: 'Joe', last: 'Brown'}, age: 26},
  	{id: '7ssc1', name: {first: 'Susan', last: 'Wellington'}, age: 62}
  ];

  add = function(a,b,c) {
  	return a + b + c;
  };

});

describe('Hanuman#curry', function(){

  it('should curry a single argument', function(){
  	var fn = H.curry(add)(10)
    assert.equal(fn(1,2), 13);
  });

  it('should curry multiple arguments', function(){
  	var fn = H.curry(add)(10,11);
    assert.equal(fn(3), 24);
  });
});

describe('Hanuman#forEach', function(){

  it('should apply the supplied function to each item in an array', function(){
  	var list = [];
    var fn = function(v,i) { list.push({i:i, v:v}); }
    H.forEach(fn, fruitList);
    assert(list[3].i === 3, list[4].v === 'date');
  });

  it('should apply an iterate function to each property in an object', function(){
    var obj = {};
  	var fn = function(v,k) { obj[k] = v;}
    H.forEach(fn, userList[0]);
    assert(obj.name.first === 'Albert', obj.name.last === 'King');
  });
});

describe('Hanuman#map', function(){

  it('should create a new list using the supplied function', function(){
  	var fn = function(v) { return v * 10}
    var output = H.map(fn, numberList)
    assert.equal(output[2], numberList[2] * 10);
  });

  it('should return an empty list if the input list is empty', function(){
    assert.equal(H.map(function(x){ return x; }, []).length, 0);
  });

});
