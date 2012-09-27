console.log("app.js loading");
/*
ko.bindingHandlers.dateString = {
	update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
		var value = valueAccessor(),
			allBindings = allBindingsAccessor();
		var valueUnwrapped = ko.utils.unwrapObservable(value);
		var pattern = allBindings.datePattern || 'MM/dd/yyyy hh:mm:ss';
		$(element).text(valueUnwrapped.toString(pattern));
	}
}
*/

function removeLastMatch(string, match) {
	var n = string.lastIndexOf(match);
	if (n >= 0 && (n + match.length) == string.length) {
		// console.log("removeLastMatch: " + string + " matches " + match);
		return string.substring(0, n);
	} else {
		// console.log("removeLastMatch: " + string + " does not match " + match);
		return string;
	}
}

function Event(data) {
	var self = this;

	// data.summary = removeLastMatch(data.summary, ' - ' + data.location);

	self.id           = ko.observable(data["@id"]);
	self.summary      = ko.observable(data.summary);
	self.description  = ko.observable(data.description);
	self.start        = ko.observable(new Date(data.start));
	self.end          = ko.observable(new Date(data.end));
	self.location     = ko.observable(data.location);
	self.createdBy    = ko.observable(data["created-by"]);
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
}

var entryIdMatch = function(entry, id) {
	return entry.id === id;
}

function EventsViewModel() {
	var self = this;
	self.events = ko.observableArray();
	self.group  = ko.observable("official");
	self.filter = ko.observable("");

	self.updateDataFromJSON = function() {
		$.getJSON("rest/events", function(allData) {
			var mappedTasks = $.map(allData.event, function(event) {
				var item = ko.utils.arrayFirst(self.events(), function(entry) {
					if (entry) {
						// console.log("entry = " + ko.toJSON(entry));
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
					console.log("reusing " + ko.toJSON(item));
					var startDate = new Date(event.start);
					var endDate	= new Date(event.end);
					var createdBy = event["created-by"];

					if (item.summary()         != event.summary)       { item.summary(event.summary); }
					if (item.description()     != event.description)   { item.description(event.description); }
					if (item.start().getTime() != startDate.getTime()) { item.start(startDate); }
					if (item.end().getTime()   != endDate.getTime())   { item.end(endDate); }
					if (item.createdBy()       != createdBy)           { item.createdBy(createdBy); }
					return item;
				} else {
					return new Event(event);
				}
			});
			self.events(mappedTasks);
		});	 
	};

	self.updateDataFromJSON();
}

var eventsModel = new EventsViewModel();

eventsModel.filteredEvents = ko.dependentObservable(function() {
	var filter = this.filter().toLowerCase();
	
	if (!filter) {
		return this.events();
	} else {
		return ko.utils.arrayFilter(this.events(), function(event) {
			if (event.summary().toLowerCase().search(filter) != -1) {
				return true;
			} else if (event.description().toLowerCase().search(filter) != -1) {
				return true;
			} else {
				return false;
			}
		});
	}
}, eventsModel);

console.log("app.js loaded");