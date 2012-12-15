#!/bin/sh

rm 3rdparty.js cruisemonkey.js

for FILE in \
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
	jquery.scrollTo/jquery.scrollTo.min.js \
; do
	cat $FILE >> 3rdparty.js
	echo "" >> 3rdparty.js
done

for FILE in \
	cm_utils.js \
	scroll_manager.js \
	page_tracker.js \
	page_navigator.js \
	date.js \
	app.js \
	init.js \
	auth.js \
; do
	echo "=== $FILE ==="
	java -jar node_modules/yuicompressor/build/yuicompressor-2.4.7.jar -v "$FILE" >> cruisemonkey.js
	echo "" >> cruisemonkey.js
done
