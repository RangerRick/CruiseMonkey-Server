/**
 * @constructor
 */
function CMUtils() {
	var self = this,
		days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
		months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		specials = [
			// order matters for these
			'-', '[', ']',
			// order doesn't matter for any of these
			'/', '{', '}', '(', ')', '*', '+', '?', '.', '\\', '^', '$', '|'
		],
		regex = new RegExp('[' + specials.join('\\') + ']', 'g');

	self.getSummary = function _getSummary(element) {
		'use strict';
		return $(element).find('div.summary').text();
	};

	self.isElementInViewport = function _isElementInViewport(element) {
		'use strict';
		var m_top = element.offsetTop,
			m_height = element.offsetHeight;

		while (element.offsetParent) {
			element = element.offsetParent;
			m_top += element.offsetTop;
		}

		return (m_top >= window.pageYOffset && (m_top + m_height) <= (window.pageYOffset + window.innerHeight));
	};

	self.isElementVisible = function _isElementVisible(element) {
		'use strict';
		var m_top = element.offsetTop;

		while (element.offsetParent) {
			element = element.offsetParent;
			m_top += element.offsetTop;
		}

		return (m_top >= window.pageYOffset);
	};

	self.formatTime = function _formatTime(d, doSeconds) {
		'use strict';
		var hour, ret;
		if (!d) {
			return '';
		}

		hour = d.getHours() % 12;
		ret = hour + ':' + String('0' + d.getMinutes()).slice(-2);

		if (doSeconds === true) {
			ret += ':' + String('0' + d.getSeconds()).slice(-2);
		}

		if ((d.getHours() % 12) == d.getHours()) {
			ret += 'am';
		} else {
			ret += 'pm';
		}
		return ret;
	};

	self.formatDate = function _formatDate(d) {
		'use strict';
		var ret = days[d.getDay()] + ', ' + months[d.getMonth()] + ' ' + d.getDate();
		d = null;
		return ret;
	};

	self.getDateFromString = function _getDateFromString(dateTime) {
		'use strict';
		if (dateTime instanceof Date) {
			var ret = new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate(), dateTime.getHours(), dateTime.getMinutes(), 0, 0);
			dateTime = null;
			return ret;
		}
		var dateTimeParts = dateTime.split('T'),
			dateParts = dateTimeParts[0].split('-'),
			timeParts = dateTimeParts[1].split(':');

		// console.log('year = ' + dateParts[0] + ', month = ' + dateParts[1] + ', day = ' + dateParts[2]);
		// console.log('hours = ' + timeParts[0] + ', minutes = ' + timeParts[1]);

		var ret = new Date(dateParts[0], dateParts[1] - 1, dateParts[2], timeParts[0], timeParts[1], 0, 0);
		dateTimeParts = dateParts = timeParts = dateTime = null;
		return ret;
	};

	self.padNumber = function _padNumber(num) {
		'use strict';
		var ret = (String('0' + num).slice(-2));
		num = null;
		return ret;
	};

	self.getStringFromDate = function _getStringFromDate(d) {
		'use strict';
		var ret = d.getFullYear() + '-' + self.padNumber(d.getMonth() + 1) + '-' + self.padNumber(d.getDate()) + 'T' + self.padNumber(d.getHours()) + ':' + self.padNumber(d.getMinutes()) + ':' + self.padNumber(d.getSeconds()) + '-00:00';
		d = null;
		return ret;
	};

	self.openLink = function _openLink(url) {
		'use strict';

		if (window.plugins && window.plugins.childBrowser) {
			console.log('openLink(' + url + '): using ChildBrowser plugin');
			window.plugins.childBrowser.openExternal(url);
		} else {
			console.log('openLink(' + url + '): using window.open()');
			window.open(url, '_blank');
		}
		url = null;
	};

	self.escapeForRegExp = function _escapeForRegExp(str) {
		'use strict';
		var ret = str.replace(regex, '\\$&');
		str = null;
		return ret;
	};
};

var cmUtils = new CMUtils();