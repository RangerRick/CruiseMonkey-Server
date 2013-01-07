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

function PageNavigator(amplify, pageTracker, defaultPage, elementCriteria) {
	if (!amplify || !pageTracker || !defaultPage || !elementCriteria) {
		throw new TypeError("You must specify an Amplify storage class, page tracker, default page, and an element criteria!");
	}

	var m_amplify         = amplify,
		m_pageTracker     = pageTracker,
		m_defaultPage     = defaultPage,
		m_elementCriteria = elementCriteria,
		m_heightChecker   = new HeightChecker(45, 15),
		m_scrollMananger,
		
		self = this;

	self.setScrollManager = function(sm) {
		m_scrollManager = sm;
	};

	self.getCurrentPage = function() {
		"use strict";
		var current_page = m_amplify.store('current_page');
		console.log('PageNavigator::getCurrentPage(): current_page = ' + current_page);
		if (!current_page || current_page == 'login') {
			current_page = m_defaultPage;
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

		pageTracker.getElement('#' + current_page).find(m_elementCriteria).each(function(index, element) {
			"use strict";
			id = element.getAttribute('id');
			if (id) {
				elementPercent = m_heightChecker.percentVisible(element);
				// console.log(index + ': ' + id + ' = ' + elementPercent + ' (criteria = ' + m_elementCriteria + ')');
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
				console.log('no ID found for element: ' + element.html());
			}
			return true;
		});

		if (el && highestPercent > 0) {
			var elementId = el.getAttribute('id');
			var summary = CMUtils.getSummary(el);
			console.log("PageNavigator::findTopVisibleElement(): first visible element on " + current_page + ": " + summary + ' (' + elementId + ')');
			m_pageTracker.setScrolledId(current_page, elementId);
			return el;
		} else {
			console.log('no top visible element found!');
		}

		return null;
	};

	self.replaceCurrentPage = function(pageId) {
		"use strict";

		console.log('replaceCurrentPage(' + pageId + ')');

		var page = m_pageTracker.getElement('#' + pageId),
			search = page.find('input[type=search]').first();

		m_pageTracker.getContainer().children().css('display', 'none');
		page.css('display', 'block');

		if (!Modernizr.touch) {
			// on non-mobile devices, focus the search input
			if (search) {
				search.focus();
			}
		}
		return m_pageTracker.getContainer()[0];
	};

	self.navigateTo = function(pageId) {
		"use strict";

		console.log('----------------------------------------------------------------------------------');
		console.log('navigateTo(' + pageId + ')');

		var page, content, topElement;

		page = $(pageId);
		if (!page) {
			console.log('unable to locate element for ' + pageId);
			return false;
		}

		if (pageId != 'login') {
			amplify.store('current_page', pageId);
		}

		if (m_scrollManager) {
			m_scrollManager.disable();
		}
		content = self.replaceCurrentPage(pageId);

		topElement = m_pageTracker.getTopElement(pageId);

		if (!topElement || topElement.getIndex() === 0) {
			// console.log('scrolling to the top of the page');
			setTimeout(function() {
				"use strict";

				m_pageTracker.getElement('#content').scrollTo(0, 0, {
					onAfter: function() {
						setTimeout(function() {
							if (m_scrollManager) {
								m_scrollManager.enable();
							}
						}, 50);
					}
				});
			}, 0);
		} else {
			// console.log("scrolling to " + topElement.toString());
			setTimeout(function() {
				"use strict";

				m_pageTracker.getElement('#content').scrollTo('#' + topElement.getId(), 0,
					{
						margin: false,
						offset: {left:0, top:0},
						onAfter: function() {
							setTimeout(function() {
								if (m_scrollManager) {
									m_scrollManager.enable();
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