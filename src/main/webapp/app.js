console.log('app.js loading');

var m_eventUpdateInterval = 10000,
_header, _container, scrollManager, pageTracker, pageNavigator, templateLoader, htmlInitialization, checkIfAuthorized,
showLoginOrCurrent, setupDefaultView, createOfficialEventsView, createMyEventsView, createPublicEventsView, createLoginView, createAmenitiesView, createDecksView,
pages = {},
page_scroll_element = [],
templates = ['#header.html', '#events.html', '#amenities.html', '#decks.html'];

pageTracker = new PageTracker('.scrollable');
pageNavigator = new PageNavigator('official-events', '.scrollable');
templateLoader = new TemplateLoader(templates);

templateLoader.onFinished = function() {
	'use strict';

	scrollManager = new ScrollManager('#content');
	scrollManager.delay = 100;

	scrollManager.onScrollStop = function(enabled) {
		'use strict';

		if (enabled) {
			pageNavigator.updateTopVisibleElement();
		}
	};

	$.each(htmlInitialization, function(index, value) {
		console.log('Initializing HTML for: ' + index);
		value();
	});

	createLoginView();
	createOfficialEventsView();
	createMyEventsView();
	createPublicEventsView();
	createAmenitiesView();
	createDecksView();

	setupDefaultView();

	setTimeout(function _favoriteHandler() {
		$('.favorite-checkbox').on('click.cm touchstart.cm', function(e) {
			'use strict';

			e.stopPropagation();
			var entry = ko.contextFor(this).$data;

			if (eventsModel.updating()) {
				// console.log('skipping ajax update for ' + e.id() + ', we are in the middle of a server update');
				return;
			}

			console.log(entry.id() + ' favorite has changed to: ' + entry.favorite());
			$.ajax({
				url: serverModel.favoritesUrl(entry.id()),
				timeout: m_timeout,
				cache: false,
				dataType: 'json',
				type: entry.favorite() ? 'PUT' : 'DELETE',
				statusCode: {
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
			});
		});
	}, 50);
};

window['templateLoader'] = templateLoader;

htmlInitialization = {
	'header': function createHeader() {
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
				if (hash !== '') {
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
			401: function four_oh_one() {
				console.log('401 not authorized');
				navModel.authorized(false);
				serverModel.password(null);
				$('#login').reveal();
			}
		},
		beforeSend: function beforeSend(xhr) {
			serverModel.setBasicAuth(xhr);
		},
		success: function _success(data) {
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
		}
	}).error(function _error(data) {
		'use strict';

		console.log('checkIfAuthorized(): An error occurred: ' + ko.toJSON(data, null, 2));
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
		},
		// failure
		function() {
			'use strict';

			console.log('checkIfAuthorized: failure');
			navModel.authorized(false);
			$('#login').reveal();
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

	setTimeout(function() {
		ajaxUpdater.start();
	}, 0);

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

createOfficialEventsView = function() {
	'use strict';

	console.log('createOfficialEventsView()');
	if (!pages.officialEventsView) {
		var html = templateLoader.renderTemplate('#events.html', { eventType: 'official' });

		var div = $('<div>');
		div.attr('id', 'official-events');
		div.css('display', 'none');
		div.html(html);
		$('#content').append(div);

		pages.officialEventsView = div;

		ko.applyBindings(officialEventsModel, div[0]);
	}
};

createMyEventsView = function() {
	'use strict';

	console.log('createMyEventsView()');
	if (!pages.myEventsView) {
		var html = templateLoader.renderTemplate('#events.html', { eventType: 'my' });

		var div = $('<div>');
		div.attr('id', 'my-events');
		div.css('display', 'none');
		div.html(html);
		$('#content').append(div);

		pages.myEventsView = div;

		ko.applyBindings(myEventsModel, div[0]);
	}
};

createPublicEventsView = function() {
	'use strict';

	console.log('createPublicEventsView()');
	if (!pages.publicEventsView) {
		var html = templateLoader.renderTemplate('#events.html', { eventType: 'public' });

		var div = $('<div>');
		div.attr('id', 'public-events');
		div.css('display', 'none');
		div.html(html);
		$('#content').append(div);

		pages.publicEventsView = div;

		ko.applyBindings(publicEventsModel, div[0]);
	}
};

createLoginView = function() {
	'use strict';

	console.log('createLoginView()');
	if (!pages.loginView) {
		var div = $('#login');

		// enter doesn't submit for some reason, so handle it manually
		console.log('trapping keydown');
		div.find('input').keydown(function(e) {
			var keyCode = e.keyCode || e.which;
			if (keyCode == 13) save_button.click();
		});

		/*
		console.log('handling href links');
		div.find('a').each(function(index, element) {
			'use strict';

			var href = element.getAttribute('href');
			// console.log('a = ' + $(element).html() + ', href = ' + href);
			if (href !== undefined && href !== '') {
				element.click(function(e) {
					openUrl(href);
					e.preventDefault();
				});
			}
		});
		*/

		console.log('handling reset click');
		$('#login_reset').on('click.cm touchstart.cm', function(e) {
			'use strict';

			e.preventDefault();
			console.log('cancel clicked');
			serverModel.reset();
		});

		var save_button = $('#login_save');

		console.log('handling save click');
		save_button.on('click.cm touchstart.cm', function(e) {
			'use strict';

			console.log('save clicked');
			e.preventDefault();
			setTimeout(function() {
				'use strict';

				serverModel.persist();
				showLoginOrCurrent();
				ajaxUpdater.pollNow();
			}, 0);
		});

		console.log('done creating loginView');
		pages.loginView = div;

		ko.applyBindings(serverModel, div[0]);
	}
};

createAmenitiesView = function() {
	'use strict';

	console.log('createAmenitiesView()');
	if (!pages.amenitiesView) {
		var html = templateLoader.renderTemplate('#amenities.html');

		var div = $('<div>');
		div.attr('id', 'amenities');
		div.css('display', 'none');
		div.html(html);
		$('#content').append(div);

		console.log('done creating amenitiesView');
		pages.amenitiesView = div;

		ko.applyBindings(amenitiesModel, div[0]);
	}
};

createDecksView = function() {
	'use strict';

	console.log('createDecksView()');
	if (!pages.decksView) {
		var html = templateLoader.renderTemplate('#decks.html');

		var div = $('<div>');
		div.attr('id', 'decks');
		div.css('display', 'none');
		div.html(html);
		$('#content').append(div);

		console.log('done creating decksView');
		pages.decksView = div;

		ko.applyBindings(decksModel, div[0]);
	}
};

(function() {
	/** filter dates in Knockout data-bind **/
	ko.bindingHandlers.dateString = {
		update: function _update(element, valueAccessor, allBindingsAccessor, viewModel) {
			'use strict';

			var value = valueAccessor(),
				allBindings = allBindingsAccessor(),
				valueUnwrapped = ko.utils.unwrapObservable(value),
				pattern = allBindings.datePattern || 'MM/dd/yyyy hh:mm:ss';
			$(element).text(valueUnwrapped.toString(pattern));
		}
	};
})();

var serverModel = new ServerModel();
var navModel = new NavModel();
var eventsModel = new EventsViewModel();
var ajaxUpdater = new AjaxUpdater();

var officialEventsModel = new OfficialEventsViewModel(eventsModel);
var myEventsModel = new MyEventsViewModel(eventsModel);
var publicEventsModel = new PublicEventsViewModel(eventsModel);

console.log('app.js loaded');
