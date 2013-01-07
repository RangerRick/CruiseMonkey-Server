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
	"use strict";
	if (!amplify || !pageTracker || !defaultPage || !elementCriteria) {
		throw new TypeError("You must specify an Amplify storage class, page tracker, default page, and an element criteria!");
	}

	var m_amplify         = amplify,
		m_pageTracker     = pageTracker,
		m_defaultPage     = defaultPage,
		m_elementCriteria = elementCriteria,
		m_heightChecker   = new HeightChecker(45, 15),
		self = this;

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

}