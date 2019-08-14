!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports,require("mithril")):"function"==typeof define&&define.amd?define(["exports","mithril"],e):e((t=t||self).polythene={},t.m)}(this,function(t,e){"use strict";e=e&&e.hasOwnProperty("default")?e.default:e;const n=({domElement:t,prop:e})=>{if(window.getComputedStyle){const n=document.defaultView;if(n){const i=n.getComputedStyle(t);if(i)return i.getPropertyValue(e)}}},i="show",o="hide",s=(t,e,n)=>{const i=n[e]||{};Object.keys(i).forEach(e=>{t.style[e]=i[e]})},r=(t,e,n,i)=>{if(e.styles){const o=((t,e)=>("function"==typeof e?e(t):e)||{})(t,e.styles);s(t,"default",o),i&&(t=>t.style.transitionDuration="0ms")(t),s(t,n,o)}if(e.className){const i={showStart:`${e.className}-show-start`,showEnd:`${e.className}-show-end`,hideStart:`${e.className}-hide-start`,hideEnd:`${e.className}-hide-end`};((t,e)=>t.classList.remove(e.showStart,e.showEnd,e.hideStart,e.hideEnd))(t,i),i&&t.classList.add(i[n])}},a={showStart:{nextStep:"showEnd"},showEnd:{nextStep:void 0},hideStart:{nextStep:"hideEnd"},hideEnd:{nextStep:void 0}},d=(t,e)=>{const o=t.domElement;if(!o)return Promise.resolve("no domElement");let s=e===i?"showStart":"hideStart";return new Promise(e=>{const i=()=>{o.removeEventListener("transitionend",i,!1),e()};r(o,t,s,"showStart"===s);const d=a[s].nextStep;d&&setTimeout(()=>{s=d,o.addEventListener("transitionend",i,!1),r(o,t,s);const e=(t=>{const e=n({domElement:t,prop:"transition-duration"}),i=void 0!==e?u(e):0,o=n({domElement:t,prop:"transition-delay"});return i+(void 0!==o?u(o):0)})(o);0==e&&setTimeout(i,e)},0)})},u=t=>{const e=parseFloat(t)*(-1===t.indexOf("ms")?1e3:1);return isNaN(e)?0:e};var c=function(t,e){return t(e={exports:{}},e.exports),e.exports}(function(t){!function(){n.SKIP={},n.lift=function(){var t=arguments[0];return o(Array.prototype.slice.call(arguments,1)).map(function(e){return t.apply(void 0,e)})},n.scan=function(t,e,i){var o=i.map(function(i){var o=t(e,i);return o!==n.SKIP&&(e=o),o});return o(e),o},n.merge=o,n.combine=i,n.scanMerge=function(t,e){var n=t.map(function(t){return t[0]}),o=i(function(){var i=arguments[arguments.length-1];return n.forEach(function(n,o){i.indexOf(n)>-1&&(e=t[o][1](e,n()))}),e},n);return o(e),o},n["fantasy-land/of"]=n;var e=!1;function n(t){var e,o=[],r=[];function a(e){return arguments.length&&e!==n.SKIP&&(t=e,s(a)&&(a._changing(),a._state="active",o.forEach(function(e,n){e(r[n](t))}))),t}return a.constructor=n,a._state=arguments.length&&t!==n.SKIP?"active":"pending",a._parents=[],a._changing=function(){s(a)&&(a._state="changing"),o.forEach(function(t){t._changing()})},a._map=function(e,i){var s=i?n():n(e(t));return s._parents.push(a),o.push(s),r.push(e),s},a.map=function(t){return a._map(t,"active"!==a._state)},a.toJSON=function(){return null!=t&&"function"==typeof t.toJSON?t.toJSON():t},a["fantasy-land/map"]=a.map,a["fantasy-land/ap"]=function(t){return i(function(t,e){return t()(e())},[t,a])},a._unregisterChild=function(t){var e=o.indexOf(t);-1!==e&&(o.splice(e,1),r.splice(e,1))},Object.defineProperty(a,"end",{get:function(){return e||((e=n()).map(function(t){return!0===t&&(a._parents.forEach(function(t){t._unregisterChild(a)}),a._state="ended",a._parents.length=o.length=r.length=0),t}),e)}}),a}function i(t,e){var i=e.every(function(t){if(t.constructor!==n)throw new Error("Ensure that each item passed to stream.combine/stream.merge/lift is a stream");return"active"===t._state}),o=i?n(t.apply(null,e.concat([e]))):n(),s=[],r=e.map(function(n){return n._map(function(r){return s.push(n),(i||e.every(function(t){return"pending"!==t._state}))&&(i=!0,o(t.apply(null,e.concat([s]))),s=[]),r},!0)}),a=o.end.map(function(t){!0===t&&(r.forEach(function(t){t.end(!0)}),a.end(!0))});return o}function o(t){return i(function(){return t.map(function(t){return t()})},t)}function s(t){return"pending"===t._state||"active"===t._state||"changing"===t._state}Object.defineProperty(n,"HALT",{get:function(){return e||console.log("HALT is deprecated and has been renamed to SKIP"),e=!0,n.SKIP}}),t.exports=n}()});const l=(t,e)=>{const n=((t,e)=>e.find(e=>e.id===t))(t,e);return e.indexOf(n)},m=(t,e)=>[e,t.id,t.spawn].filter(Boolean).join("-"),p={initialState:{store:{}},actions:t=>({add:(e,n)=>{t(i=>{const o=i.store[e]||[];return i.store[e]=[...o,n],n.timer&&n.timer.states.map(()=>p.actions(t).refresh()),i})},remove:(e,n)=>{t(t=>{const i=t.store[e]||[],o=((t,e)=>{const n=l(t,e);return-1!==n&&e.splice(n,1),e})(n,i);return t.store[e]=o,t})},replace:(e,n,i)=>{t(t=>{const o=t.store[e]||[];if(o){const s=l(n,o);-1!==s&&(o[s]=i,t.store[e]=[...o])}return t})},removeAll:e=>{t(t=>(t.store[e]=[],t))},store:(e,n)=>{t(t=>(t.store[e]=[...n],t))},refresh:()=>{t(t=>({...t}))}}),selectors:t=>{const e={getStore:()=>{return t().store},find:(e,n)=>{const i=t().store[e]||[],o=m(n,e),s=i.find(t=>t.id===o);return s?{just:s}:{nothing:void 0}},getAll:(e,n)=>{const i=t().store[e]||[],o=void 0!==n?n.spawn:void 0,s=void 0!==n?n.id:void 0,r=void 0!==o?i.filter(t=>t.identityOptions.spawn===o):i;return void 0!==s?r.filter(t=>t.identityOptions.id===s):r},getCount:(t,n)=>e.getAll(t,n).length};return e}},f=c(),g=c.scan((t,e)=>e(t),{...p.initialState},f),h={...p.actions(f)},v={...p.selectors(g)},w={timerId:void 0,isPaused:void 0,remaining:void 0,startTime:void 0,callback:()=>{},timeoutFn:()=>{},promise:void 0,onDone:()=>{},onAbort:()=>{}},y=(t,e,n,i)=>{const o=()=>{e(),t.onDone(),i()};return{timeoutFn:o,promise:new Promise((e,n)=>{t.onDone=()=>e(),t.onAbort=()=>n()}),...t.isPaused?{}:{startTime:(new Date).getTime(),timerId:window.setTimeout(o,n),remaining:n}}},S=t=>(window.clearTimeout(t.timerId),{timerId:w.timerId}),O=t=>({...S(t)}),P=t=>({...S(t),isPaused:!0,remaining:_(t)}),E=(t,e)=>{window.clearTimeout(t.timerId);const n=e?Math.max(t.remaining||0,e):t.remaining;return{startTime:(new Date).getTime(),isPaused:!1,remaining:n,timerId:window.setTimeout(t.timeoutFn,n)}},_=t=>void 0===t.remaining?void 0:t.remaining-((new Date).getTime()-(t.startTime||0)),b=()=>{const t={initialState:w,actions:e=>({start:(n,i)=>{e(o=>({...o,...S(o),...y(o,n,i,()=>t.actions(e).done()),...o.isPaused&&P(o)}))},stop:()=>{e(t=>({...t,...O(t),...w}))},pause:()=>{e(t=>({...t,...P(t)}))},resume:t=>{e(e=>({...e,...e.isPaused&&E(e,t)}))},abort:()=>{e(t=>(t.onAbort(),{...t,...S(t)}))},done:()=>{e(t=>w)},refresh:()=>{e(t=>({...t}))}}),selectors:t=>({isPaused:()=>{return t().isPaused},getRemaining:()=>{const e=t();return e.isPaused?e.remaining:_(e)},getResultPromise:()=>{return t().promise}})},e=c(),n=c.scan((t,e)=>e(t),{...t.initialState},e);return{states:n,actions:{...t.actions(e)},selectors:{...t.selectors(n)}}};let j=0;const T=()=>j===Number.MAX_SAFE_INTEGER?0:j++,x="none",A="hiding",I=t=>{let e=0;return t.map(t=>({item:t,queueCount:t.dialogicOptions.queued?e++:0})).filter(({queueCount:t})=>0===t).map(({item:t})=>t)},N=(t,e,n)=>{const i=e[t]||[];return((...t)=>e=>t.filter(Boolean).reduce((t,e)=>e(t),e))(I,(t=>e=>e.filter(e=>e.identityOptions.spawn===t.spawn))(n))(i)},q=(t,e)=>({id:t.id,spawn:t.spawn,...e}),k=t=>e=>(n={},i)=>new Promise(o=>{const s=q(e,i),r={...e.dialogic,...n.dialogic},a=(t=>({...t,dialogicOptions:void 0}))(n),d={didShow:t=>(r.didShow&&r.didShow(t),o(t)),didHide:t=>(r.didHide&&r.didHide(t),o(t))},u={ns:t,identityOptions:s,dialogicOptions:r,callbacks:d,passThroughOptions:a,id:m(s,t),timer:r.timeout?b():void 0,key:T().toString(),transitionState:x},c=v.find(t,s);if(c.just&&!r.queued){const e=c.just,n=e.dialogicOptions,i={...u,dialogicOptions:n};h.replace(t,e.id,i),d.didShow&&d.didShow(u)}else h.add(t,u);o(u)}),D=t=>e=>(n,i)=>{return H(t)(e)(i).just?M(t)(e)(i):k(t)(e)(n,i)},H=t=>e=>n=>v.find(t,q(e,n)),C=t=>e=>n=>(i,o)=>{const s=H(e)(n)(i);return s.just?t(e,s.just,o):Promise.resolve()},M=C((t,e)=>e.transitionState!==A?(e.transitionState=A,U(e)):Promise.resolve(e)),K=C((t,e)=>(e&&e.timer&&e.timer.actions.pause(),Promise.resolve(e))),L=C((t,e,n={})=>(e&&e.timer&&e.timer.actions.resume(n.minimumDuration),Promise.resolve(e))),R=t=>e=>n=>i=>{const o=H(e)(n)(i);return o.just&&o.just&&o.just.timer?o.just.timer.selectors[t]():void 0},$=R("isPaused"),F=R("getRemaining"),J=t=>e=>n=>{return!!H(t)(e)(n).just},B=t=>()=>(v.getAll(t).forEach(t=>t.timer&&t.timer.actions.abort()),h.removeAll(t),Promise.resolve()),V=(t,e)=>({...t,dialogicOptions:{...t.dialogicOptions,...e}}),G=t=>e=>{const n=v.getAll(t),i=n.filter(t=>!e.queued&&!t.dialogicOptions.queued),o=n.filter(t=>e.queued||t.dialogicOptions.queued);if(i.forEach(t=>U(V(t,e))),o.length>0){const[n]=o;h.store(t,[n]),U(V(n,e)).then(()=>h.removeAll(t))}},X=t=>e=>v.getCount(t,e),z=(t,e)=>d(t.dialogicOptions,e),Q=async function(t){return await z(t,i),t.callbacks.didShow&&await t.callbacks.didShow(t),t.dialogicOptions.timeout&&t.timer&&await async function(t,e,n){return e.actions.start(()=>U(t),n),R("getResultPromise")}(t,t.timer,t.dialogicOptions.timeout),Promise.resolve(t)},U=async function(t){t.timer&&t.timer.actions.stop(),await z(t,o),t.callbacks.didHide&&await t.callbacks.didHide(t);const e=JSON.parse(JSON.stringify(t));return h.remove(t.ns,t.id),Promise.resolve(e)},W=({ns:t,queued:e,timeout:n})=>{const i=`default_${t}`,o=`default_${t}`,s={id:i,spawn:o,dialogic:{...e&&{queued:e},...void 0!==n&&{timeout:n}}};return{ns:t,defaultId:i,defaultSpawn:o,defaultOptions:s,show:k(t)(s),toggle:D(t)(s),hide:M(t)(s),hideAll:G(t),resetAll:B(t),pause:K(t)(s),resume:L(t)(s),exists:J(t)(s),getCount:X(t),isPaused:$(t)(s),getRemaining:F(t)(s)}},Y=W({ns:"dialog"}),Z=W({ns:"notification",queued:!0,timeout:3e3}),tt=t=>(e,n)=>{const i=v.find(t,e.detail.identityOptions);i.just&&((t,e)=>{e.dialogicOptions.domElement=t})(e.detail.domElement,i.just);const o=v.find(t,e.detail.identityOptions);o.just&&n(o.just)},et=({attrs:t})=>{let n;const i=t.dialogicOptions.className,o=e=>{e({detail:{identityOptions:t.identityOptions,domElement:n}})},s=()=>{o(t.onShow)},r=()=>{o(t.onHide)};return{oncreate:e=>{n=e.dom,o(t.onMount)},view:()=>e("div",{className:i},e(t.dialogicOptions.component,{...t.passThroughOptions,show:s,hide:r},[e("div","Instance"),e("button",{onclick:()=>r()},"Hide from instance")]))}},nt={view:({attrs:t})=>{const n=(t=>e=>tt(t)(e,Q))(t.ns),i=(t=>e=>tt(t)(e,Q))(t.ns),o=(t=>e=>tt(t)(e,U))(t.ns),s=t.identityOptions||{};return N(t.ns,v.getStore(),s).map(t=>e(et,{key:t.key,identityOptions:t.identityOptions,dialogicOptions:t.dialogicOptions,passThroughOptions:t.passThroughOptions,onMount:n,onShow:i,onHide:o}))}},it=t=>({oncreate:({attrs:t})=>{"function"==typeof t.onMount&&t.onMount()},view:({attrs:n})=>{const i={id:n.id||t.defaultId,spawn:n.spawn||t.defaultSpawn};return e(nt,{identityOptions:i,ns:t.ns})}}),ot=it(Y),st=it(Z);g.map(t=>e.redraw()),t.Dialog=ot,t.Dialogical=it,t.Notification=st,t.dialog=Y,t.notification=Z,Object.defineProperty(t,"__esModule",{value:!0})});
//# sourceMappingURL=dialogic-mithril.js.map
