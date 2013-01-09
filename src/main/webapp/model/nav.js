function NavModel() {
	'use strict';

	var self = this,

	f_hasUsername = ko.computed(function _hasUsername() {
		'use strict';
		return serverModel.username() !== null && serverModel.username() !== undefined && serverModel.username().length > 0;
	}),

	f_hasPassword = ko.computed(function _hasPassword() {
		'use strict';
		return serverModel.password() !== null && serverModel.password() !== undefined && serverModel.password().length > 0;
	});

	self.isSignedIn = ko.computed(function _isSignedIn() {
		'use strict';
		return f_hasUsername() && f_hasPassword();
	});

	self.showSignOut = ko.computed(function _showSignOut() {
		'use strict';
		return self.isSignedIn();
	});

	self.showSignIn = ko.computed(function() {
		'use strict';
		return !self.showSignOut();
	});

	self.online = function() {
		'use strict';
		if (navigator && navigator.connection) {
			console.log('connection type = ' + navigator.connection.type);
			return navigator.connection.type != Connection.NONE;
		} else {
			/* can't know if we're online, we'll just assume we are and let authorized() fail if we can't connect to things */
			return true;
		}
	};

	self.authorized = ko.observable(false);

	self.isAuthorized = ko.computed(function() {
		'use strict';
		// console.log("isSignedIn = " + self.isSignedIn());
		// console.log('authorized = ' + self.authorized());
		return self.isSignedIn() && self.authorized();
	});

	self.logOut = function() {
		'use strict';
		serverModel.password(null);
		serverModel.persist();
	};
}
