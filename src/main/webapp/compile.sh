#!/bin/sh

FILES=""

for FILE in "$@"; do
	FILES="$FILES --js=$FILE"
done

EXTERNS="--externs externs/zepto.js --externs externs/knockout.js --externs externs/browser.js --externs externs/require.js --externs externs/crypto.js --externs externs/node.js --externs externs/modernizr.js --externs externs/amplify.js --externs externs/phonegap.js --externs externs/uuid.js --externs externs/mustache.js --externs externs/app.js"

echo java -jar closure-compiler/compiler.jar --warning_level VERBOSE $EXTERNS $FILES >&2
java -jar closure-compiler/compiler.jar --warning_level VERBOSE $EXTERNS $FILES
