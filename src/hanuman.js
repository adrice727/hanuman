/*eslint-disable no-extra-semi */ ;
(() => {
    /*eslint-enable no-extra-semi */

    'use strict';

    /** Accepts a message, and returns a new error */
    let _error = message => new Error(`ø( ^_^ )ø Hanuman: ${message}`);

    /** Check for null */
    let _isNull = input => input === null;

    /** Check for string */
    let _isString = input => typeof input === 'string';

    /** Check for array */
    let _isArray = input => Array.isArray(input);

    /** Check for object */
    let _isObject = input => typeof input === 'object' && !_isNull(input);

    /** Ensures that the input is of the correct type */
    let _validateType = (type, input) => {

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
    let curry = (fn, args) => {

        args = args || [];

        return function() {

            let arity = fn.length;
            let combinedArgs = args.concat(Array.from(arguments));

            if (combinedArgs.length === arity) {
                return fn.apply(this, combinedArgs);
            } else {
                return curry(fn, combinedArgs);
            }

        };
    };

    /**
     * Applies a predicate function to a list of values and returns a new list of values which pass the test
     * @param {function} fn - The predicate function which acts as the filter
     * @param {array} list - The list to be iterated over
     */
    let filter = (fn, list) => {

        _validateType('array', list);

        let reducer = (acc, item) => {
            !!fn(item) && acc.push(item);
            return acc;
        };

        return reduce(reducer, [], list);

    };

    /** forEach Array */
    let _forEachArray = (fn, array) => {

        for (let i = 0; i < array.length; i++) {
            fn(array[i], i, array);
        }

    };

    /** forEach Object */
    let _forEachObject = (fn, obj) => {

        let keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
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
    let forEach = (fn, collection) => {

        _validateType('array-object', collection);

        Array.isArray(collection) ? _forEachArray(fn, collection) : _forEachObject(fn, collection);

    };

    /**
     * Returns the value from an object, or undefined if it doesn't exist
     * @param {string | array} props - An array of properties or a single property
     * @param {object | array} obj
     */
    let get = (props, obj) => {

        _validateType('object', obj);

        let nested = obj;
        let properties = typeof props === 'string' ? Array.from(props) : props;

        for (let i = 0; i < properties.length; i++) {
            nested = nested[properties[i]];
            if (nested === undefined) {
                return nested;
            }
        }

        return nested;
    };

    /**
     * Returns a boolean indicating whether or not the given input is empty
     * @param {string | array | object} input
     */
    let isEmpty = input => {

        if ((_isString(input) || _isArray(input)) && input.length === 0) {
            return true;
        }

        if (_isObject(input) && Object.keys(input).length === 0) {
            return true;
        }

        return false;

    };

    /** Map array */
    let _mapArray = (fn, array) => {

        return reduce((acc, item) => {
            acc.push(fn(item));
            return acc;
        }, [], array);

    };

    /** Map object */
    let _mapObject = (fn, obj) => {

        return reduce((acc, key) => {
            acc[key] = fn(obj[key]);
            return acc;
        }, {}, Object.keys(obj));

    };

    /**
     * Creates a new array, or a new object, by applying a function to each item item in
     * the list, or key/value pair
     * @param {function} fn - The function to be called on each element
     * @param {array | object} list - The list to be iterated over
     */
    let map = (fn, collection) => {

        _validateType('array-object', collection);

        return _isArray(collection) ? _mapArray(fn, collection) : _mapObject(fn, collection);
    };

    /** Copies a property from a source object to an accumulator object.
     * @param {object} obj - The source object
     * @param {object} acc - The accumulator (destination) object
     * @param {string} key - The key of the k/v pair to copy
     * @param {boolean} all - Should undefined properties be copied
     */
    let _copyProperty = (obj, acc, key, all) => {
        if (all || obj.hasOwnProperty(key)) {
            acc[key] = obj[key];
        }
        return acc;
    };

    /**
     * Returns a new object by copying properties from the supplied object.  Undefined
     * properties are not copied to the new object.
     * @param {array} props - An array of properties
     * @param {object} obj - The object from which the properties are copied
     */
    let pick = (props, obj) => {

        _validateType('object', obj);

        let copyProperty = (acc, key) => _copyProperty(obj, acc, key, false);

        return reduce(copyProperty, {}, props);
    };

    /**
     * Returns a new object by copying properties from the supplied object.  Undefined
     * properties are copied to the new object.
     * @param {array} props - An array of properties
     * @param {object} obj - The object from which the properties are copied
     */
    let pickAll = (props, obj) => {

        _validateType('object', obj);

        let copyProperty = (acc, key) => _copyProperty(obj, acc, key, true);

        return reduce(copyProperty, {}, props);
    };


    /**
     * Returns a composed function by chaining the provided functions from left
     * to right.  The first function in the chain may accept any number of
     * arguments.  The remaining functions may only accept a single argument.
     * @param {...function} fns
     */
    let pipe = (...fns) => {

        return (...args) => {

            let pipe = (acc, fn) => {
                return _isArray(acc) ? fn.apply(this, acc) : fn.call(this, acc);
            };

            return reduce(pipe, args, fns);

        };

    };

    /**
     * Applies an iterator function to an accumulator and each value in a a list, returning a single value
     * @param {function} fn - The iterator function which receives the memo and current item from the list
     * @param {*} acc - The initial value passed to the iterator function
     * @param {array} list - The list to be iterated over
     */
    let reduce = (fn, memo, list) => {

        _validateType('array', list);

        let result = memo;

        _forEachArray((value, i) => {
            result = fn(result, value, i);
        }, list);

        return result;
    };

    let H = {
        curry,
        filter: curry(filter),
        forEach: curry(forEach),
        get: curry(get),
        isEmpty: isEmpty,
        map: curry(map),
        pick: curry(pick),
        pickAll: curry(pickAll),
        pipe: pipe,
        reduce: curry(reduce)
    };

    if (typeof exports === 'object') {
        module.exports = H;
        /*eslint-disable no-undef */
    } else if (typeof define === 'function' && define.amd) {
        define(() => H);
        /*eslint-disable no-undef */
    } else {
        this.H = H;
    }

})(this);