!function(n,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports,require("dialogic")):"function"==typeof define&&define.amd?define(["exports","dialogic"],e):e((n="undefined"!=typeof globalThis?globalThis:n||self).dialogicHooks={},n.dialogic)}(this,(function(n,e){"use strict";
/*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */var i=function(){return(i=Object.assign||function(n){for(var e,i=1,t=arguments.length;i<t;i++)for(var o in e=arguments[i])Object.prototype.hasOwnProperty.call(e,o)&&(n[o]=e[o]);return n}).apply(this,arguments)};function t(){for(var n=0,e=0,i=arguments.length;e<i;e++)n+=arguments[e].length;var t=Array(n),o=0;for(e=0;e<i;e++)for(var r=arguments[e],f=0,c=r.length;f<c;f++,o++)t[o]=r[f];return t}var o=function(n){var e=n.useEffect;return function(n){var i=n.isIgnore,o=n.isShow,r=n.isHide,f=n.instance,c=n.deps,u=void 0===c?[]:c,s=n.props,a=void 0===s?{}:s,d=function(){f.show(a)},l=function(){f.hide(a)};return e((function(){i||void 0!==o&&(o?d():l())}),t(u,[o])),e((function(){i||void 0!==r&&r&&l()}),t(u,[r])),e((function(){if(!i)return function(){l()}}),[]),{show:d,hide:l}}};n.sharedUseDialog=function(n){var e=n.useEffect,t=n.dialog;return function(n){return o({useEffect:e})(i(i({},n),{instance:t}))}},n.sharedUseDialogic=o,n.sharedUseNotification=function(n){var e=n.useEffect,t=n.notification;return function(n){return o({useEffect:e})(i(i({},n),{instance:t}))}},n.sharedUseRemaining=function(n){var t=n.useState,o=n.useMemo;return function(n){var r=t(void 0),f=r[0],c=r[1],u={id:n.id,spawn:n.spawn},s=!!n.instance.exists(u);return o((function(){s&&e.remaining(i(i({},u),{instance:n.instance,roundToSeconds:n.roundToSeconds,callback:function(n){c(n)}}))}),[s]),[f]}},Object.defineProperty(n,"__esModule",{value:!0})}));
