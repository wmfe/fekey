/*
 * fekey的cli处理逻辑
 * author: xumingjie@iwaimai.baidu.com
 **/

var cli = module.exports = {}
var _ = require('./util.js');
var command = require('../core/command.js');
var scaffold = require('../core/scaffold.js');
var util = require('util');
var path = require('path');


cli.help = function() {
    var strs = [
        '',
        ' Usage: ' + fekey.cli.name + ' <command>'
    ];

    //此处会自动读取插件列表，生成command的help逻辑
    commands = {

    };

    options = {
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

cli.init = function(initType, targetPath) {
    scaffold.start(initType, targetPath)
}

cli.setProjectParams = function(argv, env) {
    var cmdName = argv._[0];
    if (argv.verbose) {
        fis.log.level = fis.log.L_ALL;
    }

    fis.set('options', argv);
    fis.project.setProjectRoot(env.cwd);

    // 如果指定了 media 值
    if (~['release', 'inspect'].indexOf(cmdName) && argv._[1]) {
        fis.project.currentMedia(argv._[1]);
    }

    env.configPath = env.configPath || argv.f || argv.file;
    fis.log.throw = cmdName !== 'release';

    if (env.configPath) {
        try {
            require(env.configPath);
        } catch (e) {
            if (~['release', 'inspect'].indexOf(cmdName)) {
                fis.log.error('Load %s error: %s \n %s', env.configPath, e.message, e.stack);
            } else {
                fis.log.warn('Load %s error: %s', env.configPath, e.message);
            }
        }

        fis.emit('conf:loaded');
        if (fis.project.currentMedia() !== 'dev' && !~Object.keys(fis.config._groups).indexOf(fis.project.currentMedia())) {
            fis.log.warn('You don\'t have any configurations under the media `%s`, are you sure?', fis.project.currentMedia());
        }
    }

    var location = env.modulePath ? path.dirname(env.modulePath) : path.join(__dirname, '../');
    fis.log.info('Currently running %s (%s)', fekey.cli.name, location);

}

/*
 * 处理自定义指令逻辑
 **/

cli.command = function(cmdName, argv, env) {
    this.setProjectParams(argv, env)
    command.start(cmdName, argv, env)
}

/*
 * 处理版本信息展示
 **/

cli.version = function() {
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

cli.guide = function(argv, env) {
    //guide的逻辑包括，如果有version，则处理version显示，否则走help逻辑
    if (argv.v || argv.version) {
        cli.version();
    } else {
        cli.help();
    }
}

/*
 *  初始化引导逻辑
 **/

cli.initGuide = function(argv, env) {
    var options = [
        '   Usage: fekey init [templateFrom] [-d=xxx]',
        '',
        '   Command:',
        '     [ ]              local path from fekey-scaffold-template',
        '     [templateFrom]   local path or template from github',
        '     [-d=xxx]         set dest fold or path',
        '',
        '   Example:',
        '     fekey init',
        '     fekey init ./fekey-scaffold-template -d=./test/fekey-scaffold-template',
        '     fekey init node -d=nodeui',
        '     fekey init h5',
        ''
    ];
    console.log(options.join('\n'));
}