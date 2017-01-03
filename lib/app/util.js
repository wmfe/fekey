/*
 * fekey的工具集
 * author: xumingjie@iwaimai.baidu.com
**/
var fs = require('fs'),
  pth = require('path'),
  _exists = fs.existsSync || pth.existsSync;

var _ = module.exports = {};

var IS_WIN = process.platform.indexOf('win') === 0;

/**
 * 是否为windows系统
 * @return {Boolean}
 * @memberOf fis.util
 * @name isWin
 * @function
 */

_.isWin = function() {
    return IS_WIN;
};


/**
 * 固定长度字符前后缀填补方法(fillZero)
 * @param  {String} str  初始字符串
 * @param  {Number} len  固定长度
 * @param  {String} fill 填补的缀
 * @param  {Boolean} pre  前缀还是后缀
 * @return {String}      填补后的字符串
 * @memberOf fis.util
 * @name pad
 * @function
 */
_.pad = function(str, len, fill, pre) {
    if (str.length < len) {
        fill = (new Array(len)).join(fill || ' ');
        if (pre) {
            str = (fill + str).substr(-len)
        } else {
            str = (str + fill).substring(0, len);
        }
    }
    return str;
}

/**
 * 是否为一个文件
 * @param  {String}  path 路径
 * @return {Boolean}      true为是
 * @memberOf fis.util
 * @name isFile
 * @function
 */
_.isFile = function(path) {
  return _exists(path) && fs.statSync(path).isFile();
};

/**
 * 是否为文件夹
 * @param  {String}  path 路径
 * @return {Boolean}      true为是
 * @memberOf fis.util
 * @name isDir
 * @function
 */
_.isDir = function(path) {
  return _exists(path) && fs.statSync(path).isDirectory();
};