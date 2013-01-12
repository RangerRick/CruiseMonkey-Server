#!/bin/sh

rm -rf /tmp/chrome-user
mkdir -p /tmp/chrome-user
/Users/ranger/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --allow-file-access-from-files --disable-web-security --remote-debugging-port=9222 --js-flags=--stack_trace_limit=-1 --user-data-dir=/tmp/chrome-user >/tmp/chrome.log 2>&1 &
