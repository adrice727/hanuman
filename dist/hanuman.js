var _this = this;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/*eslint-disable no-extra-semi */;
(function () {
    /*eslint-enable no-extra-semi */

    'use strict';

    /** Accepts a message, and returns a new error */

    var _error = function _error(message) {
        return new Error('ø( ^_^ )ø Hanuman: ' + message);
    };

    /** Check for null */
    var _isNull = function _isNull(input) {
        return input === null;
    };

    /** Check for boolean */
    var _isBoolean = function _isBoolean(input) {
        return typeof input === 'boolean';
    };

    /** Check for boolean */
    var _isFunction = function _isFunction(input) {
        return typeof input === 'function';
    };

    /** Check for string */
    var _isString = function _isString(input) {
        return typeof input === 'string';
    };

    /** Check for number */
    var _isNumber = function _isNumber(input) {
        return typeof input === 'number';
    };

    /** Check for array */
    var _isArray = function _isArray(input) {
        return Array.isArray(input);
    };

    /** Check for object */
    var _isObject = function _isObject(input) {
        return (typeof input === 'undefined' ? 'undefined' : _typeof(input)) === 'object' && !_isNull(input);
    };

    /** Ensures that the input is of the correct type */
    var _validateType = function _validateType(type, input) {

        switch (type) {
            case 'number':
                if (!_isNumber(input)) {
                    throw _error('Input must be a number');
                }
                break;
            case 'array':
                if (!_isArray(input)) {
                    throw _error('Input must be an array');
                }
                break;
            case 'object':
                if (!_isObject(input)) {
                    throw _error('Input must be an object');
                }
                break;
            case 'array-object':
                if (!_isArray(input) && !_isObject(input)) {
                    throw _error('Input must be an array or an object');
                }
                break;
        }
    };

    /**
     * Returns a deep copy of the supplied input for all types except functions,
     * for which a reference is returned.
     * @param {*} input - A single argument or series of arguments
     */
    var clone = function clone(input) {

        if (_isString(input)) {
            return input.slice();
        }

        if (_isBoolean(input)) {
            return !!input;
        }

        if (_isFunction(input) || _isNumber(input) || _isNull(input)) {
            return input;
        }

        if (_isArray(input)) {

            var cloneArray = function cloneArray(acc, input) {
                acc.push(clone(input));
                return acc;
            };

            return reduce(cloneArray, [], input);
        }

        if (_isObject(input)) {

            var cloneObj = function cloneObj(acc, key) {
                acc[key] = clone(input[key]);
                return acc;
            };

            return H.reduce(cloneObj, {}, Object.keys(input));
        }
    };

    /**
     * Returns a curried version of the supplied function
     * @param {Function} fn - The function to be curried
     * @param {...*} [args] - A single argument or series of arguments
     * TODO Preserve length of original function
     */
    var curry = function curry(fn, args) {

        args = args || [];

        return function () {

            var arity = fn.length;
            var combinedArgs = args.concat(Array.from(arguments));

            if (combinedArgs.length === arity) {
                return fn.apply(this, combinedArgs);
            } else {
                return curry(fn, combinedArgs);
            }
        };
    };

    /**
     * Applies a predicate function to a list of values and returns a new list of values which pass the test
     * @param {Function} fn - The predicate function which acts as the filter
     * @param {Array} list - The list to be iterated over
     */
    var filter = function filter(fn, list) {

        _validateType('array', list);

        var reducer = function reducer(acc, item) {
            !!fn(item) && acc.push(item);
            return acc;
        };

        return reduce(reducer, [], list);
    };

    /** forEach Array */
    var _forEachArray = function _forEachArray(fn, array, condition) {

        var check = condition ? condition : function () {
            return false;
        };

        for (var i = 0; i < array.length; i++) {
            if (check(array[i], i, array)) {
                return;
            }
            fn(array[i], i, array);
        }
    };

    /** forEach Object */
    var _forEachObject = function _forEachObject(fn, obj, condition) {

        var check = condition ? condition : function () {
            return false;
        };

        var keys = Object.keys(obj);
        for (var i = 0; i < keys.length; i++) {
            if (check(obj[keys[i]], keys[i], obj)) {
                return;
            }
            fn(obj[keys[i]], keys[i], obj);
        }
    };

    /**
     * Applies a function to each item in the collection.  If the collection is an array, the
     * iterator function will receive the value, index, and array.  If the collection is an object
     * the iterator function will receive the value, key, and object.
     * @param {Function} fn
     * @param {Array | Object} [args] - A single argument or series of arguments
     */
    var forEach = function forEach(fn, collection) {

        _validateType('array-object', collection);

        Array.isArray(collection) ? _forEachArray(fn, collection) : _forEachObject(fn, collection);
    };

    /**
     * Identical to forEach, except a predicate function is taken as the second parameter to allow for
     * for early termination of the iteration process.  The predicate function accepts the same parameters
     * as the iteratior function.  Since the order of object keys cannot be guaranteed, it is not possible
     * to determine when the predicate function will result in early termination.
     * @param {Function} fn
     * @param {Function} condition
     * @param {Array | Object} [args] - A single argument or series of arguments
     */
    var forEachBreak = function forEachBreak(fn, condition, collection) {

        _validateType('array-object', collection);

        Array.isArray(collection) ? _forEachArray(fn, collection, condition) : _forEachObject(fn, collection, condition);
    };

    /**
     * Returns the value from an object, or undefined if it doesn't exist
     * @param {String | Array} props - An array of properties or a single property
     * @param {Object | Array} obj
     */
    var get = function get(props, obj) {

        _validateType('object', obj);

        var nested = obj;
        var properties = typeof props === 'string' ? props.split('.') : props;

        for (var i = 0; i < properties.length; i++) {
            nested = nested[properties[i]];
            if (nested === undefined) {
                return nested;
            }
        }

        return nested;
    };

    /**
     * Returns a boolean indicating whether or not the given input is empty
     * @param {String | Array | object} input
     */
    var isEmpty = function isEmpty(input) {

        if ((_isString(input) || _isArray(input)) && input.length === 0) {
            return true;
        }

        if (_isObject(input) && Object.keys(input).length === 0) {
            return true;
        }

        return false;
    };

    /** Map array */
    var _mapArray = function _mapArray(fn, array) {

        return reduce(function (acc, item) {
            acc.push(fn(item));
            return acc;
        }, [], array);
    };

    /** Map object */
    var _mapObject = function _mapObject(fn, obj) {

        return reduce(function (acc, key) {
            acc[key] = fn(obj[key]);
            return acc;
        }, {}, Object.keys(obj));
    };

    /**
     * Creates a new array, or a new object, by applying a function to each item item in
     * the list, or key/value pair
     * @param {Function} fn - The function to be called on each element
     * @param {Array | Object} list - The list to be iterated over
     */
    var map = function map(fn, collection) {

        _validateType('array-object', collection);

        return _isArray(collection) ? _mapArray(fn, collection) : _mapObject(fn, collection);
    };

    /** Creates a clone from a source object property and assigns it to an accumulator object.
     * @param {Object} obj - The source object
     * @param {Object} acc - The accumulator (destination) object
     * @param {String} key - The key of the k/v pair to copy
     * @param {Boolean} all - Should undefined properties be copied
     */
    var _copyProperty = function _copyProperty(obj, acc, key, all) {
        if (all || obj.hasOwnProperty(key)) {
            acc[key] = clone(obj[key]);
        }
        return acc;
    };

    /**
     * Returns a new object by copying properties from the supplied object.  Undefined
     * properties are not copied to the new object.
     * @param {Array} props - An array of properties
     * @param {Object} obj - The object from which the properties are copied
     */
    var pick = function pick(props, obj) {

        _validateType('object', obj);

        var copyProperty = function copyProperty(acc, key) {
            return _copyProperty(obj, acc, key, false);
        };

        return reduce(copyProperty, {}, props);
    };

    /**
     * Returns a new object by copying properties from the supplied object.  Undefined
     * properties are copied to the new object.
     * @param {Array} props - An array of properties
     * @param {Object} obj - The object from which the properties are copied
     */
    var pickAll = function pickAll(props, obj) {

        _validateType('object', obj);

        var copyProperty = function copyProperty(acc, key) {
            return _copyProperty(obj, acc, key, true);
        };

        return reduce(copyProperty, {}, props);
    };

    /**
     * Returns a composed function by chaining the provided functions from left
     * to right.  The first function in the chain may accept any number of
     * arguments.  The remaining functions may only accept a single argument.
     * @param {...Function} fns
     */
    var pipe = function pipe() {
        for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
            fns[_key] = arguments[_key];
        }

        return function () {
            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            var pipe = function pipe(acc, fn) {
                return _isArray(acc) ? fn.apply(_this, acc) : fn.call(_this, acc);
            };

            return reduce(pipe, args, fns);
        };
    };

    /**
     * Returns a list of sequential numbers
     * @param {Number} start - The first number in the list
     * @param {Number} end - The last number in the list
     */
    var range = function range(start, end) {

        _validateType('number', parseInt(start)) && _validateType('number', parseInt(stop));

        var list = [];
        var current = parseInt(start);
        var stop = parseInt(end) + 1;

        while (current < stop) {
            list.push(current++);
        }

        return list;
    };

    /**
     * Applies an iterator function to an accumulator and each value in a a list, returning a single value
     * @param {Function} fn - The iterator function which receives the memo and current item from the list
     * @param {*} acc - The initial value passed to the iterator function
     * @param {Array} list - The list to be iterated over
     */
    var reduce = function reduce(fn, memo, list) {

        _validateType('array', list);

        var result = memo;

        _forEachArray(function (value, i) {
            result = fn(result, value, i);
        }, list);

        return result;
    };

    /**
     * Applies an iterator function to an accumulator and each value in a a list, returning a list
     * of successively reduced values
     * @param {Function} fn - The iterator function which receives the memo and current item from the list
     * @param {*} acc - The initial value passed to the iterator function
     * @param {Array} list - The list to be iterated over
     */
    var scan = function scan(fn, memo, list) {

        _validateType('array', list);

        var result = [memo];

        _forEachArray(function (value, i) {
            result.push(fn(result[i], value, i));
        }, list);

        return result;
    };

    var H = {
        clone: clone,
        curry: curry,
        filter: curry(filter),
        forEach: curry(forEach),
        forEachBreak: curry(forEachBreak),
        get: curry(get),
        isEmpty: isEmpty,
        map: curry(map),
        pick: curry(pick),
        pickAll: curry(pickAll),
        pipe: pipe,
        range: curry(range),
        reduce: curry(reduce),
        scan: curry(scan)
    };

    if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
        module.exports = H;
        /*eslint-disable no-undef */
    } else if (typeof define === 'function' && define.amd) {
            define(function () {
                return H;
            });
            /*eslint-disable no-undef */
        } else {
                _this.H = H;
            }
})(this);