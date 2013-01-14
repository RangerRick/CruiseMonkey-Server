/**
 * @constructor
 */
function AjaxUpdater() {
	'use strict';

	var self = this,
		m_timer = null,
		m_inFlight = false,

	f_updateEventModel = function _updateEventModel() {
		'use strict';

		if (m_inFlight) {
			console.log('AjaxUpdater::f_updateEventModel(): An update is already in-progress, skipping update.');
		}

		if (app.navigation.model.isAuthorized()) {
			var url = app.server.serverModel.eventUrl();

			console.log('updating event data from ' + url);
			m_inFlight = true;
			$.ajax({
				url: url,
				timeout: m_timeout,
				cache: false,
				dataType: 'json',
				statusCode: {
					401: function four_oh_one() {
						console.log('401 not authorized');
						app.navigation.model.authorized(false);
						app.server.serverModel.password(null);
						app.navigation.pageNavigator.navigateTo('login');
						self.onUpdate();
					}
				},
				beforeSend: function beforeSend(xhr) {
					app.server.serverModel.setBasicAuth(xhr);
					xhr = null;
				}, success: function _success(data) {
					console.log('AjaxUpdater::f_updateEventModel(): received updated event JSON');
					app.events.eventsViewModel.updateData(data);
					data = null;
					m_inFlight = false;
					self.onUpdate();
				}, error: function _error(jqXHR, textStatus, errorThrown) {
					console.log('AjaxUpdater::f_updateEventModel(): An error occurred while updating event JSON: ' + ko.toJSON(jqXHR));
					console.log('textStatus = ' + textStatus + ', errorThrown = ' + errorThrown);
					jqXHR = textStatus = errorThrown = null;
					m_inFlight = false;
					self.onUpdate();
				}
			});
		} else {
			console.log('Not authorized according to navigation model, skipping update.');
		}
		//MemoryLeakChecker.checkLeaks(window);
	};

	self.onUpdate = function() {}

	self.pollNow = function _pollNow() {
		f_updateEventModel();
	};
	self.start = function _start() {
		console.log('AjaxUpdater::start()');
		self.pollNow();
		m_timer = setInterval(f_updateEventModel, app.settings.eventUpdateInterval);
	};
	self.stop = function _stop() {
		if (m_timer !== null) {
			clearInterval(m_timer);
			m_timer = null;
		}
	};
}
