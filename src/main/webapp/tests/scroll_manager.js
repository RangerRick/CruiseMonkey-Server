module("ScrollManager", {
	setup: function() {
		"use strict";
		var fixture = $('#qunit-fixture');
		$(fixture).append('<ol>');
		for (var i = 1; i <= 1000; i++) {
			$(fixture).append('<li id="' + i + '">ID #' + i + '</li>');
		}
		$(fixture).append('</ol>');
	},
	teardown: function() {
		"use strict";
		var fixture = $('#qunit-fixture');
		$(fixture).empty();
	}
});

/* callbacks are called while enabled */
asyncTest('testEnabled', 2, function() {
	"use strict";
	var scrollManager = new ScrollManager(window);
	var started = 0;
	var stopped = 0;
	scrollManager.onScrollStart = function(enabled) {
		"use strict";
		if (enabled) { started++; }
	};
	scrollManager.onScrollStop = function(enabled) {
		"use strict";
		if (enabled) { stopped++; }
	};
	scrollManager.delay = 10;

	$('#500').scroll();
	setTimeout(function() {
		"use strict";
		equal(started, 1, 'ScrollManager should have started scrolling once.');
		equal(stopped, 1, 'ScrollManager should have completed scrolling once.');
		start();
	}, 50);
});

/* callbacks should not be called while disabled */
asyncTest('testDisabled', 4, function() {
	"use strict";
	var scrollManager = new ScrollManager(window);
	var started = 0;
	var stopped = 0;
	var started_while_disabled = 0;
	var stopped_while_disabled = 0;
	scrollManager.onScrollStart = function(enabled) {
		"use strict";
		if (enabled) {
			started++;
		} else {
			started_while_disabled++;
		}
	};
	scrollManager.onScrollStop = function(enabled) {
		"use strict";
		if (enabled) {
			stopped++;
		} else {
			stopped_while_disabled++;
		}
	};
	scrollManager.delay = 10;
	scrollManager.enabled = false;

	$('#500').scroll();
	setTimeout(function() {
		"use strict";
		equal(started, 0, 'ScrollManager should not have started scrolling.');
		equal(stopped, 0, 'ScrollManager should not have completed scrolling.');
		equal(started_while_disabled, 1, 'ScrollManager should have started disabled scrolling.');
		equal(stopped_while_disabled, 1, 'ScrollManager should have completed disabled scrolling.');
		start();
	}, 50);
});