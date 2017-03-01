/*
 * fekey自定义命令行指令处理逻辑
 * author: xumingjie@iwaimai.baidu.com
 **/

var fs = require('fs');
var path = require('path');
var _ = require('../app/util.js');
var isFile = _.isFile;

var command = {};

command.start = function(cmdName, argv, env) {
    var self = this;
    var paths = fis.require.paths;
    paths = this.gatherAvailableNodePaths(paths);
    var resolved = null;
    var pluginName = '';
    paths.every(function(dir) {
        var ret = self.loadAsFileSync(path.join(dir, '/', 'fekey-command-' + cmdName)) || self.loadAsDirectorySync(path.join(dir, '/', 'fekey-command-' + cmdName));
        if (ret) {
            pluginName = path.join(dir, '/', 'fekey-command-' + cmdName);
            resolved = ret;
        }
        return !resolved;
    });
    if (!resolved) { //如果没有找到fekey-command则去找fis3-command，走fis3原有逻辑
        var fisResolved = null;
        var prefixes = ['fis3', 'fis']
        var names = prefixes.map(function(prefix) {
            return prefix + '-command-' + cmdName;
        });
        paths.every(function(dir) {
            names.every(function(name) {
                var ret = self.loadAsFileSync(path.join(dir, '/', name)) || self.loadAsDirectorySync(path.join(dir, '/', name));
                if (ret) {
                    pluginName = path.join(dir, '/', name);
                    fisResolved = ret;
                }
                return !fisResolved;
            });
            return !fisResolved;
        });
        if (!fisResolved) { //fis3的插件也找不到，则输出错误信息
            fis.log.throw = false;
            fis.log.error('unable to load plugin [%s] or [%s] or [%s]', 'fekey-command-' + cmdName, 'fis3-command-' + cmdName, 'fis-command-' + cmdName);
        } else { //找到了fis3的插件，则调用fis3原有逻辑
            var commander = require('commander');
            var cmd = require(pluginName)

            if (cmd.register) {
                // [node, realPath(bin/fis.js)]
                var argvRaw = process.argv;
                //fix args
                var p = argvRaw.indexOf('--no-color');
                ~p && argvRaw.splice(p, 1);

                p = argvRaw.indexOf('--media');
                ~p && argvRaw.splice(p, argvRaw[p + 1][0] === '-' ? 1 : 2);

                // 兼容旧插件。
                cmd.register(
                    commander
                    .command(cmd.name || first)
                    .usage(cmd.usage)
                    .description(cmd.desc)
                );
                commander.parse(argvRaw);
            } else {
                cmd.run(argv, fekey.cli, env);
            }
        }
    } else {
        var commandPlugin = require(pluginName);
        commandPlugin.run(argv, fekey.k_cli, fekey.cli, env);
    }
}

command.gatherAvailableNodePaths = function(paths) {
    paths = paths.concat();
    var start = paths.pop();
    var node_modules = paths.concat();

    var prefix = '/';
    if (/^([A-Za-z]:)/.test(start)) {
        prefix = '';
    } else if (/^\\\\/.test(start)) {
        prefix = '\\\\';
    }
    var splitRe = process.platform === 'win32' ? /[\/\\]/ : /\/+/;

    // ensure that `start` is an absolute path at this point,
    // resolving againt the process' current working directory
    start = path.resolve(start);

    var parts = start.split(splitRe);

    var dirs = [];
    for (var i = parts.length - 1; i >= 0; i--) {
        if (parts[i] === 'node_modules') continue;

        dirs = dirs.concat(
            prefix + path.join(
                path.join.apply(path, parts.slice(0, i + 1)),
                'node_modules'
            )
        );
    }

    if (process.platform === 'win32') {
        dirs[dirs.length - 1] = dirs[dirs.length - 1].replace(":", ":\\");
    }

    return node_modules.concat(dirs);
}

exports.prefixes = ['fis3', 'fis'];
exports.extensions = ['.js'];

command.loadAsFileSync = function(x) {
    if (isFile(x)) {
        return x;
    }

    var extensions = exports.extensions;
    for (var i = 0; i < extensions.length; i++) {
        var file = x + extensions[i];
        if (isFile(file)) {
            return file;
        }
    }
}

command.loadAsDirectorySync = function(x) {
    var pkgfile = path.join(x, '/package.json');
    if (isFile(pkgfile)) {
        var body = fs.readFileSync(pkgfile, 'utf8');
        try {
            var pkg = JSON.parse(body);
            if (pkg.main) {
                var m = this.loadAsFileSync(path.resolve(x, pkg.main));
                if (m) return m;
                var n = this.loadAsDirectorySync(path.resolve(x, pkg.main));
                if (n) return n;
            }
        } catch (err) {}
    }
    return this.loadAsFileSync(path.join(x, '/index'));
}

module.exports = command;