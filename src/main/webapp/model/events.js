/**
 * @constructor
 * @param {Object=} data
 */
function CalendarEvent() {
	var self = this;

	// console.log('importing data: ' + ko.toJSON(data));
	self.id = ko.observable(uuid.v1());
	self.cleanId = function() {
		return self.id().replace(self.attributeRegex, '');
	};
	self.summary = ko.observable();
	self.description = ko.observable();
	self.startDate = ko.observable(new Date());
	self.endDate = ko.observable(new Date());
	self.location = ko.observable();
	self.createdBy = ko.observable();
	self.isPublic = ko.observable();
	self.favorite = ko.observable();
	self.lastUpdated = new Date().getTime();

	self.timespan = function _timespan() {
		var start = (self.startDate() === null || self.startDate() === undefined) ? null : cmUtils.formatTime(self.startDate(), false);
		var end = (self.endDate() === null || self.endDate() === undefined) ? null : cmUtils.formatTime(self.endDate(), false);
		var retVal = '';
		if (start !== null) {
			retVal += start;
			if (end !== null) {
				retVal += '-' + end;
			}
		}
		return retVal;
	};
	self.isMine = function _isMine() {
		return self.createdBy() == app.server.serverModel.username();
	};
	self.toString = function _toString() {
		return self.id() + ': ' + self.summary() + ' (' + self.isPublic() + ')';
	};
	
	self.updateUsing = function(d) {
		if (d.hasOwnProperty('id')          && (self.id()                  != d.id))                  { self.id(d.id);                   }; d.id = null;
		if (d.hasOwnProperty('summary')     && (self.summary()             != d.summary))             { self.summary(d.summary);         }; d.summary = null;
		if (d.hasOwnProperty('description') && (self.description()         != d.description))         { self.description(d.description); }; d.description = null;
		if (d.hasOwnProperty('startDate')   && (self.startDate().getTime() != d.startDate.getTime())) { self.startDate(d.startDate);     }; d.startDate = null;
		if (d.hasOwnProperty('endDate')     && (self.endDate().getTime()   != d.endDate.getTime()))   { self.endDate(d.endDate);         }; d.endDate = null;
		if (d.hasOwnProperty('location')    && (self.location()            != d.location))            { self.location(d.location);       }; d.location = null;
		if (d.hasOwnProperty('createdBy')   && (self.createdBy()           != d.createdBy))           { self.createdBy(d.createdBy);     }; d.createdBy = null;
		if (d.hasOwnProperty('isPublic')    && (self.isPublic()            != d.isPublic))            { self.isPublic(d.isPublic);       }; d.isPublic = null;
		if (d.hasOwnProperty('isFavorite')  && (self.favorite()            != d.isFavorite))          { self.favorite(d.isFavorite);     }; d.isFavorite = null;
		if (d.hasOwnProperty('lastUpdated') && (self.lastUpdated            < d.lastUpdated))        { self.lastUpdated = d.lastUpdated; } else { self.lastUpdated = new Date().getTime(); }; d.lastUpdated = null;
		d = null;
	};
}
CalendarEvent.prototype.attributeRegex = /[\W\@]+/g;

/**
 * @constructor
 */
function EditEventModel() {
	var self = this,
		m_pattern = 'MM/dd/yyyy hh:mm';

	self.currentEvent = ko.observable();

	self.summary = ko.computed({
		read: function() {
			return self.currentEvent() ? self.currentEvent().summary() : "";
		},
		write: function(value) {
			if (self.currentEvent()) self.currentEvent().summary(value);
		}
	});
	self.description = ko.computed({
		read: function() {
			return self.currentEvent() ? self.currentEvent().description() : "";
		},
		write: function(value) {
			if (self.currentEvent()) self.currentEvent().description(value);
		}
	});
	self.startDate = ko.computed({
		read: function() {
			return self.currentEvent() ? self.currentEvent().startDate().toString(m_pattern) : "";
		},
		write: function(value) {
			if (self.currentEvent()) self.currentEvent().startDate(Date.parse(value));
		}
	});
	self.endDate = ko.computed({
		read: function() {
			return self.currentEvent() ? self.currentEvent().endDate().toString(m_pattern) : "";
		},
		write: function(value) {
			if (self.currentEvent()) self.currentEvent().endDate(Date.parse(value));
		}
	});
	self.location = ko.computed({
		read: function() {
			return self.currentEvent() ? self.currentEvent().location() : "";
		},
		write: function(value) {
			if (self.currentEvent()) self.currentEvent().location(value);
		}
	});
	self.isPublic = ko.computed({
		read: function() {
			return self.currentEvent() ? self.currentEvent().isPublic() : "";
		},
		write: function(value) {
			if (self.currentEvent()) self.currentEvent().isPublic(value);
		}
	});
	self.createdBy = ko.computed({
		read: function() {
			return self.currentEvent() ? self.currentEvent().createdBy() : "";
		},
		write: function(value) {
			if (self.currentEvent()) self.currentEvent().createdBy(value);
		}
	});
	self.onCancel = function(formElement) {
		var preEdit = app.navigation.model.preEdit();
		if (preEdit && preEdit != 'login' && preEdit != 'edit-event') {
			app.navigation.pageNavigator.navigateTo(preEdit);
		} else {
			app.navigation.pageNavigator.navigateTo('official-events');
		}
		return true;
	};
	self.onSubmit = function(formElement) {
		if (self.currentEvent()) {
			var postme = ko.toJS(self.currentEvent());
			postme.start = postme.startDate;
			postme.end = postme.endDate;
			delete postme.cleanId;
			delete postme.timespan;
			delete postme.startDate;
			delete postme.endDate;
			delete postme.toString;
			delete postme.createdBy;
			delete postme.attributeRegex;
			delete postme.lastUpdated;
			$.ajax({
				url: app.server.serverModel.eventEditUrl(),
				timeout: m_timeout,
				type: 'POST',
				data: ko.toJSON(postme),
				dataType: 'json',
				contentType:"application/json; charset=utf-8",
				statusCode: {
					401: function four_oh_one() {
						console.log('401 not authorized');
						app.navigation.model.authorized(false);
						app.server.serverModel.password(null);
						app.navigation.pageNavigator.navigateTo('login');
					}
				},
				beforeSend: function beforeSend(xhr) {
					app.server.serverModel.setBasicAuth(xhr);
					xhr = null;
				}
			}).success(function _success() {
				console.log('success!');
				self.createdBy(app.server.serverModel.username());
				app.events.eventsViewModel.events.push(self.currentEvent());
				
				var preEdit = app.navigation.model.preEdit();
				if (preEdit && preEdit != 'edit-event' && preEdit != 'login') {
					app.navigation.pageNavigator.navigateTo(preEdit);
				} else {
					app.navigation.pageNavigator.navigateTo('official-events');
				}
			}).fail(function _error(jqXHR, textStatus, errorThrown) {
				console.log('EditEventModel::onSubmit(): An error occurred while adding a new event: ' + ko.toJSON(jqXHR));
				console.log('textStatus = ' + textStatus + ', errorThrown = ' + errorThrown);
				jqXHR = textStatus = errorThrown = null;
			}).done(function _done() {
				postme = null;
			});
		} else {
			console.log('wtf?!? no event?!');
		}
		return true;
	};
}

/**
 * @constructor
 */
function EventsViewModel() {
	var self = this,
		m_updateCount = 0;

	self.events = ko.observableArray();
	self.updating = ko.observable(false);

	(function _processEvent() {
		app.cache.functions.processEvent = function(event, favorites, lastUpdated) {
			'use strict';

			if (!lastUpdated) {
				lastUpdated = new Date().getTime();
			}

			var item = ko.utils.arrayFirst(self.events(), function(entry) {
				'use strict';
				if (entry && entry.id() == event['@id']) {
					return true;
				} else {
					return false;
				}
			});

			var update = {
				"summary": event.summary,
				"description": event.description,
				"startDate": new Date(event.start),
				"endDate": new Date(event.end),
				"location": event.location,
				"createdBy": event['created-by'],
				"isPublic": event.isPublic !== undefined ? (event.isPublic === true || event.isPublic == 'true') : false,
				"isFavorite": (event.favorite !== undefined ? event.favorite : (favorites.indexOf(event['@id']) != -1)),
				"lastUpdated": lastUpdated
			};

			var ret = {
				"item": item,
				"exists": true
			};

			if (!item) {
				update.id = event['@id'];
				ret.item = new CalendarEvent();
				ret.exists = false;
			}

			item = event = lastUpdated = null;
			ret.item.updateUsing(update);
			update = null;
			return ret;
		};
	})();

	self.updateData = function(allData) {
		console.log('EventsViewModel::updateData()');
		m_updateCount++;
		self.updating(true);

		if (!allData) {
			console.log('EventsViewModel::updateData() called, but missing event data!');
			return;
		}

		console.log('EventsViewModel::updateData(): saving data to local storage');
		amplify.store('events', allData);

		var favorites = [];
		if (allData.favorites && allData.favorites.favorite) {
			console.log('EventsViewModel::updateData(): processing favorites');
			var processFavorite = function(favorite) {
				return favorite['@event'];
			};
			if (allData.favorites.favorite instanceof Array) {
				favorites = $.map(allData.favorites.favorite, processFavorite);
			} else {
				favorites = [ processFavorite.call(window, allData.favorites.favorite) ];
			}
		}

		if (allData.events && allData.events.event) {
			console.log('EventsViewModel::updateData(): processing events');
			var mappedTasks,
				processEvent = app.cache.functions.processEvent,
				updateTime = new Date().getTime();

			if (allData.events.event instanceof Array) {
				$.each(allData.events.event, function(index, event) {
					if (event.hasOwnProperty('@id')) {
						var ret = processEvent.call(window, event, favorites, updateTime);
						if (!ret.exists) {
							self.events.push(ret.item);
						}
						ret = null;
					} else {
						console.warn('event does not have an @id property!');
					}
				});
			} else {
				if (allData.events.event.hasOwnProperty('@id')) {
					var ret = processEvent.call(window, allData.events.event, favorites, updateTime);
					if (!ret.exists) {
						self.events.push(ret.item);
					}
					ret = null;
				} else {
					console.warn('event does not have an @id property!');
				}
			}

			self.events.remove(function(item) {
				return item.lastUpdated < updateTime;
			});
			/*
			console.log('EventsViewModel::updateData(): finished processing events, saving to model');
			self.events(mappedTasks);
			console.log('EventsViewModel::updateData(): finished saving to model');
			*/

			processEvent = null;
			mappedTasks = null;
		} else {
			console.log('no proper event data found');
		}
		favorites = null;
		self.updating(false);
		console.log('EventsViewModel::updateData(): complete');
	};
	
	self.toggleFavorite = function _toggleFavorite(entry, event) {
		'use strict';

		if (Modernizr.touch && event.type == 'click') {
			return true;
		}

		if (app.events.eventsViewModel.updating()) {
			console.log('EventsViewModel::toggleFavorite: skipping ajax update for ' + entry.id() + ', we are in the middle of a server update');
			return true;
		}

		console.log('EventsViewModel::toggleFavorite: ' + entry.id() + ' favorite has changed to: ' + entry.favorite());
		$.ajax({
			url: app.server.serverModel.favoritesUrl() + '?event=' + encodeURI(entry.id()),
			timeout: m_timeout,
			cache: false,
			dataType: 'json',
			type: entry.favorite() ? 'PUT' : 'DELETE',
			statusCode: {
				/*
				200: function two_hundred() {
					console.log('EventsViewModel::toggleFavorite: 200 OK');
				},
				*/
				401: function four_oh_one() {
					console.log('EventsViewModel::toggleFavorite: 401 not authorized');
					app.navigation.model.authorized(false);
					app.server.serverModel.password(null);
					app.navigation.pageNavigator.navigateTo('login');
				}
			},
			beforeSend: function beforeSend(xhr) {
				app.server.serverModel.setBasicAuth(xhr);
				xhr = null;
			}
		}).fail(function _fail(jqXHR, textStatus, errorThrown) {
			'use strict';
			console.log('EventsViewModel::toggleFavorite: An error occurred: ' + ko.toJSON(jqXHR, null, 2));
			console.log('EventsViewModel::toggleFavorite: textStatus = ' + textStatus + ', errorThrown = ' + errorThrown);
			jqXHR = textStatus = errorThrown = null;
		});
		return true;
	};
	
	self.togglePublic = function _togglePublic(entry, event) {
		'use strict';

		if (Modernizr.touch && event.type == 'click') {
			return true;
		}

		if (app.events.eventsViewModel.updating()) {
			console.log('EventsViewModel::togglePublic: skipping ajax update for ' + entry.id() + ', we are in the middle of a server update');
			return false;
		}

		console.log('EventsViewModel::togglePublic: ' + entry.id() + ' isPublic has changed to: ' + entry.isPublic());
		$.ajax({
			url: app.server.serverModel.eventEditUrl() + '/' + encodeURI(entry.id()) + '?isPublic=' + entry.isPublic(),
			timeout: m_timeout,
			cache: false,
			dataType: 'json',
			type: 'PUT',
			statusCode: {
				/*
				200: function two_hundred() {
					console.log('EventsViewModel::togglePublic: 200 OK');
				},
				*/
				401: function four_oh_one() {
					console.log('EventsViewModel::togglePublic: 401 not authorized');
					app.navigation.model.authorized(false);
					app.server.serverModel.password(null);
					app.navigation.pageNavigator.navigateTo('login');
				}
			},
			beforeSend: function beforeSend(xhr) {
				app.server.serverModel.setBasicAuth(xhr);
				xhr = null;
			}
		}).fail(function _fail(jqXHR, textStatus, errorThrown) {
			'use strict';
			console.log('EventsViewModel::togglePublic: An error occurred: ' + ko.toJSON(jqXHR, null, 2));
			console.log('EventsViewModel::togglePublic: textStatus = ' + textStatus + ', errorThrown = ' + errorThrown);
			jqXHR = textStatus = errorThrown = null;
		});
		return true;
	};

	self.deleteEvent = function _deleteEvent(entry, event) {
		'use strict';

		if (Modernizr.touch && event.type == 'click') {
			return true;
		}

		console.log('EventsViewModel::deleteEvent: ' + entry.id());
		$.ajax({
			url: app.server.serverModel.eventEditUrl() + '/' + encodeURI(entry.id()),
			timeout: m_timeout,
			cache: false,
			dataType: 'json',
			type: 'DELETE',
			statusCode: {
				/*
				200: function two_hundred() {
					console.log('EventsViewModel::deleteEvent: 200 OK');
				},
				*/
				401: function four_oh_one() {
					console.log('EventsViewModel::deleteEvent: 401 not authorized');
					app.navigation.model.authorized(false);
					app.server.serverModel.password(null);
					app.navigation.pageNavigator.navigateTo('login');
				}
			},
			beforeSend: function beforeSend(xhr) {
				app.server.serverModel.setBasicAuth(xhr);
				xhr = null;
			}
		}).done(function _done() {
			console.log('EventsViewModel::deleteEvent: finished, removing from view');
			self.events.remove(entry);
		}).fail(function _fail(jqXHR, textStatus, errorThrown) {
			'use strict';
			console.log('EventsViewModel::deleteEvent: An error occurred: ' + ko.toJSON(jqXHR, null, 2));
			console.log('EventsViewModel::deleteEvent: textStatus = ' + textStatus + ', errorThrown = ' + errorThrown);
			jqXHR = textStatus = errorThrown = null;
		});
		return true;
	};
}

/** used for filter/searching, match an event based on a filter **/
EventsViewModel.prototype.f_matchEventText = function _matchEventText(event, filter) {
	'use strict';

	var ret = false;
	if (event.summary().toLowerCase().search(filter) != -1) {
		ret = true;
	} else if (event.description().toLowerCase().search(filter) != -1) {
		ret = true;
	}
	event = filter  = null;
	return ret;
};

/**
 * @constructor
 */
function OfficialEventsViewModel(parentModel) {
	var self = this;

	$.extend(self, parentModel);
	self.filter = ko.observable('');

	self.filteredEvents = ko.computed(function _officialFilteredEvents() {
		var filter = self.filter().toLowerCase();

		return ko.utils.arrayFilter(self.events(), function _eventsFilter(event) {
			if (event !== undefined && event.createdBy() == 'google') {
				if (filter) {
					return self.f_matchEventText.call(self, event, filter);
				} else {
					return true;
				}
			}
			return false;
		});
	});
}

/**
 * @constructor
 */
function MyEventsViewModel(parentModel) {
	var self = this;
	$.extend(self, parentModel);
	self.filter = ko.observable('');

	self.filteredEvents = ko.computed(function _myFilteredEvents(event) {
		var filter = self.filter().toLowerCase();

		return ko.utils.arrayFilter(self.events(), function _eventsFilter(event) {
			if (event.favorite() || event.createdBy() == app.server.serverModel.username()) {
				if (filter) {
					return self.f_matchEventText.call(self, event, filter);
				} else {
					return true;
				}
			}
			return false;
		});
	});
}

/**
 * @constructor
 */
function PublicEventsViewModel(parentModel) {
	var self = this;
	$.extend(self, parentModel);
	self.filter = ko.observable('');

	self.filteredEvents = ko.computed(function _publicFilteredEvents() {
		var filter = self.filter().toLowerCase();

		return ko.utils.arrayFilter(self.events(), function _eventsFilter(event) {
			if (event.createdBy() != 'google' && event.isPublic()) {
				if (filter) {
					return self.f_matchEventText.call(self, event, filter);
				} else {
					return true;
				}
			}
			return false;
		});
	});
};
