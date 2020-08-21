!function(n,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((n="undefined"!=typeof globalThis?globalThis:n||self).dialogicHooks={})}(this,(function(n){"use strict";
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
    ***************************************************************************** */var e=function(){return(e=Object.assign||function(n){for(var e,t=1,o=arguments.length;t<o;t++)for(var i in e=arguments[t])Object.prototype.hasOwnProperty.call(e,i)&&(n[i]=e[i]);return n}).apply(this,arguments)};function t(){for(var n=0,e=0,t=arguments.length;e<t;e++)n+=arguments[e].length;var o=Array(n),i=0;for(e=0;e<t;e++)for(var r=arguments[e],f=0,u=r.length;f<u;f++,i++)o[i]=r[f];return o}var o=function(n){var e=n.useEffect;return function(n){var o=n.isIgnore,i=n.isShow,r=n.isHide,f=n.instance,u=n.deps,c=void 0===u?[]:u,s=n.props,a=void 0===s?{}:s,d=function(){f.show(a)},l=function(){f.hide(a)};return e((function(){o||void 0!==i&&(i?d():l())}),t(c,[i])),e((function(){o||void 0!==r&&r&&l()}),t(c,[r])),e((function(){if(!o)return function(){l()}}),[]),{show:d,hide:l}}};n.sharedUseDialog=function(n){var t=n.useEffect,i=n.dialog;return function(n){return o({useEffect:t})(e(e({},n),{instance:i}))}},n.sharedUseDialogic=o,n.sharedUseNotification=function(n){var t=n.useEffect,i=n.notification;return function(n){return o({useEffect:t})(e(e({},n),{instance:i}))}},Object.defineProperty(n,"__esModule",{value:!0})}));
