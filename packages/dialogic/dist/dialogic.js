!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t=t||self).dialogic={})}(this,function(t){"use strict";const e=({domElement:t,prop:e})=>{if(window.getComputedStyle){const n=document.defaultView;if(n){const i=n.getComputedStyle(t);if(i)return i.getPropertyValue(e)}}},n="show",i="hide",o=(t,e,n)=>{const i=n[e]||{};Object.keys(i).forEach(e=>{const n=i[e].toString();t.style[e]=n})},r=(t,e,n,i)=>{if(e.styles){const r=((t,e)=>("function"==typeof e?e(t):e)||{})(t,e.styles);o(t,"default",r),i&&(t=>t.style.transitionDuration="0ms")(t),o(t,n,r)}if(e.className){const i={showStart:`${e.className}-show-start`,showEnd:`${e.className}-show-end`,hideStart:`${e.className}-hide-start`,hideEnd:`${e.className}-hide-end`};((t,e)=>t.classList.remove(e.showStart,e.showEnd,e.hideStart,e.hideEnd))(t,i),i&&t.classList.add(i[n])}},s={showStart:{nextStep:"showEnd"},showEnd:{nextStep:void 0},hideStart:{nextStep:"hideEnd"},hideEnd:{nextStep:void 0}},a=(t,i)=>{const o=t.domElement;if(!o)return Promise.resolve("no domElement");let a=i===n?"showStart":"hideStart";return new Promise(n=>{r(o,t,a,"showStart"===a);const i=s[a].nextStep;i&&setTimeout(()=>{r(o,t,a=i);const s=(t=>{const n=e({domElement:t,prop:"transition-duration"}),i=void 0!==n?d(n):0,o=e({domElement:t,prop:"transition-delay"});return i+(void 0!==o?d(o):0)})(o);setTimeout(n,s)},0)})},d=t=>{const e=parseFloat(t)*(-1===t.indexOf("ms")?1e3:1);return isNaN(e)?0:e};var u=function(t,e){return t(e={exports:{}},e.exports),e.exports}(function(t){!function(){n.SKIP={},n.lift=function(){var t=arguments[0];return o(Array.prototype.slice.call(arguments,1)).map(function(e){return t.apply(void 0,e)})},n.scan=function(t,e,i){var o=i.map(function(i){var o=t(e,i);return o!==n.SKIP&&(e=o),o});return o(e),o},n.merge=o,n.combine=i,n.scanMerge=function(t,e){var n=t.map(function(t){return t[0]}),o=i(function(){var i=arguments[arguments.length-1];return n.forEach(function(n,o){i.indexOf(n)>-1&&(e=t[o][1](e,n()))}),e},n);return o(e),o},n["fantasy-land/of"]=n;var e=!1;function n(t){var e,o=[],s=[];function a(e){return arguments.length&&e!==n.SKIP&&(t=e,r(a)&&(a._changing(),a._state="active",o.forEach(function(e,n){e(s[n](t))}))),t}return a.constructor=n,a._state=arguments.length&&t!==n.SKIP?"active":"pending",a._parents=[],a._changing=function(){r(a)&&(a._state="changing"),o.forEach(function(t){t._changing()})},a._map=function(e,i){var r=i?n():n(e(t));return r._parents.push(a),o.push(r),s.push(e),r},a.map=function(t){return a._map(t,"active"!==a._state)},a.toJSON=function(){return null!=t&&"function"==typeof t.toJSON?t.toJSON():t},a["fantasy-land/map"]=a.map,a["fantasy-land/ap"]=function(t){return i(function(t,e){return t()(e())},[t,a])},a._unregisterChild=function(t){var e=o.indexOf(t);-1!==e&&(o.splice(e,1),s.splice(e,1))},Object.defineProperty(a,"end",{get:function(){return e||((e=n()).map(function(t){return!0===t&&(a._parents.forEach(function(t){t._unregisterChild(a)}),a._state="ended",a._parents.length=o.length=s.length=0),t}),e)}}),a}function i(t,e){var i=e.every(function(t){if(t.constructor!==n)throw new Error("Ensure that each item passed to stream.combine/stream.merge/lift is a stream");return"active"===t._state}),o=i?n(t.apply(null,e.concat([e]))):n(),r=[],s=e.map(function(n){return n._map(function(s){return r.push(n),(i||e.every(function(t){return"pending"!==t._state}))&&(i=!0,o(t.apply(null,e.concat([r]))),r=[]),s},!0)}),a=o.end.map(function(t){!0===t&&(s.forEach(function(t){t.end(!0)}),a.end(!0))});return o}function o(t){return i(function(){return t.map(function(t){return t()})},t)}function r(t){return"pending"===t._state||"active"===t._state||"changing"===t._state}Object.defineProperty(n,"HALT",{get:function(){return e||console.log("HALT is deprecated and has been renamed to SKIP"),e=!0,n.SKIP}}),t.exports=n}()});const c=(t,e)=>{const n=((t,e)=>e.find(e=>e.id===t))(t,e);return e.indexOf(n)},l=(t,e)=>[e,t.id,t.spawn].filter(Boolean).join("-"),m={initialState:{store:{}},actions:t=>({add:(e,n)=>{t(i=>{const o=i.store[e]||[];return i.store[e]=[...o,n],n.timer&&n.timer.states.map(()=>m.actions(t).refresh()),i})},remove:(e,n)=>{t(t=>{const i=t.store[e]||[],o=((t,e)=>{const n=c(t,e);return-1!==n&&e.splice(n,1),e})(n,i);return t.store[e]=o,t})},replace:(e,n,i)=>{t(t=>{const o=t.store[e]||[];if(o){const r=c(n,o);-1!==r&&(o[r]=i,t.store[e]=[...o])}return t})},removeAll:e=>{t(t=>(t.store[e]=[],t))},store:(e,n)=>{t(t=>(t.store[e]=[...n],t))},refresh:()=>{t(t=>({...t}))}}),selectors:t=>{const e={getStore:()=>{return t().store},find:(e,n)=>{const i=t().store[e]||[],o=l(n,e),r=i.find(t=>t.id===o);return r?{just:r}:{nothing:void 0}},getAll:(e,n)=>{const i=t().store[e]||[],o=void 0!==n?n.spawn:void 0,r=void 0!==n?n.id:void 0,s=void 0!==o?i.filter(t=>t.identityOptions.spawn===o):i;return void 0!==r?s.filter(t=>t.identityOptions.id===r):s},getCount:(t,n)=>e.getAll(t,n).length};return e}},p=u(),f=u.scan((t,e)=>e(t),{...m.initialState},p),g={...m.actions(p)},h={...m.selectors(f)},w={timerId:void 0,isPaused:void 0,remaining:void 0,startTime:void 0,callback:()=>{},timeoutFn:()=>{},promise:void 0,onDone:()=>{},onAbort:()=>{}},v=(t,e,n,i)=>{const o=()=>{e(),t.onDone(),i()};return{timeoutFn:o,promise:new Promise((e,n)=>{t.onDone=()=>e(),t.onAbort=()=>n()}),...t.isPaused?{}:{startTime:(new Date).getTime(),timerId:window.setTimeout(o,n),remaining:n}}},S=t=>(window.clearTimeout(t.timerId),{timerId:w.timerId}),y=t=>({...S(t)}),P=t=>({...S(t),isPaused:!0,remaining:E(t)}),O=(t,e)=>{window.clearTimeout(t.timerId);const n=e?Math.max(t.remaining||0,e):t.remaining;return{startTime:(new Date).getTime(),isPaused:!1,remaining:n,timerId:window.setTimeout(t.timeoutFn,n)}},E=t=>void 0===t.remaining?void 0:t.remaining-((new Date).getTime()-(t.startTime||0)),_=()=>{const t={initialState:w,actions:e=>({start:(n,i)=>{e(o=>({...o,...S(o),...v(o,n,i,()=>t.actions(e).done()),...o.isPaused&&P(o)}))},stop:()=>{e(t=>({...t,...y(t),...w}))},pause:()=>{e(t=>({...t,...P(t)}))},resume:t=>{e(e=>({...e,...e.isPaused&&O(e,t)}))},abort:()=>{e(t=>(t.onAbort(),{...t,...S(t)}))},done:()=>{e(t=>w)},refresh:()=>{e(t=>({...t}))}}),selectors:t=>({isPaused:()=>{return t().isPaused},getRemaining:()=>{const e=t();return e.isPaused?e.remaining:E(e)},getResultPromise:()=>{return t().promise}})},e=u(),n=u.scan((t,e)=>e(t),{...t.initialState},e);return{states:n,actions:{...t.actions(e)},selectors:{...t.selectors(n)}}};let b=0;const x=()=>b===Number.MAX_SAFE_INTEGER?0:b++,A="none",I="hiding",T=t=>{let e=0;return t.map(t=>({item:t,queueCount:t.dialogicOptions.queued?e++:0})).filter(({queueCount:t})=>0===t).map(({item:t})=>t)},j=(t,e={})=>({id:e.id||t.id,spawn:e.spawn||t.spawn}),N=t=>e=>(n={})=>new Promise(i=>{const o={id:n.dialogic?n.dialogic.id:void 0,spawn:n.dialogic?n.dialogic.spawn:void 0},r=j(e,o),s={...e,...n.dialogic},a=(t=>{const e={...t};return delete e.dialogic,e})(n),d={didShow:t=>(s.didShow&&s.didShow(t),i(t)),didHide:t=>(s.didHide&&s.didHide(t),i(t))},u={ns:t,identityOptions:r,dialogicOptions:s,callbacks:d,passThroughOptions:a,id:l(r,t),timer:s.timeout?_():void 0,key:x().toString(),transitionState:A},c=h.find(t,r);if(c.just&&s.toggle){const n=D(t)(e)(o);return i(n)}if(c.just&&!s.queued){const e=c.just,n=e.dialogicOptions,i={...u,dialogicOptions:n};g.replace(t,e.id,i),d.didShow&&d.didShow(u)}else g.add(t,u);i(u)}),q=t=>e=>n=>h.find(t,j(e,n)),C=t=>e=>n=>i=>{const o=q(e)(n)(i);return o.just?t(e,o.just,i):Promise.resolve()},D=C((t,e)=>e.transitionState!==I?(e.transitionState=I,G(e)):Promise.resolve(e)),k=C((t,e)=>(e&&e.timer&&e.timer.actions.pause(),Promise.resolve(e))),H=C((t,e,n={})=>(e&&e.timer&&e.timer.actions.resume(n.minimumDuration),Promise.resolve(e))),R=t=>e=>n=>i=>{const o=q(e)(n)(i);return o.just&&o.just&&o.just.timer?o.just.timer.selectors[t]():void 0},K=R("isPaused"),$=R("getRemaining"),F=t=>e=>n=>{return!!q(t)(e)(n).just},J=t=>()=>(h.getAll(t).forEach(t=>t.timer&&t.timer.actions.abort()),g.removeAll(t),Promise.resolve()),L=(t,e)=>({...t,dialogicOptions:{...t.dialogicOptions,...e}}),M=t=>e=>{const n=h.getAll(t),i=n.filter(t=>!e.queued&&!t.dialogicOptions.queued),o=n.filter(t=>e.queued||t.dialogicOptions.queued);if(i.forEach(t=>G(L(t,e))),o.length>0){const[n]=o;g.store(t,[n]),G(L(n,e)).then(()=>g.removeAll(t))}},B=t=>e=>h.getCount(t,e),V=(t,e)=>a(t.dialogicOptions,e),G=async function(t){t.timer&&t.timer.actions.stop(),await V(t,i),t.callbacks.didHide&&await t.callbacks.didHide(t);const e=JSON.parse(JSON.stringify(t));return g.remove(t.ns,t.id),Promise.resolve(e)},X=({ns:t,queued:e,timeout:n})=>{const i=`default_${t}`,o=`default_${t}`,r={id:i,spawn:o,...e&&{queued:e},...void 0!==n&&{timeout:n}};return{ns:t,defaultId:i,defaultSpawn:o,defaultDialogicOptions:r,show:N(t)(r),hide:D(t)(r),hideAll:M(t),resetAll:J(t),pause:k(t)(r),resume:H(t)(r),exists:F(t)(r),getCount:B(t),isPaused:K(t)(r),getRemaining:$(t)(r)}},z=X({ns:"dialog"}),Q=X({ns:"notification",queued:!0,timeout:3e3});t.actions=g,t.dialog=z,t.dialogical=X,t.exists=F,t.filterCandidates=(t,e,n)=>{const i=e[t]||[];return 0==i.length?[]:((...t)=>e=>t.filter(Boolean).reduce((t,e)=>e(t),e))(T,(t=>e=>e.filter(e=>e.identityOptions.spawn===t.spawn))(n))(i)},t.getCount=B,t.getRemaining=$,t.getTimerProperty=R,t.hide=D,t.hideAll=M,t.hideItem=G,t.isPaused=K,t.notification=Q,t.pause=k,t.performOnItem=C,t.resetAll=J,t.resume=H,t.selectors=h,t.setDomElement=(t,e)=>{e.dialogicOptions.domElement=t},t.show=N,t.showItem=async function(t){return await V(t,n),t.callbacks.didShow&&await t.callbacks.didShow(t),t.dialogicOptions.timeout&&t.timer&&await async function(t,e,n){return e.actions.start(()=>G(t),n),R("getResultPromise")}(t,t.timer,t.dialogicOptions.timeout),Promise.resolve(t)},t.states=f,Object.defineProperty(t,"__esModule",{value:!0})});
//# sourceMappingURL=dialogic.js.map
