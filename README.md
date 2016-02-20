##### ø( &#94;_&#94; )ø ####
### Hanuman : A small, functional, JavaScript helper library


#### `curry`
##### Returns a curried version of the supplied function
######`function`  **&rarr;**  `function`

```javascript
let add = (a,b,c) => a + b + c;
let addTen = H.curry(add)(10);

addTen(2,3) // returns 15
addTen(2)(3) // returns 15
```
#### `forEach`
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
######`function`  **&rarr;**  `array`    **&rarr;**  `array`
```javascript
let square  = (a) => a * a;
let numbers = [1, 2, 3, 4, 5];

H.map(square, numbers); // returns [1, 4, 9, 16, 25]
```
#### `filter`
######`function`  **&rarr;**  `array`    **&rarr;**  `array`
```javascript
let isEven= (a) => a % 2 === 0;
let numbers = [1, 2, 3, 4, 5];

H.filter(isEven, numbers); // returns [2, 4]
```
#### `reduce`
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
######`array | string`  **&rarr;**  `object`    **&rarr;**  `* | undefined`
```javascript
let user = {id: '28jd2', name: {first: 'Albert' , last: 'King' }, age: 55};

H.path('id', user); // returns '28jd2'

let getFirstName = H.path(['name', 'first']);
getFirstName(user); // returns 'Albert'

H.path(['name', 'middle'], user); // returns undefined
```
#### `pick`
######`array`  **&rarr;**  `object`    **&rarr;**  `object`
```javascript
let fruit = {a: 'apple', b: 'banana', c: 'cherry', d: 'date', e: 'elderberry'};

H.pick(['a', 'b', 'd'], fruit) // returns {a: 'apple', b: 'banana', d: 'date'};
H.pick(['a', 'f'], fruit) // returns {a: 'apple'};
```
#### `pickAll`
######`array`  **&rarr;**  `object`    **&rarr;**  `object`
```javascript
let fruit = {a: 'apple', b: 'banana', c: 'cherry', d: 'date', e: 'elderberry'};

H.pickAll(['a', 'b', 'd'], fruit) // returns {a: 'apple', b: 'banana', d: 'date'};
H.pickAll(['a', 'f'], fruit) // returns {a: 'apple', f: undefined};
```
