3RDPARTYMINJS = \
	3rdparty/jquery/jquery-1.8.3.min.js \
	3rdparty/mustache/mustache.min.js \
	3rdparty/datejs/date.min.js \
	3rdparty/jquery-url-parser/purl.js \
	3rdparty/jquery.scrollTo/jquery.scrollTo.min.js \
	3rdparty/uuid.js
#	3rdparty/hammer/hammer.min.js \
#	3rdparty/hammer/jquery.hammer.min.js \
#	3rdparty/amplifyjs/amplify.min.js \
#	3rdparty/knockout/knockout-2.2.0.js \
#	3rdparty/knockout/knockout.mapping-latest.js \
#	3rdparty/knockout/knockout-delegatedEvents.js \

3RDPARTYJS = \
	3rdparty/mustache/mustache.js \
	3rdparty/knockout/knockout.mapping-latest.debug.js \
	3rdparty/knockout/knockout-delegatedEvents.js \
	3rdparty/hammer/hammer.js \
	3rdparty/hammer/jquery.hammer.js \
	3rdparty/foundation/javascripts/jquery.foundation.navigation.js \
	3rdparty/datejs/date.js \
	3rdparty/datejs/globalization/en-US.js \
	3rdparty/datejs/parser.js \
	3rdparty/amplifyjs/amplify.js \
	3rdparty/jquery-url-parser/purl.js \
	3rdparty/jquery.scrollTo/jquery.scrollTo.js \
	3rdparty/uuid.js

3RDPARTYCSS = \
	3rdparty/foundation/stylesheets/foundation.min.css \
	3rdparty/jquery-ui/css/no-theme/jquery-ui-1.9.2.custom.min.css \
	3rdparty/jquery-ui-timepicker-addon.css


CRUISEMONKEYJS = \
	3rdparty/foundation/javascripts/jquery.foundation.navigation.js \
	3rdparty/hammer/hammer.js \
	3rdparty/hammer/jquery.hammer.js \
	3rdparty/amplifyjs/amplify.js \
	3rdparty/knockout/knockout-2.2.0.js \
	3rdparty/knockout/knockout.mapping-latest.js \
	3rdparty/knockout/knockout-delegatedEvents.js \
	lib/cm_utils.js \
	lib/locations.js \
	lib/page_tracker.js \
	lib/page_navigator.js \
	lib/scroll_manager.js \
	lib/template_loader.js \
	model/events.js \
	model/nav.js \
	model/server.js \
	lib/ajax_updater.js \
	app.js
#	lib/photos.js
#	lib/swiper.js

CRUISEMONKEYMINJS = $(patsubst %.js,temp/%.min.js,$(CRUISEMONKEYJS))

CRUISEMONKEYCSS = styles.css

CRUISEMONKEYMINCSS = $(patsubst %.css,%.min.css,$(CRUISEMONKEYCSS))

FOUNDATION = $(shell find 3rdparty/foundation -type f)

RUNTIME = 3rdparty.js cruisemonkey.js index.html main.html $(wildcard images/*.png images/icons/*/*.png) $(FOUNDATION) styles.css 3rdparty/html5shim/html5.js 3rdparty/modernizr.js

PHONEGAPFILES = \
	cruisemonkey.manifest \
	$(RUNTIME) \
	config.xml \
	cruisemonkey.css \
	3rdparty/jquery-ui/js/jquery-ui-1.9.2.custom.min.js \
	3rdparty/jquery-ui-timepicker-addon.js

PHONEGAPDESTFILES = $(patsubst %,$(DESTDIR)/%,$(PHONEGAPFILES))

MAKEFILE=Makefile

DESTDIR=/tmp/foo

all: cruisemonkey.manifest $(RUNTIME)

DATE=$(shell date '+%s')
GITHASH=$(shell git log -1 | grep -E '^commit' | cut -d' ' -f2)

cruisemonkey.manifest: cruisemonkey.manifest.in $(3RDPARTYMINJS) $(CRUISEMONKEYJS) $(RUNTIME) $(MAKEFILE)
	@echo "$< -> $@"
	@echo "CACHE MANIFEST" > "$@"
	@echo "# version $(GITHASH) $(DATE)" >> "$@"
	@echo "" >> "$@"
	@echo "CACHE:" >> "$@"
	@for FILE in $(3RDPARTYMINJS) $(CRUISEMONKEYJS) $(RUNTIME); do \
		echo "$$FILE"; \
		done | sort -u >> "$@";
	@echo "" >> "$@"
	@echo "NETWORK:" >> "$@"
	@echo "*" >> "$@"

$(DESTDIR)/cruisemonkey.manifest: cruisemonkey.manifest.in $(RUNTIME) $(MAKEFILE)
	@echo "$< -> $@"
	@echo "CACHE MANIFEST" > "$@"
	@echo "# version $(GITHASH) $(DATE)" >> "$@"
	@echo "" >> "$@"
	@echo "CACHE:" >> "$@"
	@for FILE in $(RUNTIME); do \
		echo "$$FILE"; \
		done | sort -u >> "$@";
	@echo "" >> "$@"
	@echo "NETWORK:" >> "$@"
	@echo "*" >> "$@"

main.html: main.html.in
	@echo "$< -> $@"
	@cat "$<" | grep -v -E '(<!--|//) *PHONEGAP *(-->|//)' | sed -e 's,<!-- *BROWSER *--> *,,g' -e 's,// *BROWSER *// *,,g' -e 's,@GITHASH@,$(GITHASH),g' -e 's,@DATE@,$(DATE),g' > "$@" 2>/dev/null

$(DESTDIR)/main.html: main.html.in
	@echo "$< -> $@"
	@install -d -m 755 "$(DESTDIR)"
	@cat "$<" | grep -v -E '(<!--|//) *BROWSER *(-->|//)' | sed -e 's,<!-- *PHONEGAP *--> *,,g' -e 's,// *PHONEGAP *// *,,g' -e 's,@GITHASH@,$(GITHASH),g' -e 's,@DATE@,$(DATE),g' > "$@" 2>/dev/null

temp/%.min.js: %.js
	@install -d $(shell dirname $@)
	@echo "- minifying $<"
	@java -jar node_modules/yuicompressor/build/yuicompressor-2.4.7.jar -v "$<" > "$@" 2>/dev/null

temp/%.min.css: %.css
	@install -d $(shell dirname $@)
	@echo "- minifying $<"
	@java -jar node_modules/yuicompressor/build/yuicompressor-2.4.7.jar -v "$<" > "$@" 2>/dev/null

3rdparty.js: $(3RDPARTYMINJS)
	@echo > 3rdparty.js; for FILE in $(3RDPARTYMINJS); do \
		echo "- $$FILE"; \
		cat $$FILE >> 3rdparty.js; \
		echo "" >> 3rdparty.js; \
	done

cruisemonkey.js: $(CRUISEMONKEYJS) $(MAKEFILE) compile.sh $(wildcard externs/*.js)
	@#cat $(CRUISEMONKEYMINJS) > cruisemonkey.js
	@echo ./compile.sh $(CRUISEMONKEYJS)
	@./compile.sh $(CRUISEMONKEYJS) > "$@" 2>/dev/null || (rm cruisemonkey.js && exit 1)

runtime.js: $(CRUISEMONKEYJS) $(3RDPARTYJS) compile.sh
	@echo ./compile.sh $(CRUISEMONKEYJS) $(3RDPARTYJS)
	@./compile.sh $(CRUISEMONKEYJS) $(3RDPARTYJS) > "$@" 2>/dev/null || (rm runtime.js && exit 1)

styles.min.css: styles.css $(MAKEFILE)
	@node_modules/.bin/yuicompressor "$<" > "$@"

cruisemonkey.css: $(CRUISEMONKEYMINCSS) $(3RDPARTYCSS) $(MAKEFILE)
	@cat $(3RDPARTYCSS) $(CRUISEMONKEYMINCSS) > "$@"

$(DESTDIR)/foundation/%: foundation/%
	@DIR="$(DESTDIR)/`dirname $<`"; \
		echo "$< -> $@"; \
		install -d -m 755 "$$DIR"; \
		install -c -m 644 "$<" "$@"

$(DESTDIR)/%.png: %.png
	@DIR="$(DESTDIR)/`dirname $<`"; \
		echo "$< -> $@"; \
		install -d -m 755 "$$DIR"; \
		install -c -m 644 "$<" "$@"

$(DESTDIR)/%: % $(MAKEFILE)
	@DIR="$(DESTDIR)/`dirname $<`"; \
		echo "$< -> $@"; \
		install -d -m 755 "$$DIR"; \
		install -c -m 644 "$<" "$@"

install: $(PHONEGAPDESTFILES) all
