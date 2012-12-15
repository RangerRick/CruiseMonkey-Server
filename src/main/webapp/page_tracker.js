function PageElement(element, elementId, index) {
	if (!element || !elementId || index === undefined) {
		throw new TypeError("You must pass an element, element ID, and match index!");
	}

	var m_element   = element;
	var m_elementId = elementId;
	var m_index     = index;
	
	this.getElement = function() {
		return m_element;
	};
	this.getId = function() {
		return m_elementId;
	};
	this.getIndex = function() {
		return m_index;
	};
	this.toString = function() {
		return m_elementId + ' (' + m_index + ')';
	};
}

function PageTracker(amplify, elementCriteria) {
	if (!amplify|| !elementCriteria) {
		throw new TypeError("You must pass an Amplify storage class and an element match criteria!");
	}

	var m_amplify = amplify;
	var m_elementCriteria = elementCriteria;

	var me = this;

	/** public methods **/
	me.getScrolledId = function(page) {
		console.log('PageTracker::getScrolledId(' + page + ')');
		if (!page) {
			throw new TypeError("You must specify a page!");
		}
		return f_getPageCache()[page];
	};
	
	me.setScrolledId = function(page, id) {
		console.log('PageTracker::setScrolledId(' + page + ', ' + id + ')');
		if (!page) {
			throw new TypeError("You must specify a page!");
		}
		var page_store_cache = f_getPageCache();
		page_store_cache[page] = id;
		f_setPageCache(page_store_cache);
		return id;
	};
	
	me.getTopElement = function(pageId) {
		var matched = f_getElementForPageId(pageId);
		if (matched) {
			return matched;
		}
		return null;
	};

	me.isElementInViewport = function(el) {
		var m_top    = el.offsetTop;
		var m_height = el.offsetHeight;

		while (el.offsetParent) {
			el = el.offsetParent;
			m_top += el.offsetTop;
		}

		return ( m_top >= window.pageYOffset && (m_top + m_height) <= (window.pageYOffset + window.innerHeight) );
	};

	/** internal methods **/
	var f_getPageCache = function() {
		var page_store_cache = m_amplify.store('page_store_cache');
		if (!page_store_cache) {
			page_store_cache = {};
		}
		return page_store_cache;
	};
	
	var f_setPageCache = function(new_page_store_cache) {
		m_amplify.store('page_store_cache', new_page_store_cache);
	};
	
	var f_getElementForPageId = function(pageId) {
		var topElement = me.getScrolledId(pageId);
		var page = $('#' + pageId);

		var matched = null;
		page.find(m_elementCriteria).each(function(index, element) {
			var id = $(element).attr('id');
			if (id == topElement) {
				matched = new PageElement(element, id, index);
				console.log('PageTracker::getElementForPageId(' + pageId + '): matched ' + matched.toString());
				return false;
			}
			return true;
		});

		return matched;
	};

}
