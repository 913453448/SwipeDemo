/**
 * @author YASIN
 * @version [React-Native Ocj V01, 2018/3/28]
 * @date 17/2/23
 * @description SmartRefreshLayout.android
 */
'use strict';

var warning = require('fbjs/lib/warning');

var SmartRefreshLayout = {

    show: function (
        message: string,
        duration: number
    ): void {
        warning(false, 'SmartRefreshLayout is not supported on this platform.');
    },

};

module.exports = SmartRefreshLayout;