/*
 * fekey的入口文件，进行能力的分发
 * author: xumingjie@iwaimai.baidu.com
**/
var fekey = {};
var fis = require('fis3');
//fekey是fis的一个超集

fekey = fis;

//加载fekey本身的命令行控制逻辑

fekey.k_cli = require('./cli');

//设置对外暴露的业务接口
require('../core/api.js');

//进行fekey的相关配置

fekey.require.prefixes.unshift('fekey');
fekey.cli.name = 'fekey';
fekey.k_cli.info = fekey.cli.info = require('../../package.json');

//在主流程进行判断，如果是init，则走入初始化的分支逻辑，如果是fis定制的modules.commands，则走入fis的分支逻辑，否则走入自定义command的分支

fekey.entry = {};
var fisModuleCommand = ['install', 'release', 'server', 'inspect'];

fekey.entry.start = function (argv, env) {
    var cmdName = argv._[0]
    if (fisModuleCommand.indexOf(cmdName) > -1) { //如果是fis自带的指令，走fis的逻辑（这里摘除了init进行单独的处理）
        fis.cli.run(argv, env)
    }
    else if (cmdName == 'init') { //进入初始化的逻辑
        console.log(argv)
        if (argv._[1]) {
            var initType = argv._[1]
            var targetPath = argv.p
            fekey.k_cli.init(initType, targetPath)
        }
        else {
            fekey.k_cli.initGuide(argv, env)
        }
    }
    else if (cmdName) { //其他情况进入自定义指令逻辑
        fekey.k_cli.command(cmdName, argv)
    }
    else { //没有指令的情况下，进入引导逻辑
        fekey.k_cli.guide(argv, env)
    }

}

/*
 * 定义fekey的全局变量
**/
Object.defineProperty(global, 'fekey', {
  enumerable: true,
  writable: false,
  value: fekey
});


module.exports = fekey;