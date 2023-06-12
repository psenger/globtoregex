const directoryseperator = string => string.replace(/\//g, '\\/')
const dot = string => string.replace(/\./g, '\\.')
const splatsplat = string => string.replace(/\*{2}/g, ".*")
const question = string => string.replace(/\?/g, ".{1}")
const splat = string => string.replace(/(?<!\*)\*(?!\*)/g, "[^\\/]*")
const extensionGroup = string => string.replace(/\{(.*)\}/g, '($1)');
const negativeUnixLike = string => string.replace(/\[!(.*)\]/g, '[^($1)]');

/**
 * Converts a glob to a regex
 * @param glob {string} - The glob to convert
 * @returns {RegExp}
 */
module.exports.globToRegex = (glob) => { //, options) => {
    // const absolute = options && options.absolute ? '^' : '';
    return new RegExp(`^${[extensionGroup,dot,directoryseperator,splat,splatsplat,question,negativeUnixLike]
        .reduce((acc,cur) => {
            return cur(acc)
        },glob)}$`)
}
