// scaffold 配置文件
module.exports = {
    info: 'create a new project in h5',
    config: {
        type: 'github',
        keyword_reg: '/\\{\\{-key-\\}\\}/ig', // 文件夹名称；注意：正则写法/\$\{key\}/g, 字符串写法'/\\$\\{key\\}/g'
        prompt: [{
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
        property: [{
            name: 'lower_project_name',
            from: 'project_name',
            calc: function(project_name) {
                return project_name.replace(/(\w)/g, function(v) {
                    return v.toLowerCase();
                });
            }
        }],
        ignore: [
            'config.js',
            'README.md'
        ],
        after: [
            '保证本地nodeui环境可用，执行npm run self,',
            '页面路由为: https://127.0.0.1:8197/fly/h5/{{-lower_project_name-}}'
        ]
    }
};
