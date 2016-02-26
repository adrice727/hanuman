var _this = this;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/*eslint-disable no-extra-semi */
;(function () {
    /*eslint-enable no-extra-semi */

    'use strict';

    /** Accepts a message, and returns a new error */

    var _error = function _error(message) {
        return new Error('ø( ^_^ )ø Hanuman: ' + message);
    };

    /** Check for array */
    var _isArray = function _isArray(input) {
        return Array.isArray(input);
    };

    /** Check for object */
    var _isObject = function _isObject(input) {
        return (typeof input === 'undefined' ? 'undefined' : _typeof(input)) === 'object';
    };

    /** Ensures that the input is of the correct type */
    var _validateType = function _validateType(type, input) {

        switch (type) {
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
     * Returns a curried version of the supplied function
     * @param {function} fn - The function to be curried
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

    /** forEach Array */
    var _forEachArray = function _forEachArray(fn, array) {

        for (var i = 0; i < array.length; i++) {
            fn(array[i], i, array);
        }
    };

    /** forEach Object */
    var _forEachObject = function _forEachObject(fn, obj) {

        var keys = Object.keys(obj);
        for (var i = 0; i < keys.length; i++) {
            fn(obj[keys[i]], keys[i], obj);
        }
    };

    /**
     * Applies a function to each item in the collection.  If the collection is an array, the
     * iterator function will receive the value, index, and array.  If the collection is an object
     * the iterator function will receive the value, key, and object.
     * @param {function} fn
     * @param {array | object} [args] - A single argument or series of arguments
     */
    var forEach = function forEach(fn, collection) {

        _validateType('array-object', collection);

        Array.isArray(collection) ? _forEachArray(fn, collection) : _forEachObject(fn, collection);
    };

    /**
     * Creates a new list by applying a function to each item in the list
     * @param {function} fn - The function to be called on each element
     * @param {array} list - The list to be iterated over
     */
    var map = function map(fn, list) {

        _validateType('array', list);

        return reduce(function (acc, item) {
            acc.push(fn(item));
            return acc;
        }, [], list);
    };

    /**
     * Applies a predicate function to a list of values and returns a new list of values which pass the test
     * @param {function} fn - The predicate function which acts as the filter
     * @param {array} list - The list to be iterated over
     */
    var filter = function filter(fn, list) {

        _validateType('array', list);

        var reducer = function reducer(acc, item) {
            !!fn(item) && acc.push(item);
            return acc;
        };

        return reduce(reducer, [], list);
    };

    /**
     * Applies an iterator function to an accumulator and each value in a a list, returning a single value
     * @param {function} fn - The iterator function which receives the memo and current item from the list
     * @param {*} acc - The initial value passed to the iterator function
     * @param {array} list - The list to be iterated over
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
     * Returns the value from an object, or undefined if it doesn't exist
     * @param {array | string} props - An array of properties or a single property
     * @param {object | array} obj
     */
    var path = function path(props, obj) {

        _validateType('object', obj);

        var nested = obj;
        var properties = typeof props === 'string' ? Array.from(props) : props;

        for (var i = 0; i < properties.length; i++) {
            nested = nested[properties[i]];
            if (nested === undefined) {
                return nested;
            }
        }

        return nested;
    };

    /**
     * Returns a new object by copying properties from the supplied object.  Undefined
     * properties are not copied to the new object.
     * @param {array} props - An array of properties
     * @param {object} obj - The object from which the properties are copied
     */
    var pick = function pick(props, obj) {

        _validateType('object', obj);

        var copyProperty = function copyProperty(acc, key) {
            if (obj.hasOwnProperty(key)) {
                acc[key] = obj[key];
            }
            return acc;
        };

        return reduce(copyProperty, {}, props);
    };

    /**
     * Returns a new object by copying properties from the supplied object.  Undefined
     * properties are copied to the new object.
     * @param {array} props - An array of properties
     * @param {object} obj - The object from which the properties are copied
     */
    var pickAll = function pickAll(props, obj) {

        var copyProperty = function copyProperty(acc, key) {
            acc[key] = obj[key];
            return acc;
        };

        return reduce(copyProperty, {}, props);
    };

    /**
     * Returns a composed function by chaining the provided functions from left
     * to right.  The first function in the chain may accept any number of
     * arguments.  The remaining functions may only accept a single argument.
     * @param {...function} fns
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

                var params = _isObject(acc) ? Array.from(acc) : [acc];

                return fn.apply(fn, params);
            };

            return reduce(pipe, args, fns);
        };
    };

    var H = {
        curry: curry,
        forEach: curry(forEach),
        map: curry(map),
        filter: curry(filter),
        reduce: curry(reduce),
        path: curry(path),
        pick: curry(pick),
        pickAll: curry(pickAll),
        pipe: pipe
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