#!/bin/bash

set -e

rm -rf test/npm-shrinkwrap.json test/tmp/deps/node_modules test/tmp/deps/package.json test/tmp/deps/npm-shrinkwrap.json

node test/template-cli.js deps

cd test/tmp/deps

npm install

npm shrinkwrap --dev

cp ./npm-shrinkwrap.json ../../npm-shrinkwrap.json
