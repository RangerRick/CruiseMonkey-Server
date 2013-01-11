console.log('app.js loading');

var m_eventUpdateInterval = 60000,
_header, _container, scrollManager, pageTracker, pageNavigator, templateLoader, htmlInitialization, checkIfAuthorized,
showLoginOrCurrent, setupDefaultView,
pages = {},
page_scroll_element = [];

var serverModel = new ServerModel();
var navModel = new NavModel();
var eventsModel = new EventsViewModel();
var ajaxUpdater = new AjaxUpdater();
var addEventModel = new AddEventModel();

var officialEventsModel = new OfficialEventsViewModel(eventsModel);
var myEventsModel = new MyEventsViewModel(eventsModel);
var publicEventsModel = new PublicEventsViewModel(eventsModel);

pageTracker = new PageTracker('.scrollable');
pageNavigator = new PageNavigator('official-events', '.scrollable');
templateLoader = new TemplateLoader(['#header.html', '#login.html', '#events.html', '#amenities.html', '#decks.html']);

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
			pageNavigator.updateTopVisibleElement();
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
				var div = $('<div>');
				div.attr('id', index);
				if (data.divClasses) {
					for (var i = 0; i < data.divClasses.length; i++) {
						div.addClass(data.divClasses[i]);
					}
				}
				div.css('display', 'none');
				var renderedHtml = templateLoader.renderTemplate(data.templateSource, data.templateAttributes || {});
				div.html(renderedHtml);
				$('#content').append(div);

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

htmlInitialization = {
	"header": function createHeader() {
		'use strict';

		var header = $('#header'),
			host = document.URL.replace(/\#$/, ''),
			hostRegex = new RegExp('^' + cmUtils.escapeForRegExp(host));

		header.html(templateLoader.renderTemplate('#header.html'));

		header.find('a').each(function(index, element) {
			'use strict';

			// console.log('url host = ' + host);
			var hash, href;
			if (element.href !== undefined) {
				href = element.href.replace(hostRegex, '');
				if (href && href !== '') {
					if (href.indexOf('#') >= 0) {
						hash = element.href.split('#')[1];
					}
				} else {
					href = undefined;
				}
			}
			// console.log('a = ' + $(element).html() + ', href = ' + href + ', hash = ' + hash);
			if (hash !== undefined) {
				if (hash == 'add-event') {
					$(element).on('click.cm touchstart.cm', function(e) {
						e.preventDefault();
						console.log('add-event clicked');
						addEventModel.resetEvent();
						$('#add-event').reveal();
					})
				} else if (hash !== '') {
					// $(element).off('click');
					$(element).on('click.cm touchstart.cm', function(e) {
						'use strict';

						e.preventDefault();
						// console.log('navigation event: ' + hash);
						pageNavigator.navigateTo(hash);
					});
				}
			} else if (href !== undefined && href !== '') {
				$(element).on('click.cm touchstart.cm', function(e) {
					'use strict';

					e.preventDefault();
					cmUtils.openLink(href);
				});
			}
		});

		$(header).find('.signin a').each(function(index, element) {
			$(element).on('click.cm touchstart.cm', function(e) {
				'use strict';

				e.preventDefault();
				console.log('signin clicked');
				$('#login').reveal();
			});
		});
		$(header).find('.signout a').each(function(index, element) {
			$(element).on('click.cm touchstart.cm', function(e) {
				'use strict';

				e.preventDefault();
				console.log('signout clicked');
				navModel.logOut();
				$('#login').reveal();
			});
		});

		ko.applyBindings(navModel, header[0]);
		header = null;
	},
	"login": {
		"templateSource": "#login.html",
		"divClasses": ["reveal-modal", "full"],
		"model": serverModel
	},
	"official-events": {
		"templateSource": "#events.html",
		"templateAttributes": {
			"eventType": "official"
		},
		"model": officialEventsModel
	},
	"my-events": {
		"templateSource": "#events.html",
		"templateAttributes": {
			"eventType": "my"
		},
		"model": myEventsModel
	},
	"public-events": {
		"templateSource": "#events.html",
		"templateAttributes": {
			"eventType": "public"
		},
		"model": publicEventsModel
	},
	"amenities": {
		"templateSource": "#amenities.html",
		"model": amenitiesModel
	},
	"decks": {
		"templateSource": "#decks.html",
		"model": decksModel
	},
	"add-event": function addEvent() {
		$('#start-datepicker').datetimepicker();
		$('#end-datepicker').datetimepicker();
		ko.applyBindings(addEventModel, $('#add-event')[0]);
	}
};

checkIfAuthorized = function(success, failure) {
	'use strict';

	console.log('checkIfAuthorized()');

	if (!navModel.isSignedIn()) {
		console.log('checkIfAuthorized(): user not signed in');
		failure();
		return;
	}

	$.ajax({
		url: serverModel.authUrl(),
		timeout: m_timeout,
		cache: false,
		dataType: 'json',
		type: 'GET',
		statusCode: {
			200: function two_hundred() {
				console.log('200 OK');
			},
			401: function four_oh_one() {
				console.log('401 not authorized');
				navModel.authorized(false);
				serverModel.password(null);
				$('#login').reveal();
			}
		},
		beforeSend: function beforeSend(xhr) {
			serverModel.setBasicAuth(xhr);
		}
	}).success(function _success(data) {
		'use strict';

		if (data === true) {
			console.log('checkIfAuthorized(): test returned OK');
			success();
			return;
		} else {
			console.log('checkIfAuthorized(): success function called, but data was not OK!');
			failure();
			return;
		}
	}).fail(function _error(jqXHR, textStatus, errorThrown) {
		'use strict';
		console.log('checkIfAuthorized(): An error occurred: ' + errorThrown);
		console.log('textStatus = ' + textStatus + ', errorThrown = ' + errorThrown);
		failure();
	});
};

showLoginOrCurrent = function() {
	'use strict';

	var current_page = pageNavigator.getCurrentPage();

	checkIfAuthorized(
		// success
		function() {
			'use strict';

			console.log('checkIfAuthorized: success');
			navModel.authorized(true);
			$('#login').trigger('reveal:close');
			pageNavigator.navigateTo(current_page);

			if (window.isPhoneGap) {
				console.log('hiding splashscreen');
				navigator.splashscreen.hide();
			}
		},
		// failure
		function() {
			'use strict';

			console.log('checkIfAuthorized: failure');
			navModel.authorized(false);
			$('#login').reveal();

			if (window.isPhoneGap) {
				console.log('hiding splashscreen');
				navigator.splashscreen.hide();
			}
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
			eventsModel.updateData(events);
		} catch (err) {
			console.log('an error occurred restoring events from storage: ' + err.message);
		}
	} else {
		console.log('no stored ReST events');
	}
	events = null;

	setTimeout(function() {
		ajaxUpdater.start();
	}, 1000);

	// Hide address bar on mobile devices
	/*
	var Modernizr = window.Modernizr;
	if (Modernizr.touch) {
		$(window).load(function () {
			setTimeout(function () {
				window.scrollTo(0, 1);
			}, 0);
		});
	}
	*/

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

console.log('app.js loaded');
