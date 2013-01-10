/**
 * @constructor
 * @param {Object=} data
 */
function CalendarEvent(data) {
	var self = this;

	self.id = ko.observable(data && data['@id'] ? data['@id'] : uuid.v1());
	self.cleanId = ko.computed(function() {
		return self.id().replace(self.attributeRegex, '');
	});
	self.summary = ko.observable(data && data.summary ? data.summary : "");
	self.description = ko.observable(data && data.description ? data.description : "");
	self.start = ko.observable(data && data.start ? new Date(data.start) : new Date());
	self.end = ko.observable(data && data.end ? new Date(data.end) : new Date());
	self.location = ko.observable(data && data.location ? data.location : "");
	self.createdBy = ko.observable(data && data['created-by'] ? data['created-by'] : "");
	self.owner = ko.observable(data && data.owner ? data.owner : "");
	self.isPublic = ko.observable(data && data.isPublic ? data.isPublic : false);
	self.timespan = ko.computed(function() {
		var start = self.start() === null ? null : cmUtils.formatTime(self.start(), false);
		var end = self.end() === null ? null : cmUtils.formatTime(self.end(), false);
		var retVal = '';
		if (start !== null) {
			retVal += start;
			if (end !== null) {
				retVal += '-' + end;
			}
		}
		return retVal;
	}, self);
	self.favorite = ko.observable(false);

	self.toString = ko.computed(function() {
		return self.id() + ': ' + self.summary();
	});
}
CalendarEvent.prototype.attributeRegex = /[\W\@]+/g;

/**
 * @constructor
 */
function AddEventModel() {
	var self = this,
		m_pattern = 'MM/dd/yyyy hh:mm';

	self.addedEvent = ko.observable(new CalendarEvent());

	self.startDate = ko.computed({
		read: function() {
			return self.addedEvent().start().toString(m_pattern);
		},
		write: function(value) {
			self.addedEvent().start(Date.parse(value));
		}
	});
	self.endDate = ko.computed({
		read: function() {
			return self.addedEvent().end().toString(m_pattern);
		},
		write: function(value) {
			self.addedEvent().end(Date.parse(value));
		}
	});
	self.onSubmit = function(formElement) {
		console.log('submitted:');
		console.log(formElement);
		console.log('start = ' + self.addedEvent().start());
		console.log('end = ' + self.addedEvent().end());
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
					if (item.start().getTime() != startDate.getTime()) { item.start(startDate); }
					if (item.end().getTime() != endDate.getTime()) { item.end(endDate); }
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
			if (event.owner() != serverModel.username() && event.isPublic()) {
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
