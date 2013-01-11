/**
 * @constructor
 * @param {Object=} data
 */
function CalendarEvent(data) {
	var self = this;

	// console.log('importing data: ' + ko.toJSON(data));

	self.id = ko.observable(data && data['@id'] ? data['@id'] : uuid.v1());
	self.cleanId = ko.computed(function() {
		return self.id().replace(self.attributeRegex, '');
	});
	self.summary = ko.observable(data && data.summary ? data.summary : "");
	self.description = ko.observable(data && data.description ? data.description : "");
	self.startDate = ko.observable(data && data.start ? new Date(data.start) : new Date());
	self.endDate = ko.observable(data && data.end ? new Date(data.end) : new Date());
	self.location = ko.observable(data && data.location ? data.location : "");
	self.createdBy = ko.observable(data && data['created-by'] ? data['created-by'] : "");
	self.owner = ko.observable(data && data.owner ? data.owner : "");
	self.isPublic = ko.observable(data && data.isPublic && data.isPublic == 'true' ? true : false);
	self.timespan = ko.computed(function() {
		var start = self.startDate() === null ? null : cmUtils.formatTime(self.startDate(), false);
		var end = self.endDate() === null ? null : cmUtils.formatTime(self.endDate(), false);
		var retVal = '';
		if (start !== null) {
			retVal += start;
			if (end !== null) {
				retVal += '-' + end;
			}
		}
		return retVal;
	}, self);
	self.isMine = ko.computed(function() {
		return self.createdBy() == serverModel.username();
	});
	self.favorite = ko.observable(data && data.favorite && data.favorite == 'true' ? true : false);
	self.toString = ko.computed(function() {
		return self.id() + ': ' + self.summary() + ' (' + self.isPublic() + ')';
	});
}
CalendarEvent.prototype.attributeRegex = /[\W\@]+/g;

/**
 * @constructor
 */
function AddEventModel() {
	var self = this,
		m_pattern = 'MM/dd/yyyy hh:mm';

	self.addedEvent = ko.observable();

	self.resetEvent = function() {
		var e = new CalendarEvent();
		self.addedEvent(e);
		e = null;
	};

	self.summary = ko.computed({
		read: function() {
			return self.addedEvent() ? self.addedEvent().summary() : "";
		},
		write: function(value) {
			if (self.addedEvent()) self.addedEvent().summary(value);
		}
	});
	self.description = ko.computed({
		read: function() {
			return self.addedEvent() ? self.addedEvent().description() : "";
		},
		write: function(value) {
			if (self.addedEvent()) self.addedEvent().description(value);
		}
	});
	self.startDate = ko.computed({
		read: function() {
			return self.addedEvent() ? self.addedEvent().startDate().toString(m_pattern) : "";
		},
		write: function(value) {
			if (self.addedEvent()) self.addedEvent().startDate(Date.parse(value));
		}
	});
	self.endDate = ko.computed({
		read: function() {
			return self.addedEvent() ? self.addedEvent().endDate().toString(m_pattern) : "";
		},
		write: function(value) {
			if (self.addedEvent()) self.addedEvent().endDate(Date.parse(value));
		}
	});
	self.location = ko.computed({
		read: function() {
			return self.addedEvent() ? self.addedEvent().location() : "";
		},
		write: function(value) {
			if (self.addedEvent()) self.addedEvent().location(value);
		}
	});
	self.isPublic = ko.computed({
		read: function() {
			return self.addedEvent() ? self.addedEvent().isPublic() : "";
		},
		write: function(value) {
			if (self.addedEvent()) self.addedEvent().isPublic(value);
		}
	});
	self.createdBy = ko.computed({
		read: function() {
			return self.addedEvent() ? self.addedEvent().createdBy() : "";
		},
		write: function(value) {
			if (self.addedEvent()) self.addedEvent().createdBy(value);
		}
	});
	self.owner = ko.computed({
		read: function() {
			return self.addedEvent() ? self.addedEvent().owner() : "";
		},
		write: function(value) {
			if (self.addedEvent()) self.addedEvent().owner(value);
		}
	});
	self.onSubmit = function(formElement) {
		if (self.addedEvent()) {
			var postme = ko.toJS(self.addedEvent());
			postme.start = postme.startDate;
			postme.end = postme.endDate;
			delete postme.cleanId;
			delete postme.timespan;
			delete postme.startDate;
			delete postme.endDate;
			delete postme.toString;
			delete postme.createdBy;
			delete postme.owner;
			delete postme.attributeRegex;
			console.log('POSTing JSON: ' + ko.toJSON(postme, null, 2));
			$.ajax({
				url: serverModel.eventEditUrl(),
				timeout: m_timeout,
				type: 'POST',
				data: ko.toJSON(postme),
				dataType: 'json',
				contentType:"application/json; charset=utf-8",
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
				console.log('success!');
				self.createdBy(serverModel.username());
				self.owner(serverModel.username());
				eventsModel.events.push(self.addedEvent());
				$('#add-event').trigger('reveal:close');
			}).fail(function _error(jqXHR, textStatus, errorThrown) {
				console.log('AjaxUpdater::f_updateEventModel(): An error occurred while adding a new event: ' + ko.toJSON(jqXHR));
				console.log('textStatus = ' + textStatus + ', errorThrown = ' + errorThrown);
			});
		} else {
			console.log('wtf?!? no event?!');
		}
	};
}

/**
 * @constructor
 */
function EventsViewModel() {
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
				return favorite['@event'];
			});
		}
		if (allData.events && allData.events.event) {
			if (allData.events.event instanceof Array) {
				dataEvents = allData.events.event;
			} else {
				dataEvents.push(allData.events.event);
			}
			console.log('EventsViewModel::updateData(): parsing ' + dataEvents.length + ' events');
			var startDate,
				endDate,
				createdBy,
				e,
				mappedTasks = $.map(dataEvents, function(event) {
				'use strict';

				var isFavorite, item;
				if (event.favorite !== undefined) {
					isFavorite = event.favorite;
				} else {
					isFavorite = (favorites.indexOf(event['@id']) != -1);
				}
				// console.log("loading event: " + event['@id'] + ' (favorite = ' + isFavorite + ')');
				item = ko.utils.arrayFirst(self.events(), function(entry) {
					'use strict';

					if (entry) {
						if (entry.id() == event['@id']) {
							return true;
						} else {
							return false;
						}
					} else {
						console.log('no entry');
					}
				});
				if (item) {
					startDate = new Date(event.start);
					endDate = new Date(event.end);
					createdBy = event['created-by'];

					if (item.favorite() != isFavorite) { item.favorite(isFavorite); }
					if (item.summary() != event.summary) { item.summary(event.summary); }
					if (item.description() != event.description) { item.description(event.description); }
					if (item.startDate().getTime() != startDate.getTime()) { item.startDate(startDate); }
					if (item.endDate().getTime() != endDate.getTime()) { item.endDate(endDate); }
					if (item.createdBy() != createdBy) { item.createdBy(createdBy); }
					if (item.owner() != event.owner) { item.owner(event.owner); }
					return item;
				} else {
					e = new CalendarEvent(event);
					e.favorite(isFavorite);

					return e;
				}
			});
			self.events(mappedTasks);
			amplify.store('events', allData);
		} else {
			console.log('no proper event data found');
		}
		// console.log("saving ReST events");
		self.updating(false);
	};
	
	self.toggleFavorite = function _toggleFavorite(entry) {
		'use strict';

		if (eventsModel.updating()) {
			console.log('EventsViewModel::toggleFavorite: skipping ajax update for ' + entry.id() + ', we are in the middle of a server update');
			return false;
		}

		console.log('EventsViewModel::toggleFavorite: ' + entry.id() + ' favorite has changed to: ' + entry.favorite());
		$.ajax({
			url: serverModel.favoritesUrl() + '?event=' + encodeURI(entry.id()),
			timeout: m_timeout,
			cache: false,
			dataType: 'json',
			type: entry.favorite() ? 'PUT' : 'DELETE',
			statusCode: {
				200: function two_hundred() {
					console.log('EventsViewModel::toggleFavorite: 200 OK');
				},
				401: function four_oh_one() {
					console.log('EventsViewModel::toggleFavorite: 401 not authorized');
					navModel.authorized(false);
					serverModel.password(null);
					$('#login').reveal();
				}
			},
			beforeSend: function beforeSend(xhr) {
				serverModel.setBasicAuth(xhr);
			}
		}).fail(function _fail(jqXHR, textStatus, errorThrown) {
			'use strict';
			console.log('EventsViewModel::toggleFavorite: An error occurred: ' + ko.toJSON(jqXHR, null, 2));
			console.log('EventsViewModel::toggleFavorite: textStatus = ' + textStatus + ', errorThrown = ' + errorThrown);
		});
		return true;
	};
	self.togglePublic = function _togglePublic(entry) {
		'use strict';

		if (eventsModel.updating()) {
			console.log('EventsViewModel::togglePublic: skipping ajax update for ' + entry.id() + ', we are in the middle of a server update');
			return false;
		}

		console.log('EventsViewModel::togglePublic: ' + entry.id() + ' isPublic has changed to: ' + entry.isPublic());
		$.ajax({
			url: serverModel.eventEditUrl() + '/' + encodeURI(entry.id()) + '?isPublic=' + entry.isPublic(),
			timeout: m_timeout,
			cache: false,
			dataType: 'json',
			type: 'PUT',
			statusCode: {
				200: function two_hundred() {
					console.log('EventsViewModel::togglePublic: 200 OK');
				},
				401: function four_oh_one() {
					console.log('EventsViewModel::togglePublic: 401 not authorized');
					navModel.authorized(false);
					serverModel.password(null);
					$('#login').reveal();
				}
			},
			beforeSend: function beforeSend(xhr) {
				serverModel.setBasicAuth(xhr);
			}
		}).fail(function _fail(jqXHR, textStatus, errorThrown) {
			'use strict';
			console.log('EventsViewModel::togglePublic: An error occurred: ' + ko.toJSON(jqXHR, null, 2));
			console.log('EventsViewModel::togglePublic: textStatus = ' + textStatus + ', errorThrown = ' + errorThrown);
		});
		return true;
	};
	self.deleteEvent = function _deleteEvent(entry) {
		'use strict';

		console.log('EventsViewModel::deleteEvent: ' + entry.id());
		$.ajax({
			url: serverModel.eventEditUrl() + '/' + encodeURI(entry.id()),
			timeout: m_timeout,
			cache: false,
			dataType: 'json',
			type: 'DELETE',
			statusCode: {
				200: function two_hundred() {
					console.log('EventsViewModel::deleteEvent: 200 OK');
				},
				401: function four_oh_one() {
					console.log('EventsViewModel::deleteEvent: 401 not authorized');
					navModel.authorized(false);
					serverModel.password(null);
					$('#login').reveal();
				}
			},
			beforeSend: function beforeSend(xhr) {
				serverModel.setBasicAuth(xhr);
			}
		}).done(function _done() {
			console.log('EventsViewModel::deleteEvent: finished, removing from view');
			self.events.remove(entry);
		}).fail(function _fail(jqXHR, textStatus, errorThrown) {
			'use strict';
			console.log('EventsViewModel::deleteEvent: An error occurred: ' + ko.toJSON(jqXHR, null, 2));
			console.log('EventsViewModel::deleteEvent: textStatus = ' + textStatus + ', errorThrown = ' + errorThrown);
		});
		return true;
	};
}

/** used for filter/searching, match an event based on a filter **/
var matchEventText = function _matchEventText(event, filter) {
	'use strict';

	if (event.summary().toLowerCase().search(filter) != -1) {
		return true;
	} else if (event.description().toLowerCase().search(filter) != -1) {
		return true;
	} else {
		return false;
	}
};

/**
 * @constructor
 */
function OfficialEventsViewModel(parentModel) {
	var self = this;

	$.extend(self, parentModel);
	self.filter = ko.observable('');

	self.filteredEvents = ko.dependentObservable(function _filteredEvents() {
		var filter = self.filter().toLowerCase(),

		matchesGroup = ko.utils.arrayFilter(self.events(), function _eventsFilter(event) {
			if (event === undefined) {
				return false;
			}
			if (event.owner() == 'google') {
				return true;
			}
			return false;
		});

		if (!filter) {
			return matchesGroup;
		} else {
			return ko.utils.arrayFilter(matchesGroup, function _matchesGroupFilter(event) {
				return matchEventText(event, filter);
			});
		}
	});
}

/**
 * @constructor
 */
function MyEventsViewModel(parentModel) {
	var self = this;
	$.extend(self, parentModel);
	self.filter = ko.observable('');

	self.filteredEvents = ko.dependentObservable(function _filteredEvents() {
		var filter = self.filter().toLowerCase(),

		matchesGroup = ko.utils.arrayFilter(self.events(), function _eventsFilter(event) {
			if (event.favorite()) return true;
			if (event.owner() == serverModel.username()) return true;
			return false;
		});

		if (!filter) {
			return matchesGroup;
		} else {
			return ko.utils.arrayFilter(matchesGroup, function _matchesGroupFilter(event) {
				return matchEventText(event, filter);
			});
		}
	});
}

/**
 * @constructor
 */
function PublicEventsViewModel(parentModel) {
	var self = this;
	$.extend(self, parentModel);
	self.filter = ko.observable('');

	self.filteredEvents = ko.dependentObservable(function _filteredEvents() {
		var filter = self.filter().toLowerCase(),

		matchesGroup = ko.utils.arrayFilter(self.events(), function _eventsFilter(event) {
			if (event.owner() != 'google' && event.owner() != serverModel.username() && event.isPublic()) {
				return true;
			}
			return false;
		});

		if (!filter) {
			return matchesGroup;
		} else {
			return ko.utils.arrayFilter(matchesGroup, function _matchesGroupFilter(event) {
				return matchEventText(event, filter);
			});
		}
	});
}
