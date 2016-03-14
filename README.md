# fekey

![](https://img.shields.io/npm/v/fekey.svg) ![](https://img.shields.io/npm/dm/fekey.svg)

基于百度外卖业务，以fis3为基础的前端构建工具

提供面向外卖业务的相关工程的解决方案

支持swig前端模板，支持es6，支持当前外卖nodeui工程前端的构建和发布

```
npm install -g fekey
```

## 普通工程初始化
```
fekey init normal
```

## smarty前端工程初始化
```
fekey init php
```

## node前端工程初始化
```
fekey init node
```

###解决方案类插件：
- [fekey-node](https://www.npmjs.com/package/fekey-node)
- [fekey-smarty](https://www.npmjs.com/package/fekey-smarty)

###优化类（插件属性：optimizer）
- [fis-optimizer-uglify-js](https://www.npmjs.com/package/fis-optimizer-uglify-js) UglifyJS2 压缩插件
- [fis-optimizer-clean-css](https://www.npmjs.com/package/fis-optimizer-clean-css) CleanCss  压缩插件
- [fis-optimizer-png-compressor](https://www.npmjs.com/package/fis-optimizer-png-compressor) PNG 压缩插件

###预处理类
- [fis-parser-less](https://www.npmjs.com/package/fis-parser-less) less 解析插件
- [fis-postprocessor-px2rem](https://www.npmjs.com/package/fis-postprocessor-px2rem) px转rem插件
- [fis-postprocessor-autoprefixer](https://www.npmjs.com/package/fis-postprocessor-autoprefixer) css前缀添加插件
- [fis-parser-babel-5.x](https://www.npmjs.com/package/fis-parser-babel-5.x) es6处理插件

###处理swig模板
1. node前端工程默认引入swig.min.js和fekey-parser-swig插件
2. 需要在fekey-conf.js中配置fekey-parser-swig处理tmpl文件
```
fis.match('**.tmpl', {
    parser : "swig",
    release : false
});
```
3. 同时在需要使用的js文件中通过__inline的方式引入后编译：
```
var dataTmpl = swig.compile(__inline('./data.tmpl'));
```
