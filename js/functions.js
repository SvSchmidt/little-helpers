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
 * @return {String}     str with capitalised first letter (e.g. Test if str equals test)
 */
String.prototype.capitaliseFirstLetter = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
}
/*"test".capitaliseFirstLetter()*/

QUnit.test("str.capitaliseFirstLetter()",function() {
	equal("test".capitaliseFirstLetter(),"Test","convert test into Test");
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
