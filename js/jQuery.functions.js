(function($) {
	/**
	 * check if an element exists in DOM, example: $("#page").exists()
	 * @return {boolean}
	 */
	$.fn.exists = function() {
		return (typeof this.html() === "string");
	}
}(jQuery));