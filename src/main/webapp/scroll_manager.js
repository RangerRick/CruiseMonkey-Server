function ScrollState(page, entry) {
	var m_page  = null;
	var m_entry = null;

	var me = this;

	if (page) {
		m_page = page;
	}
	if (entry) {
		m_entry = entry;
	}
	
	me.page = function() {
		return m_page;
	};
	me.entry = function() {
		return m_entry;
	};
	me.set = function(page, entry) {
		m_page  = page;
		m_entry = entry;
	};
}

function Scroll(enabled, timeout) {
	this.enabled = enabled;
	this.timeout = timeout;
}

function ScrollManager() {
	var m_currentScroll  = null;
	var m_enabled        = true;

	var me = this;
	
	/* User-configurable options */
	me.delay = 500; // ms
	me.onScrollStart = function(enabled) {};
	me.onScrollStop  = function(enabled) {};

	/* Public methods */
	me.disable = function() {
		console.log("ScrollManager::disable()");
		m_enabled = false;
	};
	me.enable = function() {
		console.log("ScrollManager::enable()");
		m_enabled = true;
	};

	/* Internal callbacks */
	var m_onScrollStart = function() {
		var enabled = m_enabled;

		if (m_currentScroll === null) {
			console.log('ScrollManager::onScrollStart(): scrolling started (enabled=' + enabled + ')');
			me.onScrollStart(enabled);
			m_currentScroll = new Scroll(enabled, setTimeout(m_onScrollStop, me.delay));
		} else {
			clearTimeout(m_currentScroll.timeout);
			m_currentScroll.timeout = setTimeout(m_onScrollStop, me.delay);
		}
	};
	var m_onScrollStop = function(callback) {
		var enabled = m_currentScroll.enabled;

		console.log('ScrollManager::onScrollStop() (enabled=' + enabled + ')');
		clearTimeout(m_currentScroll.timeout);
		m_currentScroll.timeout = null;
		m_currentScroll = null;

		me.onScrollStop(enabled);
	};
	
	/* Attach the scrolling callback */
	$(window).scroll(m_onScrollStart);
}
