function PageTracker(amplify) {
	if (!amplify) {
		throw new TypeError("You must pass the Amplify storage class!");
	}
	m_amplify = amplify;

	var me = this;

	/** public methods **/
	me.setScrolledId = function(page, id) {
		console.log('PageTracker::setScrolledId(' + page + ', ' + id + ')');
		if (!page) {
			throw new TypeError("You must specify a page!");
		}
		var page_store_cache = f_getPageCache();
		page_store_cache[page] = id;
		f_setPageCache(page_store_cache);
	};
	
	me.getScrolledId = function(page) {
		console.log('PageTracker::getScrolledId(' + page + ')');
		if (!page) {
			throw new TypeError("You must specify a page!");
		}
		return f_getPageCache()[page];
	}

	/** internal methods **/
	f_getPageCache = function() {
		var page_store_cache = m_amplify.store('page_store_cache');
		if (!page_store_cache) {
			page_store_cache = {};
		}
		return page_store_cache;
	};
	
	f_setPageCache = function(new_page_store_cache) {
		m_amplify.store('page_store_cache', new_page_store_cache);
	}
}
