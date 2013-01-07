function NavModel(serverModel) {
	"use strict";

	var self = this,
	m_serverModel = serverModel,

	f_hasUsername = ko.computed(function() {
		"use strict";
		return m_serverModel.username() !== null && m_serverModel.username() !== undefined && m_serverModel.username().length > 0;
	}),

	f_hasPassword = ko.computed(function() {
		"use strict";
		return m_serverModel.password() !== null && m_serverModel.password() !== undefined && m_serverModel.password().length > 0;
	});

	self.isSignedIn = ko.computed(function() {
		"use strict";
		return f_hasUsername() && f_hasPassword();
	});

	self.showSignOut = ko.computed(function() {
		"use strict";
		return self.isSignedIn();
	});

	self.showSignIn = ko.computed(function() {
		"use strict";
		return !self.showSignOut();
	});

	self.online = function() {
		"use strict";
		if (navigator && navigator.connection) {
			console.log('connection type = ' + navigator.connection.type);
			return navigator.connection.type != Connection.NONE;
		} else {
			/*	can't know if we're online, we'll just assume we are and let
				authorized() fail if we can't connect to things */
			return true;
		}
	};

	self.authorized = ko.observable(false);

	self.isAuthorized = ko.computed(function() {
		"use strict";
		/*
		console.log("isSignedIn = " + self.isSignedIn());
		console.log('authorized = ' + self.authorized());
		*/
		return self.isSignedIn() && self.authorized();
	});

	self.logOut = function() {
		"use strict";
		m_serverModel.password(null);
		m_serverModel.persist();
	};
}