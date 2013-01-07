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