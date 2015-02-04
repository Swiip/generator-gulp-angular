/**
 * Silence Yeoman during tests
 * uses github.com/balderdashy/fixture-stdout
 *
 * Usage:
 * ```
 * // test-something.js
 * var Output = require( './mute' );
 *
 * // beforeEach() test:
 * this.app.on( 'start', Output.mute );
 * this.app.on( 'end', Output.unmute );
 * ```
 */
'use strict';

var Fixture = require('fixture-stdout');
var fixtureOut = new Fixture();
var fixtureErr = new Fixture({
  stream: process.stderr
});

var _writesOut = [];
var _writesErr = [];

// Mute
module.exports.mute = function () {
  fixtureOut.capture(function onWrite(string) {
    _writesOut.push({
      string: string
    });

    // Prevent original write
    return false;
  });


  fixtureErr.capture(function onWrite(string) {
    _writesErr.push({
      string: string
    });

    // Prevent original write
    return false;
  });
};

// Unmute
module.exports.unmute = function () {
  fixtureOut.release();
  fixtureErr.release();
};

// Return the output that was captured
module.exports.getMutedWrites = function () {
  return {
    out: _writesOut,
    err: _writesErr
  };
};
