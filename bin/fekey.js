#!/usr/bin/env node
'use strict'

var Liftoff = require('liftoff');
var argv = require('minimist')(process.argv.slice(2));
var path = require('path');
var cli = new Liftoff({
    name: 'fekey', // 命令名字
    processTitle: 'fekey',
    moduleName: 'fekey',
    configName: 'fekey-conf',

    // only js supported!
    extensions: {
        '.js': null
    }
});

cli.launch({
    cwd: argv.r || argv.root,
    configPath: argv.f || argv.file
}, function(env) {
    var fekey;
    if (!env.modulePath) {
        fekey = require('../');
    } else {
        fekey = require(env.modulePath);
    }
    // 配置插件查找路径，优先查找本地项目里面的 node_modules
    // 然后才是全局环境下面安装的 fis3 目录里面的 node_modules
    fekey.require.paths.unshift(path.join(env.cwd, 'node_modules'));
    fekey.require.paths.push(path.join(path.dirname(__dirname), 'node_modules'));
    fekey.require.paths.push(path.join(path.join(path.dirname(__dirname), 'node_modules', 'fis3', 'node_modules')));

    fekey.entry.start(argv, env);

});