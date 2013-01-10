/**
 * @constructor
 */
function HeightChecker(headerOffset, visibleWiggle) {
	'use strict';
	var m_headerOffset = headerOffset || 0,
		m_visibleWiggle = visibleWiggle || 0,
		self = this;

	self.percentVisible = function _percentVisible(element) {
		'use strict';
		var w = $(window),
			e = $(element),
			offset = e.offset(),
			windowTop = w.scrollTop() + m_headerOffset,
			windowBottom = w.innerHeight(),
			windowHeight = windowBottom - windowTop,
			height = e.height(),
			top = e.offset().top,
			bottom = top + height,

			adjustedTop = top - windowTop,
			adjustedBottom = bottom - windowBottom,

			lowestTop = windowTop >= adjustedTop ? windowTop : adjustedTop,
			highestBottom = windowBottom <= bottom ? windowBottom : bottom,

			visibleHeight = highestBottom - lowestTop,

			visiblePercent;

		if (adjustedTop + m_visibleWiggle >= 0 && adjustedBottom <= 0) {
			// entire object is visible
			visiblePercent = 100.00;
		} else {
			visiblePercent = Math.max(0, visibleHeight / windowHeight * 100.0).toFixed(2);
		}
		
		w = e = offset = windowTop = windowBottom = windowHeight = height = top = bottom = adjustedTop = adjustedBottom = lowestTop = highestBottom = visibleHeight = null;

		return visiblePercent;
	};
}

/**
 * @constructor
 */
function PageNavigator(defaultPage, elementCriteria) {
	if (!defaultPage || !elementCriteria) {
		throw new TypeError('You must specify a default page and an element criteria!');
	}

	var self = this;

	self.getCurrentPage = function _getCurrentPage() {
		'use strict';
		var current_page = amplify.store('current_page');
		console.log('PageNavigator::getCurrentPage(): current_page = ' + current_page);
		if (!current_page || current_page == 'login' || current_page == 'add-event') {
			current_page = defaultPage;
			amplify.store('current_page', current_page);
		}
		return current_page;
	};

	self.updateTopVisibleElement = function _updateTopVisibleElement() {
		'use strict';
		var current_page = self.getCurrentPage(),
			id = null,
			el = null,
			elementPercent = 0,
			highestPercent = 0,
			heightChecker = new HeightChecker(45, 15);

		$('#' + current_page).find(elementCriteria).each(function _eachElement(index, element) {
			'use strict';
			id = element.getAttribute('id');
			if (id) {
				elementPercent = heightChecker.percentVisible(element);
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
			console.log('PageNavigator::findTopVisibleElement(): first visible element on ' + current_page + ': ' + elementId);
			pageTracker.setScrolledId(current_page, elementId);
		} else {
			console.log('no top visible element found!');
		}

		current_page = id = el = elementPercent = highestPercent = null;
	};

	self.replaceCurrentPage = function _replaceCurrentPage(pageId) {
		'use strict';

		console.log('replaceCurrentPage(' + pageId + ')');

		var page = $('#' + pageId);

		$('#header').find('.icon').removeClass('selected');
		$('#header').find('.icon-' + pageId).addClass('selected');

		$('#content').children().css('display', 'none');
		page.css('display', 'block');

		if (!Modernizr.touch) {
			// on non-mobile devices, focus the search input
			var search = page.children('input[type=search]').first();
			if (search) {
				search.focus();
			}
			search = null;
		}
		
		page = null;
	};

	self.navigateTo = function _navigateTo(pageId) {
		'use strict';

		console.log('----------------------------------------------------------------------------------');
		console.log('navigateTo(' + pageId + ')');

		var topElement;

		if (!$(pageId)) {
			console.log('unable to locate element for ' + pageId);
			pageId = null;
			return false;
		}

		if (pageId != 'login' && pageId != 'add-event') {
			amplify.store('current_page', pageId);
		}

		if (scrollManager) {
			scrollManager.enabled = false;
		}
		self.replaceCurrentPage(pageId);

		topElement = pageTracker.getTopElement(pageId);

		if (!topElement || topElement.getIndex() === 0) {
			// console.log('scrolling to the top of the page');
			topElement = null;
			setTimeout(function _scrollTop() {
				'use strict';

				$('#content').scrollTo(0, 0, {
					onAfter: function _onAfter() {
						setTimeout(function _enableScrollManager() {
							if (scrollManager) {
								scrollManager.enabled = true;
							}
						}, 50);
					}
				});
			}, 0);
		} else {
			// console.log('scrolling to ' + topElement.toString());
			var id = '#' + topElement.getId();
			topElement = null;
			setTimeout(function _scrollToElement() {
				'use strict';

				$('#content').scrollTo(id, 0,
					{
						margin: false,
						offset: {left: 0, top: -45},
						onAfter: function _onAfter() {
							id = null;
							setTimeout(function _enableScrollManager() {
								if (scrollManager) {
									scrollManager.enabled = true;
								}
							}, 50);
						}
					}
				);
			}, 0);
		}

		return true;
	};
}
