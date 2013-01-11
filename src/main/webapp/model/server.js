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
		return self.cruisemonkey().replace(/\/$/, '');
	});

	self.authUrl = ko.computed(function() {
		return self._cruisemonkey() + '/rest/auth';
	});

	self.eventUrl = ko.computed(function() {
		return self._cruisemonkey() + '/rest/cruisemonkey/events';
	});

	self.eventEditUrl = ko.computed(function() {
		return self._cruisemonkey() + '/rest/events';
	});

	self.favoritesUrl = ko.computed(function() {
		return self._cruisemonkey() + '/rest/favorites';
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
		showLoginOrCurrent();
	};

	self.persist = ko.computed(function() {
		amplify.store('cruisemonkey_url', self.cruisemonkey().replace(/\/$/, ''));
		amplify.store('username', self.username());
		amplify.store('password', self.password());
	});

	setTimeout(function() {
		if (!self.cruisemonkey()) {
			self.cruisemonkey('http://server3.befunk.com:8088');
		}
	}, 0);
}
