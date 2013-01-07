console.log("app.js loading");

var m_eventUpdateInterval = 60000,
_header,
_container,
pages               = {},
page_scroll_element = [],
templates           = ['#header.html', '#events.html', '#amenities.html', '#decks.html'];

var scrollManager;
var pageTracker         = new PageTracker(amplify, '.scrollable');
var pageNavigator       = new PageNavigator(amplify, pageTracker, 'official-events', '.scrollable');
var templateLoader      = new TemplateLoader(templates, m_timeout);

templateLoader.onFinished = function() {
	"use strict";

	scrollManager = new ScrollManager('#content');
	scrollManager.delay = 100;
	pageNavigator.setScrollManager(scrollManager);

	scrollManager.onScrollStop = function(enabled) {
		"use strict";

		if (enabled) {
			var found = pageNavigator.findTopVisibleElement();
			if (found) {
				console.log("visible element: " + CMUtils.getSummary(found) + ' (' + $(found).attr('id') + ')');
			} else {
				console.log("no elements visible!");
			}
		} else {
			console.log('scrolling stopped while disabled');
		}
	};

	createLoginView();
	createOfficialEventsView();
	createMyEventsView();
	createAmenitiesView();
	createDecksView();

	/*
	$(window).disableTextSelect();
	$('#login').enableTextSelect();
	$('#login').attr('contentEditable', true);
	*/

	setupDefaultView();
};

var setupHeader = function() {
	"use strict";

	console.log('setupHeader()');
	var header = pageTracker.getHeader();
	header.html(templateLoader.renderTemplate('#header.html'));

	var host = document.URL.replace(/\#$/, '');

	$(header).find('a').each(function(index, element) {
		"use strict";

		// console.log('url host = ' + host);
		var hash, href;
		if (element.href !== undefined) {
			href = element.href.replace(new RegExp('^' + CMUtils.escapeForRegExp(host)), '');
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
				$(element).on('click.fndtn touchstart.fndtn', function(e) {
					"use strict";

					e.preventDefault();
					console.log("navigation event: " + hash);
					pageNavigator.navigateTo(hash);
					if ($('.top-bar').hasClass('expanded')) $('.toggle-topbar').find('a').click();
				});
			}
		} else if (href !== undefined && href !== '') {
			$(element).on('click.fndtn touchstart.fndtn', function(e) {
				"use strict";

				e.preventDefault();
				CMUtils.openLink(href);
			});
		}
	});

	/* $(document).foundationTopBar(); */

	$(header).find('.signin a').each(function(index, element) {
		$(element).on('click.fndtn touchstart.fndtn', function(e) {
			"use strict";

			e.preventDefault();
			console.log('signin clicked');
			if ($('.top-bar').hasClass('expanded')) $('.top-bar').removeClass('expanded');
			$('#login').reveal();
		});
	});
	$(header).find('.signout a').each(function(index, element) {
		$(element).on('click.fndtn touchstart.fndtn', function(e) {
			"use strict";

			e.preventDefault();
			console.log('signout clicked');
			if ($('.top-bar').hasClass('expanded')) $('.top-bar').removeClass('expanded');
			navModel.logOut();
			$('#login').reveal();
		});
	});

	ko.applyBindings(navModel, $(header)[0]);
},

checkIfAuthorized = function(success, failure) {
	"use strict";

	console.log('checkIfAuthorized()');
	var username = serverModel.username();
	var password = serverModel.password();

	if (!username || username === null || !password || password === null) {
		console.log('checkIfAuthorized(): username or password is null');
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
			401: function() {
				console.log('401 not authorized');
				navModel.authorized(false);
				serverModel.password(null);
				$('#login').reveal();
			}
		},
		beforeSend: function(xhr) {
			serverModel.setBasicAuth(xhr);
		},
		success: function(data) {
			"use strict";

			if (data === true) {
				console.log('checkIfAuthorized(): test returned OK');
				success();
				return;
			} else {
				console.log('checkIfAuthorized(): success function called, but data was not OK!  ' + ko.toJSON(data, null, 2));
				failure();
				return;
			}
		}
	}).error(function(data) {
		"use strict";

		console.log("checkIfAuthorized(): An error occurred: " + ko.toJSON(data, null, 2));
		failure();
	});
},

showLoginOrCurrent = function() {
	"use strict";

	var current_page = pageNavigator.getCurrentPage();

	checkIfAuthorized(
		// success
		function() {
			"use strict";

			console.log("checkIfAuthorized: success");
			navModel.authorized(true);
			$('#login').trigger('reveal:close');
			pageNavigator.navigateTo(current_page);
		},
		// failure
		function() {
			"use strict";

			console.log("checkIfAuthorized: failure");
			navModel.authorized(false);
			$('#login').reveal();
		}
	);
},

setupDefaultView = function() {
	"use strict";

	console.log('setupDefaultView()');
	setupHeader();

	var events = amplify.store("events");
	console.log("read events:");
	// console.log(events);
	if (events) {
		console.log("loading stored ReST events");
		try {
			eventsModel.updateData(events);
		} catch (err) {
			console.log("an error occurred restoring events from storage: " + err.message);
		}
	} else {
		console.log("no stored ReST events");
	}

	ajaxUpdater.start();

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
},

createOfficialEventsView = function() {
	"use strict";

	console.log('createOfficialEventsView()');
	if (!pages.official) {
		var html = templateLoader.renderTemplate('#events.html', { eventType: "official" });

		var div = document.createElement('div');
		div.setAttribute('id', 'official-events');
		$(div).css('display', 'none');
		$(div).html(html);
		var appended = pageTracker.getContainer()[0].appendChild(div);

		pages.official = div;

		ko.applyBindings(officialEventsModel, appended);
	}
},

createMyEventsView = function() {
	"use strict";

	console.log('createMyEventsView()');
	if (!pages.my) {
		var html = templateLoader.renderTemplate('#events.html', { eventType: "my" });

		var div = document.createElement('div');
		div.setAttribute('id', 'my-events');
		$(div).css('display', 'none');
		$(div).html(html);
		var appended = pageTracker.getContainer()[0].appendChild(div);

		pages.my = div;

		ko.applyBindings(myEventsModel, appended);
	}
},

createLoginView = function() {
	"use strict";

	console.log('createLoginView()');
	if (!pages.login) {
		var div = $('#login')[0];

		// enter doesn't submit for some reason, so handle it manually
		console.log('trapping keydown');
		$(div).find('input').keydown(function(e) {
			var keyCode = e.keyCode || e.which;
			if (keyCode == 13) save_button.click();
		});

		/*
		console.log('handling href links');
		$(div).find('a').each(function(index, element) {
			"use strict";

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
		$('#login_reset').on('click.fndtn touchstart.fndtn', function(e) {
			"use strict";

			e.preventDefault();
			console.log("cancel clicked");
			serverModel.reset();
		});

		var save_button = $('#login_save');

		console.log('handling save click');
		save_button.on('click.fndtn touchstart.fndtn', function(e) {
			"use strict";

			console.log("save clicked");
			e.preventDefault();
			setTimeout(function() {
				"use strict";

				serverModel.persist();
				showLoginOrCurrent();
				ajaxUpdater.pollNow();
			}, 0);
		});

		console.log('done creating loginView');
		pages.login = div;

		ko.applyBindings(serverModel, div);
	}
},

showLoginView = function() {
	"use strict";

	console.log('showLoginView()');
	createLoginView();
	$('#login').reveal();
},

createAmenitiesView = function() {
	"use strict";

	console.log('createAmenitiesView()');
	if (!pages.amenities) {
		var html = templateLoader.renderTemplate('#amenities.html');

		var div = document.createElement('div');
		div.setAttribute('id', 'amenities');
		$(div).css('display', 'none');
		$(div).html(html);
		var appended = pageTracker.getContainer()[0].appendChild(div);

		console.log("done creating amenitiesView");
		pages.amenities = div;
		
		ko.applyBindings(amenitiesModel, appended);
	}
};

(function($) {
	"use strict";

    if ($.browser.mozilla) {
        $.fn.disableTextSelect = function() {
            return this.each(function() {
                $(this).css({
                    'MozUserSelect' : 'none'
                });
            });
        };
        $.fn.enableTextSelect = function() {
            return this.each(function() {
                $(this).css({
                    'MozUserSelect' : ''
                });
            });
        };
    } else if ($.browser.msie) {
        $.fn.disableTextSelect = function() {
            return this.each(function() {
                $(this).bind('selectstart.disableTextSelect', function() {
                    return false;
                });
            });
        };
        $.fn.enableTextSelect = function() {
            return this.each(function() {
                $(this).unbind('selectstart.disableTextSelect');
            });
        };
    } else {
        $.fn.disableTextSelect = function() {
            return this.each(function() {
                $(this).bind('mousedown.disableTextSelect', function() {
                    return false;
                });
            });
        };
        $.fn.enableTextSelect = function() {
            return this.each(function() {
                $(this).unbind('mousedown.disableTextSelect');
            });
        };
    }
})(jQuery);

var createDecksView = function() {
	"use strict";

	console.log('createDecksView()');
	if (!pages.decks) {
		var html = templateLoader.renderTemplate('#decks.html');

		var div = document.createElement('div');
		div.setAttribute('id', 'decks');
		$(div).css('display', 'none');
		$(div).html(html);
		var appended = pageTracker.getContainer()[0].appendChild(div);

		console.log("done creating decksView");
		pages.decks = div;

		ko.applyBindings(decksModel, appended);
	}
};

/** filter dates in Knockout data-bind **/
ko.bindingHandlers.dateString = {
	update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
		"use strict";

		var value = valueAccessor(),
			allBindings = allBindingsAccessor();
		var valueUnwrapped = ko.utils.unwrapObservable(value);
		var pattern = allBindings.datePattern || 'MM/dd/yyyy hh:mm:ss';
		$(element).text(valueUnwrapped.toString(pattern));
	}
};

var serverModel = new ServerModel(m_isPhoneGap, amplify);
var navModel = new NavModel(serverModel);
var eventsModel = new EventsViewModel(navModel, serverModel);
var ajaxUpdater = new AjaxUpdater(serverModel, eventsModel, navModel);

var officialEventsModel = new OfficialEventsViewModel(eventsModel, serverModel);

var myEventsModel = new MyEventsViewModel(eventsModel);

console.log("app.js loaded");