module("TemplateLoader", {
	setup: function() {
		"use strict";
		var fixture = $('#qunit-fixture');
		fixture.append('<script id="foo.html" type="text/html"><div id="foo">blah</div></script>');
	},
	teardown: function() {
		"use strict";
		var fixture = $('#qunit-fixture');
		$(fixture).empty();
	}
});

test('testConfiguration', 5, function() {
	"use strict";
	var templateLoader = new TemplateLoader();
	templateLoader.add('tests/a.html');
	equal(templateLoader.urls().length, 1);
	templateLoader.add('tests/b.html');
	equal(templateLoader.urls().length, 2);
	templateLoader.remove('tests/a.html');
	equal(templateLoader.urls().length, 1);
	templateLoader.clear();
	equal(templateLoader.urls().length, 0);
	
	templateLoader = new TemplateLoader(['a', 'b', 'c', 'd']);
	equal(templateLoader.urls().length, 4);
});

asyncTest('testFailedGet', 2, function() {
	"use strict";
	var templateLoader = new TemplateLoader();
	templateLoader.add('tests/aasdfasdfasdf.html');

	var loadCount = 0;
	templateLoader.onLoad = function() {
		"use strict";
		loadCount++;
	};
	templateLoader.onFinished = function() {
		"use strict";
		start();
		equal(loadCount, 0);
		equal(templateLoader.urls().length, 1);
	};

	templateLoader.load();
});

asyncTest('testSuccessfulGet', 4, function() {
	"use strict";
	var templateLoader = new TemplateLoader();
	var url = 'tests/template_loader/testSuccessfulGet.html';
	templateLoader.add(url);

	var loadCount = 0,
		failCount = 0;
	templateLoader.onLoad = function(url) {
		"use strict";
		console.log("loaded " + url);
		loadCount++;
	};
	templateLoader.onFail = function(url) {
		"use strict";
		console.log("failed " + url);
		failCount++;
	};
	templateLoader.onFinished = function() {
		"use strict";
		start();
		equal(templateLoader.urls().length, 1);
		equal(failCount, 0);
		equal(loadCount, 1);
		ok(templateLoader.getTemplate(url).indexOf('foo') !== -1);
		equal(templateLoader.renderTemplate(url, {
			foo: "blah"
		}), "<div id=\"blah\" />\n");
	};

	templateLoader.load();
});

asyncTest('testIdGet', 3, function() {
	"use strict";
	var templateLoader = new TemplateLoader();
	var url = '#foo.html';
	templateLoader.add(url);

	var loadCount = 0;
	templateLoader.onLoad = function() {
		"use strict";
		loadCount++;
	};
	templateLoader.onFinished = function() {
		"use strict";
		start();
		equal(loadCount, 1);
		ok(templateLoader.getTemplate(url).indexOf('foo') !== -1);
		equal(templateLoader.renderTemplate(url, {}), '<div id="foo">blah</div>');
	};

	templateLoader.load();
});
