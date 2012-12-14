console.log("init.js loading");

var pages = {};
var page_scroll_element = [];
var online = false;

var scrollManager = new ScrollManager();
scrollManager.delay = 100;

scrollManager.onScrollStart = function(enabled) {
	if (enabled) {
		console.log('scrolling started while enabled');
	} else {
		console.log('scrolling started while disabled');
	}
};
scrollManager.onScrollStop = function(enabled) {
	if (enabled) {
		var found = findTopVisibleElement();
		if (found) {
			console.log("visible element: " + getSummary(found) + ' (' + $(found).attr('id') + ')');
		} else {
			console.log("no elements visible!");
		}
	} else {
		console.log('scrolling stopped while disabled');
	}
};

var templates = {
	header: "views/header.html",
	events: "views/events.html",
	login: "views/login.html",
	loaded: 0,
	requested: 0,
};

var setOffline = function() {
	console.log('setOffline()');
	if (online == true) {
		console.log("setOffline: we were online but have gone offline");
	}
	online = false;
	navModel.signedIn(false);
	console.log("online = " + online);
}

var setOnline = function() {
	console.log('setOnline()');
	if (online == false) {
		console.log("setOnline: we were offline but have gone online");
	}
	online = true;
	navModel.signedIn(true);
	console.log("online = " + online);
}

var isOnline = function() {
	return online;
}

var isSignedIn = function() {
	return online && loginModel.username() && loginModel.username().length > 0;
}

function elementInViewport(el) {
	var top = el.offsetTop;
	// var left = el.offsetLeft;
	// var width = el.offsetWidth;
	var height = el.offsetHeight;

	while (el.offsetParent) {
		el = el.offsetParent;
		top += el.offsetTop;
		// left += el.offsetLeft;
	}

	return (top >= window.pageYOffset
		// && left >= window.pageXOffset
		&& (top + height) <= (window.pageYOffset + window.innerHeight)
		// && (left + width) <= (window.pageXOffset + window.innerWidth)
	);
}

function _getPageStoreCache() {
	// console.log("store currently contains: " + ko.toJSON(amplify.store()));
	var page_store_cache = amplify.store('page_store_cache');
	if (!page_store_cache) {
		page_store_cache = {};
	}
	return page_store_cache;
}

function _setPageStoreCache(cache) {
	console.log("set cache: " + ko.toJSON(cache));
	amplify.store('page_store_cache', cache);
}

function updatePageTopElement(page, id) {
	console.log('updatePageTopElement(' + page + ', ' + id + ')');
	var page_store_cache = _getPageStoreCache();
	page_store_cache[page] = id;
	_setPageStoreCache(page_store_cache);
	return id;
}

function getPageTopElement(page) {
	console.log('getPageTopElement(' + page + ')');
	var page_store_cache = _getPageStoreCache();
	var retVal = null;
	if (page_store_cache) {
		retVal = page_store_cache[page];
	}
	console.log("getPageTopElement: returning " + retVal);
	return retVal;
}

function getSummary(element) {
	return $(element).find('div.summary').text();
}

function findTopVisibleElement() {
	console.log('findTopVisibleElement()');
	var found = null;
	var current_page = getCurrentPage();
	$('#' + current_page).find('.calendar-event').each(function(index, element) {
		if (elementInViewport(element)) {
			var id = $(element).attr('id');
			if (id) {
				var summary = getSummary(element);
				if (current_page) {
					console.log("first visible element on " + current_page + ": " + summary + ' (' + id + ')');
					updatePageTopElement(current_page, id);
				}
			}
			found = element;
			return false;
		}
		return true;
	});

	return found;
}

function onDeviceReady( event ) {
	console.log("Device is ready.  Initializing.");
	
	// load Mustache templates
    for (var key in templates) {
        (function() {
            var _key = key.toString();
            if ( _key != "loaded" && _key != "requested" ){
                templates.requested ++;
         
                 var templateLoaded = function( template ){
                    onTemplateLoaded( template, _key );
                 }
                
                $.get( templates[ _key ], templateLoaded );
             }
         })();
    }
}

var _header, _container;

function getHeader() {
	if (!_header) {
		_header = $("body").find("#header");
	}
	return _header;
}

function getContainer() {
	if (!_container) {
		_container = $("body").find("#content");
	}
	return _container;
}

function getScroll() {
	var scroll;
	
	// Netscape compliant
	if (typeof(window.pageYOffset) === 'number') {
		scroll = window.pageYOffset;
	}
	// DOM compliant
	else if (document.body && document.body.scrollTop) {
		scroll = document.body.scrollTop;
	}
	// IE6 standards compliant mode
	else if (document.documentElement && document.documentElement.scrollTop) {
		scroll = document.documentElement.scrollTop;
	}
	// needed for IE6 (when vertical scroll bar is on the top)
	else {
		scroll = 0;
	}
}

function setupHeader() {
	console.log('setupHeader()');
    header = getHeader();
    header.html(templates.header);
    
    var nav = $(header).find('nav')[0];

    $(nav).find('a').each(function(index, element) {
    	var hash = undefined;
    	if (element.href !== undefined) {
    		hash = element.href.split('#')[1];
    	}
    	if (hash !== undefined && hash != "") {
    		// $(element).off('click');
    		$(element).on('click.fndtn touchstart.fndtn', function(e) {
    			// e.preventDefault();
            	console.log("navigation event: " + hash);
            	navigateTo(hash);
    		});
    	}
    });

    $(document).foundationTopBar();

    $(nav).find('.signin').each(function(index, element) {
    	$(element).on('click.fndtn touchstart.fndtn', function(e) {
    		setOffline();
    		navigateTo('login');
    	});
    });
    $(nav).find('.signout').each(function(index, element) {
    	$(element).on('click.fndtn touchstart.fndtn', function(e) {
    		setOffline();
    		serverModel.username(null);
    		serverModel.password(null);
    		navigateTo('login');
    	});
    });
    ko.applyBindings(navModel, nav);
}

function navigateTo(pageId) {
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

	var topElement = getPageTopElement(pageId);
	if (topElement) {
		var page = $('#' + pageId);

		var matched = null;
		var matched_index = -1;
		page.find('.scrollable').each(function(index, element) {
			var id = $(element).attr('id');
			if (id == topElement) {
				matched = id;
				matched_index = index;
				console.log("matched " + id);
				return false;
			} else {
				console.log(id + ' did not match ' + topElement);
			}
			return true;
		});

		if (matched) {
			console.log("matched_index = " + matched_index);
			if (matched_index == 0) {
				console.log('scrolling to the top of the page');
				scrollTo(0,-45);
				// $('body').scrollTo(0, 0, {margin:false, offset: {left:0, top:-45}});
			} else {
				console.log("scrolling to " + topElement + ' (' + matched + ')');
				$('body').scrollTo('#' + topElement, 0, {margin:false, offset: {left:0, top:-45}});
				// $('body').scrollTo('#' + topElement, 0);
			}
			/*
			setTimeout(function() {
				window.scrollBy(0, -45);
			}, 50);
			*/
		} else {
			console.log("didn't find an element to scroll to for " + topElement);
		}
	} else {
		console.log("no top element found for " + pageId);
	}

	setTimeout(function() {
		scrollManager.enable();
	}, 100);
	return true;
}

function checkIfAuthorized(success, failure) {
	console.log('checkIfAuthorized()');
	var username = amplify.store('username');
	var password = amplify.store('password');
	
	if (!username || !password) {
		failure();
		return;
	}

	$.ajax({
		url: serverModel.statusnet() + '/api/help/test.json',
		dataType: 'json',
		type: 'POST',
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ':' + password));
		},
		username: username,
		password: password,
		success: function(data) {
			if (data == 'ok') {
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
		console.log("An error occurred: " + ko.toJSON(data));
		failure();
	});
}

var getCurrentPage = function() {
    var current_page = amplify.store('current_page');
    console.log('setupDefaultView: current_page = ' + current_page);
    if (!current_page || current_page == 'login') {
    	current_page = 'official-events';
    	amplify.store('current_page', current_page);
    }
    return current_page;
}

var showLoginOrCurrent = function() {
	var current_page = getCurrentPage();

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
}

function setupDefaultView() {
	console.log('setupDefaultView()');
    setupHeader();

    /*
    var interval = setInterval(function() {
    	eventsModel.updateDataFromJSON();
    }, 5000);
    */

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
}

function replaceCurrentPage(pageId) {
	console.log('replaceCurrentPage(' + pageId + ')');
	getContainer().children().css('display', 'none');
	var page = $('#' + pageId);
	page.css('display', 'block');
    if (!Modernizr.touch) {
    	// on non-mobile devices, focus the search input
    	var search = page.find('input[type=search]');
    	if (search && search[0]) {
    		search[0].focus();
    	}
    }
    if (pageId != 'login') {
        amplify.store('current_page', pageId);
    }
	return getContainer()[0];
}

function createOfficialEventsView() {
	console.log('createOfficialEventsView()');
    if (!pages.official) {
    	var div = document.createElement('div');
    	div.setAttribute('id', 'official-events');
    	$(div).css('display', 'none');
    	var html = Mustache.to_html(templates.events, { eventType: "official" });
    	$(div).html(html);
    	pages.official = div;
    	var appended = getContainer()[0].appendChild(div);
        ko.applyBindings(officialEventsModel, appended);
    }
}

function showOfficialEventsView() {
	console.log('showOfficialEventsView()');
	createOfficialEventsView();
	var content = replaceCurrentPage('official-events');
    $(content).find('ul.event-list').css('display', 'block');
}

function createMyEventsView() {
	console.log('createMyEventsView()');
    if (!pages.my) {
    	var div = document.createElement('div');
    	div.setAttribute('id', 'my-events');
    	$(div).css('display', 'none');
    	var html = Mustache.to_html(templates.events, { eventType: "my" });
    	$(div).html(html);
    	pages.my = div;
    	var appended = getContainer()[0].appendChild(div);
        ko.applyBindings(myEventsModel, appended);
    }
}

function showMyEventsView() {
	console.log('showMyEventsView()');
	createMyEventsView();
	var content = replaceCurrentPage('my-events');
    $(content).find('ul.event-list').css('display', 'block');
}

function createLoginView() {
	console.log('createLoginView()');
	if (!pages.login) {
    	var div = document.createElement('div');
    	div.setAttribute('id', 'login');
    	$(div).css('display', 'none');
    	var html = Mustache.to_html(templates.login);
    	$(div).html(html);
		$(div).find('#login_reset').on('click.fndtn touchstart.fndtn', function(e) {
			console.log("cancel clicked");
			serverModel.reset();
		});
		$(div).find('#login_save').on('click.fndtn touchstart.fndtn', function(e) {
			console.log("save clicked");
			serverModel.persist();
			setupDefaultView();
		});

    	pages.login = div;
    	var appended = getContainer()[0].appendChild(div);
    	ko.applyBindings(serverModel, appended);
	}
}

function showLoginView() {
	console.log('showLoginView()');
	createLoginView();
	var content = replaceCurrentPage('login');
}

function onTemplateLoaded(template, key) {
	console.log('onTemplateLoaded(<template>, ' + key + ')');

//    console.log( key + ": " + template);
    templates[ key ] = template;
    templates.loaded ++;

	if ( templates.loaded == templates.requested ) {
		console.log("all requested templates have been loaded");
		
		createOfficialEventsView();
		createMyEventsView();
		createLoginView();

        setupDefaultView();
    }
}

console.log("init.js loaded");