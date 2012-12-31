3RDPARTYJS = \
	jquery/jquery-1.8.1.min.js \
	mustache/mustache.min.js \
	knockout/knockout-2.2.0.js \
	knockout/knockout.mapping-latest.js \
	hammer/hammer.min.js \
	hammer/jquery.hammer.min.js \
	foundation/javascripts/foundation.min.js \
	datejs/date.min.js \
	amplifyjs/amplify.min.js \
	jquery-url-parser/purl.js \
	jquery.scrollTo/jquery.scrollTo.min.js
#	jsOauth/jsOAuth-1.3.6.min.js \

CRUISEMONKEYJS = \
	cm_utils.js \
	scroll_manager.js \
	page_tracker.js \
	page_navigator.js \
	template_loader.js \
	date.js \
	app.js \
	init.js
#	auth.js

CRUISEMONKEYMINJS = $(patsubst %.js,temp/%.min.js,$(CRUISEMONKEYJS))

CRUISEMONKEYCSS = \
	foundation/stylesheets/foundation.css \
	styles.css

CRUISEMONKEYMINCSS = $(patsubst %.css,temp/%.min.css,$(CRUISEMONKEYCSS))

DISTILLED = 3rdparty.js cruisemonkey.js cruisemonkey.css

INSTALLFILES = $(patsubst %,$(DESTDIR)/%,$(CRUISEMONKEYJS) $(DISTILLED) $(wildcard *.html) $(wildcard views/*.html) $(wildcard images/*))

MAKEFILE=Makefile

DESTDIR=/tmp/foo

all: $(DISTILLED)


temp/%.min.js: %.js $(MAKEFILE)
	@install -d $(shell dirname $@)
	@echo "- minifying $<"
	@java -jar node_modules/yuicompressor/build/yuicompressor-2.4.7.jar -v "$<" > "$@" 2>/dev/null

temp/%.min.css: %.css $(MAKEFILE)
	@install -d $(shell dirname $@)
	@echo "- minifying $<"
	@java -jar node_modules/yuicompressor/build/yuicompressor-2.4.7.jar -v "$<" > "$@" 2>/dev/null

3rdparty.js: $(3RDPARTYJS) $(MAKEFILE)
	@echo > 3rdparty.js; for FILE in $(3RDPARTYJS); do \
		cat $$FILE >> 3rdparty.js; \
		echo "" >> 3rdparty.js; \
	done

cruisemonkey.js: $(CRUISEMONKEYMINJS) $(MAKEFILE)
	@cat $(CRUISEMONKEYMINJS) > cruisemonkey.js

cruisemonkey.css: $(CRUISEMONKEYMINCSS) $(MAKEFILE)
	@cat $(CRUISEMONKEYMINCSS) > cruisemonkey.css

$(DESTDIR)/%: %
	@DIR="$(DESTDIR)/`dirname $<`"; \
		echo "$< -> $@"; \
		install -d -m 755 "$$DIR"; \
		install -c -m 644 "$<" "$@"

install: $(INSTALLFILES)
