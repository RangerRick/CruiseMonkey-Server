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

FOUNDATION = $(shell find foundation -type f)

RUNTIME = 3rdparty.js cruisemonkey.js cruisemonkey.css index.html main.html $(wildcard views/*.html) $(wildcard images/*) $(FOUNDATION)

PHONEGAPFILES = $(patsubst %,$(DESTDIR)/%,$(RUNTIME) config.xml cruisemonkey.manifest)

MAKEFILE=Makefile

DESTDIR=/tmp/foo

all: $(RUNTIME) cruisemonkey.manifest

DATE=$(shell date '+%s')
GITHASH=$(shell git log -1 | grep -E '^commit' | cut -d' ' -f2)

cruisemonkey.manifest: cruisemonkey.manifest.in $(3RDPARTYJS) $(CRUISEMONKEYJS) $(RUNTIME) $(MAKEFILE)
	@echo "$< -> $@"
	@sed -e 's,@GITHASH@,$(GITHASH),g' -e 's,@DATE@,$(DATE),g' "$<" > "$@"
	@echo "CACHE:" >> "$@"
	@for FILE in $(3RDPARTYJS) $(CRUISEMONKEYJS) $(RUNTIME); do \
		echo "$$FILE"; \
		done | sort -u >> "$@";

$(DESTDIR)/cruisemonkey.manifest: cruisemonkey.manifest.in $(RUNTIME) $(MAKEFILE)
	@echo "$< -> $@"
	@sed -e 's,@GITHASH@,$(GITHASH),g' -e 's,@DATE@,$(DATE),g' "$<" > "$@"
	@echo "CACHE:" >> "$@"
	@for FILE in $(RUNTIME); do \
		echo "$$FILE"; \
		done | sort -u >> "$@";

main.html: main.html.in $(MAKEFILE)
	@echo "$< -> $@"
	@cat "$<" | grep -v '<!-- PHONEGAP -->' | sed -e 's,<!-- BROWSER -->,,g' > "$@" 2>/dev/null

$(DESTDIR)/main.html: main.html.in $(MAKEFILE)
	@echo "$< -> $@"
	@install -d -m 755 "$(DESTDIR)"
	@cat "$<" | grep -v '<!-- BROWSER -->' | sed -e 's,<!-- PHONEGAP -->,,g' > "$@" 2>/dev/null

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

$(DESTDIR)/%: % $(MAKEFILE)
	@DIR="$(DESTDIR)/`dirname $<`"; \
		echo "$< -> $@"; \
		install -d -m 755 "$$DIR"; \
		install -c -m 644 "$<" "$@"

install: $(PHONEGAPFILES) all
