function ServerModel() {
	"use strict";

	var self = this;

	self.cruisemonkey = ko.observable(amplify.store('cruisemonkey_url'));
	self.username     = ko.observable(amplify.store('username'));
	self.password     = ko.observable(amplify.store('password'));
	
	self.authUrl = ko.computed(function() {
		return self.cruisemonkey() + '/rest/auth';
	});

	self.eventUrl = ko.computed(function() {
		return self.cruisemonkey() + '/rest/cruisemonkey/events';
	});
	
	self.favoritesUrl = function(id) {
		return self.cruisemonkey() + '/rest/favorites?event=' + encodeURI(id);
	};

	self.setBasicAuth = function(xhr) {
		xhr.setRequestHeader("Authorization", "Basic " + window.btoa(self.username() + ":" + self.password()));
	};

	self.reset = function() {
		self.cruisemonkey(amplify.store('cruisemonkey_url'));
		self.username(amplify.store('username'));
		self.password(amplify.store('password'));
	};
	
	self.persist = ko.computed(function() {
		amplify.store('cruisemonkey_url', self.cruisemonkey());
		amplify.store('username',         self.username());
		amplify.store('password',         self.password());
	});

	setTimeout(function() {
		if (!self.cruisemonkey()) {
			if (m_isPhoneGap) {
				self.cruisemonkey('http://c4.amberwood.net');
			}
			self.cruisemonkey(document.URL);
		}
	}, 0);
}
