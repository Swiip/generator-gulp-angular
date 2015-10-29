'use strict';

var path = require('path');
var _ = require('lodash');
var slash = require('slash');

/**
 * Turn str into simplest form, remove trailing slash
 * example:
 * './path/to//some/folder/' (unix) will be normalized to 'path/to/some/folder'
 * 'path\\to\\some\\folder\\' (windows) will be normalized to 'path/to/some/folder'
 * @param  {String} str, can be unix style path ('/') or windows style path ('\\')
 * @return {String} normalized unix style path
 */
function normalizePath(str) {
  var trailingSlash;
  if (path.sep === '/') {
    trailingSlash = new RegExp(path.sep + '$');
  } else {
    trailingSlash = new RegExp(path.sep + path.sep + '$');
  }
  return slash(path.normalize(str).replace(trailingSlash, ''));
}

/**
 * Check if string is absolute path
 * @param  {String} str, can be unix style path ('/') or windows style path ('\\')
 * @return {Boolean} true if string is absolute path
 */
function isAbsolutePath(str) {
  return slash(path.resolve(str)) === normalizePath(str);
}

/**
 * Replace sourceFolder with destFolder in filePath
 * if filePath has any sourceFolder as prefix
 * choose longest match if there are multiple prefixes that match
 * @param  {String} filePath    File path to be altered
 * @param  {Object} folderPairs Hash of pairs of sourceFolder:destFolder
 *                              Similar to what stored in this.props.paths
 * @return {String}             new file path
 */
function replacePrefix(filePath, folderPairs) {
  var bestMatch = '';

  _.forEach(folderPairs, function (destFolder, sourceFolder) {
    if (filePath.indexOf(sourceFolder) === 0 && sourceFolder.length > bestMatch.length) {
      bestMatch = sourceFolder;
    }
  });

  if (bestMatch.length) {
    return filePath.replace(bestMatch, folderPairs[bestMatch]);
  } else {
    return filePath;
  }
}

module.exports = {
  isAbsolutePath: isAbsolutePath,
  normalizePath: normalizePath,
  replacePrefix: replacePrefix
};
