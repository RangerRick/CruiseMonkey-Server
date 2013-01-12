/**
 * @constructor
 */
function ServerModel() {
	'use strict';

	var self = this;

	self.cruisemonkey = ko.observable(amplify.store('cruisemonkey_url'));
	self.username = ko.observable(amplify.store('username'));
	self.password = ko.observable(amplify.store('password'));

	self._cruisemonkey = ko.computed(function() {
		return self.cruisemonkey() ? self.cruisemonkey().replace(/\/$/, '') : null;
	});

	self.authUrl = ko.computed(function() {
		return self._cruisemonkey() ? self._cruisemonkey() + '/rest/auth' : null;
	});

	self.eventUrl = ko.computed(function() {
		return self._cruisemonkey() ? self._cruisemonkey() + '/rest/cruisemonkey/events' : null;
	});

	self.eventEditUrl = ko.computed(function() {
		return self._cruisemonkey() ? self._cruisemonkey() + '/rest/events' : null;
	});

	self.favoritesUrl = ko.computed(function() {
		return self._cruisemonkey() ? self._cruisemonkey() + '/rest/favorites' : null;
	});

	self.setBasicAuth = function(xhr) {
		xhr.setRequestHeader('Authorization', 'Basic ' + window.btoa(self.username() + ':' + self.password()));
	};

	self.reset = function() {
		self.cruisemonkey(amplify.store('cruisemonkey_url').replace(/\/$/, ''));
		self.username(amplify.store('username'));
		self.password(amplify.store('password'));
	};

	self.onSubmit = function(formElement) {
		self.persist();
		app.events.ajaxUpdater.pollNow();
		showLoginOrCurrent();
	};

	self.persist = ko.computed(function() {
		amplify.store('cruisemonkey_url', self.cruisemonkey() ? self.cruisemonkey().replace(/\/$/, '') : null);
		amplify.store('username', self.username());
		amplify.store('password', self.password());
	});

	setTimeout(function() {
		if (!self.cruisemonkey()) {
			self.cruisemonkey('http://cm.raccoonfink.com');
		}
	}, 0);
}
