console.log("app.js loading");

function openLink(url) {
	"use strict";

	if (window.plugins && window.plugins.childBrowser) {
		console.log('openLink(' + url + '): using ChildBrowser plugin');
		window.plugins.childBrowser.openExternal(url);
	} else {
		console.log('openLink(' + url + '): using window.open()');
		window.open(url, '_blank');
	}
}

var m_eventUpdateInterval = 60000,
_header,
_container,
scrollManager,
templateLoader,
pages               = {},
page_scroll_element = [],
templates           = ['#header.html', '#events.html', '#amenities.html', '#decks.html'],
pageTracker         = new PageTracker(amplify, '.scrollable'),
pageNavigator       = new PageNavigator(amplify, pageTracker, 'official-events', '.scrollable'),
templateLoader      = new TemplateLoader(templates, m_timeout);

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
				openLink(href);
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
};

var createAmenitiesView = function() {
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

var eventsModel;

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

/** represents a calendar event **/
function Event(data) {
	"use strict";

	var self = this;

	self.id           = ko.observable(data["@id"]);
	self.cleanId      = ko.observable(data["@id"].replace(/[\W\@]+/g, ''));
	self.summary      = ko.observable(data.summary);
	self.description  = ko.observable(data.description);
	self.start        = ko.observable(new Date(data.start));
	self.end          = ko.observable(new Date(data.end));
	self.location     = ko.observable(data.location);
	self.createdBy    = ko.observable(data["created-by"]);
	self.owner        = ko.observable(data.owner);
	self.timespan     = ko.computed(function() {
		var start = start === null? null : formatTime(self.start(), false);
		var end	= end	=== null? null : formatTime(self.end(), false);
		var retVal = "";
		if (start !== null) {
			retVal += start;
			if (end !== null) {
				retVal += "-" + end;
			}
		}
		return retVal;
	}, self);
	self.favorite = ko.observable(false);
	self.favorite.subscribe(function(isFavorite) {
		"use strict";

		if (eventsModel.updating()) {
			// console.log("skipping ajax update for " + self.id() + ", we are in the middle of a server update");
			return;
		}
		console.log(self.id() + " favorite has changed to: " + isFavorite);
		var type = "PUT";
		if (isFavorite) {
			type = 'PUT';
		} else {
			type = 'DELETE';
		}
		$.ajax({
			url: serverModel.favoritesUrl(self.id()),
			timeout: m_timeout,
			cache: false,
			dataType: 'json',
			type: type,
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
			}
		});
	});
}

/** used for filter/searching, match an event based on a filter **/
var matchEventText = function(event, filter) {
	"use strict";

	if (event.summary().toLowerCase().search(filter) != -1) {
		return true;
	} else if (event.description().toLowerCase().search(filter) != -1) {
		return true;
	} else {
		return false;
	}
};

/** Wait to make sure no other changes have happened,
  * then perform the mildly expensive check to see what
  * the latest visible element is.
  **/
var onFilterChange = function() {
	"use strict";

	/*
	if (scrollTimeout === null) {
		scrollTimeout = setTimeout(function() {
			scrollTimeout = null;
			var found = findTopVisibleElement();
			if (found) {
				console.log("visible element: " + $(found).find('div.summary').text() + ' (' + $(found).attr('id') + ')');
			} else {
				console.log("no elements visible!");
			}
		}, scrollEndDelay);
	}
	*/
};

function ServerModel() {
	"use strict";

	var self = this;

	self.cruisemonkey = ko.observable(amplify.store('cruisemonkey_url'));
	self.username     = ko.observable(amplify.store('username'));
	self.password     = ko.observable(amplify.store('password'));
	
	self.authUrl = ko.computed(function() {
		return self.cruisemonkey() + '/rest/auth';
	});

	self.eventUrl = ko.computed(function() {
		return self.cruisemonkey() + '/rest/cruisemonkey/events';
	});
	
	self.favoritesUrl = function(id) {
		return self.cruisemonkey() + '/rest/favorites?event=' + encodeURI(id);
	};

	self.setBasicAuth = function(xhr) {
		xhr.setRequestHeader("Authorization", "Basic " + window.btoa(self.username() + ":" + self.password()));
	};

	self.reset = function() {
		self.cruisemonkey(amplify.store('cruisemonkey_url'));
		self.username(amplify.store('username'));
		self.password(amplify.store('password'));
	};
	
	self.persist = ko.computed(function() {
		amplify.store('cruisemonkey_url', self.cruisemonkey());
		amplify.store('username',         self.username());
		amplify.store('password',         self.password());
	});

	setTimeout(function() {
		if (!self.cruisemonkey()) {
			self.cruisemonkey(document.URL.host);
		}
	}, 0);
}

var serverModel = new ServerModel();

function EventsViewModel() {
	"use strict";

	var self = this;
	self.events = ko.observableArray();
	self.updating = ko.observable(false);

	self.updateData = function(allData) {
		self.updating(true);
		var favorites = [], dataFavorites = [], dataEvents = [];
		if (!allData) {
			console.log('EventsViewModel::updateData() called, but missing event data!');
			return;
		}
		if (allData.favorites && allData.favorites.favorite) {
			if (allData.favorites.favorite instanceof Array) {
				dataFavorites = allData.favorites.favorite;
			} else {
				dataFavorites.push(allData.favorites.favorite);
			}
			favorites = $.map(dataFavorites, function(favorite) {
				return favorite["@event"];
			});
		}
		if (allData.events && allData.events.event) {
			if (allData.events.event instanceof Array) {
				dataEvents = allData.events.event;
			} else {
				dataEvents.push(allData.events.event);
			}
			console.log("EventsViewModel::updateData(): parsing " + dataEvents.length + " events");
			var mappedTasks = $.map(dataEvents, function(event) {
				"use strict";

				var isFavorite, item;
				if (event.favorite !== undefined) {
					isFavorite = event.favorite;
				} else {
					isFavorite = (favorites.indexOf(event["@id"]) != -1);
				}
				// console.log("loading event: " + event['@id'] + ' (favorite = ' + isFavorite + ')');
				item = ko.utils.arrayFirst(self.events(), function(entry) {
					"use strict";

					if (entry) {
						if (entry.id() == event["@id"]) {
							return true;
						} else {
							return false;
						}
					} else {
						console.log("no entry");
					}
				});
				if (item) {
					var startDate = new Date(event.start);
					var endDate	= new Date(event.end);
					var createdBy = event["created-by"];

					item.favorite(isFavorite);
					if (item.summary()         != event.summary)       { item.summary(event.summary); }
					if (item.description()     != event.description)   { item.description(event.description); }
					if (item.start().getTime() != startDate.getTime()) { item.start(startDate); }
					if (item.end().getTime()   != endDate.getTime())   { item.end(endDate); }
					if (item.createdBy()       != createdBy)           { item.createdBy(createdBy); }
					if (item.owner()           != event.owner)         { item.owner(event.owner); }
					return item;
				} else {
					var e = new Event(event);
					e.favorite(isFavorite);
					return e;
				}
			});
			self.events(mappedTasks);
			amplify.store("events", allData);
		} else {
			console.log("no proper event data found: " + ko.toJSON(allData, null, 2));
		}
		// console.log("saving ReST events");
		self.updating(false);
	};
}

eventsModel = new EventsViewModel();

function AjaxUpdater() {
	"use strict";

	var self = this,
		m_timer = null,
		m_inFlight = false,
	
	f_updateEventModel = function() {
		"use strict";

		if (!serverModel || !eventsModel || !navModel) {
			console.log('AjaxUpdater::f_updateEventModel(): Missing one of [serverModel, eventsModel, navModel], skipping update.');
			return;
		}

		if (m_inFlight) {
			console.log('AjaxUpdater::f_updateEventModel(): An update is already in-progress, skipping update.');
		}

		if (navModel.isAuthorized()) {
			var url = serverModel.eventUrl();

			console.log('updating event data from ' + url);
			m_inFlight = true;
			$.ajax({
				url: url,
				timeout: m_timeout,
				cache: false,
				dataType: 'json',
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
					console.log('AjaxUpdater::f_updateEventModel(): received updated event JSON');
					eventsModel.updateData(data);
					m_inFlight = false;
				}
			}).error(function(data, textStatus, errorThrown) {
				console.log('AjaxUpdater::f_updateEventModel(): An error occurred while updating event JSON: ' + ko.toJSON(data));
				console.log('textStatus = ' + textStatus + ', errorThrown = ' + errorThrown);
				m_inFlight = false;
			});
		} else {
			console.log('Not authorized according to navModel, skipping update.');
		}
	};
	
	self.pollNow = function() {
		f_updateEventModel();
	};
	self.start = function() {
		f_updateEventModel();
		m_timer = setInterval(f_updateEventModel, m_eventUpdateInterval);
	};
	self.stop = function() {
		if (m_timer !== null) {
			clearInterval(m_timer);
			m_timer = null;
		}
	};
}

var ajaxUpdater = new AjaxUpdater();

function OfficialEventsModel() {
	"use strict";

	var self   = this;

	self.filter = ko.observable("");
	self.events = eventsModel.events;
}
var officialEventsModel = new OfficialEventsModel();
// officialEventsModel.filter.subscribe(onFilterChange, officialEventsModel);
officialEventsModel.filteredEvents = ko.dependentObservable(function() {
	"use strict";

	var self = this,
		filter = self.filter().toLowerCase(),
		username = serverModel.username();

	var matchesGroup = ko.utils.arrayFilter(self.events(), function(event) {
		if (event.owner() == 'google') {
			return true;
		}
		return false;
	});

	if (!filter) {
		return matchesGroup;
	} else {
		return ko.utils.arrayFilter(matchesGroup, function(event) {
			return matchEventText(event, filter);
		});
	}
}, officialEventsModel);

function MyEventsModel() {
	"use strict";

	var self   = this;

	self.filter = ko.observable("");
	self.events = eventsModel.events;
}
var myEventsModel = new MyEventsModel();
// myEventsModel.filter.subscribe(onFilterChange, myEventsModel);
myEventsModel.filteredEvents = ko.dependentObservable(function() {
	var self = this,
		filter = self.filter().toLowerCase(),

	matchesGroup = ko.utils.arrayFilter(self.events(), function(event) {
		if (event.favorite()) return true;
		if (event.owner() != 'google') {
			return true;
		}
		return false;
	});

	if (!filter) {
		return matchesGroup;
	} else {
		return ko.utils.arrayFilter(matchesGroup, function(event) {
			return matchEventText(event, filter);
		});
	}
}, myEventsModel);

function NavModel() {
	"use strict";

	var self = this,

	f_hasUsername = ko.computed(function() {
		"use strict";
		return serverModel.username() !== null && serverModel.username() !== undefined && serverModel.username().length > 0;
	}),

	f_hasPassword = ko.computed(function() {
		"use strict";
		return serverModel.password() !== null && serverModel.password() !== undefined && serverModel.password().length > 0;
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
		console.log("isSignedIn = " + self.isSignedIn());
		console.log('authorized = ' + self.authorized());
		return self.isSignedIn() && self.authorized();
	});

	self.logOut = function() {
		"use strict";
		serverModel.password(null);
		serverModel.persist();
	};
}

var navModel = new NavModel();

/*
function Swiper() {
"use strict";

	var self = this,
		hasTouch = 'ontouchstart' in window,
		resizeEvent = 'onorientationchange' in window ? 'orientationchange' : 'resize',
		startEvent = hasTouch ? 'touchstart' : 'mousedown',
		moveEvent = hasTouch ? 'touchmove' : 'mousemove',
		endEvent = hasTouch ? 'touchend' : 'mouseup',
		cancelEvent = hasTouch ? 'touchcancel' : 'mouseup',
		container = $('#container'),
		w = $(window),

	eventHandler = function(e) {
		"use strict";
		// console.log('e = ' + e.type);
		switch(e.type) {
			case startEvent:
				self.__start(e);
				break;
			case moveEvent:
				self.__move(e);
				break;
			case cancelEvent:
			case endEvent:
				self.__end(e);
				break;
			case resizeEvent:
				self.__resize(e);
				break;
		}
	};

	self.__start = function(e) {
		"use strict";
		console.log("__start: " + e);
		//e.preventDefault();

		if (self.initiated) return;

		var point = hasTouch ? e.touches[0] : e;

		self.initiated = true;
		self.moved = false;
		self.thresholdExceeded = false;
		self.startX = point.pageX;
		self.startY = point.pageY;
		self.pointX = point.pageX;
		self.pointY = point.pageY;
		self.stepsX = 0;
		self.stepsY = 0;
		self.directionX = 0;
		self.directionLocked = false;

		this.__event('touchstart');
	};
	self.__move = function(e) {
		"use strict";
		if (!self.initiated) return;

		var point = hasTouch ? e.touches[0] : e,
			deltaX = point.pageX - self.pointX,
			deltaY = point.pageY - self.pointY,
			newX = this.x + deltaX,
			dist = Math.abs(point.pageX - self.startX);

		self.moved = true;
		self.pointX = point.pageX;
		self.pointY = point.pageY;
		self.directionX = deltaX > 0 ? 1 : deltaX < 0 ? -1 : 0;
		self.stepsX += Math.abs(deltaX);
		self.stepsY += Math.abs(deltaY);

		// We take a 10px buffer to figure out the direction of the swipe
		if (self.stepsX < 10 && self.stepsY < 10) {
			return;
		}

		// We are scrolling vertically, so skip SwipeView and give the control back to the browser
		if (!self.directionLocked && self.stepsY > self.stepsX) {
			self.initiated = false;
			return;
		}

		e.preventDefault();

		self.directionLocked = true;

		if (newX > 0 || newX < self.maxX) {
			newX = self.x + (deltaX / 2);
		}

		if (!self.thresholdExceeded && dist >= self.snapThreshold) {
			self.thresholdExceeded = true;
			console.log('__move: thresholdExceeded!  dist = ' + dist + ', threshold = ' + self.snapThreshold);
			self.__event('moveout');
		} else if (self.thresholdExceeded && dist < self.snapThreshold) {
			console.log('__move: thresholdExceeded!  dist = ' + dist + ', threshold = ' + self.snapThreshold);
			self.thresholdExceeded = false;
			self.__event('movein');
		} else {
			console.log('__move: threshold not exceeded.  dist = ' + dist + ', threshold = ' + self.snapThreshold);
		}

		// self.__pos(newX);
	};
	self.__end = function(e) {
		"use strict";
		console.log("__end: " + e);

		if (!self.initiated) return;
		
		var point = hasTouch ? e.changedTouches[0] : e,
			dist = Math.abs(point.pageX - self.startX);

		self.initiated = false;
		
		if (!self.moved) return;

		if (self.x > 0 || self.x < self.maxX) {
			dist = 0;
			console.log('__end: distance (' + self.x + ') was less than max (' + self.maxX + ')');
			self.__event('movein');
		}

		// Check if we exceeded the snap threshold
		if (dist < self.snapThreshold) {
			console.log('__end: distance (' + dist + ') was less than the snap threshold (' + self.snapThreshold + ')');
			self.slider.style[transitionDuration] = Math.floor(300 * dist / self.snapThreshold) + 'ms';
			// self.__pos(-self.page * self.pageWidth);
			return;
		}


		// self.__checkPosition();
	};
	self.__resize = function(e) {
		"use strict";
		console.log("__resize: " + e);
		
		self.snapThreshold = Math.round($(window).width() * 0.15);
	}

	self.__event = function (type) {
		"use strict";
		console.log('event fired: ' + type);

		var ev = document.createEvent("Event");
		ev.initEvent('swiper-' + type, true, true);
		w.trigger(ev);
	};

	if (hasTouch) {
		self.__resize();
		w.on(startEvent, eventHandler);
		w.on(moveEvent, eventHandler);
		w.on(endEvent, eventHandler);
		w.on(cancelEvent, eventHandler);
	}
};

var swiper = new Swiper();
(function() {
	"use strict";
	var pageOrder = ['official-events', 'my-events', 'amenities', 'decks'];

	var w = $(window);
	w.on('swiper-moveout', function() {
		"use strict";
		var direction = swiper.directionX,
			currentPage = pageNavigator.getCurrentPage(),
			newPage,
			pageIndex,
			newPageIndex;

		console.log('triggering page change, direction = ' + direction);
		pageIndex = $.inArray(currentPage, pageOrder);
		if (pageIndex != -1) {
			newPageIndex = pageIndex + -swiper.directionX;
			if (newPageIndex < 0 || newPageIndex >= pageOrder.length) {
				console.log('current page ' + currentPage + ' is the first or last page to display!');
			} else {
				console.log('transition from current page: ' + currentPage + ' (' + pageIndex + ') to new page: ' + pageOrder[newPageIndex] + ' (' + newPageIndex + ')');
				navigateTo(pageOrder[newPageIndex]);
			}
		} else {
			console.log('unhandled page: ' + currentPage);
		}
	});
})();
*/

console.log("app.js loaded");