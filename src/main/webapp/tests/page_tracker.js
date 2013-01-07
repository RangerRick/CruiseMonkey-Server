module("PageTracker", {
	setup: function() {
		"use strict";
		var fixture = $('#qunit-fixture');
		fixture.append('<div id="foo" /><div id="bar"><span class="monkey">hi</span></div>');
	},
	teardown: function() {
		"use strict";
		var fixture = $('#qunit-fixture');
		$(fixture).empty();
	}
});

test('testGettersAndSetters', 3, function() {
	"use strict";
	raises(function() {
		"use strict";
		var pageTracker = new PageTracker(null);
	}, TypeError, "Expecting a type error when passing an invalid amplify object.");

	var pageTracker = new PageTracker(amplify, '.scrollable');
	pageTracker.setScrolledId('bar', 'baz');
	equal(pageTracker.getScrolledId('bar'), 'baz');

	equal(pageTracker.getScrolledId('foo'), null);
});

test('testElementCache', 1, function() {
	"use strict";
	var pageTracker = new PageTracker('amplify', '.scrollable');
	var element = pageTracker.getElement('#bar');
	equal(pageTracker.getElement('#bar').html(), '<span class="monkey">hi</span>');
});