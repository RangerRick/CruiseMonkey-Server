function HeightChecker(headerOffset, visibleWiggle) {
	"use strict";
	var m_window = $(window),
		m_headerOffset = headerOffset || 0,
		m_visibleWiggle = visibleWiggle || 0;

	this.percentVisible = function(element) {
		"use strict";
		var e = $(element),
			offset = e.offset(),
			windowTop = m_window.scrollTop() + m_headerOffset,
			windowBottom = m_window.innerHeight(),
			windowHeight = windowBottom - windowTop,
			height = e.height(),
			top = e.offset().top,
			bottom = top + height,

			adjustedTop = top - windowTop,
			adjustedBottom = bottom - windowBottom,

			lowestTop = windowTop >= adjustedTop? windowTop : adjustedTop,
			highestBottom = windowBottom <= bottom? windowBottom : bottom,

			visibleHeight = highestBottom - lowestTop,

			visiblePercent;

		if (adjustedTop + m_visibleWiggle >= 0 && adjustedBottom <= 0) {
			// entire object is visible
			visiblePercent = 100.00;
		} else {
			visiblePercent = Math.max(0, visibleHeight / windowHeight * 100.0).toFixed(2);
		}

		return visiblePercent;
	};
}

function PageNavigator(defaultPage, elementCriteria) {
	if (!amplify || !pageTracker || !defaultPage || !elementCriteria) {
		throw new TypeError("You must specify an Amplify storage class, page tracker, default page, and an element criteria!");
	}

	var self = this,
		m_heightChecker = new HeightChecker(45, 15);

	self.getCurrentPage = function() {
		"use strict";
		var current_page = amplify.store('current_page');
		console.log('PageNavigator::getCurrentPage(): current_page = ' + current_page);
		if (!current_page || current_page == 'login') {
			current_page = defaultPage;
			amplify.store('current_page', current_page);
		}
		return current_page;
	};

	self.findTopVisibleElement = function() {
		"use strict";
		var current_page = self.getCurrentPage(),
			id = null,
			el = null,
			elementPercent = 0,
			highestPercent = 0;

		pageTracker.getElement('#' + current_page).find(elementCriteria).each(function(index, element) {
			"use strict";
			id = element.getAttribute('id');
			if (id) {
				elementPercent = m_heightChecker.percentVisible(element);
				// console.log(index + ': ' + id + ' = ' + elementPercent + ' (criteria = ' + elementCriteria + ')');
				if (elementPercent == 100.0) {
					el = element;
					highestPercent = elementPercent;
					return false;  // break out, we found a 100%
				} else if (elementPercent > highestPercent) {
					el = element;
					highestPercent = elementPercent;
				} else if (elementPercent < highestPercent) {
					// percentage is trailing off, break the loop
					return false;
				}
			} else {
				console.log('no ID found for element');
			}
			return true;
		});

		if (el && highestPercent > 0) {
			var elementId = el.getAttribute('id');
			console.log("PageNavigator::findTopVisibleElement(): first visible element on " + current_page + ": " + elementId);
			pageTracker.setScrolledId(current_page, elementId);
			return el;
		} else {
			console.log('no top visible element found!');
		}

		return null;
	};

	self.replaceCurrentPage = function(pageId) {
		"use strict";

		console.log('replaceCurrentPage(' + pageId + ')');

		var page = pageTracker.getElement('#' + pageId),
			search = page.find('input[type=search]').first();

		pageTracker.getContainer().children().css('display', 'none');
		page.css('display', 'block');

		if (!Modernizr.touch) {
			// on non-mobile devices, focus the search input
			if (search) {
				search.focus();
			}
		}
	};

	self.navigateTo = function(pageId) {
		"use strict";

		console.log('----------------------------------------------------------------------------------');
		console.log('navigateTo(' + pageId + ')');

		var page, topElement;

		page = $(pageId);
		if (!page) {
			console.log('unable to locate element for ' + pageId);
			return false;
		}

		if (pageId != 'login') {
			amplify.store('current_page', pageId);
		}

		if (scrollManager) {
			scrollManager.disable();
		}
		self.replaceCurrentPage(pageId);

		topElement = pageTracker.getTopElement(pageId);

		if (!topElement || topElement.getIndex() === 0) {
			// console.log('scrolling to the top of the page');
			setTimeout(function() {
				"use strict";

				pageTracker.getElement('#content').scrollTo(0, 0, {
					onAfter: function() {
						setTimeout(function() {
							if (scrollManager) {
								scrollManager.enable();
							}
						}, 50);
					}
				});
			}, 0);
		} else {
			// console.log("scrolling to " + topElement.toString());
			setTimeout(function() {
				"use strict";

				pageTracker.getElement('#content').scrollTo('#' + topElement.getId(), 0,
					{
						margin: false,
						offset: {left:0, top:-45},
						onAfter: function() {
							setTimeout(function() {
								if (scrollManager) {
									scrollManager.enable();
								}
							}, 50);
						}
					}
				);
			}, 0);
		}

		return true;
	}
}
