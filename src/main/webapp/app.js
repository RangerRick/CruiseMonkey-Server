console.log('app.js loading');

var app = {
	settings: {
		eventUpdateInterval: 15000
	},
	events: {},
	views: {},
	server: {},
	navigation: {}
};


var scrollManager, templateLoader, htmlInitialization, checkIfAuthorized, showLoginOrCurrent, setupDefaultView,
pages = {},
page_scroll_element = [];

// server
(function() {
	app.server.serverModel = new ServerModel();
})();

// events
(function() {
	app.events.eventsViewModel        = new EventsViewModel();
	app.views.officialEventsViewModel = new OfficialEventsViewModel(app.events.eventsViewModel);
	app.views.myEventsViewModel       = new MyEventsViewModel(app.events.eventsViewModel);
	app.views.publicEventsViewModel   = new PublicEventsViewModel(app.events.eventsViewModel);
	app.events.editEventModel         = new EditEventModel();
})();

// navigation
(function() {
	app.navigation.model = new NavModel();
	app.navigation.pageTracker = new PageTracker('.scrollable');
	app.navigation.pageNavigator = new PageNavigator('official-events', '.scrollable');
})();

// live updating
(function() {
	app.events.ajaxUpdater = new AjaxUpdater();
})();

templateLoader = new TemplateLoader(['#events.html', '#edit-event.html']);

htmlInitialization = {
	"header": {
		"model": app.navigation.model
	},
	"login": {
		"model": app.server.serverModel
	},
	"official-events": {
		"templateSource": "#events.html",
		"templateAttributes": {
			"eventType": "official"
		},
		"hide": true,
		"model": app.views.officialEventsViewModel
	},
	"my-events": {
		"templateSource": "#events.html",
		"templateAttributes": {
			"eventType": "my"
		},
		"hide": true,
		"model": app.views.myEventsViewModel
	},
	"public-events": {
		"templateSource": "#events.html",
		"templateAttributes": {
			"eventType": "public"
		},
		"hide": true,
		"model": app.views.publicEventsViewModel
	},
	"amenities": {
		"hide": true,
		"model": amenitiesModel
	},
	"decks": {
		"hide": true,
		"model": decksModel
	},
	"edit-event": {
		"templateSource": "edit-event.html",
		"model": app.events.editEventModel,
		"hide": true,
		"afterAttach": function _afterAttach() {
			$('#start-datepicker').datetimepicker();
			$('#end-datepicker').datetimepicker();
		}
	}
};

checkIfAuthorized = function(success, failure) {
	'use strict';

	console.log('checkIfAuthorized()');

	if (!app.navigation.model.isSignedIn()) {
		console.log('checkIfAuthorized(): user not signed in');
		failure();
		return;
	}

	$.ajax({
		url: app.server.serverModel.authUrl(),
		timeout: m_timeout,
		cache: false,
		dataType: 'json',
		type: 'GET',
		statusCode: {
			401: function four_oh_one() {
				console.log('401 not authorized');
				app.navigation.model.authorized(false);
				app.server.serverModel.password(null);
				app.navigation.pageNavigator.navigateTo('login');
			}
		},
		beforeSend: function beforeSend(xhr) {
			app.server.serverModel.setBasicAuth(xhr);
			xhr = null;
		}
	}).success(function _success(data) {
		'use strict';

		if (data === true) {
			console.log('checkIfAuthorized(): test returned OK');
			data = null;
			success();
			return;
		} else {
			console.log('checkIfAuthorized(): success function called, but data was not OK!');
			data = null;
			failure();
			return;
		}
	}).fail(function _error(jqXHR, textStatus, errorThrown) {
		'use strict';
		console.log('checkIfAuthorized(): An error occurred: ' + errorThrown + ' (' + textStatus + ')');
		jqXHR = textStatus = errorThrown = null;
		failure();
	});
};

showLoginOrCurrent = function() {
	'use strict';

	var current_page = app.navigation.pageNavigator.getCurrentPage();
	if (current_page == 'login' || current_page == 'edit-events') {
		current_page = 'official-events';
	}

	checkIfAuthorized(
		// success
		function() {
			'use strict';

			console.log('checkIfAuthorized: success');
			app.navigation.model.authorized(true);
			app.navigation.pageNavigator.navigateTo(current_page);
		},
		// failure
		function() {
			'use strict';

			console.log('checkIfAuthorized: failure');
			app.navigation.model.authorized(false);
			app.navigation.pageNavigator.navigateTo('login');
		}
	);
};

setupDefaultView = function() {
	'use strict';

	console.log('setupDefaultView()');

	var events = amplify.store('events');
	// console.log('read events:');
	// console.log(events);
	if (events) {
		console.log('loading stored ReST events');
		try {
			app.events.eventsViewModel.updateData(events);
		} catch (err) {
			console.log('an error occurred restoring events from storage: ' + err.message);
		}
	} else {
		console.log('no stored ReST events');
	}
	events = null;

	if (window.isPhoneGap) {
		console.log('configuring ajaxUpdater.onUpdate');
		app.events.ajaxUpdater.onUpdate = function _onUpdate() {
			console.log('hiding splashscreen');
			navigator.splashscreen.hide();
		}
	};

	setTimeout(function() {
		app.events.ajaxUpdater.start();
	}, 1000);

	showLoginOrCurrent();
};

(function() {
	/** filter dates in Knockout data-bind **/
	ko.bindingHandlers.dateString = {
		update: function _update(element, valueAccessor, allBindingsAccessor, viewModel) {
			'use strict';

			var value = valueAccessor(),
				allBindings = allBindingsAccessor(),
				valueUnwrapped = ko.utils.unwrapObservable(value),
				pattern = allBindings.datePattern || 'MM/dd/yyyy hh:mm';
			$(element).text(valueUnwrapped.toString(pattern));
		}
	};
})();

templateLoader.onFinished = function() {
	'use strict';

	if (window.Modernizr.touch) {
		$('#content').addClass('hide-scrollbar');
	}

	scrollManager = new ScrollManager('#content');
	scrollManager.delay = 100; // ms

	scrollManager.onScrollStop = function(enabled) {
		'use strict';

		if (enabled) {
			app.navigation.pageNavigator.updateTopVisibleElement();
		}
	};

	$.each(htmlInitialization, function(index, data) {
		if (pages[index]) {
			console.log(index + ' has already been initialized');
		} else {
			console.log('initializing HTML for ' + index);
			if (typeof data === 'function') {
				data();
			} else {
				var div;
				if (data.templateSource) {
					div = $('<div>');
					div.attr('id', index);
					div.html(templateLoader.renderTemplate(data.templateSource, data.templateAttributes || {}));
					$('#content').append(div);
				} else {
					div = $('#' + index);
				}
				if (data.divClasses) {
					for (var i = 0; i < data.divClasses.length; i++) {
						div.addClass(data.divClasses[i]);
					}
				}
				if (data.hide) {
					div.css('display', 'none');
				}

				if (data.afterAttach) {
					console.log('calling afterAttach for ' + index);
					data.afterAttach(div);
				}
				if (data.model) {
					console.log('applying ' + data.model + ' to ' + index);
					ko.applyBindings(data.model, div[0]);
				}
				div = null;
			}
			pages[index] = true;
		}
		index = data = null;
	});

	setupDefaultView();
};

window['templateLoader'] = templateLoader;

console.log('app.js loaded');