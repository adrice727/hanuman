'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var hanuman = function () {

	/** Accepts a message, and returns a new error */
	var _error = function _error(message) {
		return new Error('ø( ^_^ )ø Hanuman: ' + message);
	};

	/**
 * Returns a curried version of the supplied function
 * @param {function} fn - The function to be curried
 * @param {...*} [args] - A single argument or series of arguments
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
			fn(array[i]);
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
 * Applies a function to each item in the collection.  If the collection is an object
 * the iterator function will receive the key, value, and object.
 * @param {function} fn
 * @param {array | object} [args] - A single argument or series of arguments
 */
	var forEach = function forEach(fn, collection) {

		if (!Array.isArray(collection) || (typeof collection === 'undefined' ? 'undefined' : _typeof(collection)) !== 'object') {
			throw _error('Input must be an array or an object');
		}

		Array.isArray(collection) ? _forEachArray(fn, collection) : _forEachObject(fn, collection);
	};

	/**
 * Creates a new list by applying a function to each item in the list
 * @param {function} fn - The function to be called on each element
 * @param {array} list - The list to be iterated over
 */
	var map = function map(fn, list) {

		if (!Array.isArray(list)) {
			throw _error('Input must be an array');
		}

		var output = [];

		forEach(function (value) {
			return output.push(fn(value));
		}, list);

		return output;
	};

	/**
 * Applies a predicate function to a list of values and returns a new list of values which pass the test
 * @param {function} fn - The predicate function which acts as the filter
 * @param {array} list - The list to be iterated over
 */
	var filter = function filter(fn, list) {

		if (!Array.isArray(list)) {
			throw _error('Input must be an array');
		}

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

		if (!Array.isArray(list)) {
			throw _error('Input must be an array');
		}

		var result = memo;

		for (var i = 0; i < list.length; i++) {
			result = fn(result, list[i]);
		}

		return result;
	};

	/**
 * Returns the nested value from an object or undefined if it doesn't exist
 * @param {array | string} props - An array of properties or a single property
 * @param {object} obj
 */
	var path = function path(props, obj) {

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

	return {
		curry: curry,
		forEach: curry(forEach),
		map: curry(map),
		filter: curry(filter),
		reduce: curry(reduce),
		path: curry(path)
	};
}();