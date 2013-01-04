var CMUtils = {

	getSummary: function(element) {
		return $(element).find('div.summary').text();
	},

	isElementInViewport: function(element) {
		var m_top    = element.offsetTop,
		 	m_height = element.offsetHeight;
		

		while (element.offsetParent) {
			element = element.offsetParent;
			m_top += element.offsetTop;
		}

		return ( m_top >= window.pageYOffset && (m_top + m_height) <= (window.pageYOffset + window.innerHeight) );
	},

	isElementVisible: function(element) {
		var m_top = element.offsetTop;

		while (element.offsetParent) {
			element = element.offsetParent;
			m_top += element.offsetTop;
		}
		
		return ( m_top >= window.pageYOffset );
	}

};