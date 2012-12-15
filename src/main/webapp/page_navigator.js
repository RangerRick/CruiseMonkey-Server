function PageNavigator(amplify, pageTracker, defaultPage, elementCriteria) {
	if (!amplify || !pageTracker || !defaultPage || !elementCriteria) {
		throw new TypeError("You must specify an Amplify storage class, page tracker, default page, and an element criteria!");
	}

	var m_amplify         = amplify;
	var m_pageTracker     = pageTracker;
	var m_defaultPage     = defaultPage;
	var m_elementCriteria = elementCriteria;

	var me = this;

	me.getCurrentPage = function() {
	    var current_page = m_amplify.store('current_page');
	    console.log('PageNavigator::getCurrentPage(): current_page = ' + current_page);
	    if (!current_page || current_page == 'login') {
	    	current_page = m_defaultPage;
	    	amplify.store('current_page', current_page);
	    }
	    return current_page;
	};

	me.findTopVisibleElement = function() {
		console.log('PageNavigator::findTopVisibleElement()');
		var found = null;
		var current_page = me.getCurrentPage();
		$('#' + current_page).find(m_elementCriteria).each(function(index, element) {
			if (m_pageTracker.isElementInViewport(element)) {
				var id = $(element).attr('id');
				if (id) {
					var summary = CMUtils.getSummary(element);
					console.log("PageNavigator::findTopVisibleElement(): first visible element on " + current_page + ": " + summary + ' (' + id + ')');
					m_pageTracker.setScrolledId(current_page, id);
					found = element;
					return false;
				}
			}
			return true;
		});

		return found;
	}


}