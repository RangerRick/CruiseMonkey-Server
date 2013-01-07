function Scroll(enabled, timeout) {
	"use strict";
	this.enabled = enabled;
	this.timeout = timeout;
}

function ScrollManager(selector) {
	"use strict";
	var m_currentScroll  = null,
		m_enabled        = true,
		m_selector       = selector || window,
		self             = this;

	/* User-configurable options */
	self.delay = 500; // ms
	self.onScrollStart = function(enabled) {};
	self.onScrollStop  = function(enabled) {};
	self.onScroll      = function(enabled) {};

	/* Public methods */
	self.disable = function() {
		"use strict";
		// console.log("ScrollManager::disable()");
		m_enabled = false;
	};
	self.enable = function() {
		"use strict";
		// console.log("ScrollManager::enable()");
		m_enabled = true;
	};

	/* Internal callbacks */
	var f_onScrollStart = function() {
		"use strict";
		var enabled = m_enabled;

		if (m_currentScroll === null) {
			console.log('ScrollManager::onScrollStart(): scrolling started: enabled = ' + enabled);
			self.onScrollStart(enabled);
			m_currentScroll = new Scroll(enabled, setTimeout(f_onScrollStop, self.delay));
		} else {
			clearTimeout(m_currentScroll.timeout);
			m_currentScroll.timeout = setTimeout(f_onScrollStop, self.delay);
		}
		self.onScroll(enabled);
	},
	f_onScrollStop = function(callback) {
		"use strict";
		var enabled = m_currentScroll.enabled;

		console.log('ScrollManager::onScrollStop(): scrolling stopped: enabled = ' + enabled);
		clearTimeout(m_currentScroll.timeout);
		m_currentScroll.timeout = null;
		m_currentScroll = null;

		self.onScrollStop(enabled);
	};

	$(m_selector).scroll(f_onScrollStart);
}
