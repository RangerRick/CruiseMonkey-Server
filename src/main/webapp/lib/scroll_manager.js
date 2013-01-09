function ScrollManager(selector) {
	'use strict';
	var m_activeTimeout = null,
		m_selector = selector || window,
		f_onScrollStart,
		f_onScrollStop,
		self = this;

	/* User-configurable options */
	self.delay = 500; // ms
	self.onScrollStart = function(enabled) {};
	self.onScrollStop = function(enabled) {};
	self.onScroll = function(enabled) {};

	/* Public properties */
	self.enabled = true;

	/* Internal callbacks */
	f_onScrollStart = function() {
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
	f_onScrollStop = function(callback) {
		'use strict';

		console.log('ScrollManager::onScrollStop(): scrolling stopped: enabled = ' + self.enabled);
		clearTimeout(m_activeTimeout);
		m_activeTimeout = null;

		self.onScrollStop(self.enabled);
	};

	$(m_selector).scroll(f_onScrollStart);
}
