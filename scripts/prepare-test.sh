#!/bin/bash

set -e

node test/template-cli.js prepare

node test/template-cli.js deps

cd test/tmp/deps

SHRINKWRAP_FILE=../../npm-shrinkwrap.json
SHRINKWRAP_CACHED_FILE=node_modules/npm-shrinkwrap.cached.json

if diff -q $SHRINKWRAP_FILE $SHRINKWRAP_CACHED_FILE; then
  echo 'No shrinkwrap changes detected. npm install will be skipped...';
else
  echo 'Blowing away node_modules and reinstalling npm dependencies...'
  rm -rf node_modules
  npm install
  cp $SHRINKWRAP_FILE $SHRINKWRAP_CACHED_FILE
  echo 'npm install successful!'
fi

bower install
