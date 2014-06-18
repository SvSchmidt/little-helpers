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

Object.prototype.toArray = function(arrayVal) {
	return [obj].map(function(index) {
		return index[arrayVal];
	});
}
/*var obj = {name:"sven"};
obj.toArray("name")*/

/**
 * does exactly what function name suggests
 * Usage: "string".capitaliseFirstLetter()
 * @param  {String} str
 * @return {String}     str with capitalised first letter (e.g. Test if str equals test)
 */
String.prototype.capitaliseFirstLetter = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
}
