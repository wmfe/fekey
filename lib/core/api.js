/*
 * fekey对外暴露的api汇总
 * author: xumingjie@iwaimai.baidu.com
**/

/*开启全部同名依赖*/
fekey.useSameNameRequire = function () {
    fis.match('*.{tpl,js,es6,jsx,es}', {
        useSameNameRequire: true
    });
}

/*关闭全部同名依赖*/
fekey.closeSameNameRequire = function () {
    fis.match('*.{tpl,js,es6,jsx,es}', {
        useSameNameRequire: false
    });
}