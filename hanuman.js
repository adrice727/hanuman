
var k = (() => {


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

	let forEach = (fn, collection) => {



	}

	/**
	* Creates a new collection by applying a function to each value in the collection
	* @param {function} fn - The function to be called on each element
	* @param {array} list - The list to be iterated over
	*/

	let map = (fn, list) => {

	};

	let filter = (fn, collection) => {

	};


	let reduce = (fn, memo, collection) => {

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
		path: curry(path)
	}

})();