// Take I, doesn't help with supercalls.
// Inspired by Prototype's Class class (http://prototypejs.org)
// Copyright (C) 2009-2010 by T.J. Crowder
// Licensed under the Creative Commons Attribution License 2.0 (UK)
// http://creativecommons.org/licenses/by/2.0/uk/
var Class = (function () {

	// This function is used to create the prototype object for our generated
	// constructors if the class has a parent class. See makeConstructor for details.
	function protoCtor() {}

	// Build and return a constructor; we do this with a separate function
	// to minimize what the new constructor (a closure) closes over.
	function makeConstructor(base) {

		// Here's our basic constructor function (each class gets its own, a
		// new one of these is created every time makeConstructor is called).
		function ctor() {
			// Call the initialize method
			this.initialize.apply(this, arguments);
		}

		// If there's a base class, hook it up. We go indirectly through `protoCtor`
		// rather than simply doing "new base()" because calling `base` will call the base
		// class's `initialize` function, which we don't want to execute. We just want the
		// prototype.
		if (base) {
			protoCtor.prototype = base.prototype;
			ctor.prototype = new protoCtor();
			protoCtor.prototype = {}; // Don't leave a dangling reference
		}

		// Set the prototype's constructor property so `this.constructor` resolves
		// correctly
		ctor.prototype.constructor = ctor;

		// Return the newly-constructed constructor
		return ctor;
	}

	// This function is used when a class doesn't have its own initialize
	// function; since it does nothing and can only appear on base classes,
	// all instances can share it.
	function defaultInitialize() {}

	// makeClass: Our public "make a class" function.
	// Arguments:
	// - base: An optional constructor for the base class.
	// - ...:  One or more specification objects containing properties to
	//         put on our class as members. If a property is defined by more
	//         than one specification object, the last in the list wins.
	// Returns:
	//     A constructor function for instances of the class.
	//
	// Typical use will be just one specification object, but allow for more
	// in case the author is drawing members from multiple locations.
	function makeClass() {
		var base, // Our base class (constructor function), if any
		argsIndex, // Index of first unused argument in 'arguments'
		ctor, // The constructor function we create and return
		members, // Each members specification object
		name; // Each name in 'members'

		// We use this index to keep track of the arguments we've consumed
		argsIndex = 0;

		// Do we have a base?
		if (typeof arguments[argsIndex] == 'function') {
			// Yes
			base = arguments[argsIndex++];
		}

		// Get our constructor; this will hook up the base class's prototype
		// if there's a base class
		ctor = makeConstructor(base);

		// Assign the members from the specification object(s) to the prototype
		// Again, typically there's only spec object, but allow for more
		while (argsIndex < arguments.length) {
			// Get this specification object
			members = arguments[argsIndex++];

			// Copy its members
			for (name in members) {
				value = members[name];
				if (base && typeof value == 'function') {
					baseValue = base.prototype[name];
					if (typeof baseValue == 'function') {
						value.$super = baseValue;
					}
				}
				ctor.prototype[name] = value;
			}
		}

		// If there's no initialize function, provide one
		if (!('initialize' in ctor.prototype)) {
			// Note that this can only happen in base classes; in a derived
			// class, the check above will find the base class's version if the
			// subclass didn't define one.
			ctor.prototype.initialize = defaultInitialize;
		}

		// Return the constructor
		return ctor;
	}

	// Return our public members
	return {
		makeClass : makeClass,
		new : makeClass,
		create : makeClass
	};
})();
