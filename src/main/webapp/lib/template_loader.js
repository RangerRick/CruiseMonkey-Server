if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function _indexOf(elt /*, from*/) {
		'use strict';
		var len = this.length >>> 0,
			from = Number(arguments[1]) || 0;

		from = (from < 0) ? Math.ceil(from) : Math.floor(from);
		if (from < 0) from += len;

		for (; from < len; from++) {
			if (from in this && this[from] === elt) return from;
		}
		return -1;
	};
}

/**
 * @constructor
 */
function TemplateLoader(urls) {
	'use strict';
	var self = this,
	m_templateUrls = urls || [],
	m_failed = {},
	m_templates = {},
	f_getSize,
	f_checkOnFinished,
	f_onLoad,
	f_onFail,
	f_loadTemplate;

	f_getSize = function _f_getSize(obj) {
		'use strict';
		// http://stackoverflow.com/a/6700/11236
		var size = 0, key;
		for (key in obj) {
			if (obj.hasOwnProperty(key)) size++;
		}
		return size;
	};

	f_checkOnFinished = function _f_checkOnFinished() {
		'use strict';
		var templateLength = f_getSize(m_templates),
			failedLength = f_getSize(m_failed);

		if ((templateLength + failedLength) >= m_templateUrls.length) {
			self.onFinished();
		}
	};

	f_onLoad = function _f_onLoad(url, template) {
		'use strict';
		console.log('TemplateLoader::f_onLoad(' + url + ', <template>)');
		m_templates[url] = template;

		if (url.indexOf('#') == 0) {
			var escaped = url.replace(self.elementIdRegex, '\\$1');
			$(escaped).remove();
			escaped = null;
		}
		self.onLoad(url, template);
		f_checkOnFinished();
	};

	f_onFail = function _f_onFail(url, textStatus, errorThrown) {
		'use strict';
		console.log('TemplateLoader::f_onFail(' + url + ', ' + textStatus + ')');
		m_failed[url] = errorThrown;

		self.onFail(url);
		f_checkOnFinished();
	};

	f_loadTemplate = function _f_loadTemplate(url) {
		'use strict';
		console.log('TemplateLoader::f_loadTemplate(' + url + ')');
		(function loadUrl() {
			'use strict';
			if (url && url.indexOf('#') === 0) {
				console.log('TemplateLoader::f_loadTemplate: id-based url');
				var escaped = url.replace(self.elementIdRegex, '\\$1');
				f_onLoad(url, $(escaped).html());
				escaped = null;
			} else {
				console.log('TemplateLoader::f_loadTemplate: standard url');
				$.ajax({
					url: url,
					timeout: m_timeout,
					cache: false,
					dataType: 'text'
				}).done(function _done(template, textStatus, jqXHR) {
					f_onLoad(url, template);
				}).fail(function _fail(jqXHR, textStatus, errorThrown) {
					console.log('TemplateLoader::loadTemplate(): An error occurred while updating event JSON: ' + ko.toJSON(jqXHR));
					console.log('textStatus = ' + textStatus + ', errorThrown = ' + errorThrown);
					f_onFail(url, textStatus, errorThrown);
				});
			}
		})();
	};

	self.add = function _add(url) {
		'use strict';
		m_templateUrls.push(url);
	};
	self.remove = function _remove(url) {
		'use strict';
		m_templateUrls.splice(m_templateUrls.indexOf(url), 1);
		delete m_templates[url];
		delete m_failed[url];
	};
	self.clear = function _clear() {
		'use strict';
		m_templateUrls = [];
		m_templates = {};
		m_failed = {};
	};
	self.urls = function _urls() {
		'use strict';
		return m_templateUrls.slice(0);
	};
	self.getTemplate = function _getTemplate(url) {
		'use strict';
		return m_templates[url];
	};
	self.renderTemplate = function _renderTemplate(url, replacements) {
		'use strict';
		if (!replacements) {
			replacements = {};
		}
		var template = m_templates[url];
		if (template) {
			return Mustache.to_html(template, replacements);
		} else {
			return null;
		}
	};

	self.load = function _load() {
		'use strict';
		console.log('TemplateLoader::load()');
		var index, url;
		for (index in m_templateUrls) {
			url = m_templateUrls[index];
			console.log('TemplateLoader::load(): loading ' + url);
			f_loadTemplate(url);
		}
	};
	/**
	 * @param {String|string=} url
	 * @param {String|string=} template
	 */
	self.onLoad = function _onLoad(url, template) {
	};
	/**
	 * @param {String|string=} url
	 * @param {String|string=} template
	 */
	self.onFail = function _onFail(url, template) {
	};
	self.onFinished = function _onFinished() {
	};
}
TemplateLoader.prototype.elementIdRegex = /([^0-9A-Za-z\#])/g;
