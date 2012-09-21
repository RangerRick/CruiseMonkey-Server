ko.bindingHandlers.dateString = {
	update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
		var value = valueAccessor(),
			allBindings = allBindingsAccessor();
		var valueUnwrapped = ko.utils.unwrapObservable(value);
		var pattern = allBindings.datePattern || 'MM/dd/yyyy hh:mm:ss';
		$(element).text(valueUnwrapped.toString(pattern));
	}
}

function Event(data) {
	var self = this;
	self.id = data.id;
	self.summary = ko.observable(data.summary);
	self.description = ko.observable(data.description);
	self.start = ko.observable(new Date(data.startDate));
	self.end = ko.observable(new Date(data.endDate));
	self.createdBy = ko.observable(data.createdBy);
}

function EventsViewModel() {
	var self = this;
	self.events = ko.observableArray();
	
    $.getJSON("/events.json", function(allData) {
        var mappedTasks = $.map(allData.eventList, function(event) {
        	return new Event(event);
        });
        self.events(mappedTasks);
    });    
}

var eventsModel = new EventsViewModel();
ko.applyBindings(eventsModel);
