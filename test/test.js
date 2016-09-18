'use strict';

// Dependencies
let expect = require('chai').expect;
let H = require('../dist/hanuman');

// Data
let numbers, odds, evens, fruit, users;

// Functions
let addTwo, addThree, isEven, double, multiply, subtractTen;

/*eslint-disable no-undef */
before(function () {

    numbers = [1, 2, 3, 4, 5, 6];
    evens = [2, 4, 6, 8, 10, 12];
    odds = [1, 3, 5, 7, 9, 11];

    fruit = ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig'];

    users = [{
        id: '1ad3x',
        name: {
            first: 'Albert',
            last: 'King'
        },
        age: 44
    }, {
        id: '4jde2',
        name: {
            first: 'Joe',
            last: 'Brown'
        },
        age: 26
    }, {
        id: '7ssc1',
        name: {
            first: 'Susan',
            last: 'Wellington'
        },
        age: 62
    }];

    addTwo = (a, b) => a + b;

    addThree = (a, b, c) => a + b + c;

    isEven = v => v % 2 === 0;

    double = x => x * 2;

    multiply = (x, y) => x * y;

    subtractTen = x => x - 10;

});

describe('Hanuman#clone', () => {

    it('works for primitive types', () => {
        expect(H.clone(undefined)).to.be.undefined;
        expect(H.clone(null)).to.be.null;
        expect(H.clone(true)).to.equal(true);
        expect(H.clone(false)).to.equal(false);
        expect(H.clone('input')).to.equal('input');
        expect(H.clone(1)).to.equal(1);
    });

    it('returns a reference for functions', () => {
        expect(H.clone(addTwo)).to.equal(addTwo);
    });

    it('works for simple arrays', () => {
        expect(H.clone(numbers)).to.not.equal(numbers);
        expect(H.get('0', H.clone(numbers))).to.equal(H.get('0', numbers));

        expect(H.clone(fruit)).to.not.equal(fruit);
        expect(H.clone(fruit[0])).to.equal(fruit[0]);
    });

    let getA = H.get('a');

    it('works for simple objects', () => {
        let emptyObj = {};
        expect(H.clone(emptyObj)).to.not.equal(emptyObj);

        let singleKey = { a: 44 };
        let singleKeyClone = H.clone(singleKey);

        expect(singleKeyClone).to.not.equal(singleKey);
        expect(getA(singleKeyClone)).to.equal(getA(singleKey));
    });

    it('works for nested objects', () => {
        let nested = { a: { b: { c: 44, d: { e: [1, 2, 3] } } } };
        let nestedClone = H.clone(nested);

        expect(nestedClone).to.not.equal(nested);
        expect(getA(nestedClone)).to.not.equal(getA(nested));
        expect(H.get(['a', 'b', 'c'], nested)).to.equal(H.get(['a', 'b', 'c'], nestedClone));
        expect(H.get(['a', 'b', 'd'], nested)).to.not.equal(H.get(['a', 'b', 'd'], nestedClone));
        expect(H.get(['a', 'b', 'd', 'e'], nested)).to.not.equal(H.get(['a', 'b', 'd', 'e'], nestedClone));
        expect(H.get(['a', 'b', 'd', 'e', '0'], nested)).to.equal(H.get(['a', 'b', 'd', 'e', '0'], nestedClone));
    });
});

describe('Hanuman#contains', () => {

    it('works for simple lists', () => {
        const hasTwo = H.contains(2);
        expect(hasTwo(numbers)).to.be.true;
        expect(hasTwo(odds)).to.be.false;
    });

    it('works for complex lists', () => {
        const susan = {
            id: '7ssc1',
            name: {
                first: 'Susan',
                last: 'Wellington'
            },
            age: 62
        };

        const containsSusan = H.contains(susan);
        expect(containsSusan(users)).to.be.true;
        expect(H.contains(Object.assign({}, susan, { age: 66 }), users)).to.be.false;
    });

});

describe('Hanuman#curry', function () {

    it('curries a single argument', () => {
        let fn = H.curry(addThree)(10);
        expect(fn(1, 2)).to.equal(13);
        expect(fn(1)(2)).to.equal(13);
    });

    it('curries multiple arguments', () => {
        let fn = H.curry(addThree)(10, 11);
        expect(fn(3)).to.equal(24);
    });

    it('preserves context', () => {
        let context = {
            c: 22
        };
        let fn = H.curry(function (a, b) {
            return a + b + this.c;
        });
        expect(fn.call(context, 1, 2)).to.equal(25);
    });

});

describe('Hanuman#equals', function () {

    it('works for simple values', () => {
        expect(H.equals(1, 1)).to.be.true;
        expect(H.equals(1, 2)).to.be.false;
        expect(H.equals('tim', 'tim')).to.be.true;
        expect(H.equals('tim', 'tom')).to.be.false;
        expect(H.equals(undefined, undefined)).to.be.true;
        expect(H.equals(null, null)).to.be.true;
        expect(H.equals(null, undefined)).to.be.false;
    });

    it('works for simple arrays', () => {
        expect(H.equals([], [])).to.be.true;

        expect(H.equals([1, 2, 3, 4, 5, 6], numbers)).to.be.true;
        expect(H.equals([1, 2, 3, 4, 5, 6], evens)).to.be.false;

        expect(H.equals([1, 2, null, undefined, 44], [1, 2, null, undefined, 44])).to.be.true;
        expect(H.equals([1, 2, null, undefined, 44], [1, 2, null, null, 44])).to.be.false;
    });

    it('works for simple objects', () => {
        expect(H.equals({}, {})).to.be.true;
        expect(H.equals({ a: null }, { b: undefined })).to.be.false;
        expect(H.equals({ a: 44 }, { a: 44 })).to.be.true;
        expect(H.equals({ a: 44 }, { a: 55 })).to.be.false;
    });

    it('works for complex arrays and objects', () => {
        const a = { a: 44, b: 55, c: [1, 2, { x: 99, y: {z: null} }, 'tim'] };
        const b = { a: 44, b: 55, c: [1, 2, { x: 99, y: {z: null} }, 'tom'] };
        expect(H.equals({ a: 44, b: 55, c: [1, 2, { x: 99, y: {z: null} }, 'tim'] }, a)).to.be.true;
        expect(H.equals({ a: 44, b: 55, c: [1, 2, { x: 99, y: {z: null} }, 'tim'] }, b)).to.be.false;
    });

});

describe('Hanuman#find', () => {

    it('works for simple lists', () => {
        const isTwo = H.equals(2);
        expect(H.find(isTwo, numbers)).to.equal(2);
        expect(H.find(isTwo, odds)).to.be.undefined;
    });

    it('works for complex lists', () => {
        const susan = {
            id: '7ssc1',
            name: {
                first: 'Susan',
                last: 'Wellington'
            },
            age: 62
        };

        const firstNameSusan = user => H.get('name.first', user) === 'Susan';
        const firstNameFred = user => H.get('name.first', user) === 'Fred';
        expect(H.equals(susan, H.find(firstNameSusan, users))).to.be.true;
        expect(H.find(firstNameFred, users)).to.be.undefined;
    });

});

describe('Hanuman#forEach', () => {

    it('applies the supplied function to each item in an array', () => {
        let list = [];
        let fn = (v, i) => {
            list.push({
                i,
                v
            });
        };
        H.forEach(fn, fruit);
        expect(list[3].i).to.equal(3);
        expect(list[4].v).to.equal('elderberry');
    });

    it('applies the supplied function to each key-value pair in an object', () => {
        let obj = {};
        let fn = (v, k) => {
            obj[k] = v;
        };
        H.forEach(fn, users[0]);
        expect(obj.name.first).to.equal('Albert');
        expect(obj.name.last).to.equal('King');
    });
});

describe('Hanuman#forEachBreak', () => {

    it('returns early when the predicate function returns true', () => {
        let list = [];
        let fn = (v, i) => list.push({ i, v });
        H.forEachBreak(fn, v => v === 'cherry', fruit);
        expect(list).to.have.lengthOf(2);
    });

    it('does not return early when the predicate function does not return true', () => {
        let list = [];
        let fn = (v, i) => list.push({ i, v });
        H.forEachBreak(fn, v => v === 'pineapple', fruit);
        expect(list[3].i).to.equal(3);
        expect(list[4].v).to.equal('elderberry');
    });

    it('works for conditions outside of local scope', () => {
        let list = [];
        let count = 0;
        let fn = (v, i) => {
            list.push({ i, v });
            count++;
        };
        H.forEachBreak(fn, () => count === 2, fruit);
        expect(list).to.have.lengthOf(2);
    });

    it('works for objects', () => {
        let obj = {};
        let fn = (v, k) => obj[k] = v;
        H.forEachBreak(fn, (v, k) => k === 'name', users[0]);
        expect(obj.id).to.equal('1ad3x');
        expect(obj.name).to.be.undefined;
    });
});


describe('Hanuman#get', () => {

    it('accepts a string and returns the object property', () => {
        expect(H.get('a', {
            a: 44
        })).to.equal(44);

        expect(H.get('name', {
            name: 'Albert'
        })).to.equal('Albert');

        expect(H.get('name.first', {
            name: {
                first: 'Albert',
                last: 'King'
            }
        })).to.equal('Albert');

        expect(H.get('name.middle', {
            name: {
                first: 'Albert',
                last: 'King'
            }
        })).to.be.undefined;
    });

    it('accepts a string and returns undefined if the property does not exist', () => {
        expect(H.get('a', {
            b: 55
        })).to.be.undefined;
    });

    it('accepts an array of keys and returns the nested property', () => {
        expect(H.get(['a', 'b', 'c'], {
            a: {
                b: {
                    c: 44
                }
            }
        })).to.equal(44);
    });

    it('accepts an array of keys and returns undefined if the nested property does not exist', () => {
        expect(H.get(['a', 'b', 'c'], {
            a: {
                b: {
                    x: 1
                }
            }
        })).to.be.undefined;
    });

    it('works with arrays', () => {
        expect(H.get([0, 'a'], [{
            a: 44
        }, {
            a: 55
        }])).to.equal(44);
    });

});

describe('Hanuman#isEmpty', () => {

    it('works with strings', () => {
        expect(H.isEmpty('')).to.be.true;
        expect(H.isEmpty('empty')).to.be.false;
    });

    it('works with arrays', () => {
        expect(H.isEmpty([])).to.be.true;
        expect(H.isEmpty([1, 2, 3])).to.be.false;
    });

    it('works with objects', () => {
        expect(H.isEmpty({})).to.be.true;
        expect(H.isEmpty({ a: 'empty' })).to.be.false;
    });

    it('returns false for all other types', () => {
        expect(H.isEmpty(0)).to.be.false;
        expect(H.isEmpty(44)).to.be.false;
        expect(H.isEmpty(undefined)).to.be.false;
        expect(H.isEmpty(null)).to.be.false;
        expect(H.isEmpty(() => 'empty')).to.be.false;
    });

});

describe('Hanuman#map', () => {

    let timesTen = v => v * 10;

    it('creates a new list using the supplied function', () => {
        let output = H.map(timesTen, numbers);
        expect(output[2]).to.equal(timesTen(numbers[2]));
        expect(output).to.contain(10, 20, 30, 40, 50, 60);
    });

    it('returns an empty list if the input list is empty', () => {
        expect(H.map(timesTen, [])).to.be.empty;
    });

    it('creates a new object using the supplied function', () => {
        let output = H.map(double, {
            a: 1,
            b: 2,
            c: 3
        });
        expect(output).to.deep.equal({
            a: 2,
            b: 4,
            c: 6
        });
    });

    it('returns an empty object if the input object is empty', () => {
        expect(H.map(double, {})).to.be.empty;
    });

});

describe('Hanuman#filter', () => {

    let isEven = v => v % 2 === 0;

    it('returns a new list containing values that satisfy the provided predicate', () => {
        let output = H.filter(isEven, numbers);
        expect(output).to.have.lengthOf(3);
        expect(output[2]).to.equal(6);
    });

    it('returns an empty list if none of the items in the list satisfy the predicate', () => {
        let output = H.filter(isEven, odds);
        expect(output).to.be.empty;
    });

});

describe('Hanuman#omit', () => {

    it('creates a new object, omitting the list of supplied properties', () => {
        expect(H.omit(['a', 'b'], {
            a: 44,
            b: 55,
            c: 66
        })).to.deep.equal({
            c: 66
        });
    });

    it('works for empty objects', () => {
        expect(H.omit(['a', 'b', 'c'], {})).to.deep.equal({});
    });

    it('returns an empty object if all keys are specified', () => {
        expect(H.omit(['a', 'b', 'c'], {
            a: 44,
            b: 55,
            c: 66
        })).to.deep.equal({});
    });

    it('can be curried', () => {
        const omitA = H.omit(['a']);
        expect(omitA({
            a: 44,
            b: 55,
            c: 66
        })).to.deep.equal({
            b: 55,
            c: 66
        });
    });

});

describe('Hanuman#pick', () => {

    it('creates a new object from the list of supplied properties', () => {
        expect(H.pick(['a', 'b'], {
            a: 44,
            b: 55,
            c: 66
        })).to.deep.equal({
            a: 44,
            b: 55
        });
    });

    it('does not copy properties not contained in the supplied object', () => {
        expect(H.pick(['a', 'b'], {
            a: 44,
            c: 66
        })).to.deep.equal({
            a: 44
        });
    });

});

describe('Hanuman#pickAll', () => {

    it('creates a new object from list of supplied properties', () => {
        expect(H.pickAll(['a', 'b'], {
            a: 44,
            b: 55,
            c: 66
        })).to.deep.equal({
            a: 44,
            b: 55
        });
    });

    it('copies all supplied properties whether or not they are contained in the supplied object', () => {
        expect(H.pickAll(['a', 'b', 'c'], {
            a: 44,
            c: 66
        })).to.deep.equal({
            a: 44,
            b: undefined,
            c: 66
        });
    });

});

describe('Hanuman#pipe', () => {

    it('creates a left-to-right composed function', () => {

        expect(H.pipe(subtractTen, double)(22)).to.equal(24);

        let currentYear = new Date().getFullYear();

        let getFullName = input => {
            let user = H.pick(['age'], input);
            user.fullName = `${H.get(['name', 'first'],input)} ${H.get(['name', 'last'], input)}`;
            return user;
        };

        let getBirthYear = input => {
            let user = H.pick(['fullName'], input);
            user.birthYear = currentYear - input.age;
            return user;
        };

        let albert = users[0];
        expect(H.pipe(getFullName, getBirthYear)(albert)).to.deep.equal({
            fullName: 'Albert King',
            birthYear: currentYear - albert.age
        });

    });

    it('accepts curried functions', () => {

        expect(H.pipe(H.get(0), double, subtractTen)(evens)).to.equal(-6);
        expect(H.pipe(H.get(0), double, H.curry(addTwo)(44))(evens)).to.equal(48);

    });

});

describe('Hanuman#range', () => {

    it('creates list of sequential numbers', () => {

        let oneToTen = H.range(1, 10);

        expect(oneToTen).to.have.lengthOf(10);
        expect(H.get('0', oneToTen)).to.equal(1);
        expect(H.get('9', oneToTen)).to.equal(10);

        let justTen = H.range(10, 10);
        expect(justTen).to.have.lengthOf(1);
        expect(H.get('0', justTen)).to.equal(10);
        expect(H.get('1', justTen)).to.be.undefined;
    });

    it('can be curried', () => {

        let startAtOne = H.range(1);
        let oneToTen = startAtOne(10);

        expect(oneToTen).to.have.lengthOf(10);
        expect(H.get('0', oneToTen)).to.equal(1);
        expect(H.get('9', oneToTen)).to.equal(10);
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
        expect(output).to.include.keys('0', '1', '2', '3', '4', '5');
        expect(output[0]).to.equal(1);
        expect(output[4]).to.equal(5);
    });

    it('returns an object when provided with an object as an accumulator', () => {

        let buildEvenSquaresHash = (acc, v) => {
            if (isEven(v)) {
                acc[v] = v * v;
            }
            return acc;
        };

        let evenSquares = H.reduce(buildEvenSquaresHash, {}, numbers);
        expect(evenSquares).to.include.keys('2', '4', '6');
        expect(evenSquares).to.not.include.keys('1', '3', '5');
    });

    it('returns a list when provided with an array as an accumulator', () => {

        let buildEvenSquaresArray = (acc, v) => {
            if (isEven(v)) {
                acc.push(v);
            }
            return acc;
        };

        let evenSquares = H.reduce(buildEvenSquaresArray, [], numbers);
        expect(evenSquares).to.contain(4, 16, 36);
        expect(evenSquares).to.not.contain(1, 9, 25);
    });

});

describe('Hanuman#reject', () => {

    let isEven = v => v % 2 === 0;

    it('returns a new list containing values that do not satisfy the predicate', () => {
        let output = H.reject(isEven, numbers);
        expect(output).to.have.lengthOf(3);
        expect(output[2]).to.equal(5);
    });

    it('returns an empty list if none of the items in the list satisfy the predicate', () => {
        let output = H.reject(isEven, evens);
        expect(output).to.be.empty;
    });

});

describe('Hanuman#scan', () => {

    it('scans functions over an array with the provided accumulator', () => {
        let listOfSums = H.scan(addTwo, 0, numbers);
        expect(listOfSums).to.have.lengthOf(7);
        expect(H.get('0', listOfSums)).to.equal(0);
        expect(H.get('6', listOfSums)).to.equal(21);
    });

    it('returns an array with a single item if provided an empty list', () => {
        let listOfSums = H.scan(addTwo, 0, []);
        expect(listOfSums).to.have.lengthOf(1);
        expect(H.get('0', listOfSums)).to.equal(0);
    });

    it('can be curried', () => {

        let multipleScan = H.scan(multiply);
        let multipleSequence = multipleScan(1, numbers);

        expect(multipleSequence).to.have.lengthOf(7);
        expect(H.get('0', multipleSequence)).to.equal(1);
        expect(H.get('6', multipleSequence)).to.equal(720);
    });

});

afterEach(function (done) {
    setTimeout(done, 25);
});
/*eslint-enable no-undef */
