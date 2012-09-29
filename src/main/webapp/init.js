console.log("init.js loading");

var templates = {
	header: "views/header.html",
	events: "views/events.html",
	loaded: 0,
	requested: 0,
};

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

function setupHeader() {
    header = getHeader();
    header.html(templates.header);
    
    $('nav').find('a').each(function(index, element) {
    	var hash = undefined;
    	if (element.href !== undefined) {
    		hash = element.href.split('#')[1];
    	}
    	if (hash !== undefined && hash != "") {
    		// $(element).off('click');
    		$(element).on('click.fndtn touchstart.fndtn', function(e) {
            	e.preventDefault();
            	console.log("navigation event: " + hash);
            	if (hash == 'official-events') {
            		showOfficialEventsView();
            	} else if (hash == 'my-events') {
            		showMyEventsView();
            	}
    		});
    	}
    });

    $(document).foundationTopBar();
}

function setupDefaultView() {
    console.log("setting up default view");

    setupHeader();
    showOfficialEventsView();

    // initialize model data
    ko.applyBindings(eventsModel);

    var interval = setInterval(function() {
    	eventsModel.updateDataFromJSON();
    }, 5000);

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

}

var current_page = undefined;
var pages = {
};

function replaceCurrentPage(page) {
    if (current_page) {
		$(current_page).css('visibility', 'hidden');
	}

    var content = getContainer()[0];
    content.innerHTML = '';
    content.appendChild(page);
    current_page = page;
}

function createOfficialEventsView() {
    if (!pages.official_events) {
    	var div = document.createElement('div');
    	div.setAttribute('id', 'official-events');
    	var html = Mustache.to_html(templates.events, { eventType: "official" });
    	$(div).html(html);
    	pages.official_events = div;
    }
}

function showOfficialEventsView() {
	createOfficialEventsView();
	replaceCurrentPage(pages.official_events);
    
    var content = getContainer();
    content.find('ul.event-list').css('visibility', 'visible');
}

function createMyEventsView() {
    if (!pages.my_events) {
    	var div = document.createElement('div');
    	div.setAttribute('id', 'my-events');
    	var html = Mustache.to_html(templates.events, { eventType: "my" });
    	$(div).html(html);
    	pages.my_events = div;
    }
}

function showMyEventsView() {
	createMyEventsView();
	replaceCurrentPage(pages.my_events);
    
    var content = getContainer();
    content.find('ul.event-list').css('visibility', 'visible');
}

function onTemplateLoaded(template, key) {
	console.log("template '" + key + "' loaded");

//    console.log( key + ": " + template);
    templates[ key ] = template;
    templates.loaded ++;

	if ( templates.loaded == templates.requested ) {
		console.log("all requested templates have been loaded");
		
		createOfficialEventsView();
		createMyEventsView();

        setupDefaultView();
    }
}

console.log("init.js loaded");