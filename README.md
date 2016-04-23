ø( &#94;_&#94; )ø
-----------------

 - Provides a minimal, yet powerful set of utility functions
 - Functions are automatically curried
 - Inspired by [Ramda](http://ramdajs.com/)
 - 4kb minified

*I'm open to adding additional functionality to Hanuman, so long as I can keep the size of the library to ~1/10 that of Ramda. If there's something you'd like to see added, open an [issue](https://github.com/adrice727/hanuman/issues) on GitHub.*


###Installation:
For use with Node:

```bash
$ npm install hanuman-js
```

```javascript
var H = require('hanuman-js');
```
For use in the Browser:

```bash
$ bower install hanuman-js
```
```html
<script src="../bower_components/hanuman-js/dist/hanuman.min.js"></script>
```

###Methods:

### `clone`

*Creates a deep copy of the supplied input for all types except functions,
for which a reference is returned.*
######`*`  **&rarr;**  `*`
```javascript

let numbers = [1, 2, 3, 4, 5];
let numbersCopy = H.clone(numbers); // [1, 2, 3, 4, 5];
numbers === numbersCopy; // returns false

let user = {id: '28jd2', name: {first: 'Albert' , last: 'King' }, age: 55};
let userCopy = H.clone(user);
user === userCopy; // returns false
user.id === userCopy.id // returns true
user.name === userCopy.name // returns false
user.age === userCopy.age // returns true

let add = (a,b,c) => a + b + c;
H.clone(add) === add; \\ returns true


H.clone(44); // returns 44
H.clone('copy'); // returns 'copy'
H.clone(true); // returns true
H.clone(null); // returns null
H.clone(undefined); // returns undefined
```

### `curry`

*Returns a curried version of the supplied function*
######`function`  **&rarr;**  `function`
```javascript
let add = (a,b,c) => a + b + c;
let addTen = H.curry(add)(10);

addTen(2,3) // returns 15
addTen(2)(3) // returns 15
```

### `filter`
*Applies a predicate function to a list of values and returns a new list of values which pass the test*
######`function`  **&rarr;**  `array`    **&rarr;**  `array`
```javascript
let isEven= (a) => a % 2 === 0;
let numbers = [1, 2, 3, 4, 5];

let getEvens = H.filter(isEven);
getEvens(numbers); // returns [2, 4]
```

### `forEach`

*Applies a function to each item in the collection.  If the collection is an array, the  iterator function will receive the value, index, and array.  If the collection is an object, the iterator function will receive the value, key, and object.*
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
### `get`
*Returns a property from an object, or undefined if it doesn't exist.  An array of keys can be passed as the first argument to retrieve a nested property.*
######`string | array`  **&rarr;**  `object`    **&rarr;**  `* | undefined`
```javascript
let user = {id: '28jd2', name: {first: 'Albert' , last: 'King' }, age: 55};

H.get('id', user); // returns '28jd2'

let getFirstName = H.get(['name', 'first']);
getFirstName(user); // returns 'Albert'

H.get(['name', 'middle'], user); // returns undefined
```

### `isEmpty`
######*`* cannot be curried *`*
*Returns a boolean indicating whether or not the given input is empty*
######`string | array | object`  **&rarr;**  `boolean` 
```javascript
H.isEmpty(''); // returns true
H.isEmpty('empty'); // returns false

H.isEmpty([]); // returns true
H.isEmpty([1, 2, 3]); // returns false

H.isEmpty({}); // returns true
H.isEmpty({a: 'empty'}); // returns false

H.isEmpty(0); // returns false
H.isEmpty(44); // returns false
H.isEmpty(null); // returns false
H.isEmpty(undefined); // returns false
```

### `map`
*Creates a new array or object by applying a function to each value in the  array or object property*
######`function`  **&rarr;**  `array | object`    **&rarr;**  `array | object`
```javascript
let square  = (a) => a * a;
let numbers = [1, 2, 3, 4, 5];

H.map(square, numbers); // returns [1, 4, 9, 16, 25]

let double = x => x * 2;
H.map(double, { a: 1, b: 2, c: 3 }); // returns { a: 2, b: 4, c: 6 }
```

### `pick`
*Returns a new object by copying properties from the supplied object.  Undefined properties are not copied to the new object.*
######`array`  **&rarr;**  `object`    **&rarr;**  `object`
```javascript
let fruit = {a: 'apple', b: 'banana', c: 'cherry', d: 'date', e: 'elderberry'};

H.pick(['a', 'b', 'd'], fruit) // returns {a: 'apple', b: 'banana', d: 'date'};
H.pick(['a', 'f'], fruit) // returns {a: 'apple'};
```
### `pickAll`
*Returns a new object by copying properties from the supplied object.  Undefined properties are copied to the new object.*
######`array`  **&rarr;**  `object`    **&rarr;**  `object`
```javascript
let fruit = {a: 'apple', b: 'banana', c: 'cherry', d: 'date', e: 'elderberry'};

H.pickAll(['a', 'b', 'd'], fruit) // returns {a: 'apple', b: 'banana', d: 'date'};
H.pickAll(['a', 'f'], fruit) // returns {a: 'apple', f: undefined};
```

### `pipe`
######*`* cannot be curried *`*
*Creates a composed function by chaining the provided functions from left to right.  The first function in the chain may accept any number of arguments.  The remaining functions may only accept a single argument.*
######`...function`  **&rarr;**  `function`
```javascript
let double = x => x * 2;
let subtractTen = x => x - 10;

H.pipe(subtractTen, double)(22) // returns 24

let evens = [2, 4, 6, 8, 10, 12];
let addTwo = (a,b) => a + b;

let doubleFirstPlus44 = H.pipe(H.path(0), double, H.curry(addTwo)(44));

doubleFirstPlus44(evens) // returns 48
```


### `range`
*Returns a list of sequential numbers*
######`number`  **&rarr;**  `number`    **&rarr;**  `array`
```javascript

H.range(1,5); // returns [1, 2, 3, 4, 5]
H.range(15,15); // returns [15]
H.range(1,0); // returns []

let startAtTwelve = H.range(12);
startAtTwelve(13); // returns [12, 13];
startAtTwelve(17); // returns [12, 13, 14, 15, 16, 17];

```

### `reduce`
*Applies an iterator function to an accumulator and the current value of the list, successively returning a single value*
######`function`  **&rarr;**  `*`    **&rarr;**  `array`  **&rarr;**  `*`
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

### `scan`
*Applies an iterator function to an accumulator and each value in a a list, returning a list of successively reduced values*
######`function`  **&rarr;**  `*`    **&rarr;**  `array`  **&rarr;**  `array`
```javascript
let add = (a, b) => a + b;
let numbers = [1, 2, 3, 4, 5];

H.scan(add, 0, []); // returns [0]
H.scan(add, 0, numbers); // returns [0, 1, 3, 6, 10, 15]
H.scan(add, '', ['a', 'b', 'c']); // returns ['', 'a', 'ab', 'abc']

```