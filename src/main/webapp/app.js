console.log('app.js loading');

var app = {
	settings: {
		eventUpdateInterval: 500,
		clickTimeout: 50
	},
	cache: {
		elements: {},
		functions: {},
		pages: {}
	},
	events: {},
	views: {},
	server: {},
	navigation: {},
	empty: {}
};


// server
(function _initServer() {
	app.server.serverModel = new ServerModel();
})();

// events
(function _initEvents() {
	app.events.eventsViewModel   = new EventsViewModel();
	app.events.editEventModel    = new EditEventModel();
})();

// navigation
(function _initNavigation() {
	app.navigation.model         = new NavModel();
	app.navigation.pageTracker   = new PageTracker('.list-entry .scrollable');
	app.navigation.pageNavigator = new PageNavigator('official-events', '.list-entry .scrollable');
})();

// startup
(function _initStartup() {
	app.events.ajaxUpdater = new AjaxUpdater();

	app.settings.init = {
		"header": {
			"model": app.navigation.model
		},
		"login": {
			"model": app.server.serverModel
		},
		"events": {
			"model": app.events.eventsViewModel
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
				/*
				$('#start-datepicker').datetimepicker();
				$('#end-datepicker').datetimepicker();
				*/
			}
		}
	};

	app.cache.functions.onReady = function _onReady() {
		'use strict';

		if (window.Modernizr.touch) {
			$(app.cache.elements.content).addClass('hide-scrollbar');
		}

		(function _initScrollManager() {
			app.navigation.scrollManager = new ScrollManager('#content');
			app.navigation.scrollManager.delay = 100; // ms

			app.navigation.scrollManager.onScrollStop = function _appNavigationScrollManagerOnScrollStop(enabled) {
				'use strict';

				console.log('onScrollStop: enabled = ' + enabled);
				if (enabled) {
					app.navigation.pageNavigator.updateTopVisibleElement();
				}
			};
		})();

		app.cache.elements['content'] = $('#content');

		$.each(app.settings.init, function _appSettingsInit(index, data) {
			if (app.cache.elements[index]) {
				console.log(index + ' has already been initialized');
			} else {
				console.log('initializing HTML for ' + index);
				if (typeof data === 'function') {
					data();
				} else {
					var div = $('#' + index);
					if (data.divClasses) {
						for (var i = 0; i < data.divClasses.length; i++) {
							div.addClass(data.divClasses[i]);
						}
					}

					if (data.afterAttach) {
						console.log('calling afterAttach for ' + index);
						data.afterAttach(div);
					}

					app.cache.elements[index] = div;
					div = null;
				}
			}
			index = data = null;
		});

		app.cache.functions.setupDefaultView();
		
		setTimeout(function _initKnockout() {
			$.each(app.settings.init, function _appSettingsInitBindKnockout(index, data) {
				if (data.model) {
					var element = app.cache.elements[index][0];
					if (element) {
						console.log('applying knockout model to ' + index);
						ko.applyBindings(data.model, element);
					} else {
						console.log('unable to locate element for ' + index);
					}
					element = null;
				}
			});
			
			if (window.isPhoneGap) {
				console.log('hiding splashscreen');
				navigator.splashscreen.hide();
			}
		}, 0);
	};
})();

(function _checkIfAuthorized() {
	app.cache.functions.checkIfAuthorized = function _appCacheFunctionsCheckIfAuthorized(success, failure) {
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
			context: app.empty,
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

})();

(function _initShowLoginOrCurrent() {
	app.cache.functions.showLoginOrCurrent = function _showLoginOrCurrent() {
		'use strict';

		console.log('app.cache.functions.showLoginOrCurrent');
		var current_page = app.navigation.pageNavigator.getCurrentPage();
		if (current_page == 'login' || current_page == 'edit-events') {
			current_page = app.navigation.pageNavigator.setCurrentPage('official-events');
		}

		app.cache.functions.checkIfAuthorized(
			// success
			function _success() {
				'use strict';

				console.log('checkIfAuthorized: success');
				app.navigation.model.authorized(true);
				app.navigation.pageNavigator.navigateTo(current_page);
			},
			// failure
			function _failure() {
				'use strict';

				console.log('checkIfAuthorized: failure');
				app.navigation.model.authorized(false);
				app.navigation.pageNavigator.navigateTo('login');
			}
		);
	};
})();

(function _initLoadDefaultEvents() {
	app.cache.functions.loadDefaultEvents = function _loadDefaultEvents() {
		console.log('loadDefaultEvents()');
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
		console.log('loadDefaultEvents(): finished');
	};
})();

(function _initSetupDefaultView() {
	app.cache.functions.setupDefaultView = function _setupDefaultView() {
		'use strict';

		console.log('setupDefaultView()');
		// app.cache.functions.loadDefaultEvents();

		console.log('setupDefaultView(): set up ajaxUpdater');
		setTimeout(function _startAjaxUpdater() {
			// then, start the background event-sync
			app.events.ajaxUpdater.start();
		}, 2000);

		console.log('setupDefaultView(): calling showLoginOrCurrent()');
		app.cache.functions.showLoginOrCurrent();
		
		console.log('setupDefaultView(): finished');
	};
})();

(function _initKnockoutBindingHandlers() {
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
        'init': function _init(element, valueAccessor, allBindingsAccessor, viewModel) {
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
    };
})();

window['app'] = app;

console.log('app.js loaded');