/*
 * fekey自定义命令行指令处理逻辑
 * author: xumingjie@iwaimai.baidu.com
**/

var fs = require('fs');
var path = require('path');
var _ = require('../app/util.js');
var isFile = _.isFile;

var command = {};

command.start = function (cmdName) {
    var self = this;
    var paths = fis.require.paths;
    paths = this.gatherAvailableNodePaths(paths);
    var resolved = null;
    paths.every(function(dir) {
        var ret = self.loadAsFileSync(path.join(dir, '/', 'fekey-command-' + cmdName)) || self.loadAsDirectorySync(path.join(dir, '/', 'fekey-command-' + cmdName));
        if (ret) {
            resolved = ret;
        }
        return !resolved;
    });

    if (!resolved) {
        fis.log.error('unable to load plugin [%s]', 'fekey-command-' + cmdName);
    }
    else {
        var commandPlugin = require('fekey-command-' + cmdName);
        console.log(commandPlugin);
        commandPlugin();
    }
}

command.gatherAvailableNodePaths = function (paths) {
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

command.loadAsFileSync = function (x) {
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

command.loadAsDirectorySync = function (x) {
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