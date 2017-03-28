/*
 * fekey的入口文件，进行能力的分发
 * author: xumingjie@iwaimai.baidu.com
**/

//在主流程进行判断，如果是init，则走入初始化的分支逻辑，如果是fis定制的modules.commands，则走入fis的分支逻辑，否则走入自定义command的分支

function start (argv, env) {
    var cmdName = argv._[0]
    if (cmdName == 'init') { //进入初始化的逻辑
        // if (argv._[1]) {
        fekey.k_cli.init(argv)
        // }
        // else {
        //     fekey.k_cli.initGuide(argv, env)
        // }
    }
    else if (cmdName) { //其他情况进入自定义指令逻辑
        fekey.k_cli.command(cmdName, argv, env)
    }
    else { //没有指令的情况下，进入引导逻辑
        fekey.k_cli.guide(argv, env)
    }
}

exports.start = start;