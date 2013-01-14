console.log('app.js loading');

var app = {
	settings: {
		eventUpdateInterval: 15000,
		clickTimeout: 50
	},
	cache: {
		elements: {},
		functions: {}
	},
	events: {},
	views: {},
	server: {},
	navigation: {}
};


var templateLoader, htmlInitialization, checkIfAuthorized, showLoginOrCurrent, setupDefaultView,
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

templateLoader = new TemplateLoader(['#events.html']);

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
		"model": app.views.officialEventsViewModel
	},
	"my-events": {
		"templateSource": "#events.html",
		"templateAttributes": {
			"eventType": "my"
		},
		"model": app.views.myEventsViewModel
	},
	"public-events": {
		"templateSource": "#events.html",
		"templateAttributes": {
			"eventType": "public"
		},
		"model": app.views.publicEventsViewModel
	},
	"amenities": {
		"model": amenitiesModel
	},
	"decks": {
		"model": decksModel
	},
	"edit-event": {
		"model": app.events.editEventModel,
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
		current_page = app.navigation.pageNavigator.setCurrentPage('official-events');
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

(function() {
	app.cache.functions.loadDefaultEvents = function _loadDefaultEvents() {
		var events = amplify.store('events');
		// console.log('read events:');
		// console.log(events);
		if (events) {
			console.log('loading stored ReST events');
			app.events.eventsViewModel.updateData(events);
			events = null;
		} else {
			console.log('no stored ReST events');
		}
		events = null;
	};
})();

setupDefaultView = function() {
	'use strict';

	console.log('setupDefaultView()');

	if (window.isPhoneGap) {
		console.log('configuring ajaxUpdater.onUpdate');
		app.events.ajaxUpdater.onUpdate = function _onUpdate() {
			console.log('hiding splashscreen');
			navigator.splashscreen.hide();
		}
	};

	setTimeout(function() {
		// first, load default events
		app.cache.functions.loadDefaultEvents();

		setTimeout(function() {
			// then, start the background event-sync
			app.events.ajaxUpdater.start();
		}, 2000);

	}, 2000);

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
    ko.bindingHandlers.touchOrClick = {
        'init': function(element, valueAccessor, allBindingsAccessor, viewModel) {
            var newValueAccessor = function () {
                var result = {};
				if (Modernizr.touch) {
	                result['touchstart'] = valueAccessor();
				} else {
					result['click'] = valueAccessor();
				}
                return result;
            };
            return ko.bindingHandlers['event']['init'].call(this, element, newValueAccessor, allBindingsAccessor, viewModel);
        }
    }


})();

templateLoader.onFinished = function() {
	'use strict';

	if (window.Modernizr.touch) {
		$(app.cache.elements.content).addClass('hide-scrollbar');
	}

	(function() {
		app.navigation.scrollManager = new ScrollManager('#content');
		app.navigation.scrollManager.delay = 100; // ms

		app.navigation.scrollManager.onScrollStop = function(enabled) {
			'use strict';

			console.log('onScrollStop: enabled = ' + enabled);
			if (enabled) {
				app.navigation.pageNavigator.updateTopVisibleElement();
			}
		};
	})();

	app.cache.elements['content'] = $('#content');

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
					app.cache.elements.content.append(div);
				} else {
					div = $('#' + index);
				}
				if (data.divClasses) {
					for (var i = 0; i < data.divClasses.length; i++) {
						div.addClass(data.divClasses[i]);
					}
				}

				if (data.afterAttach) {
					console.log('calling afterAttach for ' + index);
					data.afterAttach(div);
				}
				if (data.model) {
					console.log('applying ' + data.model + ' to ' + index);
					ko.applyBindings(data.model, div[0]);
				}
				
				app.cache.elements[index] = div;
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