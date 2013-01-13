/**
 * @constructor
 */
function NavModel() {
	'use strict';

	var self = this,

	f_hasUsername = ko.computed(function _hasUsername() {
		'use strict';
		var username = app.server.serverModel.username();
		if (username !== null && username !== undefined && username.length > 0) {
			username = null;
			return true;
		} else {
			username = null;
			return false;
		}
	}),

	f_hasPassword = ko.computed(function _hasPassword() {
		'use strict';
		var password = app.server.serverModel.password();
		if (password !== null && password !== undefined && password.length > 0) {
			password = null;
			return true;
		} else {
			password = null;
			return false;
		}
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
		app.server.serverModel.password(null);
		app.server.serverModel.persist();
	};
	
	self.navigate = function(item, event) {
		var target = event.target,
			host = document.URL.replace(/\#$/, ''),
			hostRegex = new RegExp('^' + cmUtils.escapeForRegExp(host)),
			hash,
			href;

		console.log('NavModel::navigate(): href = ' + target.href);
		if (target.href !== undefined) {
			href = target.href.replace(hostRegex, '');
			if (href && href !== '') {
				if (href.indexOf('#') >= 0) {
					hash = target.href.split('#')[1];
				}
			} else {
				href = undefined;
			}
		}

		if (hash == 'edit-event') {
			app.events.editEventModel.resetEvent();
		} else if (hash == 'sign-out') {
			self.logOut();
		}

		if (hash !== undefined) {
			if (hash !== '') {
				app.navigation.pageNavigator.navigateTo(hash);
			}
		} else if (href !== undefined && href !== '') {
			cmUtils.openLink(href);
		}

		item = event = target = hash = href = null;
		return true;
	}
}
