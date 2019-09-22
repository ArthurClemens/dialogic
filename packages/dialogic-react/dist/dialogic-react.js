!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports,require("react")):"function"==typeof define&&define.amd?define(["exports","react"],e):e((t=t||self).polythene={},t.React)}(this,(function(t,e){"use strict";var n="default"in e?e.default:e;const i=(...t)=>e=>t.filter(Boolean).reduce((t,e)=>e(t),e),o=({domElement:t,prop:e})=>{if(window.getComputedStyle){const n=document.defaultView;if(n){const i=n.getComputedStyle(t);if(i)return i.getPropertyValue(e)}}},s="show",r="hide",a=(t,e,n)=>{const i=n[e]||{};Object.keys(i).forEach(e=>{const n=i[e].toString();t.style[e]=n})},u=(t,e)=>t.split(/ /).map(t=>`${t}-${e}`),d=(t,e,n,i)=>{if(e.styles){const o=((t,e)=>("function"==typeof e?e(t):e)||{})(t,e.styles);a(t,"default",o),i&&(t=>t.style.transitionDuration="0ms")(t),a(t,n,o)}if(e.className){const i={showStart:u(e.className,"show-start"),showEnd:u(e.className,"show-end"),hideStart:u(e.className,"hide-start"),hideEnd:u(e.className,"hide-end")};((t,e)=>t.classList.remove(...e.showStart,...e.showEnd,...e.hideStart,...e.hideEnd))(t,i),i&&t.classList.add(...i[n])}t.scrollTop},c={showStart:{nextStep:"showEnd"},showEnd:{nextStep:void 0},hideStart:{nextStep:"hideEnd"},hideEnd:{nextStep:void 0}},l=(t,e)=>{const n=t.domElement;if(!n)return Promise.resolve("no domElement");let i=e===s?"showStart":"hideStart";return new Promise(e=>{d(n,t,i,"showStart"===i),setTimeout(()=>{const s=c[i].nextStep;if(s){d(n,t,i=s);const r=(t=>{const e=o({domElement:t,prop:"transition-duration"}),n=void 0!==e?m(e):0,i=o({domElement:t,prop:"transition-delay"});return n+(void 0!==i?m(i):0)})(n);setTimeout(e,r)}},0)})},m=t=>{const e=parseFloat(t)*(-1===t.indexOf("ms")?1e3:1);return isNaN(e)?0:e};var p=function(t,e){return t(e={exports:{}},e.exports),e.exports}((function(t){!function(){n.SKIP={},n.lift=function(){var t=arguments[0];return o(Array.prototype.slice.call(arguments,1)).map((function(e){return t.apply(void 0,e)}))},n.scan=function(t,e,i){var o=i.map((function(i){var o=t(e,i);return o!==n.SKIP&&(e=o),o}));return o(e),o},n.merge=o,n.combine=i,n.scanMerge=function(t,e){var n=t.map((function(t){return t[0]})),o=i((function(){var i=arguments[arguments.length-1];return n.forEach((function(n,o){i.indexOf(n)>-1&&(e=t[o][1](e,n()))})),e}),n);return o(e),o},n["fantasy-land/of"]=n;var e=!1;function n(t){var e,o=[],r=[];function a(e){return arguments.length&&e!==n.SKIP&&(t=e,s(a)&&(a._changing(),a._state="active",o.forEach((function(e,n){e(r[n](t))})))),t}return a.constructor=n,a._state=arguments.length&&t!==n.SKIP?"active":"pending",a._parents=[],a._changing=function(){s(a)&&(a._state="changing"),o.forEach((function(t){t._changing()}))},a._map=function(e,i){var s=i?n():n(e(t));return s._parents.push(a),o.push(s),r.push(e),s},a.map=function(t){return a._map(t,"active"!==a._state)},a.toJSON=function(){return null!=t&&"function"==typeof t.toJSON?t.toJSON():t},a["fantasy-land/map"]=a.map,a["fantasy-land/ap"]=function(t){return i((function(t,e){return t()(e())}),[t,a])},a._unregisterChild=function(t){var e=o.indexOf(t);-1!==e&&(o.splice(e,1),r.splice(e,1))},Object.defineProperty(a,"end",{get:function(){return e||((e=n()).map((function(t){return!0===t&&(a._parents.forEach((function(t){t._unregisterChild(a)})),a._state="ended",a._parents.length=o.length=r.length=0),t})),e)}}),a}function i(t,e){var i=e.every((function(t){if(t.constructor!==n)throw new Error("Ensure that each item passed to stream.combine/stream.merge/lift is a stream");return"active"===t._state})),o=i?n(t.apply(null,e.concat([e]))):n(),s=[],r=e.map((function(n){return n._map((function(r){return s.push(n),(i||e.every((function(t){return"pending"!==t._state})))&&(i=!0,o(t.apply(null,e.concat([s]))),s=[]),r}),!0)})),a=o.end.map((function(t){!0===t&&(r.forEach((function(t){t.end(!0)})),a.end(!0))}));return o}function o(t){return i((function(){return t.map((function(t){return t()}))}),t)}function s(t){return"pending"===t._state||"active"===t._state||"changing"===t._state}Object.defineProperty(n,"HALT",{get:function(){return e||console.log("HALT is deprecated and has been renamed to SKIP"),e=!0,n.SKIP}}),t.exports=n}()}));const f=(t,e)=>{const n=((t,e)=>e.find(e=>e.id===t))(t,e);return e.indexOf(n)},g=(t,e)=>[e,t.id,t.spawn].filter(Boolean).join("-"),h={initialState:{store:{}},actions:t=>({add:(e,n)=>{t(i=>{const o=i.store[e]||[];return i.store[e]=[...o,n],n.timer&&n.timer.states.map(()=>h.actions(t).refresh()),i})},remove:(e,n)=>{t(t=>{const i=t.store[e]||[],o=((t,e)=>{const n=f(t,e);return-1!==n&&e.splice(n,1),e})(n,i);return t.store[e]=o,t})},replace:(e,n,i)=>{t(t=>{const o=t.store[e]||[];if(o){const s=f(n,o);-1!==s&&(o[s]=i,t.store[e]=[...o])}return t})},removeAll:e=>{t(t=>(t.store[e]=[],t))},store:(e,n)=>{t(t=>(t.store[e]=[...n],t))},refresh:()=>{t(t=>({...t}))}}),selectors:t=>{const e={getStore:()=>{return t().store},find:(e,n)=>{const i=t().store[e]||[],o=g(n,e),s=i.find(t=>t.id===o);return s?{just:s}:{nothing:void 0}},getAll:(e,n)=>{const i=t().store[e]||[],o=void 0!==n?n.spawn:void 0,s=void 0!==n?n.id:void 0,r=void 0!==o?i.filter(t=>t.identityOptions.spawn===o):i;return void 0!==s?r.filter(t=>t.identityOptions.id===s):r},getCount:(t,n)=>e.getAll(t,n).length};return e}},v=p(),w=p.scan((t,e)=>e(t),{...h.initialState},v),S={...h.actions(v)},y={...h.selectors(w)},O={callback:()=>{},isPaused:void 0,onAbort:()=>{},onDone:()=>{},promise:void 0,remaining:void 0,startTime:void 0,timeoutFn:()=>{},timerId:void 0},E=(t,e,n,i)=>{const o=()=>{e(),t.onDone(),i()};return{timeoutFn:o,promise:new Promise((e,n)=>{t.onDone=()=>e(),t.onAbort=()=>n()}),...t.isPaused?{}:{startTime:(new Date).getTime(),timerId:window.setTimeout(o,n),remaining:n}}},P=t=>(window.clearTimeout(t.timerId),{timerId:O.timerId}),_=t=>({...P(t)}),b=t=>({...P(t),isPaused:!0,remaining:T(t)}),j=(t,e)=>{window.clearTimeout(t.timerId);const n=e?Math.max(t.remaining||0,e):t.remaining;return{startTime:(new Date).getTime(),isPaused:!1,remaining:n,timerId:window.setTimeout(t.timeoutFn,n)}},T=t=>void 0===t.remaining?void 0:t.remaining-((new Date).getTime()-(t.startTime||0)),x=()=>{const t={initialState:O,actions:e=>({start:(n,i)=>{e(o=>({...o,...P(o),...E(o,n,i,()=>t.actions(e).done()),...o.isPaused&&b(o)}))},stop:()=>{e(t=>({...t,..._(t),...O}))},pause:()=>{e(t=>({...t,...!t.isPaused&&b(t)}))},resume:t=>{e(e=>({...e,...e.isPaused&&j(e,t)}))},abort:()=>{e(t=>(t.onAbort(),{...t,...P(t)}))},done:()=>{e(t=>O)},refresh:()=>{e(t=>({...t}))}}),selectors:t=>({isPaused:()=>{return t().isPaused},getRemaining:()=>{const e=t();return e.isPaused?e.remaining:T(e)},getResultPromise:()=>{return t().promise}})},e=p(),n=p.scan((t,e)=>e(t),{...t.initialState},e);return{states:n,actions:{...t.actions(e)},selectors:{...t.selectors(n)}}};let I=0;const A=()=>I===Number.MAX_SAFE_INTEGER?0:I++,N=0,q=1,D=2,k=t=>e=>n=>i=>{const o=C(e)(n)(i);return o.just?t(e,o.just,i):Promise.resolve()},C=t=>e=>n=>y.find(t,M(e,n)),H=t=>e=>e.filter(e=>e.identityOptions.spawn===t.spawn),R=t=>{let e=0;return t.map(t=>({item:t,queueCount:t.dialogicOptions.queued?e++:0})).filter(({queueCount:t})=>0===t).map(({item:t})=>t)},M=(t,e={})=>({id:e.id||t.id,spawn:e.spawn||t.spawn}),F=t=>e=>(n={})=>new Promise(i=>{const o={id:n.dialogic?n.dialogic.id:void 0,spawn:n.dialogic?n.dialogic.spawn:void 0},s=M(e,o),r={...e,...n.dialogic},a=(t=>{const e={...t};return delete e.dialogic,e})(n),u={didShow:t=>(r.didShow&&r.didShow(t),i(t)),didHide:t=>(r.didHide&&r.didHide(t),i(t))},d={ns:t,identityOptions:s,dialogicOptions:r,callbacks:u,passThroughOptions:a,id:g(s,t),timer:r.timeout?x():void 0,key:A().toString(),transitionState:N},c=y.find(t,s);if(c.just&&r.toggle){const n=K(t)(e)(o);return i(n)}if(c.just&&!r.queued){const e=c.just,n=e.dialogicOptions,i={...d,transitionState:e.transitionState,dialogicOptions:n};S.replace(t,e.id,i)}else S.add(t,d);i(d)}),K=k((t,e)=>e.transitionState!==D?tt(e):Promise.resolve(e)),L=k((t,e)=>(e&&e.timer&&e.timer.actions.pause(),Promise.resolve(e))),$=k((t,e,n={})=>(e&&e.timer&&e.timer.actions.resume(n.minimumDuration),Promise.resolve(e))),J=t=>e=>n=>i=>{const o=C(e)(n)(i);return o.just&&o.just&&o.just.timer?o.just.timer.selectors[t]():void 0},B=J("isPaused"),V=J("getRemaining"),G=t=>e=>n=>{return!!C(t)(e)(n).just},X=(t,e,n)=>{const o=y.getAll(t);let s;if(n){const t={...e,...n};s=i(H(t),(t=>e=>e.filter(e=>e.identityOptions.id===t.id))(t))(o)}else s=o;return s},z=t=>e=>n=>{const i=X(t,e,n),o=[];return i.forEach(t=>{t.timer&&t.timer.actions.abort(),o.push(t)}),n?i.forEach(e=>{S.remove(t,e.id)}):S.removeAll(t),Promise.resolve(o)},Q=(t,e)=>({...t,dialogicOptions:{...t.dialogicOptions,...e}}),U=t=>e=>n=>{const i=X(t,e,n),o=n||{},s=i.filter(t=>!o.queued&&!t.dialogicOptions.queued),r=i.filter(t=>o.queued||t.dialogicOptions.queued),a=[];if(s.forEach(t=>a.push(tt(Q(t,o)))),r.length>0){const[e]=r;S.store(t,[e]),a.push(tt(Q(e,o)))}return Promise.all(a)},W=t=>e=>y.getCount(t,e),Y=(t,e)=>l(t.dialogicOptions,e),Z=async function(t){return t.transitionState!==q&&(t.transitionState=q,await Y(t,s)),t.callbacks.didShow&&await t.callbacks.didShow(t),t.dialogicOptions.timeout&&t.timer&&await async function(t,e,n){return e.actions.start(()=>tt(t),n),J("getResultPromise")}(t,t.timer,t.dialogicOptions.timeout),Promise.resolve(t)},tt=async function(t){t.transitionState=D,t.timer&&t.timer.actions.stop(),await Y(t,r),t.callbacks.didHide&&await t.callbacks.didHide(t);const e={...t};return S.remove(t.ns,t.id),Promise.resolve(e)},et=({ns:t,queued:e,timeout:n})=>{const i=`default_${t}`,o=`default_${t}`,s={id:i,spawn:o,...e&&{queued:e},...void 0!==n&&{timeout:n}};return{ns:t,defaultId:i,defaultSpawn:o,defaultDialogicOptions:s,show:F(t)(s),hide:K(t)(s),hideAll:U(t)(s),resetAll:z(t)(s),pause:L(t)(s),resume:$(t)(s),exists:G(t)(s),getCount:W(t),isPaused:B(t)(s),getRemaining:V(t)(s)}},nt=et({ns:"dialog"}),it=et({ns:"notification",queued:!0,timeout:3e3}),ot=t=>(e,n)=>{const i=y.find(t,e.detail.identityOptions);i.just&&((t,e)=>{e.dialogicOptions.domElement=t})(e.detail.domElement,i.just);const o=y.find(t,e.detail.identityOptions);o.just&&n(o.just)},st=t=>{const i=e.useRef(),o=t.dialogicOptions.className,s=t.dialogicOptions.component,r=e.useCallback(t=>{null!==t&&(i.current=t,u())},[]),a=e=>{const n=i.current;void 0!==n&&e({detail:{identityOptions:t.identityOptions,domElement:n}})},u=()=>{a(t.onMount)};return n.createElement("div",{ref:r,className:o},n.createElement(s,Object.assign({},t.passThroughOptions,{show:()=>{a(t.onShow)},hide:()=>{a(t.onHide)}})))},rt=t=>{const e=(t=>e=>ot(t)(e,Z))(t.ns),o=(t=>e=>ot(t)(e,Z))(t.ns),s=(t=>e=>ot(t)(e,tt))(t.ns),r=t.identityOptions||{},a=((t,e,n)=>{const o=e[t]||[];return 0==o.length?[]:i(H(n),R)(o)})(t.ns,y.getStore(),r);return n.createElement(n.Fragment,null,a.map(t=>n.createElement(st,{key:t.key,identityOptions:t.identityOptions,dialogicOptions:t.dialogicOptions,passThroughOptions:t.passThroughOptions,onMount:e,onShow:o,onHide:s})))},at=()=>{const[t,n]=e.useState({}),i=e.useRef(!1);return e.useEffect(()=>(i.current=!0,w.map(({store:t})=>{i.current&&n({...t})}),()=>{i.current=!1}),[]),[t]},ut=t=>i=>{at();const o={id:i.id||t.defaultId,spawn:i.spawn||t.defaultSpawn};return e.useEffect(()=>{"function"==typeof i.onMount&&i.onMount()},[]),n.createElement(rt,{identityOptions:o,ns:t.ns})},dt=ut(nt),ct=ut(it);t.Dialog=dt,t.Dialogical=ut,t.Notification=ct,t.dialog=nt,t.notification=it,t.useDialogic=at,Object.defineProperty(t,"__esModule",{value:!0})}));
//# sourceMappingURL=dialogic-react.js.map
