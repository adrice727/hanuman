
;(() => {  //eslint-disable-line no-extra-semi

    'use strict';

    /** Accepts a message, and returns a new error */
    let _error = (message) => new Error(`ø( ^_^ )ø Hanuman: ${message}`);

    /**
     * Returns a curried version of the supplied function
     * @param {function} fn - The function to be curried
     * @param {...*} [args] - A single argument or series of arguments
     */
    let curry = (fn, args) => {

        args = args || [];

        return function() {

            let arity = fn.length;
            let combinedArgs = args.concat(Array.from(arguments));

            if ( combinedArgs.length === arity ) {
                return fn.apply(this, combinedArgs);
            } else {
                return curry(fn, combinedArgs);
            }

        };
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
     * Applies a function to each item in the collection.  If the collection is an object
     * the iterator function will receive the key, value, and object.
     * @param {function} fn
     * @param {array | object} [args] - A single argument or series of arguments
     */
    let forEach = (fn, collection) => {

        if (!Array.isArray(collection) && (typeof collection !== 'object')) {
            throw _error('Input must be an array or an object'); }

        Array.isArray(collection) ? _forEachArray(fn, collection) : _forEachObject(fn, collection);

    };

    /**
     * Creates a new list by applying a function to each item in the list
     * @param {function} fn - The function to be called on each element
     * @param {array} list - The list to be iterated over
     */
    let map = (fn, list) => {

        if ( !Array.isArray(list) ) {
            throw _error('Input must be an array'); }

        let output = [];

        forEach((value) => output.push(fn(value)), list);

        return output;

    };

    /**
     * Applies a predicate function to a list of values and returns a new list of values which pass the test
     * @param {function} fn - The predicate function which acts as the filter
     * @param {array} list - The list to be iterated over
     */
    let filter = (fn, list) => {

        if ( !Array.isArray(list) ) {
            throw _error('Input must be an array'); }

        let reducer = (acc, item) => {
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
    let reduce = (fn, memo, list) => {

        if ( !Array.isArray(list) ) {
            throw _error('Input must be an array'); }

        let result = memo;

        _forEachArray(value => { result = fn(result, value); }, list);

        return result;
    };

    /**
     * Returns the nested value from an object or undefined if it doesn't exist
     * @param {array | string} props - An array of properties or a single property
     * @param {object | array} obj
     */
    let path = (props, obj) => {

        let nested = obj;
        let properties = typeof props === 'string' ? Array.from(props) : props;

        for ( let i = 0; i < properties.length; i++ ) {
            nested = nested[properties[i]];
            if (nested === undefined) {
                return nested; }
        }

        return nested;
    };


    /**
     * Returns a new object by copying properties from the supplied object.  Undefined
     * properties are not copied to the new object.
     * @param {array} props - An array of properties
     * @param {object} obj - The object from which the properties are copied
     */
    let pick = (props, obj) => {

        let copyProperty = (acc, key) => {
            if ( obj.hasOwnProperty(key) ) {
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
    let pickAll = (props, obj) => {

        let copyProperty = (acc, key) => {
            acc[key] = obj[key];
            return acc;
        };

        return reduce(copyProperty, {}, props);

    };


    let H = {
        curry,
        forEach: curry(forEach),
        map: curry(map),
        filter: curry(filter),
        reduce: curry(reduce),
        path: curry(path),
        pick: curry(pick),
        pickAll: curry(pickAll)
    };

    if ( typeof exports === 'object' ) {
        module.exports = H;
    } else if ( typeof define === 'function' && define.amd ) { //eslint-disable-line no-undef
        define(() => H); //eslint-disable-line no-undef
    } else {
        this.H = H;
    }

})(this);
