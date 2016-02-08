
	var hanuman = (() => {

		/** Accepts a message, and returns a new error */
		let _error = (message) => new Error(`ø( ^_^ )ø Hanuman: ${message}`);

		/**
		* Returns a curried version of the function, which can also be curried
		* @param {function} fn - The function to be curried
		* @param {...*} [args] - A single argument or series of arguments
		*/
		let curry = (fn, args) => {

		  args = args || [];

		  return function() {

		    let arity = fn.length;
		    let combinedArgs = args.concat(Array.from(arguments));

		    if ( combinedArgs.length === arity ) {
		      return fn.apply(this, combinedArgs)
		    } else {
		      return curry(fn, combinedArgs);
		    }

		  }

		}

	  /** forEach Array */
		let _forEachArray = (fn, array) => {

			for ( let i = 0; i < array.length; i++ ) {
				fn(array[i]);
			}

		};

		/** forEach Object */
		let _forEachObject = (fn, obj) => {

			let keys = Object.keys(obj);
			for ( let i = 0; i < keys.length; i++ ) {
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

			if ( !Array.isArray(collection) || ( typeof collection !== 'object') ) { throw _error('Input must be an array or an object'); }

			Array.isArray(collection) ? _forEachArray(fn, collection) : _forEachObject(fn, collection);

		};

		/**
		* Creates a new list by applying a function to each item in the list
		* @param {function} fn - The function to be called on each element
		* @param {array} list - The list to be iterated over
		*/
		let map = (fn, list) => {

			if ( !Array.isArray(list) ) { throw _error('Input must be an array'); }

			let output = [];

			forEach((value) => output.push(fn(value)), list)

			return output;

		};

		let filter = (fn, collection) => {

		};

		/**
		* Applies a reducer function to a list to
		* @param {function} fn - The iterator function which receives the memo and current item from the list
		* @param {*} memo - The initial value passed to the iterator function
		* @param {array} list - The list to be iterated over
		*/
		let reduce = (fn, memo, list) => {

			if ( !Array.isArray(list) ) { throw _error('Input must be an array'); }

			let result = memo;

			for ( let i = 0; i < list.length; i++ ) {
				result = fn(result, list[i]);
			}

			return result;

		}


		/**
		* Returns the nested value from an object or undefined if it doesn't exist
		* @param {array | string} props - An array of properties or a single property
		* @param {object} obj
		*/
		let path = (props, obj) => {

		  let nested = obj;
		  let properties = typeof props === 'string' ? Array.from(props) : props;

		  for ( let i = 0; i < properties.length; i++ ) {
		    nested = nested[properties[i]];
		    if ( nested === undefined ) { return nested; }
		  }

		  return nested;
		}

		return {
			curry,
			path : curry(path),
			forEach	: curry(forEach),
			map : curry(map),
			reduce: curry(reduce)

		}

	})();
