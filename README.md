##### ø( &#94;_&#94; )ø ####
## Hanuman : A small, functional, JavaScript helper library

###Methods:
#### `curry`

***Returns a curried version of the supplied function***
######`function`  **&rarr;**  `function`
```javascript
let add = (a,b,c) => a + b + c;
let addTen = H.curry(add)(10);

addTen(2,3) // returns 15
addTen(2)(3) // returns 15
```
#### `forEach`

***Applies a function to each item in the collection.  If the collection is an array, the  iterator function will receive the value, index, and array.  If the collection is an object, the iterator function will receive the value, key, and object.***
######`function`  **&rarr;**  `array`    **&rarr;**  `*`
```javascript
let log = (v, i, list) => console.log(v);
let numbers = [1, 2, 3, 4, 5];

let logEach = H.curry(log);
logEach(numbers); // logs 1, 2, 3, 4, 5

let logObject = (v, k, obj) => console.log(`${k}: ${v}`);
let user = {id: '28jd2', name: {first: 'Albert' , last: 'King' }, age: 55};

H.forEach(logObject, user) // logs 'id: 28jd2', 'name: [object Object]', 'age: 55'

```
#### `map`
***Creates a new list by applying a function to each item in the list***
######`function`  **&rarr;**  `array`    **&rarr;**  `array`
```javascript
let square  = (a) => a * a;
let numbers = [1, 2, 3, 4, 5];

H.map(square, numbers); // returns [1, 4, 9, 16, 25]
```
#### `filter`
***Applies a predicate function to a list of values and returns a new list of values which pass the test***
######`function`  **&rarr;**  `array`    **&rarr;**  `array`
```javascript
let isEven= (a) => a % 2 === 0;
let numbers = [1, 2, 3, 4, 5];

H.filter(isEven, numbers); // returns [2, 4]
```
#### `reduce`
***Applies an iterator function to an accumulator and each value in a a list, returning a single value***
######`function`  **&rarr;**  `*`    **&rarr;**  `*`
```javascript
let add = (a, b) => a + b;
let numbers = [1, 2, 3, 4, 5];

H.reduce(add, 0, numbers); // returns 15
H.reduce(add, 10, numbers); // returns 25

let isEven= (a) => a % 2 === 0;
let evenSquares = (acc, v) => {
    if ( isEven(v) ) {
        acc[v] = v * v;
    }
    return acc;
}

H.reduce(evenSquares, {}, numbers); // returns { 2:4, 4:16 }
```
#### `path`
***Returns a property from an object, or undefined if it doesn't exist.  An array of keys can be passed as the first object to retrieve a nested property. ***
######`array | string`  **&rarr;**  `object`    **&rarr;**  `* | undefined`
```javascript
let user = {id: '28jd2', name: {first: 'Albert' , last: 'King' }, age: 55};

H.path('id', user); // returns '28jd2'

let getFirstName = H.path(['name', 'first']);
getFirstName(user); // returns 'Albert'

H.path(['name', 'middle'], user); // returns undefined
```
#### `pick`
*** Returns a new object by copying properties from the supplied object.  Undefined properties are not copied to the new object.***
######`array`  **&rarr;**  `object`    **&rarr;**  `object`
```javascript
let fruit = {a: 'apple', b: 'banana', c: 'cherry', d: 'date', e: 'elderberry'};

H.pick(['a', 'b', 'd'], fruit) // returns {a: 'apple', b: 'banana', d: 'date'};
H.pick(['a', 'f'], fruit) // returns {a: 'apple'};
```
#### `pickAll`
*** Returns a new object by copying properties from the supplied object.  Undefined properties are copied to the new object.***
######`array`  **&rarr;**  `object`    **&rarr;**  `object`
```javascript
let fruit = {a: 'apple', b: 'banana', c: 'cherry', d: 'date', e: 'elderberry'};

H.pickAll(['a', 'b', 'd'], fruit) // returns {a: 'apple', b: 'banana', d: 'date'};
H.pickAll(['a', 'f'], fruit) // returns {a: 'apple', f: undefined};
```
