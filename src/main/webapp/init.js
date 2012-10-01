console.log("init.js loading");

var pages = {};

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

function replaceCurrentPage(pageId) {
	getContainer().children().css('display', 'none');
	$('#' + pageId).css('display', 'block');
	return getContainer()[0];
}

function createOfficialEventsView() {
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
	createOfficialEventsView();
	var content = replaceCurrentPage('official-events');
    $(content).find('ul.event-list').css('display', 'block');
}

function createMyEventsView() {
    if (!pages.my) {
    	var div = document.createElement('div');
    	div.setAttribute('id', 'my-events');
    	$(div).css('display', 'none');
    	var html = Mustache.to_html(templates.events, { eventType: "my" });
    	// console.log("html = " + html);
    	$(div).html(html);
    	pages.my = div;
    	var appended = getContainer()[0].appendChild(div);
        ko.applyBindings(myEventsModel, appended);
    }
}

function showMyEventsView() {
	createMyEventsView();
	var content = replaceCurrentPage('my-events');
    $(content).find('ul.event-list').css('display', 'block');
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