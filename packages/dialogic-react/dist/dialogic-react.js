!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports,require("react")):"function"==typeof define&&define.amd?define(["exports","react"],e):e((t=t||self).dialogicReact={},t.React)}(this,(function(t,e){"use strict";var n="default"in e?e.default:e;const i=(...t)=>e=>t.filter(Boolean).reduce((t,e)=>e(t),e),o=({domElement:t,prop:e})=>{if(window.getComputedStyle){const n=document.defaultView;if(n){const i=n.getComputedStyle(t);if(i)return i.getPropertyValue(e)}}},s="show",r="hide",a=(t,e,n)=>{const i=n[e]||{};Object.keys(i).forEach(e=>{const n=i[e].toString();t.style[e]=n})},d=(t,e)=>t.split(/ /).map(t=>`${t}-${e}`),u=(t,e,n,i)=>{if(e.styles){const o=((t,e)=>("function"==typeof e?e(t):e)||{})(t,e.styles);a(t,"default",o),i&&(t=>t.style.transitionDuration="0ms")(t),a(t,n,o)}if(e.className){const i={showStart:d(e.className,"show-start"),showEnd:d(e.className,"show-end"),hideStart:d(e.className,"hide-start"),hideEnd:d(e.className,"hide-end")};((t,e)=>t.classList.remove(...e.showStart,...e.showEnd,...e.hideStart,...e.hideEnd))(t,i),i&&t.classList.add(...i[n])}t.scrollTop},c={showStart:{nextStep:"showEnd"},showEnd:{nextStep:void 0},hideStart:{nextStep:"hideEnd"},hideEnd:{nextStep:void 0}},l=(t,e)=>{const n=t.domElement;if(!n)return Promise.resolve("no domElement");let i=e===s?"showStart":"hideStart";return new Promise(e=>{u(n,t,i,"showStart"===i),setTimeout(()=>{const s=c[i].nextStep;if(s){u(n,t,i=s);const r=(t=>{const e=o({domElement:t,prop:"transition-duration"}),n=void 0!==e?p(e):0,i=o({domElement:t,prop:"transition-delay"});return n+(void 0!==i?p(i):0)})(n);setTimeout(e,r)}},0)})},p=t=>{const e=parseFloat(t)*(-1===t.indexOf("ms")?1e3:1);return isNaN(e)?0:e};var m=function(t,e){return t(e={exports:{}},e.exports),e.exports}((function(t){!function(){n.SKIP={},n.lift=function(){var t=arguments[0];return o(Array.prototype.slice.call(arguments,1)).map((function(e){return t.apply(void 0,e)}))},n.scan=function(t,e,i){var o=i.map((function(i){var o=t(e,i);return o!==n.SKIP&&(e=o),o}));return o(e),o},n.merge=o,n.combine=i,n.scanMerge=function(t,e){var n=t.map((function(t){return t[0]})),o=i((function(){var i=arguments[arguments.length-1];return n.forEach((function(n,o){i.indexOf(n)>-1&&(e=t[o][1](e,n()))})),e}),n);return o(e),o},n["fantasy-land/of"]=n;var e=!1;function n(t){var e,o=[],r=[];function a(e){return arguments.length&&e!==n.SKIP&&(t=e,s(a)&&(a._changing(),a._state="active",o.forEach((function(e,n){e(r[n](t))})))),t}return a.constructor=n,a._state=arguments.length&&t!==n.SKIP?"active":"pending",a._parents=[],a._changing=function(){s(a)&&(a._state="changing"),o.forEach((function(t){t._changing()}))},a._map=function(e,i){var s=i?n():n(e(t));return s._parents.push(a),o.push(s),r.push(e),s},a.map=function(t){return a._map(t,"active"!==a._state)},a.toJSON=function(){return null!=t&&"function"==typeof t.toJSON?t.toJSON():t},a["fantasy-land/map"]=a.map,a["fantasy-land/ap"]=function(t){return i((function(t,e){return t()(e())}),[t,a])},a._unregisterChild=function(t){var e=o.indexOf(t);-1!==e&&(o.splice(e,1),r.splice(e,1))},Object.defineProperty(a,"end",{get:function(){return e||((e=n()).map((function(t){return!0===t&&(a._parents.forEach((function(t){t._unregisterChild(a)})),a._state="ended",a._parents.length=o.length=r.length=0),t})),e)}}),a}function i(t,e){var i=e.every((function(t){if(t.constructor!==n)throw new Error("Ensure that each item passed to stream.combine/stream.merge/lift is a stream");return"active"===t._state})),o=i?n(t.apply(null,e.concat([e]))):n(),s=[],r=e.map((function(n){return n._map((function(r){return s.push(n),(i||e.every((function(t){return"pending"!==t._state})))&&(i=!0,o(t.apply(null,e.concat([s]))),s=[]),r}),!0)})),a=o.end.map((function(t){!0===t&&(r.forEach((function(t){t.end(!0)})),a.end(!0))}));return o}function o(t){return i((function(){return t.map((function(t){return t()}))}),t)}function s(t){return"pending"===t._state||"active"===t._state||"changing"===t._state}Object.defineProperty(n,"HALT",{get:function(){return e||console.log("HALT is deprecated and has been renamed to SKIP"),e=!0,n.SKIP}}),t.exports=n}()}));const f=(t,e)=>{const n=((t,e)=>e.find(e=>e.id===t))(t,e);return e.indexOf(n)},g=(t,e)=>[e,t.id,t.spawn].filter(Boolean).join("-"),h={initialState:{store:{}},actions:t=>({add:(e,n)=>{t(i=>{const o=i.store[e]||[];return i.store[e]=[...o,n],n.timer&&n.timer.states.map(()=>h.actions(t).refresh()),i})},remove:(e,n)=>{t(t=>{const i=t.store[e]||[],o=((t,e)=>{const n=f(t,e);return-1!==n&&e.splice(n,1),e})(n,i);return t.store[e]=o,t})},replace:(e,n,i)=>{t(t=>{const o=t.store[e]||[];if(o){const s=f(n,o);-1!==s&&(o[s]=i,t.store[e]=[...o])}return t})},removeAll:e=>{t(t=>(t.store[e]=[],t))},store:(e,n)=>{t(t=>(t.store[e]=[...n],t))},refresh:()=>{t(t=>({...t}))}}),selectors:t=>{const e={getStore:()=>{return t().store},find:(e,n)=>{const i=t().store[e]||[],o=g(n,e),s=i.find(t=>t.id===o);return s?{just:s}:{nothing:void 0}},getAll:(e,n)=>{const i=t().store[e]||[],o=void 0!==n?n.spawn:void 0,s=void 0!==n?n.id:void 0,r=void 0!==o?i.filter(t=>t.identityOptions.spawn===o):i;return void 0!==s?r.filter(t=>t.identityOptions.id===s):r},getCount:(t,n)=>e.getAll(t,n).length};return e}},w=m(),v=m.scan((t,e)=>e(t),{...h.initialState},w),O={...h.actions(w)},S={...h.selectors(v)},y={callback:()=>{},isPaused:!1,onAbort:()=>{},onDone:()=>{},promise:void 0,remaining:void 0,startTime:void 0,timeoutFn:()=>{},timerId:void 0},E=(t,e,n,i)=>{const o=()=>{e(),t.onDone(),i()};return{timeoutFn:o,promise:new Promise((e,n)=>{t.onDone=()=>e(),t.onAbort=()=>e()}),...t.isPaused?{}:{startTime:(new Date).getTime(),timerId:window.setTimeout(o,n),remaining:n}}},P=t=>(window.clearTimeout(t.timerId),{timerId:y.timerId}),T=t=>({...P(t)}),_=t=>({...P(t),isPaused:!0,remaining:j(t)}),b=(t,e)=>{window.clearTimeout(t.timerId);const n=e?Math.max(t.remaining||0,e):t.remaining;return{startTime:(new Date).getTime(),isPaused:!1,remaining:n,timerId:window.setTimeout(t.timeoutFn,n)}},j=t=>0===t.remaining||void 0===t.remaining?t.remaining:t.remaining-((new Date).getTime()-(t.startTime||0)),x=()=>{const t={initialState:y,actions:e=>({start:(n,i)=>{e(o=>({...o,...P(o),...E(o,n,i,()=>t.actions(e).done()),...o.isPaused&&_(o)}))},stop:()=>{e(t=>({...t,...T(t),...y}))},pause:()=>{e(t=>({...t,...!t.isPaused&&_(t)}))},resume:t=>{e(e=>({...e,...e.isPaused&&b(e,t)}))},abort:()=>{e(t=>(t.onAbort(),{...t,...P(t)}))},done:()=>{e(t=>y)},refresh:()=>{e(t=>({...t}))}}),selectors:t=>({isPaused:()=>{return t().isPaused},getRemaining:()=>{const e=t();return e.isPaused?e.remaining:j(e)},getResultPromise:()=>{return t().promise}})},e=m(),n=m.scan((t,e)=>e(t),{...t.initialState},e);return{states:n,actions:{...t.actions(e)},selectors:{...t.selectors(n)}}};let A=0;const I=()=>A===Number.MAX_SAFE_INTEGER?0:A++,N=0,q=1,k=2,R=t=>e=>void 0!==t.spawn?e.filter(e=>e.identityOptions.spawn===t.spawn):e,D=t=>{let e=0;return t.map(t=>({item:t,queueCount:t.dialogicOptions.queued?e++:0})).filter(({queueCount:t})=>0===t).map(({item:t})=>t)},M=(t,e={})=>({id:e.id||t.id,spawn:e.spawn||t.spawn}),C=(t,e={})=>{const n={id:e.dialogic?e.dialogic.id:void 0,spawn:e.dialogic?e.dialogic.spawn:void 0};return{identityOptions:M(t||{},n),dialogicOptions:{...t,...e.dialogic},passThroughOptions:(t=>{const e={...t};return delete e.dialogic,e})(e)}},F=t=>e=>(n={})=>{const{identityOptions:i,dialogicOptions:o,passThroughOptions:s}=C(e,n);return new Promise(r=>{const a={didShow:t=>(o.didShow&&o.didShow(t),r(t)),didHide:t=>(o.didHide&&o.didHide(t),r(t))},d={ns:t,identityOptions:i,dialogicOptions:o,callbacks:a,passThroughOptions:s,id:g(i,t),timer:o.timeout?x():void 0,key:I().toString(),transitionState:N},u=S.find(t,i);if(u.just&&o.toggle){const i=H(t)(e)(n);return r(i)}if(u.just&&!o.queued){const e=u.just,n=e.dialogicOptions,i={...d,transitionState:e.transitionState,dialogicOptions:n};O.replace(t,e.id,i)}else O.add(t,d);r(d)})},H=t=>e=>n=>{const{identityOptions:i,dialogicOptions:o,passThroughOptions:s}=C(e,n),r=S.find(t,i);if(r.just){const e=r.just,n={...e,dialogicOptions:{...e.dialogicOptions,...o},passThroughOptions:{...e.passThroughOptions,passThroughOptions:s}};return O.replace(t,e.id,n),n.transitionState!==k?Z(n):Promise.resolve(n)}return Promise.resolve()},K=t=>e=>e=>{const n=G(t,e).filter(t=>!!t.timer);return n.forEach(t=>t.timer&&t.timer.actions.pause()),Promise.all(n)},L=t=>e=>e=>{const n=e||{},i={id:n.id,spawn:n.spawn},o=G(t,i).filter(t=>!!t.timer);return o.forEach(t=>t.timer&&t.timer.actions.resume(n.minimumDuration)),Promise.all(o)},$=(t,e)=>n=>i=>o=>{const s=(t=>e=>n=>S.find(t,M(e,n)))(n)(i)(o);return s.just&&s.just&&s.just.timer?s.just.timer.selectors[t]():e},J=$("isPaused",!1),B=$("getRemaining",void 0),V=t=>e=>e=>!!G(t,e).length,G=(t,e)=>{const n=S.getAll(t);let o;return o=e?i(R(e),(t=>e=>void 0!==t.id?e.filter(e=>e.identityOptions.id===t.id):e)(e))(n):n},X=t=>e=>e=>{const n=G(t,e),i=[];return n.forEach(t=>{t.timer&&t.timer.actions.abort(),i.push(t)}),e?i.forEach(e=>{O.remove(t,e.id)}):O.removeAll(t),Promise.resolve(i)},z=(t,e)=>({...t,dialogicOptions:{...t.dialogicOptions,...e}}),Q=t=>e=>e=>{const n=e||{},i={id:n.id,spawn:n.spawn},o=G(t,i),s=o.filter(t=>!n.queued&&!t.dialogicOptions.queued),r=o.filter(t=>n.queued||t.dialogicOptions.queued),a=[];if(s.forEach(t=>a.push(Z(z(t,n)))),r.length>0){const[e]=r;O.store(t,[e]),a.push(Z(z(e,n)))}return Promise.all(a)},U=t=>e=>S.getCount(t,e),W=(t,e)=>l(t.dialogicOptions,e),Y=async function(t){return t.transitionState!==q&&(t.transitionState=q,await W(t,s)),t.callbacks.didShow&&await t.callbacks.didShow(t),t.dialogicOptions.timeout&&t.timer&&await async function(t,e,n){return e.actions.start(()=>Z(t),n),$("getResultPromise",void 0)}(t,t.timer,t.dialogicOptions.timeout),Promise.resolve(t)},Z=async function(t){t.transitionState=k,t.timer&&t.timer.actions.stop(),await W(t,r),t.callbacks.didHide&&await t.callbacks.didHide(t);const e={...t};return O.remove(t.ns,t.id),Promise.resolve(e)},tt=({ns:t,queued:e,timeout:n})=>{const i=`default_${t}`,o=`default_${t}`,s={id:i,spawn:o,...e&&{queued:e},...void 0!==n&&{timeout:n}};return{ns:t,defaultId:i,defaultSpawn:o,defaultDialogicOptions:s,show:F(t)(s),hide:H(t)(s),hideAll:Q(t)(s),resetAll:X(t)(s),pause:K(t)(s),resume:L(t)(s),exists:V(t)(s),getCount:U(t),isPaused:J(t)(s),getRemaining:B(t)(s)}},et=tt({ns:"dialog"}),nt=tt({ns:"notification",queued:!0,timeout:3e3}),it=t=>(e,n)=>{const i=S.find(t,e.detail.identityOptions);i.just&&((t,e)=>{e.dialogicOptions.domElement=t})(e.detail.domElement,i.just);const o=S.find(t,e.detail.identityOptions);o.just&&n(o.just)},ot=t=>{const i=e.useRef(),o=t.dialogicOptions.className,s=t.dialogicOptions.component,r=e.useCallback(t=>{null!==t&&(i.current=t,d())},[]),a=e=>{const n=i.current;void 0!==n&&e({detail:{identityOptions:t.identityOptions,domElement:n}})},d=()=>{a(t.onMount)};return n.createElement("div",{ref:r,className:o},n.createElement(s,Object.assign({},t.passThroughOptions,{show:()=>{a(t.onShow)},hide:()=>{a(t.onHide)}})))},st=t=>{const e=(t=>e=>it(t)(e,Y))(t.ns),o=(t=>e=>it(t)(e,Y))(t.ns),s=(t=>e=>it(t)(e,Z))(t.ns),r=t.identityOptions||{},a=((t,e,n)=>{const o=e[t]||[];return 0==o.length?[]:i(R(n),D)(o)})(t.ns,S.getStore(),r);return n.createElement(n.Fragment,null,a.map(t=>n.createElement(ot,{key:t.key,identityOptions:t.identityOptions,dialogicOptions:t.dialogicOptions,passThroughOptions:t.passThroughOptions,onMount:e,onShow:o,onHide:s})))},rt=()=>{const[t,n]=e.useState({}),i=e.useRef(!1);return e.useEffect(()=>(i.current=!0,v.map(({store:t})=>{i.current&&n({...t})}),()=>{i.current=!1}),[]),[t]},at=t=>i=>{rt();const o={id:i.id||t.defaultId,spawn:i.spawn||t.defaultSpawn};return e.useEffect(()=>{"function"==typeof i.onMount&&i.onMount()},[]),n.createElement(st,{identityOptions:o,ns:t.ns})},dt=at(et),ut=at(nt);t.Dialog=dt,t.Dialogical=at,t.Notification=ut,t.dialog=et,t.notification=nt,t.useDialogicState=rt,t.useRemaining=t=>{const[n,i]=e.useState(void 0),o=e.useRef(!1);return e.useEffect(()=>((t=>{let e,n=void 0,i=!1;const o=()=>{const s=t.instance.getRemaining();n!==s&&(n=void 0===s?s:t.roundToSeconds?Math.round(Math.max(s,0)/1e3):Math.max(s,0)),t.callback(n),t.instance.exists()?i||(e=window.requestAnimationFrame(o)):(window.cancelAnimationFrame(e),i=!0)};e=window.requestAnimationFrame(o)})({instance:t.instance,roundToSeconds:t.roundToSeconds,callback:t=>{o.current||i(t)}}),()=>{o.current=!0}),[]),[n]},Object.defineProperty(t,"__esModule",{value:!0})}));
//# sourceMappingURL=dialogic-react.js.map
