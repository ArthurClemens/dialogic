!function(n,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("mithril/stream")):"function"==typeof define&&define.amd?define(["exports","mithril/stream"],t):t((n=n||self).dialogic={},n.Stream)}(this,(function(n,t){"use strict";t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t;var e=function(){return(e=Object.assign||function(n){for(var t,e=1,i=arguments.length;e<i;e++)for(var r in t=arguments[e])Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r]);return n}).apply(this,arguments)};function i(n,t,e,i){return new(e||(e=Promise))((function(r,o){function u(n){try{s(i.next(n))}catch(n){o(n)}}function a(n){try{s(i.throw(n))}catch(n){o(n)}}function s(n){var t;n.done?r(n.value):(t=n.value,t instanceof e?t:new e((function(n){n(t)}))).then(u,a)}s((i=i.apply(n,t||[])).next())}))}function r(n,t){var e,i,r,o,u={label:0,sent:function(){if(1&r[0])throw r[1];return r[1]},trys:[],ops:[]};return o={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function a(o){return function(a){return function(o){if(e)throw new TypeError("Generator is already executing.");for(;u;)try{if(e=1,i&&(r=2&o[0]?i.return:o[0]?i.throw||((r=i.return)&&r.call(i),0):i.next)&&!(r=r.call(i,o[1])).done)return r;switch(i=0,r&&(o=[2&o[0],r.value]),o[0]){case 0:case 1:r=o;break;case 4:return u.label++,{value:o[1],done:!1};case 5:u.label++,i=o[1],o=[0];continue;case 7:o=u.ops.pop(),u.trys.pop();continue;default:if(!(r=u.trys,(r=r.length>0&&r[r.length-1])||6!==o[0]&&2!==o[0])){u=0;continue}if(3===o[0]&&(!r||o[1]>r[0]&&o[1]<r[3])){u.label=o[1];break}if(6===o[0]&&u.label<r[1]){u.label=r[1],r=o;break}if(r&&u.label<r[2]){u.label=r[2],u.ops.push(o);break}r[2]&&u.ops.pop(),u.trys.pop();continue}o=t.call(n,u)}catch(n){o=[6,n],i=0}finally{e=r=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,a])}}}function o(){for(var n=0,t=0,e=arguments.length;t<e;t++)n+=arguments[t].length;var i=Array(n),r=0;for(t=0;t<e;t++)for(var o=arguments[t],u=0,a=o.length;u<a;u++,r++)i[r]=o[u];return i}var u=function(){for(var n=[],t=0;t<arguments.length;t++)n[t]=arguments[t];return function(t){return n.filter(Boolean).reduce((function(n,t){return t(n)}),t)}},a=function(n){var t=n.domElement,e=n.prop,i=document.defaultView;if(i){var r=i.getComputedStyle(t);if(r)return r.getPropertyValue(e)}},s="show",c="hide",f=function(n,t,e){var i=e[t]||{};Object.keys(i).forEach((function(t){var e=i[t].toString();n.style[t]=e}))},d=function(n,t){return n.split(/ /).map((function(n){return n+"-"+t}))},l=function(n,t,e,i){var r;if(t.styles){var u=function(n,t){return("function"==typeof t?t(n):t)||{}}(n,t.styles);f(n,"default",u),i&&function(n){n.style.transitionDuration="0ms"}(n),f(n,e,u)}if(t.className){var a={showStart:d(t.className,"show-start"),showEnd:d(t.className,"show-end"),hideStart:d(t.className,"hide-start"),hideEnd:d(t.className,"hide-end")};!function(n,t){var e;(e=n.classList).remove.apply(e,o(t.showStart,t.showEnd,t.hideStart,t.hideEnd))}(n,a),a&&(r=n.classList).add.apply(r,a[e])}n.scrollTop},m={showStart:{nextStep:"showEnd"},showEnd:{nextStep:void 0},hideStart:{nextStep:"hideEnd"},hideEnd:{nextStep:void 0}},p=function(n,t){var e=n.domElement;if(!e)return Promise.resolve("no domElement");clearTimeout(n.__transitionTimeoutId__);var i=t===s?"showStart":"hideStart";return new Promise((function(t){l(e,n,i,"showStart"===i),setTimeout((function(){var r=m[i].nextStep;if(r){l(e,n,i=r);var o=function(n){var t=a({domElement:n,prop:"transition-duration"}),e=void 0!==t?v(t):0,i=a({domElement:n,prop:"transition-delay"});return e+(void 0!==i?v(i):0)}(e);n.__transitionTimeoutId__=setTimeout(t,o)}}),0)}))},v=function(n){var t=parseFloat(n)*(-1===n.indexOf("ms")?1e3:1);return isNaN(t)?0:t},h=function(n,t){var e=function(n,t){return t.find((function(t){return t.id===n}))}(n,t);return t.indexOf(e)},g=function(n,t){return[t,n.id,n.spawn].filter(Boolean).join("-")},w={initialState:{store:{}},actions:function(n){return{add:function(t,e){n((function(i){var r=i.store[t]||[];return i.store[t]=o(r,[e]),e.timer&&e.timer.states.map((function(){return w.actions(n).refresh()})),i}))},remove:function(t,e){n((function(n){var i=n.store[t]||[],r=function(n,t){var e=h(n,t);return-1!==e&&t.splice(e,1),t}(e,i);return n.store[t]=r,n}))},replace:function(t,e,i){n((function(n){var r=n.store[t]||[];if(r){var u=h(e,r);-1!==u&&(r[u]=i,n.store[t]=o(r))}return n}))},removeAll:function(t){n((function(n){return n.store[t]=[],n}))},store:function(t,e){n((function(n){return n.store[t]=o(e),n}))},refresh:function(){n((function(n){return e({},n)}))}}},selectors:function(n){var t={getStore:function(){return n().store},find:function(t,e){var i=n().store[t]||[],r=g(e,t),o=i.find((function(n){return n.id===r}));return o?{just:o}:{nothing:void 0}},getAll:function(t,e){var i=n().store[t]||[],r=void 0!==e?e.spawn:void 0,o=void 0!==e?e.id:void 0,u=void 0!==r?i.filter((function(n){return n.identityOptions.spawn===r})):i;return void 0!==o?u.filter((function(n){return n.identityOptions.id===o})):u},getCount:function(n,e){return t.getAll(n,e).length}};return t}},y=t(),O=t.scan((function(n,t){return t(n)}),e({},w.initialState),y),b=e({},w.actions(y)),S=e({},w.selectors(O)),P={callback:function(){},isPaused:!1,onAbort:function(){},onDone:function(){},promise:void 0,remaining:void 0,startTime:void 0,timeoutFn:function(){},timerId:void 0},T=function(n){return window.clearTimeout(n.timerId),{timerId:P.timerId}},E=function(n){return e(e({},T(n)),{isPaused:!0,remaining:x(n)})},x=function(n){return 0===n.remaining||void 0===n.remaining?n.remaining:n.remaining-((new Date).getTime()-(n.startTime||0))},A=function(){var n={initialState:P,actions:function(t){return{start:function(i,r){t((function(o){return e(e(e(e({},o),T(o)),function(n,t,i,r){var o=function(){t(),n.onDone(),r()};return e({timeoutFn:o,promise:new Promise((function(t,e){n.onDone=function(){return t()},n.onAbort=function(){return t()}}))},n.isPaused?{}:{startTime:(new Date).getTime(),timerId:window.setTimeout(o,i),remaining:i})}(o,i,r,(function(){return n.actions(t).done()}))),o.isPaused&&E(o))}))},stop:function(){t((function(n){return e(e(e({},n),function(n){return e({},T(n))}(n)),P)}))},pause:function(){t((function(n){return e(e({},n),!n.isPaused&&E(n))}))},resume:function(n){t((function(t){return e(e({},t),t.isPaused&&function(n,t){window.clearTimeout(n.timerId);var e=t?Math.max(n.remaining||0,t):n.remaining;return{startTime:(new Date).getTime(),isPaused:!1,remaining:e,timerId:window.setTimeout(n.timeoutFn,e)}}(t,n))}))},abort:function(){t((function(n){return n.onAbort(),e(e({},n),T(n))}))},done:function(){t((function(n){return P}))},refresh:function(){t((function(n){return e({},n)}))}}},selectors:function(n){return{isPaused:function(){return n().isPaused},getRemaining:function(){var t=n();return t.isPaused?t.remaining:x(t)},getResultPromise:function(){return n().promise}}}},i=t(),r=t.scan((function(n,t){return t(n)}),e({},n.initialState),i);return{states:r,actions:e({},n.actions(i)),selectors:e({},n.selectors(r))}},j=0,_=0,q=1,k=2,I=function(n){return function(t){return void 0!==n.spawn?t.filter((function(t){return t.identityOptions.spawn===n.spawn})):t}},D=function(n){var t=0;return n.map((function(n){return{item:n,queueCount:n.dialogicOptions.queued?t++:0}})).filter((function(n){return 0===n.queueCount})).map((function(n){return n.item}))},C=function(n,t){return void 0===t&&(t={}),{id:t.id||n.id,spawn:t.spawn||n.spawn}},N=function(n,t){void 0===t&&(t={});var i={id:t.dialogic?t.dialogic.id:void 0,spawn:t.dialogic?t.dialogic.spawn:void 0};return{identityOptions:C(n||{},i),dialogicOptions:e(e(e({},n),t.dialogic),{__transitionTimeoutId__:0}),passThroughOptions:function(n){var t=e({},n);return delete t.dialogic,t}(t)}},F=function(n){return function(t){return function(i){void 0===i&&(i={});var r=N(t,i),o=r.identityOptions,u=r.dialogicOptions,a=r.passThroughOptions;return new Promise((function(r){var s={didShow:function(n){return u.didShow&&u.didShow(n),r(n)},didHide:function(n){return u.didHide&&u.didHide(n),r(n)}},c={ns:n,identityOptions:o,dialogicOptions:u,callbacks:s,passThroughOptions:a,id:g(o,n),timer:u.timeout?A():void 0,key:(j===Number.MAX_VALUE?0:j++).toString(),transitionState:_},f=S.find(n,o);if(f.just&&u.toggle){var d=R(n)(t)(i);return r(d)}if(f.just&&!u.queued){var l=f.just,m=l.dialogicOptions,p=e(e({},c),{transitionState:l.transitionState,dialogicOptions:m});b.replace(n,l.id,p)}else b.add(n,c);r(c)}))}}},R=function(n){return function(t){return function(i){var r=N(t,i),o=r.identityOptions,u=r.dialogicOptions,a=r.passThroughOptions,s=S.find(n,o);if(s.just){var c=s.just,f=e(e({},c),{dialogicOptions:e(e({},c.dialogicOptions),u),passThroughOptions:e(e({},c.passThroughOptions),{passThroughOptions:a})});return b.replace(n,c.id,f),f.transitionState!==k?Y(f):Promise.resolve(f)}return Promise.resolve()}}},M=function(n){return function(t){return function(t){var e=U(n,t).filter((function(n){return!!n.timer}));return e.forEach((function(n){return n.timer&&n.timer.actions.pause()})),Promise.all(e)}}},H=function(n){return function(t){return function(t){var e=t||{},i={id:e.id,spawn:e.spawn},r=U(n,i).filter((function(n){return!!n.timer}));return r.forEach((function(n){return n.timer&&n.timer.actions.resume(e.minimumDuration)})),Promise.all(r)}}},L=function(n,t){return function(e){return function(i){return function(r){var o=function(n){return function(t){return function(e){return S.find(n,C(t,e))}}}(e)(i)(r);return o.just&&o.just&&o.just.timer?o.just.timer.selectors[n]():t}}}},V=L("isPaused",!1),B=L("getRemaining",void 0),G=function(n){return function(t){return function(t){return!!U(n,t).length}}},U=function(n,t){var e=S.getAll(n);return t?u(I(t),function(n){return function(t){return void 0!==n.id?t.filter((function(t){return t.identityOptions.id===n.id})):t}}(t))(e):e},X=function(n){return function(t){return function(t){var e=U(n,t),i=[];return e.forEach((function(n){n.timer&&n.timer.actions.abort(),i.push(n)})),t?i.forEach((function(t){b.remove(n,t.id)})):b.removeAll(n),Promise.resolve(i)}}},z=function(n,t){return e(e({},n),{dialogicOptions:e(e({},n.dialogicOptions),t)})},J=function(n){return function(t){return function(t){var e=t||{},i={id:e.id,spawn:e.spawn},r=U(n,i),o=r.filter((function(n){return!e.queued&&!n.dialogicOptions.queued})),u=r.filter((function(n){return e.queued||n.dialogicOptions.queued})),a=[];if(o.forEach((function(n){return a.push(Y(z(n,e)))})),u.length>0){var s=u[0];b.store(n,[s]),a.push(Y(z(s,e)))}return Promise.all(a)}}},K=function(n){return function(t){return S.getCount(n,t)}},Q=function(n,t){return p(n.dialogicOptions,t)},W=function(n,t,e){return i(this,void 0,void 0,(function(){return r(this,(function(i){return t.actions.start((function(){return Y(n)}),e),[2,L("getResultPromise",void 0)]}))}))},Y=function(n){return i(this,void 0,void 0,(function(){var t;return r(this,(function(i){switch(i.label){case 0:return n.transitionState=k,n.timer&&n.timer.actions.stop(),[4,Q(n,c)];case 1:return i.sent(),n.callbacks.didHide?[4,n.callbacks.didHide(n)]:[3,3];case 2:i.sent(),i.label=3;case 3:return t=e({},n),b.remove(n.ns,n.id),[2,Promise.resolve(t)]}}))}))},Z=function(n){var t=n.ns,i=n.queued,r=n.timeout,o="default_"+t,u="default_"+t,a=e(e({id:o,spawn:u},i&&{queued:i}),void 0!==r&&{timeout:r});return{ns:t,defaultId:o,defaultSpawn:u,defaultDialogicOptions:a,show:F(t)(a),hide:R(t)(a),hideAll:J(t)(a),resetAll:X(t)(a),pause:M(t)(a),resume:H(t)(a),exists:G(t)(a),getCount:K(t),isPaused:V(t)(a),getRemaining:B(t)(a)}},$=Z({ns:"dialog"}),nn=Z({ns:"notification",queued:!0,timeout:3e3});n.actions=b,n.dialog=$,n.dialogical=Z,n.exists=G,n.filterCandidates=function(n,t,e){var i=t[n]||[];return 0==i.length?[]:u(I(e),D)(i)},n.getCount=K,n.getRemaining=B,n.getTimerProperty=L,n.hide=R,n.hideAll=J,n.hideItem=Y,n.isPaused=V,n.notification=nn,n.pause=M,n.remaining=function(n){var t,e=void 0,i=!1,r=function(){var o=n.instance.getRemaining();e!==o&&(e=void 0===o?o:n.roundToSeconds?Math.round(Math.max(o,0)/1e3):Math.max(o,0)),n.callback(e),n.instance.exists()?i||(t=window.requestAnimationFrame(r)):(window.cancelAnimationFrame(t),i=!0)};t=window.requestAnimationFrame(r)},n.resetAll=X,n.resume=H,n.selectors=S,n.setDomElement=function(n,t){t.dialogicOptions.domElement=n},n.show=F,n.showItem=function(n){return i(this,void 0,void 0,(function(){return r(this,(function(t){switch(t.label){case 0:return n.transitionState===q?[3,2]:(n.transitionState=q,[4,Q(n,s)]);case 1:t.sent(),t.label=2;case 2:return n.callbacks.didShow?[4,n.callbacks.didShow(n)]:[3,4];case 3:t.sent(),t.label=4;case 4:return n.dialogicOptions.timeout&&n.timer?[4,W(n,n.timer,n.dialogicOptions.timeout)]:[3,6];case 5:t.sent(),t.label=6;case 6:return[2,Promise.resolve(n)]}}))}))},n.states=O,Object.defineProperty(n,"__esModule",{value:!0})}));
