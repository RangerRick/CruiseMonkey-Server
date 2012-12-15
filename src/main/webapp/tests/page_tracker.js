module("PageTracker", {
	setup: function() {
	},
	teardown: function() {
		var fixture = $('#qunit-fixture');
		$(fixture).empty();
	}
});

test('PageTracker.basic', 3, function() {
	raises(function() {
		var pageTracker = new PageTracker(null);
	}, TypeError, "Expecting a type error when passing an invalid amplify object.");

	var pageTracker = new PageTracker(amplify);
	pageTracker.setScrolledId('bar', 'baz');
	equal('baz', pageTracker.getScrolledId('bar'));

	equal(null, pageTracker.getScrolledId('foo'));
});
