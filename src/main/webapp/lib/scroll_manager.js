/**
 * @constructor
 */
function ScrollManager(selector) {
	'use strict';
	var m_activeTimeout = null,
		m_selector = selector || window,
		f_onScrollStart,
		f_onScrollStop,
		self = this;

	/* User-configurable options */
	self.delay = 500; // ms
	self.onScrollStart = function _onScrollStart(enabled) {};
	self.onScrollStop = function _onScrollStop(enabled) {};
	self.onScroll = function _onScroll(enabled) {};

	/* Public properties */
	self.enabled = true;

	/* Internal callbacks */
	f_onScrollStart = function _f_onScrollStart() {
		'use strict';

		if (m_activeTimeout === null) {
			console.log('ScrollManager::onScrollStart(): scrolling started: enabled = ' + self.enabled);
			self.onScrollStart(self.enabled);
			m_activeTimeout = setTimeout(f_onScrollStop, self.delay);
		} else {
			clearTimeout(m_activeTimeout);
			m_activeTimeout = setTimeout(f_onScrollStop, self.delay);
		}
		self.onScroll(self.enabled);
	};
	f_onScrollStop = function _f_onScrollStop(callback) {
		'use strict';

		console.log('ScrollManager::onScrollStop(): scrolling stopped: enabled = ' + self.enabled);
		clearTimeout(m_activeTimeout);
		m_activeTimeout = null;

		self.onScrollStop(self.enabled);
	};

	$(m_selector).scroll(f_onScrollStart);
}
