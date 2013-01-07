var CMUtils = {

	getSummary: function(element) {
		"use strict";
		return $(element).find('div.summary').text();
	},

	isElementInViewport: function(element) {
		"use strict";
		var m_top    = element.offsetTop,
			m_height = element.offsetHeight;

		while (element.offsetParent) {
			element = element.offsetParent;
			m_top += element.offsetTop;
		}

		return ( m_top >= window.pageYOffset && (m_top + m_height) <= (window.pageYOffset + window.innerHeight) );
	},

	isElementVisible: function(element) {
		"use strict";
		var m_top = element.offsetTop;

		while (element.offsetParent) {
			element = element.offsetParent;
			m_top += element.offsetTop;
		}
		
		return ( m_top >= window.pageYOffset );
	}

};

(function () {
	"use strict";
	// Referring to the table here:
	// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/regexp
	// these characters should be escaped
	// \ ^ $ * + ? . ( ) | { } [ ]
	// These characters only have special meaning inside of brackets
	// they do not need to be escaped, but they MAY be escaped
	// without any adverse effects (to the best of my knowledge and casual testing)
	// : ! , = 
	// my test "~!@#$%^&*(){}[]`/=?+\|-_;:'\",<.>".match(/[\#]/g)

	var specials = [
		// order matters for these
		"-", "[", "]",
		// order doesn't matter for any of these
		"/", "{", "}", "(", ")", "*", "+", "?", ".", "\\", "^", "$", "|"
	],

	// I choose to escape every character with '\'
	// even though only some strictly require it when inside of []
	regex = RegExp('[' + specials.join('\\') + ']', 'g');

	CMUtils.escapeForRegExp = function (str) {
		"use strict";
		return str.replace(regex, "\\$&");
	};
}());
