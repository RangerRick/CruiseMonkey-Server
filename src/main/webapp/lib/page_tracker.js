function PageElement(element, elementId, index) {
	"use strict";
	if (!element || !elementId || index === undefined) {
		throw new TypeError("You must pass an element, element ID, and match index!");
	}

	var m_element      = element,
		m_elementId    = elementId,
		m_index        = index;
	
	this.getElement = function _getElement() {
		"use strict";
		return m_element;
	};
	this.getId = function _getId() {
		"use strict";
		return m_elementId;
	};
	this.getIndex = function _getIndex() {
		"use strict";
		return m_index;
	};
	this.toString = function _toString() {
		"use strict";
		return m_elementId + ' (' + m_index + ')';
	};
}

function PageTracker(elementCriteria) {
	"use strict";
	if (!elementCriteria) {
		throw new TypeError("You must pass an Amplify storage class and an element match criteria!");
	}

	var self = this;

	/** public methods **/
	self.getScrolledId = function _getScrolledId(page) {
		"use strict";
		console.log('PageTracker::getScrolledId(' + page + ')');
		if (!page) {
			throw new TypeError("You must specify a page!");
		}
		return f_getPageCache()[page];
	};
	
	self.setScrolledId = function _setScrolledId(page, id) {
		"use strict";
		console.log('PageTracker::setScrolledId(' + page + ', ' + id + ')');
		if (!page) {
			throw new TypeError("You must specify a page!");
		}
		var page_store_cache = f_getPageCache();
		page_store_cache[page] = id;
		f_setPageCache(page_store_cache);
		return id;
	};

	self.__getElement = function ___getElement(criteria) {
		"use strict";
		return $(criteria);
	};
	self.getElement = function _getElement(criteria) {
		"use strict";
		self._memoize = self._memoize || {};
		return (criteria in self._memoize) ? self._memoize[criteria] : self._memoize[criteria] = self.__getElement(criteria);
	};

	self.getTopElement = function _getTopElement(pageId) {
		"use strict";
		var matched = f_getElementForPageId(pageId);
		if (matched) {
			return matched;
		}
		return null;
	};

	/** internal methods **/
	var f_getPageCache = function() {
		"use strict";
		var page_store_cache = amplify.store('page_store_cache');
		if (!page_store_cache) {
			page_store_cache = {};
		}
		return page_store_cache;
	},
	f_setPageCache = function(new_page_store_cache) {
		"use strict";
		amplify.store('page_store_cache', new_page_store_cache);
	},
	f_getElementForPageId = function(pageId) {
		"use strict";
		// console.log('f_getElementForPageId(' + pageId + ', criteria = ' + elementCriteria + ')');
		var topElement = self.getScrolledId(pageId),
			page = self.getElement('#' + pageId),
			matched = null,
			id = null;

		page.find(elementCriteria).each(function(index, element) {
			"use strict";
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

		return matched;
	};

}
