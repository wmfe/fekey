// 每种 scaffold 配置文件
module.exports = {
    'info': 'create a new project in h5',
    'config': {
        'type': 'github',
        'needApp': true,
        'path': '/h5',
        'allowCustom': true,
        'pathReg': '/\\$\\{key\\}/g', // 文件夹名称；注意：正则写法/\$\{key\}/g, 字符串写法'/\\$\\{key\\}/g'
        'contentReg': /\{\{-key-\}\}/ig, // 同上
        'prompt': [{
            name: 'project_name',
            description: 'Enter your h5 project name',
            type: 'string',
            required: true,
            default: 'game2'
        }, {
            name: 'type_name',
            description: 'Enter h5 project type (app | huodong)',
            type: 'string',
            required: true,
            default: 'huodong'
        }],
        'property': [{
            name: 'lower_project_name',
            from: 'project_name',
            calc: function(project_name) {
                return project_name.replace(/(\w)/g, function(v) {
                    return v.toLowerCase(); // todo
                });
            }
        }],
        'after': [
            '保证本地 nodeui 环境可用，执行 npm run self, ',
            '页面路由为 https://127.0.0.1:8197/fly/h5/${lower_project_name}'
        ]
    }
};
