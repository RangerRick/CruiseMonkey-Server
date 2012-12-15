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
	var f_onScrollStart = function() {
		var enabled = m_enabled;

		if (m_currentScroll === null) {
			console.log('ScrollManager::onScrollStart(): scrolling started (enabled = ' + enabled + ')');
			me.onScrollStart(enabled);
			m_currentScroll = new Scroll(enabled, setTimeout(f_onScrollStop, me.delay));
		} else {
			clearTimeout(m_currentScroll.timeout);
			m_currentScroll.timeout = setTimeout(f_onScrollStop, me.delay);
		}
	};
	var f_onScrollStop = function(callback) {
		var enabled = m_currentScroll.enabled;

		console.log('ScrollManager::onScrollStop() (enabled = ' + enabled + ')');
		clearTimeout(m_currentScroll.timeout);
		m_currentScroll.timeout = null;
		m_currentScroll = null;

		me.onScrollStop(enabled);
	};
	
	/* Attach the scrolling callback */
	$(window).scroll(f_onScrollStart);
}
