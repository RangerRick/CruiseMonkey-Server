console.log("app.js loading");

var pages = {},
page_scroll_element = [],
online = false,
m_interval,
_header, _container;

var scrollManager = new ScrollManager();
scrollManager.delay = 100;

/*
scrollManager.onScrollStart = function(enabled) {
	if (enabled) {
		console.log('scrolling started while enabled');
	} else {
		console.log('scrolling started while disabled');
	}
};
*/

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

var templates = ['#header.html', '#events.html', '#login.html'],
	templateLoader  = new TemplateLoader(templates);

templateLoader.onFinished = function() {
	createLoginView();
	createOfficialEventsView();
	createMyEventsView();

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

	navigator.splashscreen.hide();
};

var pageTracker = new PageTracker(amplify, '.scrollable'),
pageNavigator   = new PageNavigator(amplify, pageTracker, 'official-events', '.calendar-event'),

setOffline = function() {
	console.log('setOffline()');
	if (online == true) {
		console.log("setOffline: we were online but have gone offline");
	}
	online = false;
	navModel.signedIn(false);
	console.log("online = " + online);
},

setOnline = function() {
	console.log('setOnline()');
	if (online == false) {
		console.log("setOnline: we were offline but have gone online");
	}
	online = true;
	navModel.signedIn(true);
	console.log("online = " + online);
},

isOnline = function() {
	return online;
},

isSignedIn = function() {
	return online && loginModel.username() && loginModel.username().length > 0;
},

setupHeader = function() {
	console.log('setupHeader()');
	header = pageTracker.getHeader();
	header.html(templateLoader.renderTemplate('#header.html'));
	
	var nav = $(header).find('nav')[0];

	$(nav).find('a').each(function(index, element) {
		var hash = undefined;
		if (element.href !== undefined) {
			hash = element.href.split('#')[1];
		}
		if (hash !== undefined && hash != "") {
			// $(element).off('click');
			$(element).on('click.fndtn touchstart.fndtn', function(e) {
				e.preventDefault();
				console.log("navigation event: " + hash);
				navigateTo(hash);
				if ($('.top-bar').hasClass('expanded')) $('.toggle-topbar').find('a').click();
			});
		}
	});

	$(document).foundationTopBar();

	$(nav).find('.signin').each(function(index, element) {
		$(element).on('click.fndtn touchstart.fndtn', function(e) {
			e.preventDefault();
			setOffline();
			navigateTo('login');
			if ($('.top-bar').hasClass('expanded')) $('.toggle-topbar').find('a').click();
		});
	});
	$(nav).find('.signout').each(function(index, element) {
		$(element).on('click.fndtn touchstart.fndtn', function(e) {
			e.preventDefault();
			setOffline();
			serverModel.username(null);
			serverModel.password(null);
			navigateTo('login');
			if ($('.top-bar').hasClass('expanded')) $('.toggle-topbar').find('a').click();
		});
	});

	ko.applyBindings(navModel, nav);
},

navigateTo = function(pageId) {
	console.log('----------------------------------------------------------------------------------');
	console.log('navigateTo(' + pageId + ')');
	scrollManager.disable();

	if (pageId == 'official-events') {
		showOfficialEventsView();
	} else if (pageId == 'my-events') {
		showMyEventsView();
	} else if (pageId == 'login') {
		showLoginView();
	} else {
		console.log('unknown page ID: ' + pageId);
		return false;
	}

	var topElement = pageTracker.getTopElement(pageId);

	if (!topElement || topElement.getIndex() == 0) {
		console.log('scrolling to the top of the page');
		setTimeout(function() {
			pageTracker.getElement('body').scrollTo(0, 0, {
				onAfter: function() {
					setTimeout(function() {
						scrollManager.enable();
					}, 50);
				}
			});
		}, 0);
	} else {
		console.log("scrolling to " + topElement.toString());
		setTimeout(function() {
			pageTracker.getElement('body').scrollTo('#' + topElement.getId(), 0,
				{
					margin:false,
					offset: {left:0, top:-45},
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
	
	if (!username || !password) {
		failure();
		return;
	}

	$.ajax({
		url: serverModel.cruisemonkey() + '/rest/auth',
		timeout: m_timeout,
		cache: false,
		dataType: 'json',
		type: 'GET',
		username: username,
		password: password,
		success: function(data) {
			if (data == true) {
				setOnline();
				console.log('test returned OK');
				success();
				return;
			} else {
				setOnline();
				console.log('success function called, but data was not OK!');
				failure();
				return;
			}
		}
	}).error(function(data) {
		if (data && data.readyState == 0) {
			setOffline();
		} else {
			setOnline();
		}
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
			navigateTo(current_page);
		},
		// failure
		function() {
			console.log("checkIfAuthorized: failure");
			navigateTo('login');
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
		var html = templateLoader.renderTemplate('#login.html');

		var div = document.createElement('div');
		div.setAttribute('id', 'login');
		$(div).css('display', 'none');
		$(div).html(html);
		$(div).find('#login_reset').on('click.fndtn touchstart.fndtn', function(e) {
			e.preventDefault();
			console.log("cancel clicked");
			serverModel.reset();
		});
		$(div).find('#login_save').on('click.fndtn touchstart.fndtn', function(e) {
			e.preventDefault();
			console.log("save clicked");
			serverModel.persist();
			showLoginOrCurrent();
			if (eventsModel) {
				eventsModel.updateDataFromJSON();
			}
		});
		var appended = pageTracker.getContainer()[0].appendChild(div);

		console.log("done creating loginView");
		pages.login = div;

		ko.applyBindings(serverModel, appended);
	}
},

showLoginView = function() {
	console.log('showLoginView()');
	createLoginView();
	var content = replaceCurrentPage('login');
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
	self.favorite     = ko.observable(false);
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
			username: serverModel.username(),
			password: serverModel.password()
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
	
	self.persist = function() {
		amplify.store('cruisemonkey_url', self.cruisemonkey());
		amplify.store('username',         self.username());
		amplify.store('password',         self.password());
	};
	
	if (!self.cruisemonkey()) {
		self.cruisemonkey(document.URL.host);
	}
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
			username: serverModel.username(),
			password: serverModel.password(),
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
officialEventsModel.filter.subscribe(onFilterChange, officialEventsModel);
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
myEventsModel.filter.subscribe(onFilterChange, myEventsModel);
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

var navModel = {
		signedIn: ko.observable(false)
};
navModel.notSignedIn = ko.dependentObservable(function() {
	var self = this;
	return ! self.signedIn();
}, navModel);

console.log("app.js loaded");