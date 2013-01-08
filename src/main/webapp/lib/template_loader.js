if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(elt /*, from*/) {
		"use strict";
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

function TemplateLoader(urls) {
	"use strict";
	var self = this,
	m_templateUrls = urls || [],
	m_failed = {},
	m_templates = {},

	f_getSize = function(obj) {
		"use strict";
		// http://stackoverflow.com/a/6700/11236
		var size = 0, key;
		for (key in obj) {
			if (obj.hasOwnProperty(key)) size++;
		}
		return size;
	},

	f_checkOnFinished = function() {
		"use strict";
		var templateLength = f_getSize(m_templates),
			failedLength = f_getSize(m_failed);

		if ((templateLength + failedLength) >= m_templateUrls.length) {
			self.onFinished();
		}
	},
	f_onLoad = function(url, template) {
		"use strict";
		console.log('TemplateLoader::f_onLoad(' + url + ', <template>)');
		m_templates[url] = template;

		self.onLoad(url, template);
		f_checkOnFinished();
	},
	f_onFail = function(url, textStatus, errorThrown) {
		"use strict";
		console.log('TemplateLoader::f_onFail(' + url + ', ' + textStatus + ')');
		m_failed[url] = errorThrown;

		self.onFail(url);
		f_checkOnFinished();
	},
	f_loadTemplate = function(url) {
		"use strict";
		console.log('TemplateLoader::f_loadTemplate(' + url + ')');
		(function loadUrl() {
			"use strict";
			if (url && url.indexOf('#') === 0) {
				console.log('TemplateLoader::f_loadTemplate: id-based url');
				var escaped = url.replace(self.elementIdRegex, '\\$1');
				f_onLoad( url, $(escaped).html() );
			} else {
				console.log('TemplateLoader::f_loadTemplate: standard url');
				var templateLoaded = function( template ){
					"use strict";
					f_onLoad( url, template );
				},
				failed = function(jqXHR, textStatus, errorThrown) {
					"use strict";
					f_onFail(url, textStatus, errorThrown);
				};
				$.ajax({
					url: url,
					timeout: m_timeout,
					cache: false,
					success: templateLoaded,
					error: failed,
					dataType: 'text'
				});
			}
		})();
	};
	
	self.add = function(url) {
		"use strict";
		m_templateUrls.push(url);
	};
	self.remove = function(url) {
		"use strict";
		m_templateUrls.splice(m_templateUrls.indexOf(url), 1);
		delete m_templates[url];
		delete m_failed[url];
	};
	self.clear = function() {
		"use strict";
		m_templateUrls = [];
		m_templates = {};
		m_failed = {};
	};
	self.urls = function() {
		"use strict";
		return m_templateUrls.slice(0);
	};
	self.getTemplate = function(url) {
		"use strict";
		return m_templates[url];
	};
	self.renderTemplate = function(url, replacements) {
		"use strict";
		if (!replacements) {
			replacements = {};
		}
		var template = m_templates[url];
		return Mustache.to_html(template, replacements);
	};

	self.load = function() {
		"use strict";
		console.log("TemplateLoader::load()");
		var index, url;
		for (index in m_templateUrls) {
			url = m_templateUrls[index];
			console.log('TemplateLoader::load(): loading ' + url);
			f_loadTemplate(url);
		}
	};
	self.onLoad = function(url) {
	};
	self.onFail = function(url) {
	};
	self.onFinished = function() {
	};
}
TemplateLoader.prototype.elementIdRegex = /([^0-9A-Za-z\#])/g;