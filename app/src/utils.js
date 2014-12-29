'use strict';

var path = require('path');
var _ = require('lodash');

/**
 * Turn str into simplest form, remove trailing slash
 * example: ./path/to//some/folder/ will be normalized to to path/to/some/folder
 * @param  {String} str 
 * @return {String} 
 */
function normalizePath(str) {
  var trailingSlash;
  if (path.sep === '/') 
    trailingSlash = new RegExp(path.sep + '$');
  else 
    trailingSlash = new RegExp(path.sep + path.sep + '$');
  return path.normalize(str).replace(trailingSlash, '');
}

/**
 * Check if string is absolute path
 * @param  {String} str 
 * @return {Boolean} 
 */
function isAbsolutePath(str) {
  return path.resolve(str) === normalizePath(str);
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
  _.forEach(folderPairs, function(destFolder, sourceFolder) {
    if (filePath.indexOf(sourceFolder) === 0 && sourceFolder.length > bestMatch.length) {
      bestMatch = sourceFolder;
    }
  });

  if (bestMatch.length)
    return filePath.replace(bestMatch, folderPairs[bestMatch]);
  else
    return filePath;
}

module.exports = {
  isAbsolutePath: isAbsolutePath,
  normalizePath: normalizePath,
  replacePrefix: replacePrefix
};
