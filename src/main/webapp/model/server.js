function ServerModel(isPhoneGap, amplify) {
	"use strict";

	var self = this,
		m_isPhoneGap = isPhoneGap,
		m_amplify = amplify;

	self.cruisemonkey = ko.observable(m_amplify.store('cruisemonkey_url'));
	self.username     = ko.observable(m_amplify.store('username'));
	self.password     = ko.observable(m_amplify.store('password'));
	
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
		self.cruisemonkey(m_amplify.store('cruisemonkey_url'));
		self.username(m_amplify.store('username'));
		self.password(m_amplify.store('password'));
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
