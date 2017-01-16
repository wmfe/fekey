/*
 * fekey的cli处理逻辑
 * author: xumingjie@iwaimai.baidu.com
**/

var cli = module.exports = {}
var _ = require('./util.js');
var command = require('../core/command.js');
var scaffold = require('../core/scaffold.js');
var util = require('util');

cli.help = function () {
    var strs = [
        '',
        ' Usage: ' + fekey.cli.name + ' <command>'
    ];

    //此处会自动读取插件列表，生成command的help逻辑
    commands = {

    };

    options =  {
        '-h, --help': 'print this help message',
        '-v, --version': 'print product version and exit',
        '--verbose': 'enable verbose mode'
    };

    var optionsKeys = Object.keys(options);

    if (optionsKeys.length) {
    maxWidth = optionsKeys.reduce(function(prev, curr) {
      return curr.length > prev ? curr.length : prev;
    }, 0) + 4;

    strs.push(null, ' Options:', null);

    optionsKeys.forEach(function(key) {
      strs.push(util.format('   %s %s', _.pad(key, maxWidth), options[key]));
    });

    strs.push(null);
  }
    console.log(strs.join('\n'));
}

/*
 * 处理脚手架工程逻辑
**/

cli.init = function (initType, targetPath) {
    scaffold.start(initType, targetPath)
}

/*
 * 处理自定义指令逻辑
**/

cli.command = function (cmdName, argv) {
    command.start(cmdName, argv)
}

/*
 * 处理版本信息展示
**/

cli.version = function () {
    var content = ['',
        '  v' + cli.info.version,
        ''
    ].join('\n');

    var logo;

    logo = [
        '   /\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ /\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\  /\\\\\\        /\\///    /\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\   /\\\\\\                 /\\///',
        '   \\/\\\\\\/////////// \\/\\\\\\///////////  \\/\\\\\\      /\\///     \\/\\\\\\///////////     \\/\\\\\\            /\\///',
        '    \\/\\\\\\            \\/\\\\\\             \\/\\\\\\    /\\///       \\/\\\\\\                 \\/\\\\\\        /\\///',
        '     \\/\\\\\\\\\\\\\\\\\\\\\\    \\/\\\\\\\\\\\\\\\\\\\\\\     \\/\\\\\\  /\\///         \\/\\\\\\\\\\\\\\\\\\\\\\          \\/\\\\\\   /\\///',
        '      \\/\\\\\\///////     \\/\\\\\\///////      \\/\\\\\\ \\/\\\\\\          \\/\\\\\\///////              |||||',
        '       \\/\\\\\\            \\/\\\\\\             \\/\\\\\\   \\/\\\\\\        \\/\\\\\\                    |||||',
        '        \\/\\\\\\            \\/\\\\\\             \\/\\\\\\    \\/\\\\\\       \\/\\\\\\                   |||||',
        '         \\/\\\\\\            \\/\\\\\\\\\\\\\\\\\\\\\\\\    \\/\\\\\\     \\/\\\\\\      \\/\\\\\\\\\\\\\\\\\\\\\\\\         |||||',
        '          \\///             \\/\\\\\\////////     \\/\\\\\\      \\/\\\\\\     \\/\\\\\\////////         |||||',
        ''
    ].join('\n');

    console.log(content + '\n' + logo);
}

/*
 * 处理引导逻辑
**/

cli.guide = function (argv, env) {
    //guide的逻辑包括，如果有version，则处理version显示，否则走help逻辑
    if (argv.v || argv.version) {
        cli.version();
    }
    else {
        cli.help();
    }
}

/*
 *  初始化引导逻辑
**/

cli.initGuide = function (argv, env) {
    var options = [
        '   fekey init <initType>',
        '   example: fekey init newsystem'
    ];
    console.log(options.join('\n'));
}