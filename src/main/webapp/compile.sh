#!/bin/sh

FILES=""

for FILE in "$@"; do
	FILES="$FILES --js=$FILE"
done

EXTERNS=""
for FILE in externs/*.js; do
	EXTERNS="$EXTERNS --externs $FILE"
done

echo java -jar closure-compiler/compiler.jar --warning_level VERBOSE $EXTERNS $FILES
java -jar closure-compiler/compiler.jar --warning_level VERBOSE $EXTERNS $FILES
