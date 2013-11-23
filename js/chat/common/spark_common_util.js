'use strict';
// warn_deprecate(function(..), "oldfunction", "newfunction") ...
function warn_deprecate(callback, name, suggestion) {
  return function() {
    if( typeof console !== 'undefined' && 
	typeof console.warn === 'function') {
            console.warn(name + " is deprecated, use " + suggestion + "instead.", new Error("").stack ) 
	}
    return callback.apply(this, arguments);
    };
};
