/*
 * fekey初始化脚手架指令处理逻辑
 * author: xumingjie@iwaimai.baidu.com wangwei@iwaimai.baidu.com
 **/

'use strict';

// var templates = require('./config/scaffold.js');
var fs = require('fs');
var path = require('path');
var Promise = require('bluebird');
var Scaffold = require('fis-scaffold-kernel');

var config = {
    customFold: path.resolve('fekey-scaffold-template'),
    templatePath: '',
    destPath: path.resolve(),
    customRepo: 'wmfe/fekey-scaffold-',
    keyword_reg: /\{\{-key-\}\}/ig
};

var scaffold = {};
var scaffoldKernel = new Scaffold({
    type: 'github',
    log: {
        level: 0
    }
});
/*
    start函数，脚手架加载的主函数
    参数initType为命令行中读入的initType类型 如果配置文件中没有相关配置，会默认去找wmfe/fekey-scaffold-initType
    通过initConfig中的initType配置来获取要读取的脚手架工程
*/
scaffold.start = function(argv) {
    console.log(argv);
    if (argv.h) {
        // -h 展示帮助信息
        fekey.k_cli.initGuide();
    }

    var initType = argv._[1];
    var targetPath = argv.d || '';

    if (!initType) {
        // 针对只输入fekey init的情况，判断当前目录下是否存在已约定的本地模板, 否则help提示
        if (fs.existsSync(config.customFold)) {
            config.templatePath = config.customFold;
        } else {
            fekey.k_cli.initGuide();
            return;
        }
    } else {
        config.templatePath = path.resolve(initType);
    }

    config.destPath = path.resolve(targetPath);

    var dir = process.cwd();

    // 分析模板来源、是否存在配置文件，执行相应的操作
    analysic();

}

module.exports = scaffold;

/**
 * [获取脚手架配置文件]
 * @param  {[path]} templatePath [模板所在目录]
 * @return {[type]}              [脚手架配置文件]
 */
function getConf(templatePath) {
    var configPath = path.join(templatePath, '/config.js');
    // 判断是否配置规则
    if (fs.existsSync(configPath)) {
        var scaffoldConf = require(configPath);
        return scaffoldConf;
    } else {
        return false;
    }
}

/**
 * 分析模板来源、是否存在配置文件，执行相应的操作
 * @return {[type]} [description]
 */
function analysic() {
    if (fs.existsSync(config.templatePath)) {
        // 本地模板
        fis.log.notice('Using local template from ' + config.templatePath);
        var scaffoldConf = getConf(config.templatePath);
        // 判断是否配置规则
        if (scaffoldConf) {
            deploy(config.templatePath, scaffoldConf);
        } else {
            // 未配置规则：直接将本地模板copy到目标目录下
            deliver({
                from: config.templatePath,
                to: config.destPath
            });
        }
    } else {
        var repo = config.customRepo + initType;
        fis.log.notice('Downloading and unzipping from ' + repo);
        scaffoldKernel.download((repo), function(err, tmp_path) {
            if (err) {
                fis.log.error(err);
            }
            fis.log.notice('download scaffold from ' + repo + ' done');
            var scaffoldConf = getConf(tmp_path);
            if (scaffoldConf) {
                deploy(tmp_path, scaffoldConf);
            } else {
                deliver({
                    from: tmp_path,
                    to: config.destPath
                });
            }
        });
    }
}

/**
 * 对配置文件进行分析、处理
 * @param  {[type]} templatePath [模板所在的本地目录]
 * @param  {[type]} scaffoldConf [配置文件内容]
 * @return {[type]}              [description]
 */
function deploy(templatePath, scaffoldConf) {
    var conf = scaffoldConf.config;
    prompt({conf: conf})
        .then(function(params) {
            var results = postprocess(params)
            var release = deployPath({
                conf: conf,
                results: results,
                from: templatePath,
                to: config.destPath
            });
            deliver({
                conf: conf,
                release: release,
                results: results
            });
        });
}

/**
 * 提示用户输入必要数据
 * @param  {[type]} params [description]
 * @return {[type]}         [description]
 */
function prompt(params) {
    return new Promise(function(resolve, reject) {
        // 输入数据
        scaffoldKernel.prompt(params.conf.prompt, function(err, results) {
            if (err) {
                fis.log.error(err);
            }
            resolve({
                results: results,
                rules: params.conf.property
            });
        });
    })
}

/**
 * 针对输入的参数进行二次处理，比如h5模块中要求活动路由为纯小写
 * @param  {[type]} results [键入的数据]
 * @param  {[type]} rules   [数据处理规则]
 * @return {[type]}         [description]
 */
function postprocess(params) {
    if (params.rules) {
        // 对输入数据的特殊处理
        params.rules.forEach(function(property) {
            params.results[property.name] = property.calc(params.results[property.from]);
        });
    }
    params.results._namespace = fis.config.get('namespace');
    return params.results;
}

/**
 * 利用正则进行数据替换
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
function replace(params) {

}

/**
 * 分析文件路径，将原始文件路径与最终deliver路径进行一一对应
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
function deployPath(params) {
    var release = [];
    // 获取原始文件path与目标文件path数组
    // todo: scaffoldKernel.util.find 针对空文件夹进行了过滤，未返回img和wtpl文件夹
    // author: prompt
    var files = scaffoldKernel.util.find(params.from);
    config.keyword_reg = params.conf.keyword_reg || config.keyword_reg;
    // 将正则转换为字符串
    config.keyword_reg = regToStr(config.keyword_reg);
    fis.util.map(files, function(index, path) {
        var pathTemp = path;
        fis.util.map(params.results, function(key, value) {
            var reg = config.keyword_reg.replace('key', key);
            // 将字符串转化为正则
            reg = strToReg(reg);
            pathTemp = pathTemp.replace(reg, value);
        });
        release.push({
            originalPath: path,
            releasePath: pathTemp.replace(params.from, params.to)
        });
    });
    return release;
}

/**
 * deliver阶段 将文件交付给目标位置
 * @param  {[type]} params [description]
 * @return {[type]}         [description]
 */
function deliver(params) {
    if (params.release) {
        // 遍历文件path数组, 创建目标文件
        fis.util.map(params.release, function(index, path) {
            if (fis.util.isDir(path.releasePath)) {
                // 文件夹：创建目标文件夹
                fis.util.mkdir(path.releasePath);
            } else if (fis.util.isTextFile(path.releasePath)) {
                // 文件：读取原始文件内容
                var content = fis.util.read(path.originalPath);
                // 将正则转换为字符串
                config.keyword_reg = regToStr(config.keyword_reg);
                fis.util.map(params.results, function(key, value) {
                    var reg = config.keyword_reg.replace('key', key);
                    // 将字符串转化为正则
                    reg = strToReg(reg);
                    // 对原始文件内容进行模板数据替换
                    content = content.replace(reg, value);
                });
                // 创建目标文件，并将替换后的文件内容写入
                fis.util.write(path.releasePath, content);
            }
        });
    } else if (params.form && params.to) {
        scaffoldKernel.util.copy(params.from, params.to);
    }
    fis.log.notice('deliver scaffold to ' + config.destPath + ' done');
    after({
        conf: params.conf,
        results: params.results
    });
}

/**
 * 完成脚手架下载、模板写入等操作之后的处理，用于展示配置的提示信息
 * @param  {[type]} conf   [配置文件]
 * @return {[type]}        [description]
 */
function after(params) {
    if (params.conf.after) {
        // 将正则转换为字符串
        config.keyword_reg = regToStr(config.keyword_reg);
        fis.util.map(params.conf.after, function(index, message) {
            fis.util.map(params.results, function(key, value) {
                var reg = config.keyword_reg.replace('key', key);
                // 将字符串转化为正则
                reg = strToReg(reg);
                message = message.replace(reg, value);
            });
            // console.log(message);
        });
    }
}

/**
 * 将正则表达式转换为字符串
 * @param  {[type]} reg [正则表达式]
 * @return {[type]}     [字符串]
 */
function regToStr(reg) {
    return reg + '';
}

/**
 * 将字符串转换为正则
 * @param  {[type]} str [字符串]
 * @return {[type]}     [正则表达式]
 */
function strToReg(str) {
    return eval(str);
}
