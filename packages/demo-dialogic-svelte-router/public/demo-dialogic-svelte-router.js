!function(t,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):(t="undefined"!=typeof globalThis?globalThis:t||self).demoDialogicSvelte=n()}(this,(function(){"use strict";function t(){}function n(t,n){for(const e in n)t[e]=n[e];return t}function e(t){return t()}function i(){return Object.create(null)}function o(t){t.forEach(e)}function s(t){return"function"==typeof t}function r(t,n){return t!=t?n==n:t!==n||t&&"object"==typeof t||"function"==typeof t}function a(n,...e){if(null==n)return t;const i=n.subscribe(...e);return i.unsubscribe?()=>i.unsubscribe():i}function c(t,n,e){t.$$.on_destroy.push(a(n,e))}function l(t){const n={};for(const e in t)"$"!==e[0]&&(n[e]=t[e]);return n}function u(n){return n&&s(n.destroy)?n.destroy:t}function d(t,n){t.appendChild(n)}function f(t,n,e){t.insertBefore(n,e||null)}function p(t){t.parentNode.removeChild(t)}function m(t){return document.createElement(t)}function h(t){return document.createTextNode(t)}function g(){return h(" ")}function $(){return h("")}function w(t,n,e,i){return t.addEventListener(n,e,i),()=>t.removeEventListener(n,e,i)}function y(t,n,e){null==e?t.removeAttribute(n):t.getAttribute(n)!==e&&t.setAttribute(n,e)}function v(t,n){n=""+n,t.wholeText!==n&&(t.data=n)}function b(t,n){t.value=null==n?"":n}let O;function S(t){O=t}function x(){if(!O)throw new Error("Function called outside component initialization");return O}function _(t){x().$$.on_mount.push(t)}function E(){const t=x();return(n,e)=>{const i=t.$$.callbacks[n];if(i){const o=function(t,n){const e=document.createEvent("CustomEvent");return e.initCustomEvent(t,!1,!1,n),e}(n,e);i.slice().forEach(n=>{n.call(t,o)})}}}function k(t,n){const e=t.$$.callbacks[n.type];e&&e.slice().forEach(t=>t(n))}const T=[],P=[],C=[],j=[],A=Promise.resolve();let I=!1;function D(){I||(I=!0,A.then(M))}function N(){return D(),A}function H(t){C.push(t)}let L=!1;const q=new Set;function M(){if(!L){L=!0;do{for(let t=0;t<T.length;t+=1){const n=T[t];S(n),R(n.$$)}for(S(null),T.length=0;P.length;)P.pop()();for(let t=0;t<C.length;t+=1){const n=C[t];q.has(n)||(q.add(n),n())}C.length=0}while(T.length);for(;j.length;)j.pop()();I=!1,L=!1,q.clear()}}function R(t){if(null!==t.fragment){t.update(),o(t.before_update);const n=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,n),t.after_update.forEach(H)}}const F=new Set;let K;function X(){K={r:0,c:[],p:K}}function Y(){K.r||o(K.c),K=K.p}function B(t,n){t&&t.i&&(F.delete(t),t.i(n))}function U(t,n,e,i){if(t&&t.o){if(F.has(t))return;F.add(t),K.c.push(()=>{F.delete(t),i&&(e&&t.d(1),i())}),t.o(n)}}function G(t,n){U(t,1,1,()=>{n.delete(t.key)})}function J(t,n){const e={},i={},o={$$scope:1};let s=t.length;for(;s--;){const r=t[s],a=n[s];if(a){for(const t in r)t in a||(i[t]=1);for(const t in a)o[t]||(e[t]=a[t],o[t]=1);t[s]=a}else for(const t in r)o[t]=1}for(const t in i)t in e||(e[t]=void 0);return e}function V(t){return"object"==typeof t&&null!==t?t:{}}function z(t){t&&t.c()}function W(t,n,i,r){const{fragment:a,on_mount:c,on_destroy:l,after_update:u}=t.$$;a&&a.m(n,i),r||H(()=>{const n=c.map(e).filter(s);l?l.push(...n):o(n),t.$$.on_mount=[]}),u.forEach(H)}function Q(t,n){const e=t.$$;null!==e.fragment&&(o(e.on_destroy),e.fragment&&e.fragment.d(n),e.on_destroy=e.fragment=null,e.ctx=[])}function Z(n,e,s,r,a,c,l=[-1]){const u=O;S(n);const d=n.$$={fragment:null,ctx:null,props:c,update:t,not_equal:a,bound:i(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(u?u.$$.context:e.context||[]),callbacks:i(),dirty:l,skip_bound:!1};let f=!1;if(d.ctx=s?s(n,e.props||{},(t,e,...i)=>{const o=i.length?i[0]:e;return d.ctx&&a(d.ctx[t],d.ctx[t]=o)&&(!d.skip_bound&&d.bound[t]&&d.bound[t](o),f&&function(t,n){-1===t.$$.dirty[0]&&(T.push(t),D(),t.$$.dirty.fill(0)),t.$$.dirty[n/31|0]|=1<<n%31}(n,t)),e}):[],d.update(),f=!0,o(d.before_update),d.fragment=!!r&&r(d.ctx),e.target){if(e.hydrate){const t=function(t){return Array.from(t.childNodes)}(e.target);d.fragment&&d.fragment.l(t),t.forEach(p)}else d.fragment&&d.fragment.c();e.intro&&B(n.$$.fragment),W(n,e.target,e.anchor,e.customElement),M()}S(u)}class tt{$destroy(){Q(this,1),this.$destroy=t}$on(t,n){const e=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return e.push(n),()=>{const t=e.indexOf(n);-1!==t&&e.splice(t,1)}}$set(t){var n;this.$$set&&(n=t,0!==Object.keys(n).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}var nt=function(t){var n={exports:{}};return t(n,n.exports),n.exports}((function(t){!function(){e.SKIP={},e.lift=function(){var t=arguments[0],n=Array.prototype.slice.call(arguments,1);return o(n).map((function(n){return t.apply(void 0,n)}))},e.scan=function(t,n,i){var o=i.map((function(i){var o=t(n,i);return o!==e.SKIP&&(n=o),o}));return o(n),o},e.merge=o,e.combine=i,e.scanMerge=function(t,n){var e=t.map((function(t){return t[0]})),o=i((function(){var i=arguments[arguments.length-1];return e.forEach((function(e,o){i.indexOf(e)>-1&&(n=t[o][1](n,e()))})),n}),e);return o(n),o},e["fantasy-land/of"]=e;var n=!1;function e(t){var n,o=[],r=[];function a(n){return arguments.length&&n!==e.SKIP&&(t=n,s(a)&&(a._changing(),a._state="active",o.forEach((function(n,e){n(r[e](t))})))),t}function c(){return(n=e()).map((function(t){return!0===t&&(a._parents.forEach((function(t){t._unregisterChild(a)})),a._state="ended",a._parents.length=o.length=r.length=0),t})),n}return a.constructor=e,a._state=arguments.length&&t!==e.SKIP?"active":"pending",a._parents=[],a._changing=function(){s(a)&&(a._state="changing"),o.forEach((function(t){t._changing()}))},a._map=function(n,i){var s=i?e():e(n(t));return s._parents.push(a),o.push(s),r.push(n),s},a.map=function(t){return a._map(t,"active"!==a._state)},a.toJSON=function(){return null!=t&&"function"==typeof t.toJSON?t.toJSON():t},a["fantasy-land/map"]=a.map,a["fantasy-land/ap"]=function(t){return i((function(t,n){return t()(n())}),[t,a])},a._unregisterChild=function(t){var n=o.indexOf(t);-1!==n&&(o.splice(n,1),r.splice(n,1))},Object.defineProperty(a,"end",{get:function(){return n||c()}}),a}function i(t,n){var i=n.every((function(t){if(t.constructor!==e)throw new Error("Ensure that each item passed to stream.combine/stream.merge/lift is a stream");return"active"===t._state})),o=i?e(t.apply(null,n.concat([n]))):e(),s=[],r=n.map((function(e){return e._map((function(r){return s.push(e),(i||n.every((function(t){return"pending"!==t._state})))&&(i=!0,o(t.apply(null,n.concat([s]))),s=[]),r}),!0)})),a=o.end.map((function(t){!0===t&&(r.forEach((function(t){t.end(!0)})),a.end(!0))}));return o}function o(t){return i((function(){return t.map((function(t){return t()}))}),t)}function s(t){return"pending"===t._state||"active"===t._state||"changing"===t._state}Object.defineProperty(e,"HALT",{get:function(){return n||console.log("HALT is deprecated and has been renamed to SKIP"),n=!0,e.SKIP}}),t.exports=e}()}));const et=(...t)=>n=>t.filter(Boolean).reduce((t,n)=>n(t),n),it=({domElement:t,prop:n})=>{const e=document.defaultView;if(e){const i=e.getComputedStyle(t);if(i)return i.getPropertyValue(n)}},ot="show",st="hide",rt=(t,n,e)=>{const i=e[n]||{};Object.keys(i).forEach(n=>{const e=i[n].toString();t.style[n]=e})},at=(t,n)=>t.split(/ /).map(t=>`${t}-${n}`),ct=(t,n,e,i)=>{if(n.styles){const o=((t,n)=>("function"==typeof n?n(t):n)||{})(t,n.styles);rt(t,"default",o),i&&(t=>{t.style.transitionDuration="0ms"})(t),rt(t,e,o)}if(n.className){const i={showStart:at(n.className,"show-start"),showEnd:at(n.className,"show-end"),hideStart:at(n.className,"hide-start"),hideEnd:at(n.className,"hide-end")};((t,n)=>{t.classList.remove(...n.showStart,...n.showEnd,...n.hideStart,...n.hideEnd)})(t,i),i&&t.classList.add(...i[e])}t.scrollTop},lt={showStart:{nextStep:"showEnd"},showEnd:{nextStep:void 0},hideStart:{nextStep:"hideEnd"},hideEnd:{nextStep:void 0}},ut=(t,n)=>{const e=t.domElement;if(!e)return Promise.resolve("no domElement");clearTimeout(t.__transitionTimeoutId__);let i=n===ot?"showStart":"hideStart";return new Promise(n=>{ct(e,t,i,"showStart"===i),setTimeout(()=>{const o=lt[i].nextStep;if(o){i=o,ct(e,t,i);const s=(t=>{const n=it({domElement:t,prop:"transition-duration"}),e=void 0!==n?dt(n):0,i=it({domElement:t,prop:"transition-delay"});return e+(void 0!==i?dt(i):0)})(e);t.__transitionTimeoutId__=setTimeout(n,s)}},0)})},dt=t=>{const n=parseFloat(t)*(-1===t.indexOf("ms")?1e3:1);return isNaN(n)?0:n},ft=(t,n)=>{const e=((t,n)=>n.find(n=>n.id===t))(t,n);return n.indexOf(e)},pt=(t,n)=>[n,t.id,t.spawn].filter(Boolean).join("-"),mt={initialState:{store:{}},actions:t=>({add:(n,e)=>{t(i=>{const o=i.store[n]||[];return i.store[n]=[...o,e],e.timer&&e.timer.states.map(()=>mt.actions(t).refresh()),i})},remove:(n,e)=>{t(t=>{const i=t.store[n]||[],o=((t,n)=>{const e=ft(t,n);return-1!==e&&n.splice(e,1),n})(e,i);return t.store[n]=o,t})},replace:(n,e,i)=>{t(t=>{const o=t.store[n]||[];if(o){const s=ft(e,o);-1!==s&&(o[s]=i,t.store[n]=[...o])}return t})},removeAll:n=>{t(t=>(t.store[n]=[],t))},store:(n,e)=>{t(t=>(t.store[n]=[...e],t))},refresh:()=>{t(t=>({...t}))}}),selectors:t=>{const n={getStore:()=>t().store,find:(n,e)=>{const i=t().store[n]||[],o=pt(e,n),s=i.find(t=>t.id===o);return s?{just:s}:{nothing:void 0}},getAll:(n,e)=>{const i=t().store[n]||[],o=void 0!==e?e.spawn:void 0,s=void 0!==e?e.id:void 0,r=void 0!==o?i.filter(t=>t.identityOptions.spawn===o):i;return void 0!==s?r.filter(t=>t.identityOptions.id===s):r},getCount:(t,e)=>n.getAll(t,e).length};return n}},ht=nt(),gt=nt.scan((t,n)=>n(t),{...mt.initialState},ht),$t={...mt.actions(ht)},wt={...mt.selectors(gt)},yt={callback:()=>{},isPaused:!1,onAbort:()=>{},onDone:()=>{},promise:void 0,remaining:void 0,startTime:void 0,timeoutFn:()=>{},timerId:void 0},vt=(t,n,e,i)=>{const o=()=>{n(),t.onDone(),i()};return{timeoutFn:o,promise:new Promise(n=>{t.onDone=()=>n(),t.onAbort=()=>n()}),...t.isPaused?{}:{startTime:(new Date).getTime(),timerId:window.setTimeout(o,e),remaining:e}}},bt=t=>(window.clearTimeout(t.timerId),{timerId:yt.timerId}),Ot=t=>({...bt(t)}),St=t=>({...bt(t),isPaused:!0,remaining:_t(t)}),xt=(t,n)=>{window.clearTimeout(t.timerId);const e=n?Math.max(t.remaining||0,n):t.remaining;return{startTime:(new Date).getTime(),isPaused:!1,remaining:e,timerId:window.setTimeout(t.timeoutFn,e)}},_t=t=>0===t.remaining||void 0===t.remaining?t.remaining:t.remaining-((new Date).getTime()-(t.startTime||0)),Et=()=>{const t={initialState:yt,actions:n=>({start:(e,i)=>{n(o=>({...o,...bt(o),...vt(o,e,i,()=>t.actions(n).done()),...o.isPaused&&St(o)}))},stop:()=>{n(t=>({...t,...Ot(t),...yt}))},pause:()=>{n(t=>({...t,...!t.isPaused&&St(t)}))},resume:t=>{n(n=>({...n,...n.isPaused&&xt(n,t)}))},abort:()=>{n(t=>(t.onAbort(),{...t,...bt(t)}))},done:()=>{n(t=>yt)},refresh:()=>{n(t=>({...t}))}}),selectors:t=>({isPaused:()=>t().isPaused,getRemaining:()=>{const n=t();return n.isPaused?n.remaining:_t(n)},getResultPromise:()=>t().promise})},n=nt(),e=nt.scan((t,n)=>n(t),{...t.initialState},n);return{states:e,actions:{...t.actions(n)},selectors:{...t.selectors(e)}}};let kt=0;const Tt=0,Pt=1,Ct=2,jt=t=>n=>void 0!==t.spawn?n.filter(n=>n.identityOptions.spawn===t.spawn):n,At=t=>{let n=0;return t.map(t=>({item:t,queueCount:t.dialogicOptions.queued?n++:0})).filter(({queueCount:t})=>0===t).map(({item:t})=>t)},It=(t,n,e)=>{const i=n[t]||[];return 0==i.length?[]:et(jt(e),At)(i)},Dt=(t,n={})=>({id:n.id||t.id,spawn:n.spawn||t.spawn}),Nt=(t,n={})=>{const e={id:n.dialogic?n.dialogic.id:void 0,spawn:n.dialogic?n.dialogic.spawn:void 0};return{identityOptions:Dt(t||{},e),dialogicOptions:{...t,...n.dialogic,__transitionTimeoutId__:0},passThroughOptions:(t=>{const n={...t};return delete n.dialogic,n})(n)}},Ht=t=>n=>(e={})=>{const{identityOptions:i,dialogicOptions:o,passThroughOptions:s}=Nt(n,e);return new Promise(r=>{const a={willShow:t=>(o.willShow&&o.willShow(t),r(t)),willHide:t=>(o.willHide&&o.willHide(t),r(t)),didShow:t=>(o.didShow&&o.didShow(t),r(t)),didHide:t=>(o.didHide&&o.didHide(t),r(t))},c={ns:t,identityOptions:i,dialogicOptions:o,callbacks:a,passThroughOptions:s,id:pt(i,t),timer:o.timeout?Et():void 0,key:(kt===Number.MAX_VALUE?0:kt++).toString(),transitionState:Tt},l=wt.find(t,i);if(l.just&&o.toggle){const i=Lt(t)(n)(e);return r(i)}if(l.just&&!o.queued){const n=l.just,e=n.dialogicOptions,i={...c,key:n.key,transitionState:n.transitionState,dialogicOptions:e};$t.replace(t,n.id,i)}else $t.add(t,c);r(c)})},Lt=t=>n=>e=>{const{identityOptions:i,dialogicOptions:o,passThroughOptions:s}=Nt(n,e),r=wt.find(t,i);if(r.just){const n=r.just,e={...n,dialogicOptions:{...n.dialogicOptions,...o},passThroughOptions:{...n.passThroughOptions,passThroughOptions:s}};return $t.replace(t,n.id,e),e.transitionState!==Ct?Wt(e):Promise.resolve(e)}return Promise.resolve()},qt=t=>n=>n=>{const e=Yt(t,n).filter(t=>!!t.timer);return e.forEach(t=>t.timer&&t.timer.actions.pause()),Promise.all(e)},Mt=t=>n=>n=>{const e=n||{},i={id:e.id,spawn:e.spawn},o=Yt(t,i).filter(t=>!!t.timer);return o.forEach(t=>t.timer&&t.timer.actions.resume(e.minimumDuration)),Promise.all(o)},Rt=(t,n)=>e=>i=>o=>{const s=(t=>n=>e=>wt.find(t,Dt(n,e)))(e)(i)(o);return s.just&&s.just&&s.just.timer?s.just.timer.selectors[t]():n},Ft=Rt("isPaused",!1),Kt=Rt("getRemaining",void 0),Xt=t=>n=>n=>!!Yt(t,n).length,Yt=(t,n)=>{const e=wt.getAll(t);let i;return i=n?et(jt(n),(t=>n=>void 0!==t.id?n.filter(n=>n.identityOptions.id===t.id):n)(n))(e):e,i},Bt=t=>n=>n=>{const e=Yt(t,n),i=[];return e.forEach(t=>{t.timer&&t.timer.actions.abort(),i.push(t)}),n?i.forEach(n=>{$t.remove(t,n.id)}):$t.removeAll(t),Promise.resolve(i)},Ut=(t,n)=>({...t,dialogicOptions:{...t.dialogicOptions,...n}}),Gt=t=>n=>n=>{const e=n||{},i={id:e.id,spawn:e.spawn},o=Yt(t,i),s=o.filter(t=>!e.queued&&!t.dialogicOptions.queued),r=o.filter(t=>e.queued||t.dialogicOptions.queued),a=[];if(s.forEach(t=>a.push(Wt(Ut(t,e)))),r.length>0){const[n]=r;$t.store(t,[n]),a.push(Wt(Ut(n,e)))}return Promise.all(a)},Jt=t=>n=>wt.getCount(t,n),Vt=(t,n)=>ut(t.dialogicOptions,n),zt=async function(t){return t.callbacks.willShow&&t.callbacks.willShow(t),t.transitionState!==Pt&&(t.transitionState=Pt,await Vt(t,ot)),t.callbacks.didShow&&t.callbacks.didShow(t),t.dialogicOptions.timeout&&t.timer&&await async function(t,n,e){return n.actions.start(()=>Wt(t),e),Rt("getResultPromise",void 0)}(t,t.timer,t.dialogicOptions.timeout),Promise.resolve(t)},Wt=async function(t){t.transitionState=Ct,t.timer&&t.timer.actions.stop(),t.callbacks.willHide&&t.callbacks.willHide(t),await Vt(t,st),t.callbacks.didHide&&t.callbacks.didHide(t);const n={...t};return $t.remove(t.ns,t.id),Promise.resolve(n)},Qt=({ns:t,queued:n,timeout:e})=>{const i="default_"+t,o="default_"+t,s={id:i,spawn:o,...n&&{queued:n},...void 0!==e&&{timeout:e}};return{ns:t,defaultId:i,defaultSpawn:o,defaultDialogicOptions:s,show:Ht(t)(s),hide:Lt(t)(s),hideAll:Gt(t)(s),resetAll:Bt(t)(s),pause:qt(t)(s),resume:Mt(t)(s),exists:Xt(t)(s),getCount:Jt(t),isPaused:Ft(t)(s),getRemaining:Kt(t)(s)}},Zt=Qt({ns:"dialog"}),tn=Qt({ns:"notification",queued:!0,timeout:3e3}),nn=[];function en(t,n){return{subscribe:on(t,n).subscribe}}function on(n,e=t){let i;const o=[];function s(t){if(r(n,t)&&(n=t,i)){const t=!nn.length;for(let t=0;t<o.length;t+=1){const e=o[t];e[1](),nn.push(e,n)}if(t){for(let t=0;t<nn.length;t+=2)nn[t][0](nn[t+1]);nn.length=0}}}return{set:s,update:function(t){s(t(n))},subscribe:function(r,a=t){const c=[r,a];return o.push(c),1===o.length&&(i=e(s)||t),r(n),()=>{const t=o.indexOf(c);-1!==t&&o.splice(t,1),0===o.length&&(i(),i=null)}}}}function sn(n,e,i){const r=!Array.isArray(n),c=r?[n]:n,l=e.length<2;return en(i,n=>{let i=!1;const u=[];let d=0,f=t;const p=()=>{if(d)return;f();const i=e(r?u[0]:u,n);l?n(i):f=s(i)?i:t},m=c.map((t,n)=>a(t,t=>{u[n]=t,d&=~(1<<n),i&&p()},()=>{d|=1<<n}));return i=!0,p(),function(){o(m),f()}})}const rn={...on(gt),...wt};gt.map(t=>rn.set({...t,...wt}));const an=t=>n=>sn(rn,()=>wt.getCount(t,n)),cn=t=>n=>e=>sn(rn,()=>Ft(t)(n)(e)),ln=t=>n=>e=>sn(rn,()=>Xt(t)(n)(e)),un={...Zt,getCount:t=>an(Zt.ns)(t),isPaused:t=>cn(Zt.ns)(Zt.defaultDialogicOptions)(t),exists:t=>ln(Zt.ns)(Zt.defaultDialogicOptions)(t)},dn={...tn,getCount:t=>an(tn.ns)(t),isPaused:t=>cn(tn.ns)(tn.defaultDialogicOptions)(t),exists:t=>ln(tn.ns)(tn.defaultDialogicOptions)(t)},fn=t=>(n,e)=>{const i=wt.find(t,n.detail.identityOptions);var o;i.just&&(o=n.detail.domElement,i.just.dialogicOptions.domElement=o);const s=wt.find(t,n.detail.identityOptions);s.just&&e(s.just)};function pn(t){let e,i,o;const s=[{show:t[4]},{hide:t[5]},t[0]];var r=t[1].component;function a(t){let e={};for(let t=0;t<s.length;t+=1)e=n(e,s[t]);return{props:e}}return r&&(i=new r(a())),{c(){e=m("div"),i&&z(i.$$.fragment),y(e,"class",t[3])},m(n,s){f(n,e,s),i&&W(i,e,null),t[7](e),o=!0},p(t,[n]){const o=49&n?J(s,[16&n&&{show:t[4]},32&n&&{hide:t[5]},1&n&&V(t[0])]):{};if(r!==(r=t[1].component)){if(i){X();const t=i;U(t.$$.fragment,1,0,()=>{Q(t,1)}),Y()}r?(i=new r(a()),z(i.$$.fragment),B(i.$$.fragment,1),W(i,e,null)):i=null}else r&&i.$set(o)},i(t){o||(i&&B(i.$$.fragment,t),o=!0)},o(t){i&&U(i.$$.fragment,t),o=!1},d(n){n&&p(e),i&&Q(i),t[7](null)}}}function mn(t,n,e){const i=E();let o,{identityOptions:s}=n,{passThroughOptions:r}=n,{dialogicOptions:a}=n;const c=a?a.className:"",l=t=>i(t,{identityOptions:s,domElement:o});return _(()=>{l("mount")}),t.$$set=t=>{"identityOptions"in t&&e(6,s=t.identityOptions),"passThroughOptions"in t&&e(0,r=t.passThroughOptions),"dialogicOptions"in t&&e(1,a=t.dialogicOptions)},[r,a,o,c,()=>{l("show")},()=>{l("hide")},s,function(t){P[t?"unshift":"push"](()=>{o=t,e(2,o)})}]}class hn extends tt{constructor(t){super(),Z(this,t,mn,pn,r,{identityOptions:6,passThroughOptions:0,dialogicOptions:1})}}function gn(t,n,e){const i=t.slice();return i[1]=n[e].identityOptions,i[6]=n[e].dialogicOptions,i[7]=n[e].passThroughOptions,i[8]=n[e].key,i[10]=e,i}function $n(t,n){let e,i,o;return i=new hn({props:{identityOptions:n[1],dialogicOptions:n[6],passThroughOptions:n[7]}}),i.$on("mount",n[3]),i.$on("show",n[4]),i.$on("hide",n[5]),{key:t,first:null,c(){e=$(),z(i.$$.fragment),this.first=e},m(t,n){f(t,e,n),W(i,t,n),o=!0},p(t,e){n=t;const o={};7&e&&(o.identityOptions=n[1]),7&e&&(o.dialogicOptions=n[6]),7&e&&(o.passThroughOptions=n[7]),i.$set(o)},i(t){o||(B(i.$$.fragment,t),o=!0)},o(t){U(i.$$.fragment,t),o=!1},d(t){t&&p(e),Q(i,t)}}}function wn(t){let n,e,i=[],o=new Map,s=It(t[0],t[2].store,t[1]);const r=t=>t[8];for(let n=0;n<s.length;n+=1){let e=gn(t,s,n),a=r(e);o.set(a,i[n]=$n(a,e))}return{c(){for(let t=0;t<i.length;t+=1)i[t].c();n=$()},m(t,o){for(let n=0;n<i.length;n+=1)i[n].m(t,o);f(t,n,o),e=!0},p(t,[e]){63&e&&(s=It(t[0],t[2].store,t[1]),X(),i=function(t,n,e,i,o,s,r,a,c,l,u,d){let f=t.length,p=s.length,m=f;const h={};for(;m--;)h[t[m].key]=m;const g=[],$=new Map,w=new Map;for(m=p;m--;){const t=d(o,s,m),a=e(t);let c=r.get(a);c?i&&c.p(t,n):(c=l(a,t),c.c()),$.set(a,g[m]=c),a in h&&w.set(a,Math.abs(m-h[a]))}const y=new Set,v=new Set;function b(t){B(t,1),t.m(a,u),r.set(t.key,t),u=t.first,p--}for(;f&&p;){const n=g[p-1],e=t[f-1],i=n.key,o=e.key;n===e?(u=n.first,f--,p--):$.has(o)?!r.has(i)||y.has(i)?b(n):v.has(o)?f--:w.get(i)>w.get(o)?(v.add(i),b(n)):(y.add(o),f--):(c(e,r),f--)}for(;f--;){const n=t[f];$.has(n.key)||c(n,r)}for(;p;)b(g[p-1]);return g}(i,e,r,1,t,s,o,n.parentNode,G,$n,n,gn),Y())},i(t){if(!e){for(let t=0;t<s.length;t+=1)B(i[t]);e=!0}},o(t){for(let t=0;t<i.length;t+=1)U(i[t]);e=!1},d(t){for(let n=0;n<i.length;n+=1)i[n].d(t);t&&p(n)}}}function yn(t,n,e){let i;c(t,rn,t=>e(2,i=t));let{identityOptions:o}=n,{ns:s}=n;const r=(t=>n=>fn(t)(n,zt))(s),a=(t=>n=>fn(t)(n,zt))(s),l=(t=>n=>fn(t)(n,Wt))(s);return t.$$set=t=>{"identityOptions"in t&&e(1,o=t.identityOptions),"ns"in t&&e(0,s=t.ns)},[s,o,i,r,a,l]}class vn extends tt{constructor(t){super(),Z(this,t,yn,wn,r,{identityOptions:1,ns:0})}}function bn(t){let n,e;return n=new vn({props:{identityOptions:t[1],ns:t[0]}}),{c(){z(n.$$.fragment)},m(t,i){W(n,t,i),e=!0},p(t,[e]){const i={};1&e&&(i.ns=t[0]),n.$set(i)},i(t){e||(B(n.$$.fragment,t),e=!0)},o(t){U(n.$$.fragment,t),e=!1},d(t){Q(n,t)}}}function On(t,n,e){let{instance:i}=n,{ns:o=i.ns}=n,{spawn:s}=n,{id:r}=n,{onMount:a}=n;const c={id:r||i.defaultId,spawn:s||i.defaultSpawn};return _(()=>{"function"==typeof a&&a()}),t.$$set=t=>{"instance"in t&&e(2,i=t.instance),"ns"in t&&e(0,o=t.ns),"spawn"in t&&e(3,s=t.spawn),"id"in t&&e(4,r=t.id),"onMount"in t&&e(5,a=t.onMount)},[o,c,i,s,r,a]}class Sn extends tt{constructor(t){super(),Z(this,t,On,bn,r,{instance:2,ns:0,spawn:3,id:4,onMount:5})}}function xn(t){let e,i;const o=[t[0],{instance:un}];let s={};for(let t=0;t<o.length;t+=1)s=n(s,o[t]);return e=new Sn({props:s}),{c(){z(e.$$.fragment)},m(t,n){W(e,t,n),i=!0},p(t,[n]){const i=1&n?J(o,[1&n&&V(t[0]),0&n&&{instance:un}]):{};e.$set(i)},i(t){i||(B(e.$$.fragment,t),i=!0)},o(t){U(e.$$.fragment,t),i=!1},d(t){Q(e,t)}}}function _n(t,e,i){return t.$$set=t=>{i(0,e=n(n({},e),l(t)))},[e=l(e)]}class En extends tt{constructor(t){super(),Z(this,t,_n,xn,r,{})}}function kn(t){let e,i;const o=[t[0],{instance:dn}];let s={};for(let t=0;t<o.length;t+=1)s=n(s,o[t]);return e=new Sn({props:s}),{c(){z(e.$$.fragment)},m(t,n){W(e,t,n),i=!0},p(t,[n]){const i=1&n?J(o,[1&n&&V(t[0]),0&n&&{instance:dn}]):{};e.$set(i)},i(t){i||(B(e.$$.fragment,t),i=!0)},o(t){U(e.$$.fragment,t),i=!1},d(t){Q(e,t)}}}function Tn(t,e,i){return t.$$set=t=>{i(0,e=n(n({},e),l(t)))},[e=l(e)]}class Pn extends tt{constructor(t){super(),Z(this,t,Tn,kn,r,{})}}let Cn=0;function jn(n,e,i){let o,s,r=t;n.$$.on_destroy.push(()=>r());const c=Cn++;let{props:l}=e,{isShow:u}=e,{isHide:d}=e,{isIgnore:f}=e,{deps:p}=e,{instance:m}=e;const h=()=>{m.hide(o)};let g;return _(()=>()=>{h()}),n.$$set=t=>{"props"in t&&i(1,l=t.props),"isShow"in t&&i(2,u=t.isShow),"isHide"in t&&i(3,d=t.isHide),"isIgnore"in t&&i(4,f=t.isIgnore),"deps"in t&&i(5,p=t.deps),"instance"in t&&i(6,m=t.instance)},n.$$.update=()=>{2&n.$$.dirty&&(o={...l,...l.dialogic?{dialogic:{...l.dialogic,id:l.dialogic.id||c}}:{dialogic:{id:c}}}),60&n.$$.dirty&&(i(0,g=(t=>({subscribe:t}))(()=>(f||(void 0!==u?u?m.show(o):h():void 0!==d&&d&&h()),()=>{}))),r(),r=a(g,t=>i(7,s=t))),n.$$.dirty},[g,l,u,d,f,p,m,s]}class An extends tt{constructor(t){super(),Z(this,t,jn,null,r,{props:1,isShow:2,isHide:3,isIgnore:4,deps:5,instance:6})}}function In(t){let e,i;const o=[{instance:Zt},t[0]];let s={};for(let t=0;t<o.length;t+=1)s=n(s,o[t]);return e=new An({props:s}),{c(){z(e.$$.fragment)},m(t,n){W(e,t,n),i=!0},p(t,[n]){const i=1&n?J(o,[0&n&&{instance:Zt},1&n&&V(t[0])]):{};e.$set(i)},i(t){i||(B(e.$$.fragment,t),i=!0)},o(t){U(e.$$.fragment,t),i=!1},d(t){Q(e,t)}}}function Dn(t,e,i){return t.$$set=t=>{i(0,e=n(n({},e),l(t)))},[e=l(e)]}class Nn extends tt{constructor(t){super(),Z(this,t,Dn,In,r,{})}}function Hn(t){let e,i,o;const s=[t[2]];var r=t[0];function a(t){let e={};for(let t=0;t<s.length;t+=1)e=n(e,s[t]);return{props:e}}return r&&(e=new r(a()),e.$on("routeEvent",t[7])),{c(){e&&z(e.$$.fragment),i=$()},m(t,n){e&&W(e,t,n),f(t,i,n),o=!0},p(t,n){const o=4&n?J(s,[V(t[2])]):{};if(r!==(r=t[0])){if(e){X();const t=e;U(t.$$.fragment,1,0,()=>{Q(t,1)}),Y()}r?(e=new r(a()),e.$on("routeEvent",t[7]),z(e.$$.fragment),B(e.$$.fragment,1),W(e,i.parentNode,i)):e=null}else r&&e.$set(o)},i(t){o||(e&&B(e.$$.fragment,t),o=!0)},o(t){e&&U(e.$$.fragment,t),o=!1},d(t){t&&p(i),e&&Q(e,t)}}}function Ln(t){let e,i,o;const s=[{params:t[1]},t[2]];var r=t[0];function a(t){let e={};for(let t=0;t<s.length;t+=1)e=n(e,s[t]);return{props:e}}return r&&(e=new r(a()),e.$on("routeEvent",t[6])),{c(){e&&z(e.$$.fragment),i=$()},m(t,n){e&&W(e,t,n),f(t,i,n),o=!0},p(t,n){const o=6&n?J(s,[2&n&&{params:t[1]},4&n&&V(t[2])]):{};if(r!==(r=t[0])){if(e){X();const t=e;U(t.$$.fragment,1,0,()=>{Q(t,1)}),Y()}r?(e=new r(a()),e.$on("routeEvent",t[6]),z(e.$$.fragment),B(e.$$.fragment,1),W(e,i.parentNode,i)):e=null}else r&&e.$set(o)},i(t){o||(e&&B(e.$$.fragment,t),o=!0)},o(t){e&&U(e.$$.fragment,t),o=!1},d(t){t&&p(i),e&&Q(e,t)}}}function qn(t){let n,e,i,o;const s=[Ln,Hn],r=[];function a(t,n){return t[1]?0:1}return n=a(t),e=r[n]=s[n](t),{c(){e.c(),i=$()},m(t,e){r[n].m(t,e),f(t,i,e),o=!0},p(t,[o]){let c=n;n=a(t),n===c?r[n].p(t,o):(X(),U(r[c],1,1,()=>{r[c]=null}),Y(),e=r[n],e?e.p(t,o):(e=r[n]=s[n](t),e.c()),B(e,1),e.m(i.parentNode,i))},i(t){o||(B(e),o=!0)},o(t){U(e),o=!1},d(t){r[n].d(t),t&&p(i)}}}function Mn(){const t=window.location.href.indexOf("#/");let n=t>-1?window.location.href.substr(t+1):"/";const e=n.indexOf("?");let i="";return e>-1&&(i=n.substr(e+1),n=n.substr(0,e)),{location:n,querystring:i}}const Rn=en(null,(function(t){t(Mn());const n=()=>{t(Mn())};return window.addEventListener("hashchange",n,!1),function(){window.removeEventListener("hashchange",n,!1)}})),Fn=sn(Rn,t=>t.location);async function Kn(t){if(!t||t.length<1||"/"!=t.charAt(0)&&0!==t.indexOf("#/"))throw Error("Invalid parameter location");await N(),history.replaceState({scrollX:window.scrollX,scrollY:window.scrollY},void 0,void 0),window.location.hash=("#"==t.charAt(0)?"":"#")+t}function Xn(t,n){if(!t||!t.tagName||"a"!=t.tagName.toLowerCase())throw Error('Action "link" can only be used with <a> tags');return Yn(t,n||t.getAttribute("href")),{update(n){Yn(t,n)}}}function Yn(t,n){if(!n||n.length<1||"/"!=n.charAt(0))throw Error('Invalid value for "href" attribute: '+n);t.setAttribute("href","#"+n),t.addEventListener("click",Bn)}function Bn(t){t.preventDefault();const n=t.currentTarget.getAttribute("href");history.replaceState({scrollX:window.scrollX,scrollY:window.scrollY},void 0,void 0),window.location.hash=n}function Un(t,n,e){let{routes:i={}}=n,{prefix:o=""}=n,{restoreScrollState:s=!1}=n;class r{constructor(t,n){if(!n||"function"!=typeof n&&("object"!=typeof n||!0!==n._sveltesparouter))throw Error("Invalid component object");if(!t||"string"==typeof t&&(t.length<1||"/"!=t.charAt(0)&&"*"!=t.charAt(0))||"object"==typeof t&&!(t instanceof RegExp))throw Error('Invalid value for "path" argument - strings must start with / or *');const{pattern:e,keys:i}=function(t,n){if(t instanceof RegExp)return{keys:!1,pattern:t};var e,i,o,s,r=[],a="",c=t.split("/");for(c[0]||c.shift();o=c.shift();)"*"===(e=o[0])?(r.push("wild"),a+="/(.*)"):":"===e?(i=o.indexOf("?",1),s=o.indexOf(".",1),r.push(o.substring(1,~i?i:~s?s:o.length)),a+=~i&&!~s?"(?:/([^/]+?))?":"/([^/]+?)",~s&&(a+=(~i?"?":"")+"\\"+o.substring(s))):a+="/"+o;return{keys:r,pattern:new RegExp("^"+a+(n?"(?=$|/)":"/?$"),"i")}}(t);this.path=t,"object"==typeof n&&!0===n._sveltesparouter?(this.component=n.component,this.conditions=n.conditions||[],this.userData=n.userData,this.props=n.props||{}):(this.component=()=>Promise.resolve(n),this.conditions=[],this.props={}),this._pattern=e,this._keys=i}match(t){if(o)if("string"==typeof o){if(!t.startsWith(o))return null;t=t.substr(o.length)||"/"}else if(o instanceof RegExp){const n=t.match(o);if(!n||!n[0])return null;t=t.substr(n[0].length)||"/"}const n=this._pattern.exec(t);if(null===n)return null;if(!1===this._keys)return n;const e={};let i=0;for(;i<this._keys.length;){try{e[this._keys[i]]=decodeURIComponent(n[i+1]||"")||null}catch(t){e[this._keys[i]]=null}i++}return e}async checkConditions(t){for(let n=0;n<this.conditions.length;n++)if(!await this.conditions[n](t))return!1;return!0}}const a=[];i instanceof Map?i.forEach((t,n)=>{a.push(new r(n,t))}):Object.keys(i).forEach(t=>{a.push(new r(t,i[t]))});let c=null,l=null,u={};const d=E();async function f(t,n){await N(),d(t,n)}let p=null;var m;s&&(window.addEventListener("popstate",t=>{p=t.state&&t.state.scrollY?t.state:null}),m=()=>{p?window.scrollTo(p.scrollX,p.scrollY):window.scrollTo(0,0)},x().$$.after_update.push(m));let h=null,g=null;return Rn.subscribe(async t=>{h=t;let n=0;for(;n<a.length;){const i=a[n].match(t.location);if(!i){n++;continue}const o={route:a[n].path,location:t.location,querystring:t.querystring,userData:a[n].userData};if(!await a[n].checkConditions(o))return e(0,c=null),g=null,void f("conditionsFailed",o);f("routeLoading",Object.assign({},o));const s=a[n].component;if(g!=s){s.loading?(e(0,c=s.loading),g=s,e(1,l=s.loadingParams),e(2,u={}),f("routeLoaded",Object.assign({},o,{component:c,name:c.name}))):(e(0,c=null),g=null);const n=await s();if(t!=h)return;e(0,c=n&&n.default||n),g=s}return i&&"object"==typeof i&&Object.keys(i).length?e(1,l=i):e(1,l=null),e(2,u=a[n].props),void f("routeLoaded",Object.assign({},o,{component:c,name:c.name}))}e(0,c=null),g=null}),t.$$set=t=>{"routes"in t&&e(3,i=t.routes),"prefix"in t&&e(4,o=t.prefix),"restoreScrollState"in t&&e(5,s=t.restoreScrollState)},t.$$.update=()=>{32&t.$$.dirty&&(history.scrollRestoration=s?"manual":"auto")},[c,l,u,i,o,s,function(n){k(t,n)},function(n){k(t,n)}]}sn(Rn,t=>t.querystring);class Gn extends tt{constructor(t){super(),Z(this,t,Un,qn,r,{routes:3,prefix:4,restoreScrollState:5})}}function Jn(n){let e,i,o;return{c(){e=m("div"),i=m("span"),o=h(n[0]),y(i,"class","tag"),y(i,"data-test-id","current-path"),y(e,"class","control path-control")},m(t,n){f(t,e,n),d(e,i),d(i,o)},p(t,[n]){1&n&&v(o,t[0])},i:t,o:t,d(t){t&&p(e)}}}function Vn(t,n,e){let i;return c(t,Fn,t=>e(0,i=t)),[i]}class zn extends tt{constructor(t){super(),Z(this,t,Vn,Jn,r,{})}}function Wn(n){let e,i,o,s,r,a,c,l,h,$,w,v;return s=new zn({}),{c(){e=m("div"),i=m("h1"),i.textContent="Home",o=g(),z(s.$$.fragment),r=g(),a=m("p"),a.innerHTML="This demo shows\n    <code>UseDialog</code>\n    that allows for a declarative way of controlling dialogs. The Profile dialog\n    responds to the route, and is automatically hidden when using the browser&#39;s\n    back button.",c=g(),l=m("div"),h=m("a"),h.textContent="Go to Profile",y(i,"class","title"),y(a,"class","intro"),y(h,"class","button is-link"),y(h,"href","/profile"),y(h,"data-test-id","btn-profile"),y(l,"class","buttons"),y(e,"data-test-id","home-page")},m(t,n){f(t,e,n),d(e,i),d(e,o),W(s,e,null),d(e,r),d(e,a),d(e,c),d(e,l),d(l,h),$=!0,w||(v=u(Xn.call(null,h)),w=!0)},p:t,i(t){$||(B(s.$$.fragment,t),$=!0)},o(t){U(s.$$.fragment,t),$=!1},d(t){t&&p(e),Q(s),w=!1,v()}}}function Qn(n){let e,i,r,a,c,l,$,O,S,x,_,E,k,T,P,C,j,A,I,D,N,H,L,q,M,R;return{c(){e=m("div"),i=m("div"),r=g(),a=m("form"),c=m("header"),l=m("p"),$=h(n[0]),O=g(),S=m("button"),x=g(),_=m("section"),E=m("div"),k=m("div"),T=m("input"),P=g(),C=m("footer"),j=m("div"),A=m("button"),A.textContent="Save changes",I=g(),D=m("a"),D.textContent="Go to Home",N=g(),H=m("button"),H.textContent="Dynamic title count",L=g(),q=m("button"),q.textContent="Cancel",y(i,"class","modal-background"),y(l,"class","modal-card-title"),y(l,"data-test-id","title"),y(S,"class","delete"),y(S,"data-test-id","btn-close"),y(c,"class","modal-card-head"),y(T,"class","input"),y(T,"type","text"),y(T,"data-test-id","input-email"),y(k,"class","control"),y(E,"class","field"),y(_,"class","modal-card-body"),y(A,"type","submit"),y(A,"class","button is-link"),y(A,"data-test-id","btn-save"),y(D,"class","button is-link is-light is-outlined"),y(D,"href","/"),y(D,"data-test-id","btn-home"),y(H,"type","button"),y(H,"class","button is-link is-light is-outlined"),y(H,"data-test-id","btn-add-count"),y(q,"type","button"),y(q,"class","button is-danger is-light is-outlined"),y(q,"data-test-id","btn-cancel"),y(j,"class","footer-buttons"),y(C,"class","modal-card-foot"),y(a,"class","modal-card"),y(e,"class","modal is-active"),y(e,"data-test-id","edit-profile-dialog")},m(t,o){f(t,e,o),d(e,i),d(e,r),d(e,a),d(a,c),d(c,l),d(l,$),d(c,O),d(c,S),d(a,x),d(a,_),d(_,E),d(E,k),d(k,T),b(T,n[4]),d(a,P),d(a,C),d(C,j),d(j,A),d(j,I),d(j,D),d(j,N),d(j,H),d(j,L),d(j,q),M||(R=[w(S,"click",(function(){s(n[2])&&n[2].apply(this,arguments)})),w(T,"input",n[6]),w(A,"click",n[7]),u(Xn.call(null,D)),w(H,"click",(function(){s(n[3])&&n[3].apply(this,arguments)})),w(q,"click",(function(){s(n[2])&&n[2].apply(this,arguments)})),w(a,"submit",n[8])],M=!0)},p(t,[e]){n=t,1&e&&v($,n[0]),16&e&&T.value!==n[4]&&b(T,n[4])},i:t,o:t,d(t){t&&p(e),M=!1,o(R)}}}function Zn(t,n,e){let{title:i}=n,{email:o}=n,{onSave:s}=n,{onCancel:r}=n,{increment:a}=n,c=o;return t.$$set=t=>{"title"in t&&e(0,i=t.title),"email"in t&&e(5,o=t.email),"onSave"in t&&e(1,s=t.onSave),"onCancel"in t&&e(2,r=t.onCancel),"increment"in t&&e(3,a=t.increment)},[i,s,r,a,c,o,function(){c=this.value,e(4,c)},t=>{t.preventDefault(),s(c)},t=>{t.preventDefault(),s(c)}]}class te extends tt{constructor(t){super(),Z(this,t,Zn,Qn,r,{title:0,email:5,onSave:1,onCancel:2,increment:3})}}const ne=on("allan@company.com"),ee=on(0),ie=()=>ee.update(t=>t+1);function oe(n){let e,i;return{c(){e=m("div"),i=h(n[0]),y(e,"class","notification-content"),y(e,"data-test-id","notification")},m(t,n){f(t,e,n),d(e,i)},p(t,[n]){1&n&&v(i,t[0])},i:t,o:t,d(t){t&&p(e)}}}function se(t,n,e){let{content:i}=n;return t.$$set=t=>{"content"in t&&e(0,i=t.content)},[i]}class re extends tt{constructor(t){super(),Z(this,t,se,oe,r,{content:0})}}function ae(t){let n,e,i,s,r,a,c,l,$,w,b,O,S,x,_,E,k,T,P,C,j;return s=new zn({}),T=new Nn({props:{props:t[3],isShow:t[2],deps:[t[0]]}}),{c(){n=m("div"),e=m("h1"),e.textContent="Profile",i=g(),z(s.$$.fragment),r=g(),a=m("div"),c=m("div"),c.innerHTML="<strong>Email</strong>",l=g(),$=m("div"),w=h(t[1]),b=g(),O=m("a"),S=h("Edit"),x=g(),_=m("div"),E=m("a"),E.textContent="Go to Home",k=g(),z(T.$$.fragment),y(e,"class","title"),y($,"data-test-id","current-email"),y(O,"class","button is-link"),y(O,"href",ce),y(O,"data-test-id","btn-edit-profile"),y(a,"class","profile-tile"),y(E,"class","button is-link is-light is-outlined"),y(E,"href","/"),y(E,"data-test-id","btn-home"),y(_,"class","buttons"),y(n,"data-test-id","profile-page")},m(t,o){f(t,n,o),d(n,e),d(n,i),W(s,n,null),d(n,r),d(n,a),d(a,c),d(a,l),d(a,$),d($,w),d(a,b),d(a,O),d(O,S),d(n,x),d(n,_),d(_,E),d(n,k),W(T,n,null),P=!0,C||(j=[u(Xn.call(null,O)),u(Xn.call(null,E))],C=!0)},p(t,[n]){(!P||2&n)&&v(w,t[1]);const e={};8&n&&(e.props=t[3]),4&n&&(e.isShow=t[2]),1&n&&(e.deps=[t[0]]),T.$set(e)},i(t){P||(B(s.$$.fragment,t),B(T.$$.fragment,t),P=!0)},o(t){U(s.$$.fragment,t),U(T.$$.fragment,t),P=!1},d(t){t&&p(n),Q(s),Q(T),C=!1,o(j)}}}const ce="/profile/edit",le="/profile";function ue(t,n,e){let i,o,s,r,a;return c(t,Fn,t=>e(4,s=t)),c(t,ee,t=>e(0,r=t)),c(t,ne,t=>e(1,a=t)),t.$$.update=()=>{16&t.$$.dirty&&e(2,i=s===ce),3&t.$$.dirty&&e(3,o={dialogic:{component:te,className:"dialog"},title:"Update your e-mail "+r,email:a,onSave:t=>{t!==a&&(ne.set(t),dn.show({dialogic:{component:re,className:"demo-notification",styles:t=>{const n=t.getBoundingClientRect().height;return{default:{transition:"all 350ms ease-in-out"},showStart:{transform:`translate3d(0, ${n}px, 0)`},showEnd:{transform:"translate3d(0, 0px,  0)",transitionDelay:"500ms"},hideEnd:{transitionDuration:"450ms",transform:`translate3d(0, ${n}px, 0)`}}}},content:"E-mail address updated"})),Kn(le)},onCancel:()=>{Kn(le)},increment:ie})},[r,a,i,o,s]}var de={"/":class extends tt{constructor(t){super(),Z(this,t,null,Wn,r,{})}},"/profile/:edit?":class extends tt{constructor(t){super(),Z(this,t,ue,ae,r,{})}}};function fe(n){let e,i,o,s,r,a,c;return i=new Gn({props:{routes:de}}),s=new En({}),a=new Pn({}),{c(){e=m("div"),z(i.$$.fragment),o=g(),z(s.$$.fragment),r=g(),z(a.$$.fragment),y(e,"class","app")},m(t,n){f(t,e,n),W(i,e,null),d(e,o),W(s,e,null),d(e,r),W(a,e,null),c=!0},p:t,i(t){c||(B(i.$$.fragment,t),B(s.$$.fragment,t),B(a.$$.fragment,t),c=!0)},o(t){U(i.$$.fragment,t),U(s.$$.fragment,t),U(a.$$.fragment,t),c=!1},d(t){t&&p(e),Q(i),Q(s),Q(a)}}}return new class extends tt{constructor(t){super(),Z(this,t,null,fe,r,{})}}({target:document.body})}));
//# sourceMappingURL=demo-dialogic-svelte-router.js.map
