function AjaxUpdater(serverModel, eventsModel, navModel) {
	"use strict";

	var self = this,
		m_timer = null,
		m_inFlight = false,
		m_serverModel = serverModel,
		m_eventsModel = eventsModel,
		m_navModel = navModel,
	
	f_updateEventModel = function() {
		"use strict";

		if (!m_serverModel || !m_eventsModel || !m_navModel) {
			console.log('AjaxUpdater::f_updateEventModel(): Missing one of [serverModel, eventsModel, navModel], skipping update.');
			return;
		}

		if (m_inFlight) {
			console.log('AjaxUpdater::f_updateEventModel(): An update is already in-progress, skipping update.');
		}

		if (m_navModel.isAuthorized()) {
			var url = m_serverModel.eventUrl();

			console.log('updating event data from ' + url);
			m_inFlight = true;
			$.ajax({
				url: url,
				timeout: m_timeout,
				cache: false,
				dataType: 'json',
				statusCode: {
					401: function() {
						console.log('401 not authorized');
						m_navModel.authorized(false);
						sm_erverModel.password(null);
						$('#login').reveal();
					}
				},
				beforeSend: function(xhr) {
					m_serverModel.setBasicAuth(xhr);
				},
				success: function(data) {
					console.log('AjaxUpdater::f_updateEventModel(): received updated event JSON');
					m_eventsModel.updateData(data);
					m_inFlight = false;
				}
			}).error(function(data, textStatus, errorThrown) {
				console.log('AjaxUpdater::f_updateEventModel(): An error occurred while updating event JSON: ' + ko.toJSON(data));
				console.log('textStatus = ' + textStatus + ', errorThrown = ' + errorThrown);
				m_inFlight = false;
			});
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
