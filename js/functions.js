 /**
 * checks whether the console-object exists or not, defines an empty console-object to prevent errors if not
 * @return {void} 
 */
function checkConsole() {
	if(typeof console === "undefined") {
		console = {
			log:function() {},
			debug:function() {},
			error:function() {},
			debug:function() {}
		};
	}
}

/*------------------------------------*/

/**
 * does exactly what function name suggests
 * @param  {String} str
 * @return {String}     str with capitalized first letter (e.g. Test if str equals test)
 */
String.prototype.capitalizeFirstLetter = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
}
/*"test".capitaliseFirstLetter()*/

QUnit.test("str.capitalizeFirstLetter()",function() {
	equal("test".capitalizeFirstLetter(),"Test","convert test into Test");
});

/*------------------------------------*/

/**
 * improved function to add events to objects differing between attachEvent (< IE 8) and addEventEventListener	
 * @param {String}   eventType  event name to be attached (e.g. click, scroll)
 * @param {Function} fn         handler to call on event
 * @param {Boolean}   useCapture
 */
var addEvent = function(eventType,fn,useCapture) {
    if(this.addEventListener) {
        this.addEventListener(eventType,fn,useCapture);
    } else if(this.attachEvent) {
        var ret = this.attachEvent("on" + eventType,fn);
        return ret;
    }
};

Window.prototype.addEvent = addEvent;
Document.prototype.addEvent = addEvent;
HTMLElement.prototype.addEvent = addEvent;

/*------------------------------------*/

DOMTokenList.prototype.removeAll = function() {
	for(index in this) {
		if(typeof this[index] === "string") this.remove(this[index]);
	}
}
/*document.documentElement.classList.removeAll()*/

/*------------------------------------*/

/**
 * search for needle in haystack
 * @param  {String} needle   String to search for
 * @param  {Array} haystack array to scan for needle
 * @return {Number / boolean}          key of needle in haystack if exists, false otherwise
 */
function inArray(needle,haystack) {
	for(var i = 0; i < haystack.length; i++) {
		if(haystack[i] == needle) return i;
	}

	return false;
}

/*------------------------------------*/

Object.prototype.toArray = function(arrayVal) {
	return [obj].map(function(index) {
		return index[arrayVal];
	});
}
/*var obj = {name:"sven"};
obj.toArray("name")*/

/*------------------------------------*/

/**
 * check whether classList appears in given DOMObject or not
 * @param  {String / Array}  classList Either a space-separated list of classes ("class1 class2") or an array
 * @return {Boolean}           true if the element features all of the given classes (all-or-none)
 */
Object.prototype.hasClasses = function(classList) {
	if(typeof classList !== "object") classList = classList.split(" ");

	for(var i = 0; i < classList.length; ++i) {
		if(inArray(classList[i],this.classList) === false) return false;
	}

	return true;
}

/*------------------------------------*/

/**
 * checks if the used browser knows the specified CSS attribute (e.g. filter)
 * @return {boolean} true if browser knows specified attribute, false if not
 */
navigator.supports = function(attribute) {
	var vendorPrefixes = ["Moz","Webkit","Khtml","O","ms",""];
	for(var i = 0; i < vendorPrefixes.length; i++) {
		if(typeof((document.body || document.documentElement).style[vendorPrefixes[i] + attribute]) == "string") return true;
	}

	return false;
}

QUnit.test("navigator.supports(attribute)",function() {
	ok(navigator.supports("color"),"return true if used browser knows specified attribute respecting vendorprefixes");
	ok(!navigator.supports("bullshit"),"return false if specified attribute respecting vendorprefixes is unknown to browser");
});

/*------------------------------------*/

/**
 * returns either vendorprefix of current browser or vendor-prefixed @attribute
 * even if there isn't any prefixed value set, getComputedStyle will return the initial values
 * @param  {String} attribute e.g. transform
 * @return {String} vendor-prefix (e.g. Webkit) or vendor-prefixed attribute (e.g. WebkitTransform)
 */
function vendorPrefix(attribute) {
	var vendorPrefix = (Array.prototype.slice.call(window.getComputedStyle(document.documentElement,""))).join("").match(/-(moz|webkit|ms)-/);
	var objResult = {
		"prefix": {
			"css":vendorPrefix[0],
			"js":vendorPrefix[1].capitalizeFirstLetter(),
		},
		"attribute": {
			"css":vendorPrefix[0] + attribute,
			"js":vendorPrefix[1].capitalizeFirstLetter() + (attribute ? attribute.capitalizeFirstLetter() : "")
		}
	}

	if(typeof window.getComputedStyle(document.documentElement)[attribute] === "string") return attribute;
	if(typeof window.getComputedStyle(document.documentElement)[objResult.attribute.css] === "string") return objResult.attribute.js;

	return objResult.prefix.js;
}

QUnit.test("vendorPrefix(attribute)",function() {
	equal(vendorPrefix(),"Webkit","return vendorprefix (WebKit) if no attribute's provided");
	equal(vendorPrefix("ffjfjaf"),"Webkit","do so too if prefixed attribute is unknown to browser");
	equal(vendorPrefix("transform"),"WebkitTransform","prefix the attribute if provided");
	equal(vendorPrefix("transition"),"transition","do not prefix the attribute if the browser knows both the variant with and without prefix (e.g. transition)");
});

/*------------------------------------*/

function isInteger(x) {
	return (Math.round(x) === x);
}

QUnit.test("isInteger(x)",function() {
	ok(isInteger(1),"1 is an integer");
	ok(isInteger(-1),"so is -1");
	ok(isInteger(0),"so is 0");
	ok(!isInteger(1.2),"1.2 isn't");
	ok(!isInteger("1"),"'1' isn't");
	ok(!isInteger(undefined),"undefined isn't");
	ok(!isInteger(null),"null isn't");
	ok(!isInteger(false),"false isn't");
});

/*------------------------------------*/

function isPositiveNumber(x) {
	if(typeof x !== "number") return false;
	return ((-1 * x) <= 0);
}

QUnit.test("isPositiveNumber(x)",function() {
	ok(isPositiveNumber(1),"1 is positive");
	ok(isPositiveNumber(0),"so is 0");
	ok(isPositiveNumber(1.2),"so is 1.2");
	ok(!isPositiveNumber(-1),"-1 isn't");
	ok(!isPositiveNumber("1"),"'1' isn't")
	ok(!isPositiveNumber(undefined),"undefined isn't");
	ok(!isPositiveNumber(null),"null isn't");
	ok(!isPositiveNumber(false),"false isn't");
});

/*------------------------------------*/

function isEvenNumber(x) {
	if(typeof x !== "number") return false;
	return x === 1 || x % 2 === 0;
}

QUnit.test("isEvenNumber",function() {
	ok(isEvenNumber(2),"2 is even");
	ok(isEvenNumber(1),"1 isn't");
	ok(isEvenNumber(0),"0 is");
	ok(!isEvenNumber(null),"null isn't");
	ok(!isEvenNumber(false),"false isn't");
});

/**
 * checks whether an element is in viewport or not
 * @param  {DOMElement} elem Element to check viewport presence for
 * @return {Boolean}      true if elem is in viewport, false if not
 */
function elementInViewport(elem) {
	if(!elem) return false;
	var rect = elem.getBoundingClientRect();

	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
		rect.right <= (window.innerWidth || document.documentElement.clientWidth)
	);
}
