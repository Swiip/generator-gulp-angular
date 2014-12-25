'use strict';

var path = require('path');
var _ = require('lodash');

/**
 * Turn str into simplest form & relative to cwd
 * example: ./path/to//some/folder/ will be reduced to path/to/some/folder
 * @param  {String} str 
 * @return {String} 
 */
function normalizePath(str) {
  return path.relative(process.cwd(), path.join(process.cwd(), str));
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
  normalizePath: normalizePath,
  replacePrefix: replacePrefix
};