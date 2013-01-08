/** represents a calendar event **/
function Event(data) {
	var self = this;

	self.id           = ko.observable(data["@id"]);
	self.cleanId      = ko.observable(data["@id"].replace(self.attributeRegex, ''));
	self.summary      = ko.observable(data.summary);
	self.description  = ko.observable(data.description);
	self.start        = ko.observable(new Date(data.start));
	self.end          = ko.observable(new Date(data.end));
	self.location     = ko.observable(data.location);
	self.createdBy    = ko.observable(data["created-by"]);
	self.owner        = ko.observable(data.owner);
	self.isPublic     = ko.observable(data.isPublic);
	self.timespan     = ko.computed(function() {
		var start = start === null? null : CMUtils.formatTime(self.start(), false);
		var end	= end	=== null? null : CMUtils.formatTime(self.end(), false);
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
}
Event.prototype.attributeRegex = /[\W\@]+/g;

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
			var startDate,
				endDate,
				createdBy,
				e,
				mappedTasks = $.map(dataEvents, function(event) {
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
					startDate = new Date(event.start);
					endDate	= new Date(event.end);
					createdBy = event["created-by"];

					if (item.favorite()        != isFavorite)          { item.favorite(isFavorite); }
					if (item.summary()         != event.summary)       { item.summary(event.summary); }
					if (item.description()     != event.description)   { item.description(event.description); }
					if (item.start().getTime() != startDate.getTime()) { item.start(startDate); }
					if (item.end().getTime()   != endDate.getTime())   { item.end(endDate); }
					if (item.createdBy()       != createdBy)           { item.createdBy(createdBy); }
					if (item.owner()           != event.owner)         { item.owner(event.owner); }
					return item;
				} else {
					e = new Event(event);
					e.favorite(isFavorite);
					/*
					e.favorite.subscribe(function(isFavorite) {
						"use strict";

						if (self.updating()) {
							// console.log("skipping ajax update for " + e.id() + ", we are in the middle of a server update");
							return;
						}
						console.log(e.id() + " favorite has changed to: " + isFavorite);
						var type = "PUT";
						if (isFavorite) {
							type = 'PUT';
						} else {
							type = 'DELETE';
						}
						$.ajax({
							url: serverModel.favoritesUrl(e.id()),
							timeout: m_timeout,
							cache: false,
							dataType: 'json',
							type: type,
							statusCode: statusCode,
							beforeSend: beforeSend
						});
					});
					*/

					return e;
				}
			});
			self.events(mappedTasks);
			amplify.store("events", allData);
		} else {
			console.log("no proper event data found");
		}
		// console.log("saving ReST events");
		self.updating(false);
	};
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

function OfficialEventsViewModel(parentModel) {
	var self = this;

	$.extend(self, parentModel);
	self.filter = ko.observable("");

	self.filteredEvents = ko.dependentObservable(function() {
		var username = serverModel.username(),
			filter = self.filter().toLowerCase(),

		matchesGroup = ko.utils.arrayFilter(self.events(), function(event) {
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
			return ko.utils.arrayFilter(matchesGroup, function(event) {
				return matchEventText(event, filter);
			});
		}
	});
}

function MyEventsViewModel(parentModel) {
	var self = this;
	$.extend(self, parentModel);
	self.filter = ko.observable("");
	
	self.filteredEvents = ko.dependentObservable(function() {
		var filter = self.filter().toLowerCase(),
			username = serverModel.username(),

		matchesGroup = ko.utils.arrayFilter(self.events(), function(event) {
			if (event.favorite()) return true;
			if (event.owner() == username) return true;
			return false;
		});

		if (!filter) {
			return matchesGroup;
		} else {
			return ko.utils.arrayFilter(matchesGroup, function(event) {
				return matchEventText(event, filter);
			});
		}
	});
}

function PublicEventsViewModel(parentModel) {
	var self = this;
	$.extend(self, parentModel);
	self.filter = ko.observable("");
	
	self.filteredEvents = ko.dependentObservable(function() {
		var filter = self.filter().toLowerCase(),
			username = serverModel.username(),

		matchesGroup = ko.utils.arrayFilter(self.events(), function(event) {
			if (event.owner() != username && event.isPublic()) {
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
	});
}
