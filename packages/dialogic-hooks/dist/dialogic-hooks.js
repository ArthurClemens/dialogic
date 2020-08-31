!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports,require("dialogic")):"function"==typeof define&&define.amd?define(["exports","dialogic"],n):n((e="undefined"!=typeof globalThis?globalThis:e||self).dialogicHooks={},e.dialogic)}(this,(function(e,n){"use strict";
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
    ***************************************************************************** */var i=function(){return(i=Object.assign||function(e){for(var n,i=1,t=arguments.length;i<t;i++)for(var o in n=arguments[i])Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o]);return e}).apply(this,arguments)};function t(){for(var e=0,n=0,i=arguments.length;n<i;n++)e+=arguments[n].length;var t=Array(e),o=0;for(n=0;n<i;n++)for(var r=arguments[n],a=0,c=r.length;a<c;a++,o++)t[o]=r[a];return t}var o=0,r=function(e){var n=e.useEffect,r=e.useState;return function(e){var a=e.isIgnore,c=e.isShow,u=e.isHide,s=e.instance,f=e.deps,d=void 0===f?[]:f,l=e.props,g=void 0===l?{}:l,v=r(o++)[0],h=i(i({},g),g.dialogic?{dialogic:i(i({},g.dialogic),{id:g.dialogic.id||v})}:{dialogic:{id:v}}),p=function(){s.show(h)},y=function(){s.hide(h)};return n((function(){a||void 0!==c&&(c?p():y())}),t(d,[c])),n((function(){a||void 0!==u&&u&&y()}),t(d,[u])),n((function(){if(!a)return function(){y()}}),[]),{show:p,hide:y}}};e.sharedUseDialog=function(e){var n=e.useEffect,t=e.useState,o=e.dialog;return function(e){return r({useEffect:n,useState:t})(i(i({},e),{instance:o}))}},e.sharedUseDialogic=r,e.sharedUseNotification=function(e){var n=e.useEffect,t=e.useState,o=e.notification;return function(e){return r({useEffect:n,useState:t})(i(i({},e),{instance:o}))}},e.sharedUseRemaining=function(e){var t=e.useState,o=e.useMemo;return function(e){var r=t(void 0),a=r[0],c=r[1],u={id:e.id,spawn:e.spawn},s=!!e.instance.exists(u);return o((function(){s&&n.remaining(i(i({},u),{instance:e.instance,roundToSeconds:e.roundToSeconds,callback:function(e){c(e)}}))}),[s]),[a]}},Object.defineProperty(e,"__esModule",{value:!0})}));
