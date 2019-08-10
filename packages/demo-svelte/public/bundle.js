var app=function(){"use strict";function n(){}function t(n,t){for(const e in t)n[e]=t[e];return n}function e(n){return n()}function i(){return Object.create(null)}function o(n){n.forEach(e)}function s(n){return"function"==typeof n}function r(n,t){return n!=n?t==t:n!==t||n&&"object"==typeof n||"function"==typeof n}function a(n,t,e){n.$$.on_destroy.push(function(n,t){const e=n.subscribe(t);return e.unsubscribe?()=>e.unsubscribe():e}(t,e))}function c(n){const t={};for(const e in n)"$"!==e[0]&&(t[e]=n[e]);return t}function u(n,t){n.appendChild(t)}function l(n,t,e){n.insertBefore(t,e||null)}function d(n){n.parentNode.removeChild(n)}function p(n){return document.createElement(n)}function f(n){return document.createTextNode(n)}function m(){return f(" ")}function h(){return f("")}function g(n,t,e,i){return n.addEventListener(t,e,i),()=>n.removeEventListener(t,e,i)}function $(n,t,e){null==e?n.removeAttribute(t):n.setAttribute(t,e)}function w(n,t){for(const e in t)"style"===e?n.style.cssText=t[e]:e in n?n[e]=t[e]:$(n,e,t[e])}function _(n,t){t=""+t,n.data!==t&&(n.data=t)}let O;function y(n){O=n}function v(){if(!O)throw new Error("Function called outside component initialization");return O}function k(n){v().$$.on_mount.push(n)}function x(n){v().$$.on_destroy.push(n)}function b(){const n=O;return(t,e)=>{const i=n.$$.callbacks[t];if(i){const o=function(n,t){const e=document.createEvent("CustomEvent");return e.initCustomEvent(n,!1,!1,t),e}(t,e);i.slice().forEach(t=>{t.call(n,o)})}}}const C=[],D=[],N=[],S=[],P=Promise.resolve();let I=!1;function E(n){N.push(n)}function T(){const n=new Set;do{for(;C.length;){const n=C.shift();y(n),A(n.$$)}for(;D.length;)D.pop()();for(let t=0;t<N.length;t+=1){const e=N[t];n.has(e)||(e(),n.add(e))}N.length=0}while(C.length);for(;S.length;)S.pop()();I=!1}function A(n){n.fragment&&(n.update(n.dirty),o(n.before_update),n.fragment.p(n.dirty,n.ctx),n.dirty=null,n.after_update.forEach(E))}const M=new Set;let R;function F(){R={r:0,c:[],p:R}}function H(){R.r||o(R.c),R=R.p}function j(n,t){n&&n.i&&(M.delete(n),n.i(t))}function q(n,t,e,i){if(n&&n.o){if(M.has(n))return;M.add(n),R.c.push(()=>{M.delete(n),i&&(e&&n.d(1),i())}),n.o(t)}}function L(n,t){q(n,1,1,()=>{t.delete(n.key)})}function Q(n,t){const e={},i={},o={$$scope:1};let s=n.length;for(;s--;){const r=n[s],a=t[s];if(a){for(const n in r)n in a||(i[n]=1);for(const n in a)o[n]||(e[n]=a[n],o[n]=1);n[s]=a}else for(const n in r)o[n]=1}for(const n in i)n in e||(e[n]=void 0);return e}function K(n,t,i){const{fragment:r,on_mount:a,on_destroy:c,after_update:u}=n.$$;r.m(t,i),E(()=>{const t=a.map(e).filter(s);c?c.push(...t):o(t),n.$$.on_mount=[]}),u.forEach(E)}function V(n,t){n.$$.fragment&&(o(n.$$.on_destroy),n.$$.fragment.d(t),n.$$.on_destroy=n.$$.fragment=null,n.$$.ctx={})}function B(n,t){n.$$.dirty||(C.push(n),I||(I=!0,P.then(T)),n.$$.dirty=i()),n.$$.dirty[t]=!0}function J(t,e,s,r,a,c){const u=O;y(t);const l=e.props||{},d=t.$$={fragment:null,ctx:null,props:c,update:n,not_equal:a,bound:i(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(u?u.$$.context:[]),callbacks:i(),dirty:null};let p=!1;d.ctx=s?s(t,l,(n,e)=>{d.ctx&&a(d.ctx[n],d.ctx[n]=e)&&(d.bound[n]&&d.bound[n](e),p&&B(t,n))}):l,d.update(),p=!0,o(d.before_update),d.fragment=r(d.ctx),e.target&&(e.hydrate?d.fragment.l(function(n){return Array.from(n.childNodes)}(e.target)):d.fragment.c(),e.intro&&j(t.$$.fragment),K(t,e.target,e.anchor),T()),y(u)}class W{$destroy(){V(this,1),this.$destroy=n}$on(n,t){const e=this.$$.callbacks[n]||(this.$$.callbacks[n]=[]);return e.push(t),()=>{const n=e.indexOf(t);-1!==n&&e.splice(n,1)}}$set(){}}const z="undefined"!=typeof document,G="show",X="hide",U={className:!0,component:!0,didHide:!0,didShow:!0,hideDelay:!0,hideDuration:!0,hideTimingFunction:!0,showClassName:!0,showDelay:!0,showDuration:!0,showTimingFunction:!0,timeout:!0,transitionClassName:!0,transitions:!0},Y=(n,t)=>{const e=n.domElements?n.domElements.domElement:null;if(!e)throw new Error("No DOM element");return new Promise(i=>{const o=e.style,s=z?window.getComputedStyle(e):null,r=t===G,a=nn(n,r),c=void 0!==a.duration?1e3*a.duration:s?Z(s.transitionDuration):0,u=void 0!==a.delay?1e3*a.delay:s?Z(s.transitionDelay):0,l=c+u;a.before&&"function"==typeof a.before&&(o.transitionDuration="0ms",o.transitionDelay="0ms",a.before()),(()=>{const t=a.timingFunction||(s?s.transitionTimingFunction:void 0);if(t&&(o.transitionTimingFunction=t),o.transitionDuration=c+"ms",o.transitionDelay=u+"ms",n.transitionClassName&&e.classList.add(n.transitionClassName),n.showClassName){(n.showClassElement||e).classList[r?"add":"remove"](n.showClassName)}a.transition&&a.transition()})(),setTimeout(()=>{a.after&&"function"==typeof a.after&&a.after(),n.transitionClassName&&e.classList.remove(n.transitionClassName),i()},l)})},Z=n=>{const t=parseFloat(n)*(-1===n.indexOf("ms")?1e3:1);return isNaN(t)?0:t},nn=(n,t)=>{const[e,i,o,s]=t?[n.showDuration,n.showDelay,n.showTimingFunction,n.transitions?n.transitions.show:void 0]:[n.hideDuration,n.hideDelay,n.hideTimingFunction,n.transitions?n.transitions.hide:void 0];return{duration:e,delay:i,timingFunction:o,...s?s(n.domElements):void 0}};var tn=function(n,t){return n(t={exports:{}},t.exports),t.exports}(function(n){!function(){e.SKIP={},e.lift=function(){var n=arguments[0];return o(Array.prototype.slice.call(arguments,1)).map(function(t){return n.apply(void 0,t)})},e.scan=function(n,t,i){var o=i.map(function(i){var o=n(t,i);return o!==e.SKIP&&(t=o),o});return o(t),o},e.merge=o,e.combine=i,e.scanMerge=function(n,t){var e=n.map(function(n){return n[0]}),o=i(function(){var i=arguments[arguments.length-1];return e.forEach(function(e,o){i.indexOf(e)>-1&&(t=n[o][1](t,e()))}),t},e);return o(t),o},e["fantasy-land/of"]=e;var t=!1;function e(n){var t,o=[],r=[];function a(t){return arguments.length&&t!==e.SKIP&&(n=t,s(a)&&(a._changing(),a._state="active",o.forEach(function(t,e){t(r[e](n))}))),n}return a.constructor=e,a._state=arguments.length&&n!==e.SKIP?"active":"pending",a._parents=[],a._changing=function(){s(a)&&(a._state="changing"),o.forEach(function(n){n._changing()})},a._map=function(t,i){var s=i?e():e(t(n));return s._parents.push(a),o.push(s),r.push(t),s},a.map=function(n){return a._map(n,"active"!==a._state)},a.toJSON=function(){return null!=n&&"function"==typeof n.toJSON?n.toJSON():n},a["fantasy-land/map"]=a.map,a["fantasy-land/ap"]=function(n){return i(function(n,t){return n()(t())},[n,a])},a._unregisterChild=function(n){var t=o.indexOf(n);-1!==t&&(o.splice(t,1),r.splice(t,1))},Object.defineProperty(a,"end",{get:function(){return t||((t=e()).map(function(n){return!0===n&&(a._parents.forEach(function(n){n._unregisterChild(a)}),a._state="ended",a._parents.length=o.length=r.length=0),n}),t)}}),a}function i(n,t){var i=t.every(function(n){if(n.constructor!==e)throw new Error("Ensure that each item passed to stream.combine/stream.merge/lift is a stream");return"active"===n._state}),o=i?e(n.apply(null,t.concat([t]))):e(),s=[],r=t.map(function(e){return e._map(function(r){return s.push(e),(i||t.every(function(n){return"pending"!==n._state}))&&(i=!0,o(n.apply(null,t.concat([s]))),s=[]),r},!0)}),a=o.end.map(function(n){!0===n&&(r.forEach(function(n){n.end(!0)}),a.end(!0))});return o}function o(n){return i(function(){return n.map(function(n){return n()})},n)}function s(n){return"pending"===n._state||"active"===n._state||"changing"===n._state}Object.defineProperty(e,"HALT",{get:function(){return t||console.log("HALT is deprecated and has been renamed to SKIP"),t=!0,e.SKIP}}),n.exports=e}()});const en=(n,t)=>{const e=((n,t)=>t.find(t=>t.id===n))(n,t);return t.indexOf(e)},on=(n,t)=>[t,n.id,n.spawn].filter(Boolean).join("-"),sn={initialState:{store:{}},actions:n=>({add:(t,e)=>{n(i=>{const o=i.store[t]||[];return i.store[t]=[...o,e],e.timer&&e.timer.states.map(()=>sn.actions(n).refresh()),i})},remove:(t,e)=>{n(n=>{const i=n.store[t]||[],o=((n,t)=>{const e=en(n,t);return-1!==e&&t.splice(e,1),t})(e,i);return n.store[t]=o,n})},replace:(t,e,i)=>{n(n=>{const o=n.store[t]||[];if(o){const s=en(e,o);-1!==s&&(o[s]=i,n.store[t]=[...o])}return n})},removeAll:t=>{n(n=>(n.store[t]=[],n))},store:(t,e)=>{n(n=>(n.store[t]=[...e],n))},refresh:()=>{n(n=>({...n}))}}),selectors:n=>{const t={getStore:()=>{return n().store},find:(t,e)=>{const i=n().store[t]||[],o=on(e,t),s=i.find(n=>n.id===o);return s?{just:s}:{nothing:void 0}},getAll:(t,e)=>{const i=n().store[t]||[],o=void 0!==e?e.spawn:void 0,s=void 0!==e?e.id:void 0,r=void 0!==o?i.filter(n=>n.spawnOptions.spawn===o):i;return void 0!==s?r.filter(n=>n.spawnOptions.id===s):r},getCount:(n,e)=>t.getAll(n,e).length};return t}},rn=tn(),an=tn.scan((n,t)=>t(n),{...sn.initialState},rn),cn={...sn.actions(rn)},un={...sn.selectors(an)},ln={timerId:void 0,isPaused:void 0,remaining:void 0,startTime:void 0,callback:()=>{},timeoutFn:()=>{},promise:void 0,onDone:()=>{},onAbort:()=>{}},dn=(n,t,e,i)=>{const o=()=>{t(),n.onDone(),i()};return{timeoutFn:o,promise:new Promise((t,e)=>{n.onDone=()=>t(),n.onAbort=()=>e()}),...n.isPaused?{}:{startTime:(new Date).getTime(),timerId:window.setTimeout(o,e),remaining:e}}},pn=n=>(window.clearTimeout(n.timerId),{timerId:ln.timerId}),fn=n=>({...pn(n)}),mn=n=>({...pn(n),isPaused:!0,remaining:gn(n)}),hn=(n,t)=>{window.clearTimeout(n.timerId);const e=t?Math.max(n.remaining||0,t):n.remaining;return{startTime:(new Date).getTime(),isPaused:!1,remaining:e,timerId:window.setTimeout(n.timeoutFn,e)}},gn=n=>void 0===n.remaining?void 0:n.remaining-((new Date).getTime()-(n.startTime||0)),$n=()=>{const n={initialState:ln,actions:t=>({start:(e,i)=>{t(o=>({...o,...pn(o),...dn(o,e,i,()=>n.actions(t).done()),...o.isPaused&&mn(o)}))},stop:()=>{t(n=>({...n,...fn(n),...ln}))},pause:()=>{t(n=>({...n,...mn(n)}))},resume:n=>{t(t=>({...t,...t.isPaused&&hn(t,n)}))},abort:()=>{t(n=>(n.onAbort(),{...n,...pn(n)}))},done:()=>{t(n=>ln)},refresh:()=>{t(n=>({...n}))}}),selectors:n=>({isPaused:()=>{return n().isPaused},getRemaining:()=>{const t=n();return t.isPaused?t.remaining:gn(t)},getResultPromise:()=>{return n().promise}})},t=tn(),e=tn.scan((n,t)=>t(n),{...n.initialState},t);return{states:e,actions:{...n.actions(t)},selectors:{...n.selectors(e)}}};let wn=0;const _n=()=>wn===Number.MAX_SAFE_INTEGER?0:wn++,On="none",yn="hiding",vn=n=>{let t=0;return n.map(n=>({item:n,queueCount:n.spawnOptions.queued?t++:0})).filter(({queueCount:n})=>0===n).map(({item:n})=>n)},kn=(n,t,e)=>{const i=t[n]||[];return((...n)=>t=>n.filter(Boolean).reduce((n,t)=>t(n),t))(vn,(n=>t=>t.filter(t=>t.spawnOptions.spawn===n.spawn))(e))(i)},xn=n=>{return Object.keys(n).reduce((t,e)=>{const i=n[e];return U[e]?t.transitionOptions[e]=i:t.instanceOptions[e]=i,t},{transitionOptions:{},instanceOptions:{}})},bn=n=>t=>e=>(i,o)=>new Promise(s=>{const r={...t,...o},a=on(r,n),{transitionOptions:c,instanceOptions:u}=xn(i),l={...e,...c};l.didShow=n=>(i.didShow&&i.didShow(n),s(n)),l.didHide=n=>(i.didHide&&i.didHide(n),s(n));const d=_n().toString(),p={spawnOptions:r,transitionOptions:l,instanceTransitionOptions:c,instanceOptions:u,id:a,timer:l.timeout?$n():void 0,key:d,transitionState:On},f=un.find(n,r);if(f.just&&!r.queued){const t=f.just,e=t.instanceTransitionOptions,i={...p,instanceTransitionOptions:e};cn.replace(n,t.id,i),l.didShow(r.id)}else cn.add(n,p)}),Cn=n=>t=>e=>(i,o)=>{return Dn(n)(t)(o).just?Sn(n)(t)(o):bn(n)(t)(e)(i,o)},Dn=n=>t=>e=>{const i={...t,...e};return un.find(n,i)},Nn=n=>t=>e=>(i,o)=>{const s=Dn(t)(e)(i);return s.just?n(t,s.just,o):Promise.resolve()},Sn=Nn((n,t)=>t.transitionState!==yn?(t.transitionState=yn,Qn(n,t)):Promise.resolve()),Pn=Nn((n,t)=>(t&&t.timer&&t.timer.actions.pause(),Promise.resolve())),In=Nn((n,t,e={})=>(t&&t.timer&&t.timer.actions.resume(e.minimumDuration),Promise.resolve())),En=n=>t=>e=>i=>{const o=Dn(t)(e)(i);return o.just&&o.just&&o.just.timer?o.just.timer.selectors[n]():void 0},Tn=En("isPaused"),An=En("getRemaining"),Mn=n=>t=>e=>{return!!Dn(n)(t)(e).just},Rn=n=>()=>(un.getAll(n).forEach(n=>n.timer&&n.timer.actions.abort()),cn.removeAll(n),Promise.resolve()),Fn=(n,t)=>{const{transitionOptions:e}=xn(t);return{...n,transitionOptions:{...n.transitionOptions,...e}}},Hn=n=>t=>(e,i)=>{const o={...t,...i},s=un.getAll(n),r=s.filter(n=>!o.queued&&!n.spawnOptions.queued),a=s.filter(n=>o.queued||n.spawnOptions.queued);if(r.forEach(t=>Qn(n,Fn(t,e))),a.length>0){const[t]=a;cn.store(n,[t]),Qn(n,Fn(t,e)).then(()=>cn.removeAll(n))}},jn=n=>t=>un.getCount(n,t),qn=(n,t)=>{try{return Y({...n.instanceTransitionOptions,...n.transitionOptions},t)}catch(n){throw new Error(`Transition error: ${n}`)}},Ln=async function(n,t){return await qn(t,G),t.transitionOptions.didShow&&await t.transitionOptions.didShow(t.spawnOptions.id),t.transitionOptions.timeout&&t.timer&&await async function(n,t,e,i){return e.actions.start(()=>Qn(n,t),i),En("getResultPromise")}(n,t,t.timer,t.transitionOptions.timeout),t.spawnOptions.id},Qn=async function(n,t){return t.timer&&t.timer.actions.stop(),await qn(t,X),t.transitionOptions.didHide&&await t.transitionOptions.didHide(t.spawnOptions.id),cn.remove(n,t.id),t.spawnOptions.id},Kn=({ns:n,queued:t,timeout:e})=>{const i=`default_${n}`,o=`default_${n}`,s={id:i,spawn:o,queued:t},r={timeout:e};return{ns:n,defaultId:i,defaultSpawn:o,defaultSpawnOptions:s,show:bn(n)(s)(r),toggle:Cn(n)(s)(r),hide:Sn(n)(s),pause:Pn(n)(s),resume:In(n)(s),hideAll:Hn(n)(s),resetAll:Rn(n),isDisplayed:Mn(n)(s),getCount:jn(n),isPaused:Tn(n)(s),getRemaining:An(n)(s)}},Vn=Kn({ns:"dialog"}),Bn=Kn({ns:"notification",queued:!0,timeout:3e3}),Jn=[];function Wn(t,e=n){let i;const o=[];function s(n){if(r(t,n)&&(t=n,i)){const n=!Jn.length;for(let n=0;n<o.length;n+=1){const e=o[n];e[1](),Jn.push(e,t)}if(n){for(let n=0;n<Jn.length;n+=2)Jn[n][0](Jn[n+1]);Jn.length=0}}}return{set:s,update:function(n){s(n(t))},subscribe:function(r,a=n){const c=[r,a];return o.push(c),1===o.length&&(i=e(s)||n),r(t),()=>{const n=o.indexOf(c);-1!==n&&o.splice(n,1),0===o.length&&(i(),i=null)}}}}function zn(t,e,i){const r=!Array.isArray(t),a=r?[t]:t,c=e.length<2;return{subscribe:Wn(i,t=>{let i=!1;const u=[];let l=0,d=n;const p=()=>{if(l)return;d();const i=e(r?u[0]:u,t);c?t(i):d=s(i)?i:n},f=a.map((n,t)=>n.subscribe(n=>{u[t]=n,l&=~(1<<t),i&&p()},()=>{l|=1<<t}));return i=!0,p(),function(){o(f),d()}}).subscribe}}const Gn={...Wn(an),...un};an.map(n=>Gn.set({...n,...un}));const Xn=n=>t=>zn(Gn,()=>un.getCount(n,t)),Un=n=>t=>e=>zn(Gn,()=>En("isPaused")(n)(t)(e)),Yn=n=>t=>e=>zn(Gn,()=>Mn(n)(t)(e)),Zn={...Vn,getCount:n=>Xn(Vn.ns)(n),isPaused:n=>Un(Vn.ns)(Vn.defaultSpawnOptions)(n),isDisplayed:n=>Yn(Vn.ns)(Vn.defaultSpawnOptions)(n)},nt={...Bn,getCount:n=>Xn(Bn.ns)(n),isPaused:n=>Un(Bn.ns)(Bn.defaultSpawnOptions)(n),isDisplayed:n=>Yn(Bn.ns)(Bn.defaultSpawnOptions)(n)},tt=n=>(t,e)=>{const i=un.find(n,t.detail.spawnOptions);i.just&&(i.just.instanceTransitionOptions=t.detail.transitionOptions);const o=un.find(n,t.detail.spawnOptions);o.just&&e(n,o.just)},et=n=>t=>tt(n)(t,Ln),it=n=>t=>tt(n)(t,Ln),ot=n=>t=>tt(n)(t,Qn);function st(n){var e,i,o=[{show:n.show},{hide:n.hide},n.instanceOptions],s=n.transitionOptions.component;function r(n){let e={};for(var i=0;i<o.length;i+=1)e=t(e,o[i]);return{props:e}}if(s)var a=new s(r());for(var c=[{class:n.R_classNames},n.elementProps],u={},f=0;f<c.length;f+=1)u=t(u,c[f]);return{c(){e=p("div"),a&&a.$$.fragment.c(),w(e,u)},m(t,o){l(t,e,o),a&&K(a,e,null),n.div_binding(e),i=!0},p(n,t){var i=n.show||n.hide||n.instanceOptions?Q(o,[n.show&&{show:t.show},n.hide&&{hide:t.hide},n.instanceOptions&&t.instanceOptions]):{};if(s!==(s=t.transitionOptions.component)){if(a){F();const n=a;q(n.$$.fragment,1,0,()=>{V(n,1)}),H()}s?((a=new s(r())).$$.fragment.c(),j(a.$$.fragment,1),K(a,e,null)):a=null}else s&&a.$set(i);w(e,Q(c,[n.R_classNames&&{class:t.R_classNames},n.elementProps&&t.elementProps]))},i(n){i||(a&&j(a.$$.fragment,n),i=!0)},o(n){a&&q(a.$$.fragment,n),i=!1},d(t){t&&d(e),a&&V(a),n.div_binding(null)}}}function rt(n,t,e){const i=b();let o,{spawnOptions:s,instanceOptions:r,transitionOptions:a}=t;const c=n=>i(n,{spawnOptions:s,transitionOptions:{className:a.className,showClassName:a.showClassName,domElements:{domElement:o}}});let u,l;return k(()=>{c("mount")}),n.$set=n=>{"spawnOptions"in n&&e("spawnOptions",s=n.spawnOptions),"instanceOptions"in n&&e("instanceOptions",r=n.instanceOptions),"transitionOptions"in n&&e("transitionOptions",a=n.transitionOptions)},n.$$.update=(n={transitionOptions:1,instanceOptions:1,R_classNames:1})=>{(n.transitionOptions||n.instanceOptions)&&e("R_classNames",u=[,a.className,r.className].join(" ")),n.R_classNames&&e("elementProps",l={class:u})},{domElement:o,spawnOptions:s,instanceOptions:r,transitionOptions:a,show:()=>{c("show")},hide:()=>{c("hide")},R_classNames:u,elementProps:l,div_binding:function(n){D[n?"unshift":"push"](()=>{e("domElement",o=n)})}}}class at extends W{constructor(n){super(),J(this,n,rt,st,r,["spawnOptions","instanceOptions","transitionOptions"])}}function ct(n,t,e){const i=Object.create(n);return i.spawnOptions=t[e].spawnOptions,i.transitionOptions=t[e].transitionOptions,i.instanceOptions=t[e].instanceOptions,i.key=t[e].key,i.index=e,i}function ut(n,t){var e,i,o=new at({props:{spawnOptions:t.spawnOptions,transitionOptions:t.transitionOptions,instanceOptions:t.instanceOptions}});return o.$on("mount",t.nsOnInstanceMounted),o.$on("show",t.nsOnShowInstance),o.$on("hide",t.nsOnHideInstance),{key:n,first:null,c(){e=h(),o.$$.fragment.c(),this.first=e},m(n,t){l(n,e,t),K(o,n,t),i=!0},p(n,t){var e={};(n.filterCandidates||n.ns||n.$appState||n.spawnOptions)&&(e.spawnOptions=t.spawnOptions),(n.filterCandidates||n.ns||n.$appState||n.spawnOptions)&&(e.transitionOptions=t.transitionOptions),(n.filterCandidates||n.ns||n.$appState||n.spawnOptions)&&(e.instanceOptions=t.instanceOptions),o.$set(e)},i(n){i||(j(o.$$.fragment,n),i=!0)},o(n){q(o.$$.fragment,n),i=!1},d(n){n&&d(e),V(o,n)}}}function lt(n){var t,e,i=[],o=new Map,s=kn(n.ns,n.$appState.store,n.spawnOptions);const r=n=>n.key;for(var a=0;a<s.length;a+=1){let t=ct(n,s,a),e=r(t);o.set(e,i[a]=ut(e,t))}return{c(){for(a=0;a<i.length;a+=1)i[a].c();t=h()},m(n,o){for(a=0;a<i.length;a+=1)i[a].m(n,o);l(n,t,o),e=!0},p(n,e){const s=kn(e.ns,e.$appState.store,e.spawnOptions);F(),i=function(n,t,e,i,o,s,r,a,c,u,l,d){let p=n.length,f=s.length,m=p;const h={};for(;m--;)h[n[m].key]=m;const g=[],$=new Map,w=new Map;for(m=f;m--;){const n=d(o,s,m),a=e(n);let c=r.get(a);c?i&&c.p(t,n):(c=u(a,n)).c(),$.set(a,g[m]=c),a in h&&w.set(a,Math.abs(m-h[a]))}const _=new Set,O=new Set;function y(n){j(n,1),n.m(a,l),r.set(n.key,n),l=n.first,f--}for(;p&&f;){const t=g[f-1],e=n[p-1],i=t.key,o=e.key;t===e?(l=t.first,p--,f--):$.has(o)?!r.has(i)||_.has(i)?y(t):O.has(o)?p--:w.get(i)>w.get(o)?(O.add(i),y(t)):(_.add(o),p--):(c(e,r),p--)}for(;p--;){const t=n[p];$.has(t.key)||c(t,r)}for(;f;)y(g[f-1]);return g}(i,n,r,1,e,s,o,t.parentNode,L,ut,t,ct),H()},i(n){if(!e){for(var t=0;t<s.length;t+=1)j(i[t]);e=!0}},o(n){for(a=0;a<i.length;a+=1)q(i[a]);e=!1},d(n){for(a=0;a<i.length;a+=1)i[a].d(n);n&&d(t)}}}function dt(n,t,e){let i;a(n,Gn,n=>{e("$appState",i=n)});let{spawnOptions:o,ns:s}=t;const r=et(s),c=it(s),u=ot(s);return n.$set=n=>{"spawnOptions"in n&&e("spawnOptions",o=n.spawnOptions),"ns"in n&&e("ns",s=n.ns)},{spawnOptions:o,ns:s,nsOnInstanceMounted:r,nsOnShowInstance:c,nsOnHideInstance:u,$appState:i}}class pt extends W{constructor(n){super(),J(this,n,dt,lt,r,["spawnOptions","ns"])}}function ft(n){var t,e=new pt({props:{spawnOptions:n.spawnOptions,ns:n.ns}});return{c(){e.$$.fragment.c()},m(n,i){K(e,n,i),t=!0},p(n,t){var i={};n.spawnOptions&&(i.spawnOptions=t.spawnOptions),n.ns&&(i.ns=t.ns),e.$set(i)},i(n){t||(j(e.$$.fragment,n),t=!0)},o(n){q(e.$$.fragment,n),t=!1},d(n){V(e,n)}}}function mt(n,t,e){let{type:i,ns:o=i.ns,spawn:s,id:r,onMount:a}=t;const c={id:r||i.defaultId,spawn:s||i.defaultSpawn};return k(()=>{"function"==typeof a&&a()}),n.$set=n=>{"type"in n&&e("type",i=n.type),"ns"in n&&e("ns",o=n.ns),"spawn"in n&&e("spawn",s=n.spawn),"id"in n&&e("id",r=n.id),"onMount"in n&&e("onMount",a=n.onMount)},{type:i,ns:o,spawn:s,id:r,onMount:a,spawnOptions:c}}class ht extends W{constructor(n){super(),J(this,n,mt,ft,r,["type","ns","spawn","id","onMount"])}}function gt(n){var e,i=[n.$$props,{type:Zn}];let o={};for(var s=0;s<i.length;s+=1)o=t(o,i[s]);var r=new ht({props:o});return{c(){r.$$.fragment.c()},m(n,t){K(r,n,t),e=!0},p(n,t){var e=n.$$props||n.dialog?Q(i,[n.$$props&&t.$$props,n.dialog&&{type:Zn}]):{};r.$set(e)},i(n){e||(j(r.$$.fragment,n),e=!0)},o(n){q(r.$$.fragment,n),e=!1},d(n){V(r,n)}}}function $t(n,e,i){return n.$set=n=>{i("$$props",e=t(t({},e),n))},{$$props:e,$$props:e=c(e)}}class wt extends W{constructor(n){super(),J(this,n,$t,gt,r,[])}}function _t(n){var e,i=[n.$$props,{type:nt}];let o={};for(var s=0;s<i.length;s+=1)o=t(o,i[s]);var r=new ht({props:o});return{c(){r.$$.fragment.c()},m(n,t){K(r,n,t),e=!0},p(n,t){var e=n.$$props||n.notification?Q(i,[n.$$props&&t.$$props,n.notification&&{type:nt}]):{};r.$set(e)},i(n){e||(j(r.$$.fragment,n),e=!0)},o(n){q(r.$$.fragment,n),e=!1},d(n){V(r,n)}}}function Ot(n,e,i){return n.$set=n=>{i("$$props",e=t(t({},e),n))},{$$props:e,$$props:e=c(e)}}class yt extends W{constructor(n){super(),J(this,n,Ot,_t,r,[])}}function vt(t){var e,i,o,s,r,a,c=t.$$props.title;return{c(){e=p("div"),i=p("h2"),o=f(c),s=m(),(r=p("button")).textContent="hide from instance",a=g(r,"click",t.$$props.hide)},m(n,t){l(n,e,t),u(e,i),u(i,o),u(e,s),u(e,r)},p(n,t){n.$$props&&c!==(c=t.$$props.title)&&_(o,c)},i:n,o:n,d(n){n&&d(e),a()}}}function kt(n,e,i){return n.$set=n=>{i("$$props",e=t(t({},e),n))},{$$props:e,$$props:e=c(e)}}class xt extends W{constructor(n){super(),J(this,n,kt,vt,r,[])}}function bt(t){var e,i,o,s,r,a,c,h,$,w,O=t.$$props.title,y=1===t.seconds?"second":"seconds";return{c(){e=p("div"),i=p("h2"),o=f(O),s=f("\n  The page has been open for\n\t"),r=f(t.seconds),a=m(),c=f(y),h=m(),($=p("button")).textContent="hide from instance",w=g($,"click",t.$$props.hide)},m(n,t){l(n,e,t),u(e,i),u(i,o),u(e,s),u(e,r),u(e,a),u(e,c),u(e,h),u(e,$)},p(n,t){n.$$props&&O!==(O=t.$$props.title)&&_(o,O),n.seconds&&_(r,t.seconds),n.seconds&&y!==(y=1===t.seconds?"second":"seconds")&&_(c,y)},i:n,o:n,d(n){n&&d(e),w()}}}function Ct(n,e,i){let o=0;return function(n,t){const e=setInterval(n,t);x(()=>{clearInterval(e)})}(()=>{const n=o+=1;return i("seconds",o),n},1e3),n.$set=n=>{i("$$props",e=t(t({},e),n))},{seconds:o,$$props:e,$$props:e=c(e)}}class Dt extends W{constructor(n){super(),J(this,n,Ct,bt,r,[])}}function Nt(t){var e,i,o;return{c(){e=p("div"),i=f("Remaining: "),o=f(t.displayValue)},m(n,t){l(n,e,t),u(e,i),u(e,o)},p(n,t){n.displayValue&&_(o,t.displayValue)},i:n,o:n,d(n){n&&d(e)}}}function St(n,t,e){let i,{getRemainingFn:o}=t,s=0;const r=()=>{const n=o();e("displayValue",s=void 0===n?void 0:Math.max(n,0)),i=window.requestAnimationFrame(r)};return i=window.requestAnimationFrame(r),x(()=>{window.cancelAnimationFrame(i)}),n.$set=n=>{"getRemainingFn"in n&&e("getRemainingFn",o=n.getRemainingFn)},{getRemainingFn:o,displayValue:s}}class Pt extends W{constructor(n){super(),J(this,n,St,Nt,r,["getRemainingFn"])}}function It(n){var t,e,i,s,r,a,c,h,$,w,O,y,v,k,x,b,C,D,N,S,P,I,E,T,A,M,R,L,Q,B,J,W,z,G,X,U,Y,Z,nn,tn,en,on,sn,rn,an,cn,un,ln,dn,pn,fn,mn,hn,gn,$n,wn,_n,On,yn,vn,kn,xn,bn,Cn,Dn,Nn,Sn,Pn,In,En,Tn,An,Mn,Rn,Fn,Hn,jn,qn,Ln,Qn=n.$timerDialogDisplayed&&Et(n),Kn=new wt({}),Vn=new wt({props:{spawn:"special"}}),Bn=new wt({props:{spawn:"Q"}}),Jn=new wt({props:{spawn:"initial",onMount:n.func_1}});return{c(){(t=p("h2")).textContent="Dialog",e=m(),i=p("p"),s=f("Dialog count = "),r=f(n.$dialogCount),a=m(),c=p("hr"),h=m(),$=p("div"),(w=p("button")).textContent="Default",O=m(),(y=p("button")).textContent="Hide",v=m(),k=p("div"),Qn&&Qn.c(),x=m(),(b=p("button")).textContent="With timer",C=m(),(D=p("button")).textContent="Pause",N=m(),(S=p("button")).textContent="Resume",P=m(),(I=p("button")).textContent="Hide",E=m(),T=p("div"),(A=p("button")).textContent="Show with promises",M=m(),(R=p("button")).textContent="Hide",L=m(),Q=p("div"),(B=p("button")).textContent="Show delay",J=m(),(W=p("button")).textContent="Hide",z=m(),G=p("div"),(X=p("button")).textContent="Show slow fade",U=m(),(Y=p("button")).textContent="Hide",Z=m(),nn=p("div"),(tn=p("button")).textContent="Show transition",en=m(),(on=p("button")).textContent="Hide",sn=m(),rn=p("div"),(an=p("button")).textContent="Show default in spawn",cn=m(),(un=p("button")).textContent="Hide",ln=m(),dn=p("hr"),pn=m(),fn=p("div"),(mn=p("p")).textContent="Dialog:",hn=m(),Kn.$$.fragment.c(),gn=m(),$n=p("div"),(wn=p("p")).textContent="Dialog with spawn:",_n=m(),Vn.$$.fragment.c(),On=m(),yn=p("hr"),vn=f("\nQueued dialog\n"),kn=p("div"),(xn=p("button")).textContent="Queued",bn=m(),(Cn=p("button")).textContent="Hide",Dn=m(),Nn=p("div"),(Sn=p("p")).textContent="Dialog queued:",Pn=m(),Bn.$$.fragment.c(),In=m(),En=p("hr"),Tn=f("\nInitially shown dialog\n"),An=p("div"),(Mn=p("button")).textContent="Initially shown",Rn=m(),(Fn=p("button")).textContent="Hide",Hn=m(),jn=p("div"),Jn.$$.fragment.c(),Ln=[g(w,"click",n.click_handler_5),g(y,"click",n.click_handler_6),g(b,"click",n.click_handler_7),g(D,"click",n.click_handler_8),g(S,"click",n.click_handler_9),g(I,"click",n.click_handler_10),g(A,"click",n.click_handler_11),g(R,"click",n.click_handler_12),g(B,"click",n.click_handler_13),g(W,"click",n.click_handler_14),g(X,"click",n.click_handler_15),g(Y,"click",n.click_handler_16),g(tn,"click",n.click_handler_17),g(on,"click",n.click_handler_18),g(an,"click",n.click_handler_19),g(un,"click",n.click_handler_20),g(xn,"click",n.click_handler_21),g(Cn,"click",n.click_handler_22),g(Mn,"click",n.click_handler_23),g(Fn,"click",n.click_handler_24)]},m(n,o){l(n,t,o),l(n,e,o),l(n,i,o),u(i,s),u(i,r),l(n,a,o),l(n,c,o),l(n,h,o),l(n,$,o),u($,w),u($,O),u($,y),l(n,v,o),l(n,k,o),Qn&&Qn.m(k,null),u(k,x),u(k,b),u(k,C),u(k,D),u(k,N),u(k,S),u(k,P),u(k,I),l(n,E,o),l(n,T,o),u(T,A),u(T,M),u(T,R),l(n,L,o),l(n,Q,o),u(Q,B),u(Q,J),u(Q,W),l(n,z,o),l(n,G,o),u(G,X),u(G,U),u(G,Y),l(n,Z,o),l(n,nn,o),u(nn,tn),u(nn,en),u(nn,on),l(n,sn,o),l(n,rn,o),u(rn,an),u(rn,cn),u(rn,un),l(n,ln,o),l(n,dn,o),l(n,pn,o),l(n,fn,o),u(fn,mn),u(fn,hn),K(Kn,fn,null),l(n,gn,o),l(n,$n,o),u($n,wn),u($n,_n),K(Vn,$n,null),l(n,On,o),l(n,yn,o),l(n,vn,o),l(n,kn,o),u(kn,xn),u(kn,bn),u(kn,Cn),l(n,Dn,o),l(n,Nn,o),u(Nn,Sn),u(Nn,Pn),K(Bn,Nn,null),l(n,In,o),l(n,En,o),l(n,Tn,o),l(n,An,o),u(An,Mn),u(An,Rn),u(An,Fn),l(n,Hn,o),l(n,jn,o),K(Jn,jn,null),qn=!0},p(n,t){qn&&!n.$dialogCount||_(r,t.$dialogCount),t.$timerDialogDisplayed?Qn?(Qn.p(n,t),j(Qn,1)):((Qn=Et(t)).c(),j(Qn,1),Qn.m(k,x)):Qn&&(F(),q(Qn,1,1,()=>{Qn=null}),H());var e={};n.showInitial&&(e.onMount=t.func_1),Jn.$set(e)},i(n){qn||(j(Qn),j(Kn.$$.fragment,n),j(Vn.$$.fragment,n),j(Bn.$$.fragment,n),j(Jn.$$.fragment,n),qn=!0)},o(n){q(Qn),q(Kn.$$.fragment,n),q(Vn.$$.fragment,n),q(Bn.$$.fragment,n),q(Jn.$$.fragment,n),qn=!1},d(n){n&&(d(t),d(e),d(i),d(a),d(c),d(h),d($),d(v),d(k)),Qn&&Qn.d(),n&&(d(E),d(T),d(L),d(Q),d(z),d(G),d(Z),d(nn),d(sn),d(rn),d(ln),d(dn),d(pn),d(fn)),V(Kn),n&&(d(gn),d($n)),V(Vn),n&&(d(On),d(yn),d(vn),d(kn),d(Dn),d(Nn)),V(Bn),n&&(d(In),d(En),d(Tn),d(An),d(Hn),d(jn)),V(Jn),o(Ln)}}}function Et(n){var t,e=new Pt({props:{getRemainingFn:n.func}});return{c(){e.$$.fragment.c()},m(n,i){K(e,n,i),t=!0},p(n,t){var i={};n.dialog&&(i.getRemainingFn=t.func),e.$set(i)},i(n){t||(j(e.$$.fragment,n),t=!0)},o(n){q(e.$$.fragment,n),t=!1},d(n){V(e,n)}}}function Tt(n){var t,e,i,s,r,a,c,h,$,w,O,y,v,k,x,b,C,D,N,S,P,I,E,T,A,M,R,F=new yt({props:{spawn:"NO"}});return{c(){(t=p("h2")).textContent="Notification",e=m(),i=p("p"),s=f("Notification count: "),r=f(n.$notificationCount),a=m(),c=p("p"),h=f("Notification displayed: "),$=f(n.$notificationDisplayed),w=m(),O=p("p"),y=f("Is paused: "),v=f(n.$notificationItemIsPaused),k=m(),x=p("div"),(b=p("button")).textContent="Queued",C=m(),(D=p("button")).textContent="Hide",N=m(),(S=p("button")).textContent="Pause",P=m(),(I=p("button")).textContent="Resume",E=m(),F.$$.fragment.c(),T=m(),A=p("hr"),R=[g(b,"click",n.click_handler_26),g(D,"click",n.click_handler_27),g(S,"click",n.click_handler_28),g(I,"click",n.click_handler_29)]},m(n,o){l(n,t,o),l(n,e,o),l(n,i,o),u(i,s),u(i,r),l(n,a,o),l(n,c,o),u(c,h),u(c,$),l(n,w,o),l(n,O,o),u(O,y),u(O,v),l(n,k,o),l(n,x,o),u(x,b),u(x,C),u(x,D),u(x,N),u(x,S),u(x,P),u(x,I),l(n,E,o),K(F,n,o),l(n,T,o),l(n,A,o),M=!0},p(n,t){M&&!n.$notificationCount||_(r,t.$notificationCount),M&&!n.$notificationDisplayed||_($,t.$notificationDisplayed),M&&!n.$notificationItemIsPaused||_(v,t.$notificationItemIsPaused)},i(n){M||(j(F.$$.fragment,n),M=!0)},o(n){q(F.$$.fragment,n),M=!1},d(n){n&&(d(t),d(e),d(i),d(a),d(c),d(w),d(O),d(k),d(x),d(E)),V(F,n),n&&(d(T),d(A)),o(R)}}}function At(n){var t,e,i,s,r,a,c,u,f,$,w,_,O,y,v,k,x,b,C,D,N=n.showDialogs&&It(n),S=n.showNotifications&&Tt(n);return{c(){(t=p("button")).textContent="Hide notifications",e=m(),(i=p("button")).textContent="Reset notifications",s=m(),(r=p("button")).textContent="Hide dialogs",a=m(),(c=p("button")).textContent="Reset dialogs",u=m(),f=p("hr"),$=m(),(w=p("button")).textContent="Toggle dialogs",_=m(),N&&N.c(),O=m(),y=p("hr"),v=m(),(k=p("button")).textContent="Toggle notifications",x=m(),S&&S.c(),b=h(),D=[g(t,"click",n.click_handler),g(i,"click",n.click_handler_1),g(r,"click",n.click_handler_2),g(c,"click",n.click_handler_3),g(w,"click",n.click_handler_4),g(k,"click",n.click_handler_25)]},m(n,o){l(n,t,o),l(n,e,o),l(n,i,o),l(n,s,o),l(n,r,o),l(n,a,o),l(n,c,o),l(n,u,o),l(n,f,o),l(n,$,o),l(n,w,o),l(n,_,o),N&&N.m(n,o),l(n,O,o),l(n,y,o),l(n,v,o),l(n,k,o),l(n,x,o),S&&S.m(n,o),l(n,b,o),C=!0},p(n,t){t.showDialogs?N?(N.p(n,t),j(N,1)):((N=It(t)).c(),j(N,1),N.m(O.parentNode,O)):N&&(F(),q(N,1,1,()=>{N=null}),H()),t.showNotifications?S?(S.p(n,t),j(S,1)):((S=Tt(t)).c(),j(S,1),S.m(b.parentNode,b)):S&&(F(),q(S,1,1,()=>{S=null}),H())},i(n){C||(j(N),j(S),C=!0)},o(n){q(N),q(S),C=!1},d(n){n&&(d(t),d(e),d(i),d(s),d(r),d(a),d(c),d(u),d(f),d($),d(w),d(_)),N&&N.d(n),n&&(d(O),d(y),d(v),d(k),d(x)),S&&S.d(n),n&&d(b),o(D)}}}function Mt(n,t,e){let i,o,s,r,c;const u=Zn.getCount();a(n,u,n=>{e("$dialogCount",i=n)});const l=Zn.isDisplayed({id:"timer"});a(n,l,n=>{e("$timerDialogDisplayed",o=n)});const d=nt.getCount({spawn:"NO"});a(n,d,n=>{e("$notificationCount",s=n)});const p=nt.isPaused({spawn:"NO"});a(n,p,n=>{e("$notificationItemIsPaused",c=n)});const f=nt.isDisplayed({spawn:"NO"});a(n,f,n=>{e("$notificationDisplayed",r=n)});const m=()=>Math.round(1e3*Math.random()).toString(),h=({isOnMount:n}={})=>Zn.show({title:m(),component:xt,showDuration:n?0:.5,hideDuration:.5,className:"xxx",showClassName:"xxx-visible"},{spawn:"initial"}),g={showDuration:.5,showDelay:.25,hideDuration:.5,hideDelay:.25,component:Dt,className:"xxx",showClassName:"xxx-visible",title:"Clock",id:m()},$={showDuration:.75,showDelay:0,hideDuration:.75,hideDelay:0,component:xt,className:"xxx",showClassName:"xxx-visible",title:"Fade",id:m()},w={transitions:{show:n=>{const t=n.domElement;return{duration:.5,before:()=>(t.style.opacity=0,t.style.transform="translate3d(0, 20px, 0)"),transition:()=>(t.style.opacity=1,t.style.transform="translate3d(0, 0px,  0)")}},hide:n=>{const t=n.domElement;return{duration:.5,transition:()=>t.style.opacity=0}}},component:xt,title:"Transitions",id:m()},_={transitions:{hide:n=>{const t=n.domElement;return{duration:.5,delay:0,transition:()=>t.style.opacity=0}}}};let O,y;return e("showDialogs",O=!0),e("showNotifications",y=!1),{dialogCount:u,timerDialogDisplayed:l,notificationCount:d,notificationItemIsPaused:p,notificationDisplayed:f,getRandomId:m,showInitial:h,dialogOneProps:g,dialogTwoProps:$,dialogFourProps:w,clearOptions:_,Math:Math,showDialogs:O,showNotifications:y,$dialogCount:i,$timerDialogDisplayed:o,$notificationCount:s,$notificationDisplayed:r,$notificationItemIsPaused:c,click_handler:function(){return nt.hideAll({hideDelay:0,hideDuration:.25})},click_handler_1:function(){return nt.resetAll().catch(()=>{})},click_handler_2:function(){return Zn.hideAll(_)},click_handler_3:function(){return Zn.resetAll().catch(()=>{})},click_handler_4:function(){const n=O=!O;return e("showDialogs",O),n},click_handler_5:function(){return Zn.show({component:xt,title:"Default"})},click_handler_6:function(){return Zn.hide()},func:function(){return Zn.getRemaining({id:"timer"})},click_handler_7:function(){return Zn.show({timeout:2e3,component:xt,title:"With timer"},{id:"timer"})},click_handler_8:function(){return Zn.pause({id:"timer"})},click_handler_9:function(){return Zn.resume({id:"timer"},{minimumDuration:2e3})},click_handler_10:function(){return Zn.hide({id:"timer"}).catch(()=>console.log("caught"))},click_handler_11:function(){return Zn.show({didShow:n=>console.log("didShow",n),didHide:n=>console.log("didHide",n),showDuration:.5,showDelay:.25,component:xt,title:"With Promise"},{id:"withPromise"}).then(n=>console.log("dialog shown",n))},click_handler_12:function(){return Zn.hide({id:"withPromise"}).then(n=>console.log("dialog hidden",n))},click_handler_13:function(){return Zn.show({...g,showDelay:.5,hideDelay:0,title:g.title+" "+m()},{id:g.id})},click_handler_14:function(){return Zn.hide({id:g.id})},click_handler_15:function(){return Zn.show($,{id:$.id})},click_handler_16:function(){return Zn.hide({id:$.id})},click_handler_17:function(){return Zn.show(w,{id:w.id})},click_handler_18:function(){return Zn.hide({id:w.id})},click_handler_19:function(){return Zn.show({component:xt,title:"Custom spawn"},{spawn:"special"})},click_handler_20:function(){return Zn.hide({spawn:"special"})},click_handler_21:function(){return Zn.show({component:xt,title:"Queued "+Math.round(1e3*Math.random())},{spawn:"Q",queued:!0})},click_handler_22:function(){return Zn.hide({spawn:"Q"})},click_handler_23:function(){return h()},click_handler_24:function(){return Zn.hide({spawn:"initial"})},func_1:function(){return h({isOnMount:!0})},click_handler_25:function(){const n=y=!y;return e("showNotifications",y),n},click_handler_26:function(){const n="N "+m();nt.show({didShow:t=>console.log("didShow",t,n),didHide:t=>console.log("didHide",t,n),component:xt,className:"xxx-timings",showClassName:"xxx-visible-timings",title:n},{spawn:"NO"}).then(t=>console.log("notification shown",t,n))},click_handler_27:function(n){return nt.hide({spawn:"NO"}).then(n=>console.log("notification hidden from App",n))},click_handler_28:function(){return nt.pause({spawn:"NO"})},click_handler_29:function(){return nt.resume({spawn:"NO"})}}}return new class extends W{constructor(n){super(),J(this,n,Mt,At,r,[])}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
