/**
 * @constructor
 */
function PageElement(element, elementId, index) {
	'use strict';
	if (!element || !elementId || index === undefined) {
		throw new TypeError('You must pass an element, element ID, and match index!');
	}
	var self = this;

	self.getElement = function _getElement() {
		return element;
	};
	self.getId = function _getId() {
		return elementId;
	};
	self.getIndex = function _getIndex() {
		return index;
	};
	self.toString = function _toString() {
		return self.getElement() + ' (' + self.getIndex() + ')';
	};
}

/**
 * @constructor
 */
function PageTracker(elementCriteria) {
	'use strict';
	if (!elementCriteria) {
		throw new TypeError('You must pass an Amplify storage class and an element match criteria!');
	}

	var self = this,
		f_getPageCache,
		f_setPageCache,
		f_getElementForPageId;

	/** public methods **/
	self.getScrolledId = function _getScrolledId(pageId) {
		'use strict';
		console.log('PageTracker::getScrolledId(' + pageId + ')');
		if (!pageId) {
			throw new TypeError('You must specify a page ID!');
		}

		return f_getPageCache()[pageId];
	};

	self.setScrolledId = function _setScrolledId(page, id) {
		'use strict';
		console.log('PageTracker::setScrolledId(' + page + ', ' + id + ')');
		if (!page) {
			throw new TypeError('You must specify a page!');
		}
		var page_store_cache = f_getPageCache();
		page_store_cache[page] = id;
		f_setPageCache(page_store_cache);
		page_store_cache = null;
		return id;
	};

	self.getTopElement = function _getTopElement(pageId) {
		'use strict';
		var matched = f_getElementForPageId(pageId);
		if (matched) {
			return matched;
		}
		return null;
	};

	/** internal methods **/
	f_getPageCache = function() {
		'use strict';
		var page_store_cache = amplify.store('page_store_cache');
		if (!page_store_cache) {
			page_store_cache = {};
		}
		return page_store_cache;
	};
	f_setPageCache = function(new_page_store_cache) {
		'use strict';
		amplify.store('page_store_cache', new_page_store_cache);
		new_page_store_cache = null;
	};
	f_getElementForPageId = function(pageId) {
		'use strict';
		// console.log('f_getElementForPageId(' + pageId + ', criteria = ' + elementCriteria + ')');
		var topElement = self.getScrolledId(pageId),
			page,
			matched = null,
			id = null;

		if (app.cache.elements[pageId]) {
			page = $(app.cache.elements[pageId]);
		} else {
			page = $('#' + pageId);
		}
		page.find(elementCriteria).each(function(index, element) {
			'use strict';
			id = element.getAttribute('id');
			if (id == topElement) {
				// console.log('new PageElement(' + element + ', ' + id + ', ' + index + ')');
				matched = new PageElement(element, id, index);
				// console.log('PageTracker::getElementForPageId(' + pageId + '): matched ' + matched.toString());
				console.log('PageTracker::getElementForPageId(' + pageId + '): matched');
				return false;
			}
			return true;
		});
		
		topElement = null;
		page = null;
		id = null;

		return matched;
	};

}
