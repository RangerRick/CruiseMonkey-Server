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

	self.preEdit = ko.observable();
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

	self.navigate = function _navigate(item, event) {
		var host = document.URL.replace(/\??\#.*?$/, ''),
			hostRegex = new RegExp('^' + cmUtils.escapeForRegExp(host) + '\\??'),
			hash,
			href = event.target.href;

		var target = $(event.target);
		if (target.is('div') && target.hasClass('icon')) {
			href = target.parent().attr('href');
		}
		if (href !== undefined) {
			href = href.replace(hostRegex, '');
			if (href && href !== '') {
				if (href.indexOf('#') >= 0) {
					hash = href.split('#')[1];
				}
			} else {
				href = undefined;
			}
		}
		item = target = event = host = hostRegex = null;

		if (hash == 'edit-event') {
			var currentPage = app.navigation.pageNavigator.getCurrentPage();
			if (currentPage && currentPage != 'edit-event') {
				console.log('setting pre-edit to ' + currentPage);
				app.navigation.model.preEdit(currentPage);
			}
			console.log('resetting event model');
			if (app.events.editEventModel) {
				app.events.editEventModel.resetModel();
			} else {
				console.log("err, can't find editEventModel");
			}
			currentPage = null;
		} else if (hash == 'sign-out') {
			self.logOut();
			hash = 'login';
		} else if (hash == 'sign-in') {
			hash = 'login';
		} else if (hash == 'official-events' || hash == 'public-events' || hash == 'my-events') {
			app.events.eventsViewModel.viewType(hash);
			hash = 'events';
		}
		console.log('NavModel::navigate(): href = ' + href + ', hash = ' + hash);

		if (hash !== undefined) {
			if (hash !== '') {
				app.navigation.pageNavigator.navigateTo(hash);
			} else {
				console.log('Error: empty hash.');
			}
		} else if (href !== undefined && href !== '') {
			cmUtils.openLink(href);
		} else {
			console.log('Error: empty href.');
		}

		hash = href = null;
		return true;
	}
}
