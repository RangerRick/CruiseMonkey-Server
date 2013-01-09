#!/bin/sh

FILES=""

for FILE in "$@"; do
	FILES="$FILES --js=$FILE"
done

java -jar closure-compiler/compiler.jar $FILES
