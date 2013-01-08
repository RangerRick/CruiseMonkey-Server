function AjaxUpdater() {
	"use strict";

	var self = this,
		m_timer = null,
		m_inFlight = false,
		m_success = function success(data) {
			console.log('AjaxUpdater::f_updateEventModel(): received updated event JSON');
			eventsModel.updateData(data);
			m_inFlight = false;
		},
		m_error = function error(data, textStatus, errorThrown) {
			console.log('AjaxUpdater::f_updateEventModel(): An error occurred while updating event JSON: ' + ko.toJSON(data));
			console.log('textStatus = ' + textStatus + ', errorThrown = ' + errorThrown);
			m_inFlight = false;
		},
	
	f_updateEventModel = function() {
		"use strict";

		if (m_inFlight) {
			console.log('AjaxUpdater::f_updateEventModel(): An update is already in-progress, skipping update.');
		}

		if (navModel.isAuthorized()) {
			var url = serverModel.eventUrl();

			console.log('updating event data from ' + url);
			m_inFlight = true;
			$.ajax({
				url: url,
				timeout: m_timeout,
				cache: false,
				dataType: 'json',
				statusCode: statusCode,
				beforeSend: beforeSend,
				success: m_success
			}).error(m_error);
		} else {
			console.log('Not authorized according to navModel, skipping update.');
		}
	};
	
	self.pollNow = function() {
		f_updateEventModel();
	};
	self.start = function() {
		f_updateEventModel();
		m_timer = setInterval(f_updateEventModel, m_eventUpdateInterval);
	};
	self.stop = function() {
		if (m_timer !== null) {
			clearInterval(m_timer);
			m_timer = null;
		}
	};
}
