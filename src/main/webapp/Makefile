3RDPARTYJS = \
	3rdparty/jquery/jquery-1.8.3.min.js \
	3rdparty/mustache/mustache.min.js \
	3rdparty/knockout/knockout-2.2.0.js \
	3rdparty/knockout/knockout.mapping-latest.js \
	3rdparty/hammer/hammer.min.js \
	3rdparty/hammer/jquery.hammer.min.js \
	3rdparty/foundation/javascripts/foundation.min.js \
	3rdparty/datejs/date.min.js \
	3rdparty/amplifyjs/amplify.min.js \
	3rdparty/jquery-url-parser/purl.js \
	3rdparty/jquery.scrollTo/jquery.scrollTo.min.js

CRUISEMONKEYJS = \
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

CRUISEMONKEYMINCSS = $(patsubst %.css,temp/%.min.css,$(CRUISEMONKEYCSS))

FOUNDATION = $(shell find 3rdparty/foundation -type f)

RUNTIME = 3rdparty.js cruisemonkey.js index.html main.html $(wildcard images/*.png images/icons/*/*.png) $(FOUNDATION) styles.css 3rdparty/html5shim/html5.js

PHONEGAPFILES = $(patsubst %,$(DESTDIR)/%,$(RUNTIME) config.xml cruisemonkey.manifest)

MAKEFILE=Makefile

DESTDIR=/tmp/foo

all: $(RUNTIME) cruisemonkey.manifest

DATE=$(shell date '+%s')
GITHASH=$(shell git log -1 | grep -E '^commit' | cut -d' ' -f2)

cruisemonkey.manifest: cruisemonkey.manifest.in $(3RDPARTYJS) $(CRUISEMONKEYJS) $(RUNTIME) $(MAKEFILE)
	@echo "$< -> $@"
	@echo "CACHE MANIFEST" > "$@"
	@echo "# version $(GITHASH) $(DATE)" >> "$@"
	@echo "" >> "$@"
	@echo "CACHE:" >> "$@"
	@for FILE in $(3RDPARTYJS) $(CRUISEMONKEYJS) $(RUNTIME); do \
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
	@cat "$<" | grep -v '<!-- PHONEGAP -->' | sed -e 's,<!-- BROWSER -->,,g' > "$@" 2>/dev/null

$(DESTDIR)/main.html: main.html.in
	@echo "$< -> $@"
	@install -d -m 755 "$(DESTDIR)"
	@cat "$<" | grep -v '<!-- BROWSER -->' | sed -e 's,<!-- PHONEGAP -->,,g' > "$@" 2>/dev/null

temp/%.min.js: %.js
	@install -d $(shell dirname $@)
	@echo "- minifying $<"
	@java -jar node_modules/yuicompressor/build/yuicompressor-2.4.7.jar -v "$<" > "$@" 2>/dev/null

temp/%.min.css: %.css
	@install -d $(shell dirname $@)
	@echo "- minifying $<"
	@java -jar node_modules/yuicompressor/build/yuicompressor-2.4.7.jar -v "$<" > "$@" 2>/dev/null

3rdparty.js: $(3RDPARTYJS)
	@echo > 3rdparty.js; for FILE in $(3RDPARTYJS); do \
		cat $$FILE >> 3rdparty.js; \
		echo "" >> 3rdparty.js; \
	done

cruisemonkey.js: $(CRUISEMONKEYJS) $(MAKEFILE) compile.sh
	@#cat $(CRUISEMONKEYMINJS) > cruisemonkey.js
	@echo ./compile.sh $(CRUISEMONKEYJS)
	@./compile.sh $(CRUISEMONKEYJS) > "$@" 2>/dev/null

cruisemonkey.css: $(CRUISEMONKEYMINCSS)
	@cat $(CRUISEMONKEYMINCSS) > cruisemonkey.css

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

install: $(PHONEGAPFILES) all
