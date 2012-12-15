module("ScrollManager", {
	setup: function() {
		var fixture = $('#qunit-fixture');
		$(fixture).append('<ol>');
		for (var i = 1; i <= 1000; i++) {
			$(fixture).append('<li id="' + i + '">ID #' + i + '</li>');
		}
		$(fixture).append('</ol>');
	},
	teardown: function() {
		var fixture = $('#qunit-fixture');
		$(fixture).empty();
	}
});

/* callbacks are called while enabled */
asyncTest('ScrollManager.enabled', 2, function() {
	var scrollManager = new ScrollManager();
	var started = 0;
	var stopped = 0;
	scrollManager.onScrollStart = function(enabled) {
		if (enabled) { started++; }
	};
	scrollManager.onScrollStop = function(enabled) {
		if (enabled) { stopped++; }
	};
	scrollManager.delay = 10;

	$('#500').scroll();
	setTimeout(function() {
		equal(started, 1, 'ScrollManager should have started scrolling once.');
		equal(stopped, 1, 'ScrollManager should have completed scrolling once.');
		start();
	}, 50);
});

/* callbacks should not be called while disabled */
asyncTest('ScrollManager.disabled', 4, function() {
	var scrollManager = new ScrollManager();
	var started = 0;
	var stopped = 0;
	var started_while_disabled = 0;
	var stopped_while_disabled = 0;
	scrollManager.onScrollStart = function(enabled) {
		if (enabled) {
			started++;
		} else {
			started_while_disabled++;
		}
	};
	scrollManager.onScrollStop = function(enabled) {
		if (enabled) {
			stopped++;
		} else {
			stopped_while_disabled++;
		}
	};
	scrollManager.delay = 10;
	scrollManager.disable();

	$('#500').scroll();
	setTimeout(function() {
		equal(started, 0, 'ScrollManager should not have started scrolling.');
		equal(stopped, 0, 'ScrollManager should not have completed scrolling.');
		equal(started_while_disabled, 1, 'ScrollManager should have started disabled scrolling.');
		equal(stopped_while_disabled, 1, 'ScrollManager should have completed disabled scrolling.');
		start();
	}, 50);
});
