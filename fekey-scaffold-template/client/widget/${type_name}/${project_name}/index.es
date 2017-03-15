/**
 * @file {{-project_name-}} 
 * @author {{-project_author-}}
 */
import {
    toast,
    Request,
    addStat,
    thirdParty
} from '../../common/util/index.es6';

import {
    shareInfo
} from 'const.es';

const Invoke = require('node_h5:widget/common/platformInvoke/invoke2.es6');

module.exports = Widget.extend({

    el: '#{{-project_name-}}',

	events: {
	},

    init(data) {
        // 初始化分享文案
        this.initShare();
    },
    
    // 初始化分享文案
    initShare() {
        Invoke.init(shareInfo);
    }
});
