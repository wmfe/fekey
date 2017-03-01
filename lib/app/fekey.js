var fekey = {};
var fis = require('fis3');
//fekey是fis的一个超集

fekey = fis;

/*
 * 定义fekey的全局变量
**/
Object.defineProperty(global, 'fekey', {
  enumerable: true,
  writable: false,
  value: fekey
});

//加载fekey本身的命令行控制逻辑

fekey.k_cli = require('./cli');

fekey.k_release = require('../core/release');

//设置对外暴露的业务接口
var api = require('../core/api.js');
api.register();

//进行fekey的相关配置

fekey.require.prefixes.unshift('fekey');
fekey.cli.name = 'fekey';
fekey.k_cli.info = fekey.cli.info = require('../../package.json');

fekey.entry = require('./entry')

module.exports = fekey;