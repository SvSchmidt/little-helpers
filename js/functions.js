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

DOMTokenList.prototype.removeAll = function() {
	for(index in this) {
		if(typeof this[index] === "string") this.remove(this[index]);
	}
}
/*document.documentElement.classList.removeAll()*/

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
/*document.documentElement.hasClasses("class1 class2 ...")*/

QUnit.test("Object.prototype.hasClasses(classList)",function() {
	ok(document.documentElement.hasClasses("js"),"return true if element does have specified class(es)");
	ok(document.documentElement.hasClasses("js root-section"),"handle class list as string (e.g. 'class1 class2')");
	ok(document.documentElement.hasClasses(["js","root-section"]),"handle class list as array (e.g. ['class1','class2'])");
	ok(!document.documentElement.hasClasses("js root-section bullshit"),"return false if one class of classList is missing in element (all-or-none)")
	ok(!document.documentElement.hasClasses("stupid classes"),"return false if element does not have specified class(es)")
});

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
