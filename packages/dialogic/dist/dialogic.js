!function(t,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n((t=t||self).dialogic={})}(this,function(t){"use strict";const n="undefined"!=typeof document,e="show",i="hide",o={className:!0,component:!0,didHide:!0,didShow:!0,hideDelay:!0,hideDuration:!0,hideTimingFunction:!0,showClassName:!0,showDelay:!0,showDuration:!0,showTimingFunction:!0,timeout:!0,transitionClassName:!0,transitions:!0},s=(t,i)=>{const o=t.domElements?t.domElements.domElement:null;return o?new Promise(s=>{const u=o.style,d=n?window.getComputedStyle(o):null,c=i===e,m=a(t,c),l=void 0!==m.duration?1e3*m.duration:d?r(d.transitionDuration):0,p=void 0!==m.delay?1e3*m.delay:d?r(d.transitionDelay):0,f=l+p;m.before&&"function"==typeof m.before&&(u.transitionDuration="0ms",u.transitionDelay="0ms",m.before()),(()=>{const n=m.timingFunction||(d?d.transitionTimingFunction:void 0);n&&(u.transitionTimingFunction=n),u.transitionDuration=l+"ms",u.transitionDelay=p+"ms",t.transitionClassName&&o.classList.add(t.transitionClassName),t.showClassName&&(t.showClassElement||o).classList[c?"add":"remove"](t.showClassName);m.transition&&m.transition()})(),setTimeout(()=>{m.after&&"function"==typeof m.after&&m.after(),t.transitionClassName&&o.classList.remove(t.transitionClassName),s()},f)}):Promise.resolve("no domElement")},r=t=>{const n=parseFloat(t)*(-1===t.indexOf("ms")?1e3:1);return isNaN(n)?0:n},a=(t,n)=>{const[e,i,o,s]=n?[t.showDuration,t.showDelay,t.showTimingFunction,t.transitions?t.transitions.show:void 0]:[t.hideDuration,t.hideDelay,t.hideTimingFunction,t.transitions?t.transitions.hide:void 0];return{duration:e,delay:i,timingFunction:o,...s?s(t.domElements):void 0}};var u=function(t,n){return t(n={exports:{}},n.exports),n.exports}(function(t){!function(){e.SKIP={},e.lift=function(){var t=arguments[0];return o(Array.prototype.slice.call(arguments,1)).map(function(n){return t.apply(void 0,n)})},e.scan=function(t,n,i){var o=i.map(function(i){var o=t(n,i);return o!==e.SKIP&&(n=o),o});return o(n),o},e.merge=o,e.combine=i,e.scanMerge=function(t,n){var e=t.map(function(t){return t[0]}),o=i(function(){var i=arguments[arguments.length-1];return e.forEach(function(e,o){i.indexOf(e)>-1&&(n=t[o][1](n,e()))}),n},e);return o(n),o},e["fantasy-land/of"]=e;var n=!1;function e(t){var n,o=[],r=[];function a(n){return arguments.length&&n!==e.SKIP&&(t=n,s(a)&&(a._changing(),a._state="active",o.forEach(function(n,e){n(r[e](t))}))),t}return a.constructor=e,a._state=arguments.length&&t!==e.SKIP?"active":"pending",a._parents=[],a._changing=function(){s(a)&&(a._state="changing"),o.forEach(function(t){t._changing()})},a._map=function(n,i){var s=i?e():e(n(t));return s._parents.push(a),o.push(s),r.push(n),s},a.map=function(t){return a._map(t,"active"!==a._state)},a.toJSON=function(){return null!=t&&"function"==typeof t.toJSON?t.toJSON():t},a["fantasy-land/map"]=a.map,a["fantasy-land/ap"]=function(t){return i(function(t,n){return t()(n())},[t,a])},a._unregisterChild=function(t){var n=o.indexOf(t);-1!==n&&(o.splice(n,1),r.splice(n,1))},Object.defineProperty(a,"end",{get:function(){return n||((n=e()).map(function(t){return!0===t&&(a._parents.forEach(function(t){t._unregisterChild(a)}),a._state="ended",a._parents.length=o.length=r.length=0),t}),n)}}),a}function i(t,n){var i=n.every(function(t){if(t.constructor!==e)throw new Error("Ensure that each item passed to stream.combine/stream.merge/lift is a stream");return"active"===t._state}),o=i?e(t.apply(null,n.concat([n]))):e(),s=[],r=n.map(function(e){return e._map(function(r){return s.push(e),(i||n.every(function(t){return"pending"!==t._state}))&&(i=!0,o(t.apply(null,n.concat([s]))),s=[]),r},!0)}),a=o.end.map(function(t){!0===t&&(r.forEach(function(t){t.end(!0)}),a.end(!0))});return o}function o(t){return i(function(){return t.map(function(t){return t()})},t)}function s(t){return"pending"===t._state||"active"===t._state||"changing"===t._state}Object.defineProperty(e,"HALT",{get:function(){return n||console.log("HALT is deprecated and has been renamed to SKIP"),n=!0,e.SKIP}}),t.exports=e}()});const d=(t,n)=>{const e=((t,n)=>n.find(n=>n.id===t))(t,n);return n.indexOf(e)},c=(t,n)=>[n,t.id,t.spawn].filter(Boolean).join("-"),m={initialState:{store:{}},actions:t=>({add:(n,e)=>{t(i=>{const o=i.store[n]||[];return i.store[n]=[...o,e],e.timer&&e.timer.states.map(()=>m.actions(t).refresh()),i})},remove:(n,e)=>{t(t=>{const i=t.store[n]||[],o=((t,n)=>{const e=d(t,n);return-1!==e&&n.splice(e,1),n})(e,i);return t.store[n]=o,t})},replace:(n,e,i)=>{t(t=>{const o=t.store[n]||[];if(o){const s=d(e,o);-1!==s&&(o[s]=i,t.store[n]=[...o])}return t})},removeAll:n=>{t(t=>(t.store[n]=[],t))},store:(n,e)=>{t(t=>(t.store[n]=[...e],t))},refresh:()=>{t(t=>({...t}))}}),selectors:t=>{const n={getStore:()=>{return t().store},find:(n,e)=>{const i=t().store[n]||[],o=c(e,n),s=i.find(t=>t.id===o);return s?{just:s}:{nothing:void 0}},getAll:(n,e)=>{const i=t().store[n]||[],o=void 0!==e?e.spawn:void 0,s=void 0!==e?e.id:void 0,r=void 0!==o?i.filter(t=>t.spawnOptions.spawn===o):i;return void 0!==s?r.filter(t=>t.spawnOptions.id===s):r},getCount:(t,e)=>n.getAll(t,e).length};return n}},l=u(),p=u.scan((t,n)=>n(t),{...m.initialState},l),f={...m.actions(l)},g={...m.selectors(p)},h={timerId:void 0,isPaused:void 0,remaining:void 0,startTime:void 0,callback:()=>{},timeoutFn:()=>{},promise:void 0,onDone:()=>{},onAbort:()=>{}},w=(t,n,e,i)=>{const o=()=>{n(),t.onDone(),i()};return{timeoutFn:o,promise:new Promise((n,e)=>{t.onDone=()=>n(),t.onAbort=()=>e()}),...t.isPaused?{}:{startTime:(new Date).getTime(),timerId:window.setTimeout(o,e),remaining:e}}},v=t=>(window.clearTimeout(t.timerId),{timerId:h.timerId}),O=t=>({...v(t)}),y=t=>({...v(t),isPaused:!0,remaining:S(t)}),P=(t,n)=>{window.clearTimeout(t.timerId);const e=n?Math.max(t.remaining||0,n):t.remaining;return{startTime:(new Date).getTime(),isPaused:!1,remaining:e,timerId:window.setTimeout(t.timeoutFn,e)}},S=t=>void 0===t.remaining?void 0:t.remaining-((new Date).getTime()-(t.startTime||0)),_=()=>{const t={initialState:h,actions:n=>({start:(e,i)=>{n(o=>({...o,...v(o),...w(o,e,i,()=>t.actions(n).done()),...o.isPaused&&y(o)}))},stop:()=>{n(t=>({...t,...O(t),...h}))},pause:()=>{n(t=>({...t,...y(t)}))},resume:t=>{n(n=>({...n,...n.isPaused&&P(n,t)}))},abort:()=>{n(t=>(t.onAbort(),{...t,...v(t)}))},done:()=>{n(t=>h)},refresh:()=>{n(t=>({...t}))}}),selectors:t=>({isPaused:()=>{return t().isPaused},getRemaining:()=>{const n=t();return n.isPaused?n.remaining:S(n)},getResultPromise:()=>{return t().promise}})},n=u(),e=u.scan((t,n)=>n(t),{...t.initialState},n);return{states:e,actions:{...t.actions(n)},selectors:{...t.selectors(e)}}};let T=0;const D=()=>T===Number.MAX_SAFE_INTEGER?0:T++,b="none",A="hiding",C=t=>{let n=0;return t.map(t=>({item:t,queueCount:t.spawnOptions.queued?n++:0})).filter(({queueCount:t})=>0===t).map(({item:t})=>t)},j=t=>{return Object.keys(t).reduce((n,e)=>{const i=t[e];return o[e]?n.transitionOptions[e]=i:n.instanceOptions[e]=i,n},{transitionOptions:{},instanceOptions:{}})},E=t=>n=>e=>(i={},o)=>new Promise(s=>{const r={...n,...o},a=c(r,t),{transitionOptions:u,instanceOptions:d}=j(i),m={...e,...u},l=Object.keys(m).reduce((t,n)=>void 0!==m[n]?t+1:t,0)>0;m.didShow=t=>(i.didShow&&i.didShow(t),s(t)),m.didHide=t=>(i.didHide&&i.didHide(t),s(t));const p=D().toString(),h={spawnOptions:r,transitionOptions:m,instanceTransitionOptions:u,instanceOptions:d,id:a,timer:m.timeout?_():void 0,key:p,transitionState:b},w=g.find(t,r);if(w.just&&!r.queued){const n=w.just,e=n.instanceTransitionOptions,i={...h,instanceTransitionOptions:e};f.replace(t,n.id,i),m.didShow(h)}else f.add(t,h);l||s(h)}),I=t=>n=>e=>(i,o)=>{return N(t)(n)(o).just?x(t)(n)(o):E(t)(n)(e)(i,o)},N=t=>n=>e=>{const i={...n,...e};return g.find(t,i)},F=t=>n=>e=>(i,o)=>{const s=N(n)(e)(i);return s.just?t(n,s.just,o):Promise.resolve()},x=F((t,n)=>n.transitionState!==A?(n.transitionState=A,X(t,n)):Promise.resolve(n)),q=F((t,n)=>(n&&n.timer&&n.timer.actions.pause(),Promise.resolve(n))),H=F((t,n,e={})=>(n&&n.timer&&n.timer.actions.resume(e.minimumDuration),Promise.resolve(n))),R=t=>n=>e=>i=>{const o=N(n)(e)(i);return o.just&&o.just&&o.just.timer?o.just.timer.selectors[t]():void 0},K=R("isPaused"),J=R("getRemaining"),L=t=>n=>e=>{return!!N(t)(n)(e).just},k=t=>()=>(g.getAll(t).forEach(t=>t.timer&&t.timer.actions.abort()),f.removeAll(t),Promise.resolve()),M=(t,n)=>{const{transitionOptions:e}=j(n);return{...t,transitionOptions:{...t.transitionOptions,...e}}},B=t=>n=>(e,i)=>{const o={...n,...i},s=g.getAll(t),r=s.filter(t=>!o.queued&&!t.spawnOptions.queued),a=s.filter(t=>o.queued||t.spawnOptions.queued);if(r.forEach(n=>X(t,M(n,e))),a.length>0){const[n]=a;f.store(t,[n]),X(t,M(n,e)).then(()=>f.removeAll(t))}},$=t=>n=>g.getCount(t,n),G=(t,n)=>s({...t.instanceTransitionOptions,...t.transitionOptions},n),X=async function(t,n){n.timer&&n.timer.actions.stop(),await G(n,i),n.transitionOptions.didHide&&await n.transitionOptions.didHide(n);const e=JSON.parse(JSON.stringify(n));return f.remove(t,n.id),Promise.resolve(e)},z=({ns:t,queued:n,timeout:e})=>{const i=`default_${t}`,o=`default_${t}`,s={id:i,spawn:o,...n&&{queued:n}},r={...void 0!==e&&{timeout:e}};return{ns:t,defaultId:i,defaultSpawn:o,defaultSpawnOptions:s,show:E(t)(s)(r),toggle:I(t)(s)(r),hide:x(t)(s),hideAll:B(t)(s),resetAll:k(t),pause:q(t)(s),resume:H(t)(s),isDisplayed:L(t)(s),getCount:$(t),isPaused:K(t)(s),getRemaining:J(t)(s)}},Q=z({ns:"dialog"}),U=z({ns:"notification",queued:!0,timeout:3e3});t.actions=f,t.dialog=Q,t.dialogical=z,t.filterCandidates=(t,n,e)=>{const i=n[t]||[];return((...t)=>n=>t.filter(Boolean).reduce((t,n)=>n(t),n))(C,(t=>n=>n.filter(n=>n.spawnOptions.spawn===t.spawn))(e))(i)},t.getCount=$,t.getRemaining=J,t.getTimerProperty=R,t.hide=x,t.hideAll=B,t.hideItem=X,t.isDisplayed=L,t.isPaused=K,t.notification=U,t.pause=q,t.performOnItem=F,t.resetAll=k,t.resume=H,t.selectors=g,t.show=E,t.showItem=async function(t,n){return await G(n,e),n.transitionOptions.didShow&&await n.transitionOptions.didShow(n),n.transitionOptions.timeout&&n.timer&&await async function(t,n,e,i){return e.actions.start(()=>X(t,n),i),R("getResultPromise")}(t,n,n.timer,n.transitionOptions.timeout),Promise.resolve(n)},t.states=p,t.toggle=I,Object.defineProperty(t,"__esModule",{value:!0})});
//# sourceMappingURL=dialogic.js.map
