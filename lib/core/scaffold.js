/*
 * fekey初始化脚手架指令处理逻辑
 * author: xumingjie@iwaimai.baidu.com
**/

var Promise = require('bluebird');
var fs = require('fs');
var path = require('path');
var exists = fs.existsSync;
var fekeyConfFilePath = path.dirname(__dirname) + '/config/.fekeyrc';
var homeConfFilePath = process.env['HOME'] + '/.fekeyrc';
var exec = require('child_process').exec;
var child_process = require('child_process');

var Scaffold = require('fis-scaffold-kernel');

var initConfig;

/*
    init配置文件读取逻辑：优先读取home目录下的配置文件，如果不存在，则读取fekey中的配置文件，并复制到home目录中
*/
if (exists(homeConfFilePath)) {
    initConfig = JSON.parse(fs.readFileSync(homeConfFilePath)).init;
    var defaultInitConfig = JSON.parse(fs.readFileSync(fekeyConfFilePath)).init;
    if (initConfig.version < defaultInitConfig.version) { //对home目录的配置文件进行版本校验
        exec('cp ' + fekeyConfFilePath + ' ' + homeConfFilePath);
        initConfig = defaultInitConfig
    }
}
else {
    initConfig = JSON.parse(fs.readFileSync(fekeyConfFilePath)).init;
    exec('cp ' + fekeyConfFilePath + ' ' + homeConfFilePath);
}

var scaffoldKernel = new Scaffold({
    type: initConfig.type,
    log: {
        level: 0
    }
});

var scaffold = {};

/*
    start函数，脚手架加载的主函数
    参数initType为命令行中读入的initType类型 如果配置文件中没有相关配置，会默认去找wmfe/fekey-scaffold-initType
    通过initConfig中的initType配置来获取要读取的脚手架工程
*/
scaffold.start = function (initType, targetPath) {
    var defaultConfigReps = 'wmfe/fekey-scaffold-' + initType;
    var initTypeConfig = initConfig['detail'][initType];
    if (initTypeConfig) {
        var initTypeConfigReps = initTypeConfig.reps;
        if (!initTypeConfigReps) {
            initTypeConfigReps = defaultConfigReps;
        }
    }
    else {
        initTypeConfigReps = defaultConfigReps;
    }
    Promise.try(this.download.bind(this, initTypeConfigReps, targetPath)).then(this.deliver).then(this.npmInstall).then(this.fisInstall);
}

/*
    download函数，用于脚手架工程的下载
*/

scaffold.download = function (reps, targetPath) {
    console.log('>>>>>> downloading scaffold from ' + reps + ' <<<<<<')
    return new Promise(function (resolve, reject) {
        scaffoldKernel.download(reps, function (err, tempPath) {
            if (err) {
                console.log(err);
            }
            else {
                resolve({
                    tempPath: tempPath,
                    targetPath: targetPath
                });
                console.log('>>>>>> download scaffold done <<<<<<');
            }
        })
    })
}

scaffold.deliver = function (params) {
    var tempPath = params.tempPath;
    var targetPath = params.targetPath;
    return new Promise(function (resolve, reject) {
        if (!targetPath) {
            targetPath = process.cwd();
        }
        else {
            targetPath = process.cwd() + '/' + targetPath;
        }
        console.log('target path = ' + targetPath);
        scaffoldKernel.deliver(tempPath, targetPath);
        resolve();
    });
}

scaffold.npmInstall = function () {
    var packageJson = process.cwd() + '/package.json';
    if (exists(packageJson)) {
        var config = require(packageJson);
        if (config.dependencies || config.devDependencies) {
            // run `npm install`
            return new Promise(function(resolve, reject) {
                scaffoldKernel.prompt([{
                    name: 'Run `npm install`?',
                    'default': 'y'
                }], function(error, result) {
                    if (error) {
                        return reject(error);
                    }

                    if (/^\s*y\s*$/.test(result['Run `npm install`?'])) {
                        var spawn = child_process.spawn;
                        console.log('npm install');

                        var npm = process.platform === "win32" ? "npm.cmd" : "npm";
                        var install = spawn(npm, ['install'], {
                            cwd: process.cwd()
                        });
                        install.stdout.pipe(process.stdout);
                        install.stderr.pipe(process.stderr);

                        install.on('error', function(reason) {
                            reject(reason);
                        });

                        install.on('close', function() {
                            resolve();
                        });
                    } else {
                        resolve();
                    }
                });
            });
        }
    }
    else {
        console.log('package not exists');
    }
}

scaffold.fisInstall = function () {
    var json = process.cwd() + '/component.json';

    if (exists(json)) {
        var config = require(json);
        return new Promise(function(resolve, reject) {
            scaffoldKernel.prompt([{
                name: 'Run `fis3 install`?',
                'default': 'y'
            }], function(error, result) {
                if (error) {
                    return reject(error);
                }

                if (/^\s*y\s*$/.test(result['Run `fis3 install`?'])) {
                    var spawn = child_process.spawn;
                    console.log('npm install');

                    var spawn = child_process.spawn;
                    console.log('Installing components...');

                    var install = spawn(process.execPath, [process.argv[1], 'install']);
                    install.stdout.pipe(process.stdout);
                    install.stderr.pipe(process.stderr);

                    install.on('error', function(reason) {
                        reject(reason);
                    });

                    install.on('close', function() {
                        resolve();
                    });
                } else {
                    resolve();
                }
            });
        });
    }
}

module.exports = scaffold;