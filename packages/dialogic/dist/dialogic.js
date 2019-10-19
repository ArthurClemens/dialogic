!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t=t||self).dialogic={})}(this,(function(t){"use strict";const e=(...t)=>e=>t.filter(Boolean).reduce((t,e)=>e(t),e),n=({domElement:t,prop:e})=>{if(window.getComputedStyle){const n=document.defaultView;if(n){const i=n.getComputedStyle(t);if(i)return i.getPropertyValue(e)}}},i="show",o="hide",s=(t,e,n)=>{const i=n[e]||{};Object.keys(i).forEach(e=>{const n=i[e].toString();t.style[e]=n})},r=(t,e)=>t.split(/ /).map(t=>`${t}-${e}`),a=(t,e,n,i)=>{if(e.styles){const o=((t,e)=>("function"==typeof e?e(t):e)||{})(t,e.styles);s(t,"default",o),i&&(t=>t.style.transitionDuration="0ms")(t),s(t,n,o)}if(e.className){const i={showStart:r(e.className,"show-start"),showEnd:r(e.className,"show-end"),hideStart:r(e.className,"hide-start"),hideEnd:r(e.className,"hide-end")};((t,e)=>t.classList.remove(...e.showStart,...e.showEnd,...e.hideStart,...e.hideEnd))(t,i),i&&t.classList.add(...i[n])}t.scrollTop},d={showStart:{nextStep:"showEnd"},showEnd:{nextStep:void 0},hideStart:{nextStep:"hideEnd"},hideEnd:{nextStep:void 0}},u=(t,e)=>{const o=t.domElement;if(!o)return Promise.resolve("no domElement");let s=e===i?"showStart":"hideStart";return new Promise(e=>{a(o,t,s,"showStart"===s),setTimeout(()=>{const i=d[s].nextStep;if(i){a(o,t,s=i);const r=(t=>{const e=n({domElement:t,prop:"transition-duration"}),i=void 0!==e?c(e):0,o=n({domElement:t,prop:"transition-delay"});return i+(void 0!==o?c(o):0)})(o);setTimeout(e,r)}},0)})},c=t=>{const e=parseFloat(t)*(-1===t.indexOf("ms")?1e3:1);return isNaN(e)?0:e};var l=function(t,e){return t(e={exports:{}},e.exports),e.exports}((function(t){!function(){n.SKIP={},n.lift=function(){var t=arguments[0];return o(Array.prototype.slice.call(arguments,1)).map((function(e){return t.apply(void 0,e)}))},n.scan=function(t,e,i){var o=i.map((function(i){var o=t(e,i);return o!==n.SKIP&&(e=o),o}));return o(e),o},n.merge=o,n.combine=i,n.scanMerge=function(t,e){var n=t.map((function(t){return t[0]})),o=i((function(){var i=arguments[arguments.length-1];return n.forEach((function(n,o){i.indexOf(n)>-1&&(e=t[o][1](e,n()))})),e}),n);return o(e),o},n["fantasy-land/of"]=n;var e=!1;function n(t){var e,o=[],r=[];function a(e){return arguments.length&&e!==n.SKIP&&(t=e,s(a)&&(a._changing(),a._state="active",o.forEach((function(e,n){e(r[n](t))})))),t}return a.constructor=n,a._state=arguments.length&&t!==n.SKIP?"active":"pending",a._parents=[],a._changing=function(){s(a)&&(a._state="changing"),o.forEach((function(t){t._changing()}))},a._map=function(e,i){var s=i?n():n(e(t));return s._parents.push(a),o.push(s),r.push(e),s},a.map=function(t){return a._map(t,"active"!==a._state)},a.toJSON=function(){return null!=t&&"function"==typeof t.toJSON?t.toJSON():t},a["fantasy-land/map"]=a.map,a["fantasy-land/ap"]=function(t){return i((function(t,e){return t()(e())}),[t,a])},a._unregisterChild=function(t){var e=o.indexOf(t);-1!==e&&(o.splice(e,1),r.splice(e,1))},Object.defineProperty(a,"end",{get:function(){return e||((e=n()).map((function(t){return!0===t&&(a._parents.forEach((function(t){t._unregisterChild(a)})),a._state="ended",a._parents.length=o.length=r.length=0),t})),e)}}),a}function i(t,e){var i=e.every((function(t){if(t.constructor!==n)throw new Error("Ensure that each item passed to stream.combine/stream.merge/lift is a stream");return"active"===t._state})),o=i?n(t.apply(null,e.concat([e]))):n(),s=[],r=e.map((function(n){return n._map((function(r){return s.push(n),(i||e.every((function(t){return"pending"!==t._state})))&&(i=!0,o(t.apply(null,e.concat([s]))),s=[]),r}),!0)})),a=o.end.map((function(t){!0===t&&(r.forEach((function(t){t.end(!0)})),a.end(!0))}));return o}function o(t){return i((function(){return t.map((function(t){return t()}))}),t)}function s(t){return"pending"===t._state||"active"===t._state||"changing"===t._state}Object.defineProperty(n,"HALT",{get:function(){return e||console.log("HALT is deprecated and has been renamed to SKIP"),e=!0,n.SKIP}}),t.exports=n}()}));const m=(t,e)=>{const n=((t,e)=>e.find(e=>e.id===t))(t,e);return e.indexOf(n)},p=(t,e)=>[e,t.id,t.spawn].filter(Boolean).join("-"),f={initialState:{store:{}},actions:t=>({add:(e,n)=>{t(i=>{const o=i.store[e]||[];return i.store[e]=[...o,n],n.timer&&n.timer.states.map(()=>f.actions(t).refresh()),i})},remove:(e,n)=>{t(t=>{const i=t.store[e]||[],o=((t,e)=>{const n=m(t,e);return-1!==n&&e.splice(n,1),e})(n,i);return t.store[e]=o,t})},replace:(e,n,i)=>{t(t=>{const o=t.store[e]||[];if(o){const s=m(n,o);-1!==s&&(o[s]=i,t.store[e]=[...o])}return t})},removeAll:e=>{t(t=>(t.store[e]=[],t))},store:(e,n)=>{t(t=>(t.store[e]=[...n],t))},refresh:()=>{t(t=>({...t}))}}),selectors:t=>{const e={getStore:()=>{return t().store},find:(e,n)=>{const i=t().store[e]||[],o=p(n,e),s=i.find(t=>t.id===o);return s?{just:s}:{nothing:void 0}},getAll:(e,n)=>{const i=t().store[e]||[],o=void 0!==n?n.spawn:void 0,s=void 0!==n?n.id:void 0,r=void 0!==o?i.filter(t=>t.identityOptions.spawn===o):i;return void 0!==s?r.filter(t=>t.identityOptions.id===s):r},getCount:(t,n)=>e.getAll(t,n).length};return e}},g=l(),h=l.scan((t,e)=>e(t),{...f.initialState},g),v={...f.actions(g)},w={...f.selectors(h)},S={callback:()=>{},isPaused:void 0,onAbort:()=>{},onDone:()=>{},promise:void 0,remaining:void 0,startTime:void 0,timeoutFn:()=>{},timerId:void 0},O=(t,e,n,i)=>{const o=()=>{e(),t.onDone(),i()};return{timeoutFn:o,promise:new Promise((e,n)=>{t.onDone=()=>e(),t.onAbort=()=>n()}),...t.isPaused?{}:{startTime:(new Date).getTime(),timerId:window.setTimeout(o,n),remaining:n}}},y=t=>(window.clearTimeout(t.timerId),{timerId:S.timerId}),P=t=>({...y(t)}),E=t=>({...y(t),isPaused:!0,remaining:T(t)}),_=(t,e)=>{window.clearTimeout(t.timerId);const n=e?Math.max(t.remaining||0,e):t.remaining;return{startTime:(new Date).getTime(),isPaused:!1,remaining:n,timerId:window.setTimeout(t.timeoutFn,n)}},T=t=>void 0===t.remaining?void 0:t.remaining-((new Date).getTime()-(t.startTime||0)),b=()=>{const t={initialState:S,actions:e=>({start:(n,i)=>{e(o=>({...o,...y(o),...O(o,n,i,()=>t.actions(e).done()),...o.isPaused&&E(o)}))},stop:()=>{e(t=>({...t,...P(t),...S}))},pause:()=>{e(t=>({...t,...!t.isPaused&&E(t)}))},resume:t=>{e(e=>({...e,...e.isPaused&&_(e,t)}))},abort:()=>{e(t=>(t.onAbort(),{...t,...y(t)}))},done:()=>{e(t=>S)},refresh:()=>{e(t=>({...t}))}}),selectors:t=>({isPaused:()=>{return t().isPaused},getRemaining:()=>{const e=t();return e.isPaused?e.remaining:T(e)},getResultPromise:()=>{return t().promise}})},e=l(),n=l.scan((t,e)=>e(t),{...t.initialState},e);return{states:n,actions:{...t.actions(e)},selectors:{...t.selectors(n)}}};let j=0;const x=()=>j===Number.MAX_SAFE_INTEGER?0:j++,I=0,A=1,N=2,q=t=>e=>n=>i=>{const o=C(e)(n)(i);return o.just?t(e,o.just,i):Promise.resolve()},C=t=>e=>n=>w.find(t,H(e,n)),D=t=>e=>void 0!==t.spawn?e.filter(e=>e.identityOptions.spawn===t.spawn):e,k=t=>{let e=0;return t.map(t=>({item:t,queueCount:t.dialogicOptions.queued?e++:0})).filter(({queueCount:t})=>0===t).map(({item:t})=>t)},H=(t,e={})=>({id:e.id||t.id,spawn:e.spawn||t.spawn}),R=(t,e={})=>{const n={id:e.dialogic?e.dialogic.id:void 0,spawn:e.dialogic?e.dialogic.spawn:void 0};return{identityOptions:H(t||{},n),dialogicOptions:{...t,...e.dialogic},passThroughOptions:(t=>{const e={...t};return delete e.dialogic,e})(e)}},K=t=>e=>(n={})=>{const{identityOptions:i,dialogicOptions:o,passThroughOptions:s}=R(e,n);return new Promise(r=>{const a={didShow:t=>(o.didShow&&o.didShow(t),r(t)),didHide:t=>(o.didHide&&o.didHide(t),r(t))},d={ns:t,identityOptions:i,dialogicOptions:o,callbacks:a,passThroughOptions:s,id:p(i,t),timer:o.timeout?b():void 0,key:x().toString(),transitionState:I},u=w.find(t,i);if(u.just&&o.toggle){const i=F(t)(e)(n);return r(i)}if(u.just&&!o.queued){const e=u.just,n=e.dialogicOptions,i={...d,transitionState:e.transitionState,dialogicOptions:n};v.replace(t,e.id,i)}else v.add(t,d);r(d)})},F=t=>e=>n=>{const{identityOptions:i,dialogicOptions:o,passThroughOptions:s}=R(e,n),r=w.find(t,i);if(r.just){const e=r.just,n=e.dialogicOptions.domElement,i={...r.just,dialogicOptions:{...e,...o,domElement:n},passThroughOptions:s};return v.replace(t,e.id,i),i.transitionState!==N?Y(i):Promise.resolve(i)}return Promise.resolve()},L=q((t,e)=>(e&&e.timer&&e.timer.actions.pause(),Promise.resolve(e))),M=q((t,e,n={})=>(e&&e.timer&&e.timer.actions.resume(n.minimumDuration),Promise.resolve(e))),$=t=>e=>n=>i=>{const o=C(e)(n)(i);return o.just&&o.just&&o.just.timer?o.just.timer.selectors[t]():void 0},J=$("isPaused"),B=$("getRemaining"),V=t=>e=>e=>!!G(t,e).length,G=(t,n)=>{const i=w.getAll(t);let o;return o=n?e(D(n),(t=>e=>void 0!==t.id?e.filter(e=>e.identityOptions.id===t.id):e)(n))(i):i},X=t=>e=>e=>{const n=G(t,e),i=[];return n.forEach(t=>{t.timer&&t.timer.actions.abort(),i.push(t)}),e?i.forEach(e=>{v.remove(t,e.id)}):v.removeAll(t),Promise.resolve(i)},z=(t,e)=>({...t,dialogicOptions:{...t.dialogicOptions,...e}}),Q=t=>e=>e=>{const n=e||{},i={id:n.id,spawn:n.spawn},o=G(t,i),s=o.filter(t=>!n.queued&&!t.dialogicOptions.queued),r=o.filter(t=>n.queued||t.dialogicOptions.queued),a=[];if(s.forEach(t=>a.push(Y(z(t,n)))),r.length>0){const[e]=r;v.store(t,[e]),a.push(Y(z(e,n)))}return Promise.all(a)},U=t=>e=>w.getCount(t,e),W=(t,e)=>u(t.dialogicOptions,e),Y=async function(t){t.transitionState=N,t.timer&&t.timer.actions.stop(),await W(t,o),t.callbacks.didHide&&await t.callbacks.didHide(t);const e={...t};return v.remove(t.ns,t.id),Promise.resolve(e)},Z=({ns:t,queued:e,timeout:n})=>{const i=`default_${t}`,o=`default_${t}`,s={id:i,spawn:o,...e&&{queued:e},...void 0!==n&&{timeout:n}};return{ns:t,defaultId:i,defaultSpawn:o,defaultDialogicOptions:s,show:K(t)(s),hide:F(t)(s),hideAll:Q(t)(s),resetAll:X(t)(s),pause:L(t)(s),resume:M(t)(s),exists:V(t)(s),getCount:U(t),isPaused:J(t)(s),getRemaining:B(t)(s)}},tt=Z({ns:"dialog"}),et=Z({ns:"notification",queued:!0,timeout:3e3});t.actions=v,t.dialog=tt,t.dialogical=Z,t.exists=V,t.filterCandidates=(t,n,i)=>{const o=n[t]||[];return 0==o.length?[]:e(D(i),k)(o)},t.getCount=U,t.getRemaining=B,t.getTimerProperty=$,t.hide=F,t.hideAll=Q,t.hideItem=Y,t.isPaused=J,t.notification=et,t.pause=L,t.performOnItem=q,t.resetAll=X,t.resume=M,t.selectors=w,t.setDomElement=(t,e)=>{e.dialogicOptions.domElement=t},t.show=K,t.showItem=async function(t){return t.transitionState!==A&&(t.transitionState=A,await W(t,i)),t.callbacks.didShow&&await t.callbacks.didShow(t),t.dialogicOptions.timeout&&t.timer&&await async function(t,e,n){return e.actions.start(()=>Y(t),n),$("getResultPromise")}(t,t.timer,t.dialogicOptions.timeout),Promise.resolve(t)},t.states=h,Object.defineProperty(t,"__esModule",{value:!0})}));
//# sourceMappingURL=dialogic.js.map
