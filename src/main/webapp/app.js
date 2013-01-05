console.log("app.js loading");

function openLink(url) {
	if (window.plugins && window.plugins.childBrowser) {
		console.log('openLink(' + url + '): using ChildBrowser plugin');
		window.plugins.childBrowser.openExternal(url);
	} else {
		console.log('openLink(' + url + '): using window.open()');
		window.open(url, '_blank');
	}
}

var m_interval,
_header,
_container,
scrollManager,
templateLoader,
pages               = {},
page_scroll_element = [],
templates           = templates = ['#header.html', '#events.html', '#amenities.html', '#decks.html'],
pageTracker         = new PageTracker(amplify, '.scrollable'),
pageNavigator       = new PageNavigator(amplify, pageTracker, 'official-events', '.scrollable'),
templateLoader      = new TemplateLoader(templates, m_timeout);

templateLoader.onFinished = function() {
	scrollManager = new ScrollManager('#content');
	scrollManager.delay = 100;

	scrollManager.onScrollStop = function(enabled) {
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

	if (typeof(Storage) !== "undefined") {
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
	}
};

var setupHeader = function() {
	console.log('setupHeader()');
	header = pageTracker.getHeader();
	header.html(templateLoader.renderTemplate('#header.html'));

	var nav = $(header).find('nav')[0];

	$(nav).find('a').each(function(index, element) {
		var hash = undefined,
			href = undefined;
		if (element.href !== undefined) {
			if (element.href.indexOf('#') == 0) {
				hash = element.href.split('#')[1];
			} else {
				href = element.href;
			}
		}
		if (hash !== undefined && hash != "") {
			// $(element).off('click');
			$(element).on('click.fndtn touchstart.fndtn', function(e) {
				e.preventDefault();
				console.log("navigation event: " + hash);
				navigateTo(hash);
				if ($('.top-bar').hasClass('expanded')) $('.toggle-topbar').find('a').click();
			});
		} else if (href !== undefined && href != "") {
			$(element).on('click.fndtn touchstart.fndtn', function(e) {
				e.preventDefault();
				openLink(href);
			});
		}
	});

	$(document).foundationTopBar();

	$(nav).find('.signin').each(function(index, element) {
		$(element).on('click.fndtn touchstart.fndtn', function(e) {
			e.preventDefault();
			console.log('signin clicked');
			if ($('.top-bar').hasClass('expanded')) $('.top-bar').removeClass('expanded');
			$('#login').reveal();
		});
	});
	$(nav).find('.signout').each(function(index, element) {
		$(element).on('click.fndtn touchstart.fndtn', function(e) {
			e.preventDefault();
			console.log('signout clicked');
			if ($('.top-bar').hasClass('expanded')) $('.top-bar').removeClass('expanded');
			navModel.logOut();
			$('#login').reveal();
		});
	});

	ko.applyBindings(navModel, nav);
},

navigateTo = function(pageId) {
	console.log('----------------------------------------------------------------------------------');
	console.log('navigateTo(' + pageId + ')');
	scrollManager.disable();

	switch(pageId) {
		case 'official-events': showOfficialEventsView(); break;
		case 'my-events':       showMyEventsView(); break;
		case 'amenities':       showAmenitiesView(); break;
		case 'decks':           showDecksView(); break;
		// case 'login':           showLoginView(); break;
		case '':                break;
		default:
			console.log('unknown page ID: ' + pageId);
			return false;
	}

	var topElement = pageTracker.getTopElement(pageId);

	if (!topElement || topElement.getIndex() == 0) {
		// console.log('scrolling to the top of the page');
		setTimeout(function() {
			pageTracker.getElement('#content').scrollTo(0, 0, {
				onAfter: function() {
					setTimeout(function() {
						scrollManager.enable();
					}, 50);
				}
			});
		}, 0);
	} else {
		// console.log("scrolling to " + topElement.toString());
		setTimeout(function() {
			pageTracker.getElement('#content').scrollTo('#' + topElement.getId(), 0,
				{
					margin: false,
					offset: {left:0, top:0},
					onAfter: function() {
						setTimeout(function() {
							scrollManager.enable();
						}, 50);
					}
				}
			);
		}, 0);
	}

	return true;
},

checkIfAuthorized = function(success, failure) {
	console.log('checkIfAuthorized()');
	var username = serverModel.username();
	var password = serverModel.password();

	if (!username || username == null || !password || password == null) {
		failure();
		return;
	}

	$.ajax({
		url: serverModel.cruisemonkey() + '/rest/auth',
		timeout: m_timeout,
		cache: false,
		dataType: 'json',
		type: 'GET',
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Authorization", "Basic " + window.btoa(username + ":" + password));
		},
		success: function(data) {
			if (data == true) {
				navModel.authorized(true);
				console.log('test returned OK');
				success();
				return;
			} else {
				navModel.authorized(false);
				console.log('success function called, but data was not OK!  ' + ko.toJSON(data, null, 2));
				failure();
				return;
			}
		}
	}).error(function(data) {
		navModel.authorized(false);
		console.log("An error occurred: " + ko.toJSON(data, null, 2));
		failure();
	});
},

showLoginOrCurrent = function() {
	var current_page = pageNavigator.getCurrentPage();

	checkIfAuthorized(
		// success
		function() {
			console.log("checkIfAuthorized: success");
			$('#login').trigger('reveal:close');
			navigateTo(current_page);
		},
		// failure
		function() {
			console.log("checkIfAuthorized: failure");
			$('#login').reveal();
		}
	);
},

setupDefaultView = function() {

	console.log('setupDefaultView()');
	setupHeader();

	m_interval = setInterval(function() {
		if (eventsModel) {
			eventsModel.updateDataFromJSON();
		}
	}, 60000);

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

replaceCurrentPage = function(pageId) {
	console.log('replaceCurrentPage(' + pageId + ')');

	var page = pageTracker.getElement('#' + pageId);
	var search = page.find('input[type=search]').first();

	pageTracker.getContainer().children().css('display', 'none');
	page.css('display', 'block');

	if (!Modernizr.touch) {
		// on non-mobile devices, focus the search input
		if (search) {
			search.focus();
		}
	}
	if (pageId != 'login') {
		amplify.store('current_page', pageId);
	}
	return pageTracker.getContainer()[0];
},

createOfficialEventsView = function() {
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

showOfficialEventsView = function() {
	console.log('showOfficialEventsView()');
	createOfficialEventsView();
	var content = replaceCurrentPage('official-events');
	$(content).find('ul.event-list').css('display', 'block');
},

createMyEventsView = function() {
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

showMyEventsView = function() {
	console.log('showMyEventsView()');
	createMyEventsView();
	var content = replaceCurrentPage('my-events');
	$(content).find('ul.event-list').css('display', 'block');
},

createLoginView = function() {
	console.log('createLoginView()');
	if (!pages.login) {
		var div = $('#login')[0];

		/*
		var html = templateLoader.renderTemplate('#login.html');

		var div = document.createElement('div');
		div.setAttribute('id', 'login');
		$(div).css('display', 'none');
		$(div).html(html);
		*/

		$(div).find('#login_reset').on('click.fndtn touchstart.fndtn', function(e) {
			e.stopPropagation();
			console.log("cancel clicked");
			serverModel.reset();
		});

		var save_button = $(div).find('#login_save');

		save_button.on('click.fndtn touchstart.fndtn', function(e) {
			console.log("save clicked");
			setTimeout(function() {
				serverModel.persist();
				showLoginOrCurrent();
				if (eventsModel) {
					eventsModel.updateDataFromJSON();
				} else {
					console.log('no eventsModel found');
				}
			}, 0);
		});

		// enter doesn't submit for some reason, so handle it manually
		$(div).find('input').keydown(function(e) {
			var keyCode = e.keyCode || e.which;
			if (keyCode == 13) save_button.click();
		});
		
		$(div).find('a').each(function(index, element) {
			var href = element.getAttribute('href');
			console.log('a = ' + $(element).html() + ', href = ' + href);
			if (href != undefined && href != "") {
				element.click(function(e) {
					openUrl(href);
					e.preventDefault();
				});
			}
		});

		/*
		var appended = pageTracker.getContainer()[0].appendChild(div);
		*/

		console.log('done creating loginView');
		pages.login = div;

		ko.applyBindings(serverModel, div);
	}
},

showLoginView = function() {
	console.log('showLoginView()');
	createLoginView();
	$('#login').reveal();
};

var createAmenitiesView = function() {
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

var showAmenitiesView = function() {
	console.log('showAmenitiesView()');
	createAmenitiesView();
	var content = replaceCurrentPage('amenities');
};

(function($) {
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

var m_decksInitialized = false,
showDecksView = function() {
	console.log('showDecksView()');
	createDecksView();
	var content = replaceCurrentPage('decks');

	/*
	if (!m_decksInitialized) {
		console.log("first time initialization of decks view");
		// First time, the indicator needs a character
		var fixedNav = $("#deck-list-nav-indicator-fixed");

		var decks = decksModel.decks();
		fixedNav.append(decks[0].number());

		var changeToDeck = function(deck) {
			fixedNav.replaceWith('<div class="deck-list-nav-indicator">Deck ' + deck + '</div>');
		};

		var deck, element;
		scrollManager.onScroll = function() {
			console.log('deck scrolling');

			for (var i = 0; i < decks.length; i++) {
				deck = decks[i];
				element = $('#' + deck.id() + '-image')[0];
				console.log('element = ' + element);
				if (CMUtils.isElementVisible(element)) {
					console.log('deck ' + deck.number() + ' is in viewport');
				}
			}
		}
		m_decksInitialized = true;
	}
	*/
};

var eventsModel;

/** filter dates in Knockout data-bind **/
ko.bindingHandlers.dateString = {
	update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
		var value = valueAccessor(),
			allBindings = allBindingsAccessor();
		var valueUnwrapped = ko.utils.unwrapObservable(value);
		var pattern = allBindings.datePattern || 'MM/dd/yyyy hh:mm:ss';
		$(element).text(valueUnwrapped.toString(pattern));
	}
}

/** represents a calendar event **/
function Event(data) {
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
		if (start != null) {
			retVal += start;
			if (end != null) {
				retVal += "-" + end;
			}
		}
		return retVal;
	}, self);
	self.favorite = ko.observable(false);
	self.favorite.subscribe(function(isFavorite) {
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
			url: serverModel.cruisemonkey() + '/rest/favorites?event=' + encodeURI(self.id()),
			timeout: m_timeout,
			cache: false,
			dataType: 'json',
			type: type,
			beforeSend: function(xhr) {
				xhr.setRequestHeader("Authorization", "Basic " + window.btoa(serverModel.username() + ":" + serverModel.password()));
			}
		});
	});
}

/** used for filter/searching, match an event based on a filter **/
var matchEventText = function(event, filter) {
	if (event.summary().toLowerCase().search(filter) != -1) {
		return true;
	} else if (event.description().toLowerCase().search(filter) != -1) {
		return true;
	} else {
		return false;
	}
}

/** Wait to make sure no other changes have happened,
  * then perform the mildly expensive check to see what
  * the latest visible element is.
  **/
var onFilterChange = function() {
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
	var self = this;

	self.cruisemonkey = ko.observable(amplify.store('cruisemonkey_url'));
	self.username     = ko.observable(amplify.store('username'));
	self.password     = ko.observable(amplify.store('password'));
	
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
	var self = this;
	self.events = ko.observableArray();
	self.updating = ko.observable(false);

	self.updateData = function(allData) {
		self.updating(true);
		var favorites = [], dataFavorites = [], dataEvents = [];
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
			var mappedTasks = $.map(dataEvents, function(event) {
				var isFavorite, item;
				if (event.favorite !== undefined) {
					isFavorite = event.favorite;
				} else {
					isFavorite = (favorites.indexOf(event["@id"]) != -1);
				}
				// console.log("loading event: " + event['@id'] + ' (favorite = ' + isFavorite + ')');
				item = ko.utils.arrayFirst(self.events(), function(entry) {
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
		}
		// console.log("saving ReST events");
		amplify.store("events", ko.toJSON({
			events: {
				event: self.events()
			}
		}, null, 2));
		self.updating(false);
	}
	
	self.updateDataFromJSON = function() {
		$.ajax({
			url: serverModel.cruisemonkey() + '/rest/cruisemonkey/events',
			timeout: m_timeout,
			cache: false,
			dataType: 'json',
			beforeSend: function(xhr) {
				xhr.setRequestHeader("Authorization", "Basic " + window.btoa(serverModel.username() + ":" + serverModel.password()));
			},
			success: self.updateData
		});
	};

	self.updateDataFromJSON();
}

eventsModel = new EventsViewModel();

function OfficialEventsModel() {
	var self   = this;

	self.filter = ko.observable("");
	self.events = eventsModel.events;
}
var officialEventsModel = new OfficialEventsModel();
// officialEventsModel.filter.subscribe(onFilterChange, officialEventsModel);
officialEventsModel.filteredEvents = ko.dependentObservable(function() {
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
	var self = this,

	f_hasUsername = ko.computed(function() {
		return serverModel.username() != null
			&& serverModel.username() != undefined
			&& serverModel.username().length > 0;
	}),

	f_hasPassword = ko.computed(function() {
		return serverModel.password() != null
			&& serverModel.password() != undefined
			&& serverModel.password().length > 0;
	});

	self.showSignOut = ko.computed(function() {
		return f_hasUsername() && f_hasPassword();
	});

	self.showSignIn = ko.computed(function() {
		return !self.showSignOut();
	});

	self.online = function() {
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

	self.logOut = function() {
		serverModel.password(null);
		serverModel.persist();
	};
}

var navModel = new NavModel();

/*
function Swiper() {
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
		console.log("__resize: " + e);
		
		self.snapThreshold = Math.round($(window).width() * 0.15);
	}

	self.__event = function (type) {
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
	var pageOrder = ['official-events', 'my-events', 'amenities', 'decks'];

	var w = $(window);
	w.on('swiper-moveout', function() {
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