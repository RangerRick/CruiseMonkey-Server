function PageElement(element, elementId, index) {
	"use strict";
	if (!element || !elementId || index === undefined) {
		throw new TypeError("You must pass an element, element ID, and match index!");
	}

	var m_element      = element,
		m_elementId    = elementId,
		m_index        = index;
	
	this.getElement = function() {
		"use strict";
		return m_element;
	};
	this.getId = function() {
		"use strict";
		return m_elementId;
	};
	this.getIndex = function() {
		"use strict";
		return m_index;
	};
	this.toString = function() {
		"use strict";
		return m_elementId + ' (' + m_index + ')';
	};
}

function PageTracker(amplify, elementCriteria) {
	"use strict";
	if (!amplify|| !elementCriteria) {
		throw new TypeError("You must pass an Amplify storage class and an element match criteria!");
	}

	var m_elementCriteria = elementCriteria,
		m_elementCache    = [],
		self = this;

	/** public methods **/
	self.getScrolledId = function(page) {
		"use strict";
		console.log('PageTracker::getScrolledId(' + page + ')');
		if (!page) {
			throw new TypeError("You must specify a page!");
		}
		return f_getPageCache()[page];
	};
	
	self.setScrolledId = function(page, id) {
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

	self._getElement = function(criteria) {
		"use strict";
		return $(criteria);
	};
	self.getElement = function(criteria) {
		"use strict";
		self._memoize = self._memoize || {};
		return (criteria in self._memoize) ? self._memoize[criteria] : self._memoize[criteria] = self._getElement(criteria);
	};

	self.getTopElement = function(pageId) {
		"use strict";
		var matched = f_getElementForPageId(pageId);
		if (matched) {
			return matched;
		}
		return null;
	};

	self.getHeader = function() {
		"use strict";
		return self.getElement('#header');
	};
	self.getContainer = function() {
		"use strict";
		return self.getElement('#content');
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
		// console.log('f_getElementForPageId(' + pageId + ', criteria = ' + m_elementCriteria + ')');
		var topElement = self.getScrolledId(pageId),
			page = self.getElement('#' + pageId),
			matched = null,
			id = null;

		page.find(m_elementCriteria).each(function(index, element) {
			"use strict";
			id = element.getAttribute('id');
			if (id == topElement) {
				console.log('new PageElement(' + element + ', ' + id + ', ' + index + ')');
				matched = new PageElement(element, id, index);
				console.log('PageTracker::getElementForPageId(' + pageId + '): matched ' + matched.toString());
				return false;
			}
			return true;
		});

		return matched;
	};

}
