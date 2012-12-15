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
	jsOauth/jsOAuth-1.3.6.min.js \
	jquery-url-parser/purl.js \
	jquery.scrollTo/jquery.scrollTo.min.js

CRUISEMONKEYJS = \
	cm_utils.js \
	scroll_manager.js \
	page_tracker.js \
	page_navigator.js \
	date.js \
	app.js \
	init.js \
	auth.js

CRUISEMONKEYMINJS = $(patsubst %.js,%.min.js,$(CRUISEMONKEYJS))

CRUISEMONKEYCSS = \
	foundation/stylesheets/foundation.css \
	styles.css

CRUISEMONKEYMINCSS = $(patsubst %.css,%.min.css,$(CRUISEMONKEYCSS))

%.min.js: %.js
	java -jar node_modules/yuicompressor/build/yuicompressor-2.4.7.jar -v "$<" > "$@"

%.min.css: %.css
	java -jar node_modules/yuicompressor/build/yuicompressor-2.4.7.jar -v "$<" > "$@"

3rdparty.js: $(3RDPARTYJS)
	cat $(3RDPARTYJS) >> 3rdparty.js

cruisemonkey.js: $(CRUISEMONKEYMINJS)
	cat $(CRUISEMONKEYMINJS) > cruisemonkey.js


cruisemonkey.css: $(CRUISEMONKEYMINCSS)
	cat $(CRUISEMONKEYMINCSS) > cruisemonkey.css
