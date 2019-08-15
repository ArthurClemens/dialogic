!function(t,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n((t=t||self)["dialogic-svelte"]={})}(this,function(t){"use strict";const n=({domElement:t,prop:n})=>{if(window.getComputedStyle){const e=document.defaultView;if(e){const i=e.getComputedStyle(t);if(i)return i.getPropertyValue(n)}}},e="show",i="hide",o=(t,n,e)=>{const i=e[n]||{};Object.keys(i).forEach(n=>{const e=i[n].toString();t.style[n]=e})},s=(t,n,e,i)=>{if(n.styles){const s=((t,n)=>("function"==typeof n?n(t):n)||{})(t,n.styles);o(t,"default",s),i&&(t=>t.style.transitionDuration="0ms")(t),o(t,e,s)}if(n.className){const i={showStart:`${n.className}-show-start`,showEnd:`${n.className}-show-end`,hideStart:`${n.className}-hide-start`,hideEnd:`${n.className}-hide-end`};((t,n)=>t.classList.remove(n.showStart,n.showEnd,n.hideStart,n.hideEnd))(t,i),i&&t.classList.add(i[e])}},r={showStart:{nextStep:"showEnd"},showEnd:{nextStep:void 0},hideStart:{nextStep:"hideEnd"},hideEnd:{nextStep:void 0}},a=(t,i)=>{const o=t.domElement;if(!o)return Promise.resolve("no domElement");let a=i===e?"showStart":"hideStart";return new Promise(e=>{s(o,t,a,"showStart"===a);const i=r[a].nextStep;i&&setTimeout(()=>{s(o,t,a=i);const r=(t=>{const e=n({domElement:t,prop:"transition-duration"}),i=void 0!==e?c(e):0,o=n({domElement:t,prop:"transition-delay"});return i+(void 0!==o?c(o):0)})(o);setTimeout(e,r)},0)})},c=t=>{const n=parseFloat(t)*(-1===t.indexOf("ms")?1e3:1);return isNaN(n)?0:n};var u=function(t,n){return t(n={exports:{}},n.exports),n.exports}(function(t){!function(){e.SKIP={},e.lift=function(){var t=arguments[0];return o(Array.prototype.slice.call(arguments,1)).map(function(n){return t.apply(void 0,n)})},e.scan=function(t,n,i){var o=i.map(function(i){var o=t(n,i);return o!==e.SKIP&&(n=o),o});return o(n),o},e.merge=o,e.combine=i,e.scanMerge=function(t,n){var e=t.map(function(t){return t[0]}),o=i(function(){var i=arguments[arguments.length-1];return e.forEach(function(e,o){i.indexOf(e)>-1&&(n=t[o][1](n,e()))}),n},e);return o(n),o},e["fantasy-land/of"]=e;var n=!1;function e(t){var n,o=[],r=[];function a(n){return arguments.length&&n!==e.SKIP&&(t=n,s(a)&&(a._changing(),a._state="active",o.forEach(function(n,e){n(r[e](t))}))),t}return a.constructor=e,a._state=arguments.length&&t!==e.SKIP?"active":"pending",a._parents=[],a._changing=function(){s(a)&&(a._state="changing"),o.forEach(function(t){t._changing()})},a._map=function(n,i){var s=i?e():e(n(t));return s._parents.push(a),o.push(s),r.push(n),s},a.map=function(t){return a._map(t,"active"!==a._state)},a.toJSON=function(){return null!=t&&"function"==typeof t.toJSON?t.toJSON():t},a["fantasy-land/map"]=a.map,a["fantasy-land/ap"]=function(t){return i(function(t,n){return t()(n())},[t,a])},a._unregisterChild=function(t){var n=o.indexOf(t);-1!==n&&(o.splice(n,1),r.splice(n,1))},Object.defineProperty(a,"end",{get:function(){return n||((n=e()).map(function(t){return!0===t&&(a._parents.forEach(function(t){t._unregisterChild(a)}),a._state="ended",a._parents.length=o.length=r.length=0),t}),n)}}),a}function i(t,n){var i=n.every(function(t){if(t.constructor!==e)throw new Error("Ensure that each item passed to stream.combine/stream.merge/lift is a stream");return"active"===t._state}),o=i?e(t.apply(null,n.concat([n]))):e(),s=[],r=n.map(function(e){return e._map(function(r){return s.push(e),(i||n.every(function(t){return"pending"!==t._state}))&&(i=!0,o(t.apply(null,n.concat([s]))),s=[]),r},!0)}),a=o.end.map(function(t){!0===t&&(r.forEach(function(t){t.end(!0)}),a.end(!0))});return o}function o(t){return i(function(){return t.map(function(t){return t()})},t)}function s(t){return"pending"===t._state||"active"===t._state||"changing"===t._state}Object.defineProperty(e,"HALT",{get:function(){return n||console.log("HALT is deprecated and has been renamed to SKIP"),n=!0,e.SKIP}}),t.exports=e}()});const d=(t,n)=>{const e=((t,n)=>n.find(n=>n.id===t))(t,n);return n.indexOf(e)},p=(t,n)=>[n,t.id,t.spawn].filter(Boolean).join("-"),l={initialState:{store:{}},actions:t=>({add:(n,e)=>{t(i=>{const o=i.store[n]||[];return i.store[n]=[...o,e],e.timer&&e.timer.states.map(()=>l.actions(t).refresh()),i})},remove:(n,e)=>{t(t=>{const i=t.store[n]||[],o=((t,n)=>{const e=d(t,n);return-1!==e&&n.splice(e,1),n})(e,i);return t.store[n]=o,t})},replace:(n,e,i)=>{t(t=>{const o=t.store[n]||[];if(o){const s=d(e,o);-1!==s&&(o[s]=i,t.store[n]=[...o])}return t})},removeAll:n=>{t(t=>(t.store[n]=[],t))},store:(n,e)=>{t(t=>(t.store[n]=[...e],t))},refresh:()=>{t(t=>({...t}))}}),selectors:t=>{const n={getStore:()=>{return t().store},find:(n,e)=>{const i=t().store[n]||[],o=p(e,n),s=i.find(t=>t.id===o);return s?{just:s}:{nothing:void 0}},getAll:(n,e)=>{const i=t().store[n]||[],o=void 0!==e?e.spawn:void 0,s=void 0!==e?e.id:void 0,r=void 0!==o?i.filter(t=>t.identityOptions.spawn===o):i;return void 0!==s?r.filter(t=>t.identityOptions.id===s):r},getCount:(t,e)=>n.getAll(t,e).length};return n}},f=u(),m=u.scan((t,n)=>n(t),{...l.initialState},f),g={...l.actions(f)},h={...l.selectors(m)},$={timerId:void 0,isPaused:void 0,remaining:void 0,startTime:void 0,callback:()=>{},timeoutFn:()=>{},promise:void 0,onDone:()=>{},onAbort:()=>{}},y=(t,n,e,i)=>{const o=()=>{n(),t.onDone(),i()};return{timeoutFn:o,promise:new Promise((n,e)=>{t.onDone=()=>n(),t.onAbort=()=>e()}),...t.isPaused?{}:{startTime:(new Date).getTime(),timerId:window.setTimeout(o,e),remaining:e}}},O=t=>(window.clearTimeout(t.timerId),{timerId:$.timerId}),w=t=>({...O(t)}),v=t=>({...O(t),isPaused:!0,remaining:b(t)}),S=(t,n)=>{window.clearTimeout(t.timerId);const e=n?Math.max(t.remaining||0,n):t.remaining;return{startTime:(new Date).getTime(),isPaused:!1,remaining:e,timerId:window.setTimeout(t.timeoutFn,e)}},b=t=>void 0===t.remaining?void 0:t.remaining-((new Date).getTime()-(t.startTime||0)),_=()=>{const t={initialState:$,actions:n=>({start:(e,i)=>{n(o=>({...o,...O(o),...y(o,e,i,()=>t.actions(n).done()),...o.isPaused&&v(o)}))},stop:()=>{n(t=>({...t,...w(t),...$}))},pause:()=>{n(t=>({...t,...v(t)}))},resume:t=>{n(n=>({...n,...n.isPaused&&S(n,t)}))},abort:()=>{n(t=>(t.onAbort(),{...t,...O(t)}))},done:()=>{n(t=>$)},refresh:()=>{n(t=>({...t}))}}),selectors:t=>({isPaused:()=>{return t().isPaused},getRemaining:()=>{const n=t();return n.isPaused?n.remaining:b(n)},getResultPromise:()=>{return t().promise}})},n=u(),e=u.scan((t,n)=>n(t),{...t.initialState},n);return{states:e,actions:{...t.actions(n)},selectors:{...t.selectors(e)}}};let E=0;const x=()=>E===Number.MAX_SAFE_INTEGER?0:E++,P="none",T="hiding",j=t=>{let n=0;return t.map(t=>({item:t,queueCount:t.dialogicOptions.queued?n++:0})).filter(({queueCount:t})=>0===t).map(({item:t})=>t)},k=(t,n,e)=>{const i=n[t]||[];return 0==i.length?[]:((...t)=>n=>t.filter(Boolean).reduce((t,n)=>n(t),n))(j,(t=>n=>n.filter(n=>n.identityOptions.spawn===t.spawn))(e))(i)},A=(t,n={})=>({id:n.id||t.id,spawn:n.spawn||t.spawn}),I=t=>n=>(e={})=>new Promise(i=>{const o={id:e.dialogic?e.dialogic.id:void 0,spawn:e.dialogic?e.dialogic.spawn:void 0},s=A(n,o),r={...n,...e.dialogic},a=(t=>{const n={...t};return delete n.dialogic,n})(e),c={didShow:t=>(r.didShow&&r.didShow(t),i(t)),didHide:t=>(r.didHide&&r.didHide(t),i(t))},u={ns:t,identityOptions:s,dialogicOptions:r,callbacks:c,passThroughOptions:a,id:p(s,t),timer:r.timeout?_():void 0,key:x().toString(),transitionState:P},d=h.find(t,s);if(d.just&&r.toggle){const e=M(t)(n)(o);return i(e)}if(d.just&&!r.queued){const n=d.just,e=n.dialogicOptions,i={...u,dialogicOptions:e};g.replace(t,n.id,i),c.didShow&&c.didShow(u)}else g.add(t,u);i(u)}),N=t=>n=>e=>h.find(t,A(n,e)),C=t=>n=>e=>i=>{const o=N(n)(e)(i);return o.just?t(n,o.just,i):Promise.resolve()},M=C((t,n)=>n.transitionState!==T?(n.transitionState=T,X(n)):Promise.resolve(n)),D=C((t,n)=>(n&&n.timer&&n.timer.actions.pause(),Promise.resolve(n))),q=C((t,n,e={})=>(n&&n.timer&&n.timer.actions.resume(e.minimumDuration),Promise.resolve(n))),H=t=>n=>e=>i=>{const o=N(n)(e)(i);return o.just&&o.just&&o.just.timer?o.just.timer.selectors[t]():void 0},F=H("isPaused"),K=H("getRemaining"),R=t=>n=>e=>{return!!N(t)(n)(e).just},J=t=>()=>(h.getAll(t).forEach(t=>t.timer&&t.timer.actions.abort()),g.removeAll(t),Promise.resolve()),L=(t,n)=>({...t,dialogicOptions:{...t.dialogicOptions,...n}}),B=t=>n=>{const e=h.getAll(t),i=e.filter(t=>!n.queued&&!t.dialogicOptions.queued),o=e.filter(t=>n.queued||t.dialogicOptions.queued);if(i.forEach(t=>X(L(t,n))),o.length>0){const[e]=o;g.store(t,[e]),X(L(e,n)).then(()=>g.removeAll(t))}},V=t=>n=>h.getCount(t,n),z=(t,n)=>a(t.dialogicOptions,n),G=async function(t){return await z(t,e),t.callbacks.didShow&&await t.callbacks.didShow(t),t.dialogicOptions.timeout&&t.timer&&await async function(t,n,e){return n.actions.start(()=>X(t),e),H("getResultPromise")}(t,t.timer,t.dialogicOptions.timeout),Promise.resolve(t)},X=async function(t){t.timer&&t.timer.actions.stop(),await z(t,i),t.callbacks.didHide&&await t.callbacks.didHide(t);const n=JSON.parse(JSON.stringify(t));return g.remove(t.ns,t.id),Promise.resolve(n)},Q=({ns:t,queued:n,timeout:e})=>{const i=`default_${t}`,o=`default_${t}`,s={id:i,spawn:o,...n&&{queued:n},...void 0!==e&&{timeout:e}};return{ns:t,defaultId:i,defaultSpawn:o,defaultDialogicOptions:s,show:I(t)(s),hide:M(t)(s),hideAll:B(t),resetAll:J(t),pause:D(t)(s),resume:q(t)(s),exists:R(t)(s),getCount:V(t),isPaused:F(t)(s),getRemaining:K(t)(s)}},U=Q({ns:"dialog"}),W=Q({ns:"notification",queued:!0,timeout:3e3});function Y(){}function Z(t,n){for(const e in n)t[e]=n[e];return t}function tt(t){return t()}function nt(){return Object.create(null)}function et(t){t.forEach(tt)}function it(t){return"function"==typeof t}function ot(t,n){return t!=t?n==n:t!==n||t&&"object"==typeof t||"function"==typeof t}function st(t){const n={};for(const e in t)"$"!==e[0]&&(n[e]=t[e]);return n}function rt(t,n,e){t.insertBefore(n,e||null)}function at(t){t.parentNode.removeChild(t)}function ct(){return t="",document.createTextNode(t);var t}let ut;function dt(t){ut=t}function pt(t){(function(){if(!ut)throw new Error("Function called outside component initialization");return ut})().$$.on_mount.push(t)}function lt(){const t=ut;return(n,e)=>{const i=t.$$.callbacks[n];if(i){const o=function(t,n){const e=document.createEvent("CustomEvent");return e.initCustomEvent(t,!1,!1,n),e}(n,e);i.slice().forEach(n=>{n.call(t,o)})}}}const ft=[],mt=[],gt=[],ht=[],$t=Promise.resolve();let yt=!1;function Ot(t){gt.push(t)}function wt(){const t=new Set;do{for(;ft.length;){const t=ft.shift();dt(t),vt(t.$$)}for(;mt.length;)mt.pop()();for(let n=0;n<gt.length;n+=1){const e=gt[n];t.has(e)||(e(),t.add(e))}gt.length=0}while(ft.length);for(;ht.length;)ht.pop()();yt=!1}function vt(t){t.fragment&&(t.update(t.dirty),et(t.before_update),t.fragment.p(t.dirty,t.ctx),t.dirty=null,t.after_update.forEach(Ot))}const St=new Set;let bt;function _t(){bt={r:0,c:[],p:bt}}function Et(){bt.r||et(bt.c),bt=bt.p}function xt(t,n){t&&t.i&&(St.delete(t),t.i(n))}function Pt(t,n,e,i){if(t&&t.o){if(St.has(t))return;St.add(t),bt.c.push(()=>{St.delete(t),i&&(e&&t.d(1),i())}),t.o(n)}}function Tt(t,n){Pt(t,1,1,()=>{n.delete(t.key)})}function jt(t,n){const e={},i={},o={$$scope:1};let s=t.length;for(;s--;){const r=t[s],a=n[s];if(a){for(const t in r)t in a||(i[t]=1);for(const t in a)o[t]||(e[t]=a[t],o[t]=1);t[s]=a}else for(const t in r)o[t]=1}for(const t in i)t in e||(e[t]=void 0);return e}function kt(t,n,e){const{fragment:i,on_mount:o,on_destroy:s,after_update:r}=t.$$;i.m(n,e),Ot(()=>{const n=o.map(tt).filter(it);s?s.push(...n):et(n),t.$$.on_mount=[]}),r.forEach(Ot)}function At(t,n){t.$$.fragment&&(et(t.$$.on_destroy),t.$$.fragment.d(n),t.$$.on_destroy=t.$$.fragment=null,t.$$.ctx={})}function It(t,n){t.$$.dirty||(ft.push(t),yt||(yt=!0,$t.then(wt)),t.$$.dirty=nt()),t.$$.dirty[n]=!0}function Nt(t,n,e,i,o,s){const r=ut;dt(t);const a=n.props||{},c=t.$$={fragment:null,ctx:null,props:s,update:Y,not_equal:o,bound:nt(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(r?r.$$.context:[]),callbacks:nt(),dirty:null};let u=!1;c.ctx=e?e(t,a,(n,e)=>{c.ctx&&o(c.ctx[n],c.ctx[n]=e)&&(c.bound[n]&&c.bound[n](e),u&&It(t,n))}):a,c.update(),u=!0,et(c.before_update),c.fragment=i(c.ctx),n.target&&(n.hydrate?c.fragment.l(function(t){return Array.from(t.childNodes)}(n.target)):c.fragment.c(),n.intro&&xt(t.$$.fragment),kt(t,n.target,n.anchor),wt()),dt(r)}class Ct{$destroy(){At(this,1),this.$destroy=Y}$on(t,n){const e=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return e.push(n),()=>{const t=e.indexOf(n);-1!==t&&e.splice(t,1)}}$set(){}}const Mt=[];function Dt(t,n=Y){let e;const i=[];function o(n){if(ot(t,n)&&(t=n,e)){const n=!Mt.length;for(let n=0;n<i.length;n+=1){const e=i[n];e[1](),Mt.push(e,t)}if(n){for(let t=0;t<Mt.length;t+=2)Mt[t][0](Mt[t+1]);Mt.length=0}}}return{set:o,update:function(n){o(n(t))},subscribe:function(s,r=Y){const a=[s,r];return i.push(a),1===i.length&&(e=n(o)||Y),s(t),()=>{const t=i.indexOf(a);-1!==t&&i.splice(t,1),0===i.length&&(e(),e=null)}}}}function qt(t,n,e){const i=!Array.isArray(t),o=i?[t]:t,s=n.length<2;return{subscribe:Dt(e,t=>{let e=!1;const r=[];let a=0,c=Y;const u=()=>{if(a)return;c();const e=n(i?r[0]:r,t);s?t(e):c=it(e)?e:Y},d=o.map((t,n)=>t.subscribe(t=>{r[n]=t,a&=~(1<<n),e&&u()},()=>{a|=1<<n}));return e=!0,u(),function(){et(d),c()}}).subscribe}}const Ht={...Dt(m),...h};m.map(t=>Ht.set({...t,...h}));const Ft=t=>n=>qt(Ht,()=>h.getCount(t,n)),Kt=t=>n=>e=>qt(Ht,()=>H("isPaused")(t)(n)(e)),Rt=t=>n=>e=>qt(Ht,()=>R(t)(n)(e)),Jt={...U,getCount:t=>Ft(U.ns)(t),isPaused:t=>Kt(U.ns)(U.defaultDialogicOptions)(t),exists:t=>Rt(U.ns)(U.defaultDialogicOptions)(t)},Lt={...W,getCount:t=>Ft(W.ns)(t),isPaused:t=>Kt(W.ns)(W.defaultDialogicOptions)(t),exists:t=>Rt(W.ns)(W.defaultDialogicOptions)(t)},Bt=t=>(n,e)=>{const i=h.find(t,n.detail.identityOptions);i.just&&((t,n)=>{n.dialogicOptions.domElement=t})(n.detail.domElement,i.just);const o=h.find(t,n.detail.identityOptions);o.just&&e(o.just)},Vt=t=>n=>Bt(t)(n,G),zt=t=>n=>Bt(t)(n,G),Gt=t=>n=>Bt(t)(n,X);function Xt(t){var n,e,i=[{show:t.show},{hide:t.hide},t.passThroughOptions],o=t.dialogicOptions.component;function s(t){let n={};for(var e=0;e<i.length;e+=1)n=Z(n,i[e]);return{props:n}}if(o)var r=new o(s());return{c(){var e,i,o,s;e="div",n=document.createElement(e),r&&r.$$.fragment.c(),i=n,o="class",null==(s=t.className)?i.removeAttribute(o):i.setAttribute(o,s)},m(i,o){rt(i,n,o),r&&kt(r,n,null),t.div_binding(n),e=!0},p(t,e){var a=t.show||t.hide||t.passThroughOptions?jt(i,[t.show&&{show:e.show},t.hide&&{hide:e.hide},t.passThroughOptions&&e.passThroughOptions]):{};if(o!==(o=e.dialogicOptions.component)){if(r){_t();const t=r;Pt(t.$$.fragment,1,0,()=>{At(t,1)}),Et()}o?((r=new o(s())).$$.fragment.c(),xt(r.$$.fragment,1),kt(r,n,null)):r=null}else o&&r.$set(a)},i(t){e||(r&&xt(r.$$.fragment,t),e=!0)},o(t){r&&Pt(r.$$.fragment,t),e=!1},d(e){e&&at(n),r&&At(r),t.div_binding(null)}}}function Qt(t,n,e){const i=lt();let o,{identityOptions:s,passThroughOptions:r,dialogicOptions:a}=n;const c=a.className,u=t=>i(t,{identityOptions:s,domElement:o});return pt(()=>{u("mount")}),t.$set=t=>{"identityOptions"in t&&e("identityOptions",s=t.identityOptions),"passThroughOptions"in t&&e("passThroughOptions",r=t.passThroughOptions),"dialogicOptions"in t&&e("dialogicOptions",a=t.dialogicOptions)},{domElement:o,identityOptions:s,passThroughOptions:r,dialogicOptions:a,className:c,show:()=>{u("show")},hide:()=>{u("hide")},div_binding:function(t){mt[t?"unshift":"push"](()=>{e("domElement",o=t)})}}}class Ut extends Ct{constructor(t){super(),Nt(this,t,Qt,Xt,ot,["identityOptions","passThroughOptions","dialogicOptions"])}}function Wt(t,n,e){const i=Object.create(t);return i.identityOptions=n[e].identityOptions,i.dialogicOptions=n[e].dialogicOptions,i.passThroughOptions=n[e].passThroughOptions,i.key=n[e].key,i.index=e,i}function Yt(t,n){var e,i,o=new Ut({props:{identityOptions:n.identityOptions,dialogicOptions:n.dialogicOptions,passThroughOptions:n.passThroughOptions}});return o.$on("mount",n.nsOnInstanceMounted),o.$on("show",n.nsOnShowInstance),o.$on("hide",n.nsOnHideInstance),{key:t,first:null,c(){e=ct(),o.$$.fragment.c(),this.first=e},m(t,n){rt(t,e,n),kt(o,t,n),i=!0},p(t,n){var e={};(t.filterCandidates||t.ns||t.$appState||t.identityOptions)&&(e.identityOptions=n.identityOptions),(t.filterCandidates||t.ns||t.$appState||t.identityOptions)&&(e.dialogicOptions=n.dialogicOptions),(t.filterCandidates||t.ns||t.$appState||t.identityOptions)&&(e.passThroughOptions=n.passThroughOptions),o.$set(e)},i(t){i||(xt(o.$$.fragment,t),i=!0)},o(t){Pt(o.$$.fragment,t),i=!1},d(t){t&&at(e),At(o,t)}}}function Zt(t){var n,e,i=[],o=new Map,s=k(t.ns,t.$appState.store,t.identityOptions);const r=t=>t.key;for(var a=0;a<s.length;a+=1){let n=Wt(t,s,a),e=r(n);o.set(e,i[a]=Yt(e,n))}return{c(){for(a=0;a<i.length;a+=1)i[a].c();n=ct()},m(t,o){for(a=0;a<i.length;a+=1)i[a].m(t,o);rt(t,n,o),e=!0},p(t,e){const s=k(e.ns,e.$appState.store,e.identityOptions);_t(),i=function(t,n,e,i,o,s,r,a,c,u,d,p){let l=t.length,f=s.length,m=l;const g={};for(;m--;)g[t[m].key]=m;const h=[],$=new Map,y=new Map;for(m=f;m--;){const t=p(o,s,m),a=e(t);let c=r.get(a);c?i&&c.p(n,t):(c=u(a,t)).c(),$.set(a,h[m]=c),a in g&&y.set(a,Math.abs(m-g[a]))}const O=new Set,w=new Set;function v(t){xt(t,1),t.m(a,d),r.set(t.key,t),d=t.first,f--}for(;l&&f;){const n=h[f-1],e=t[l-1],i=n.key,o=e.key;n===e?(d=n.first,l--,f--):$.has(o)?!r.has(i)||O.has(i)?v(n):w.has(o)?l--:y.get(i)>y.get(o)?(w.add(i),v(n)):(O.add(o),l--):(c(e,r),l--)}for(;l--;){const n=t[l];$.has(n.key)||c(n,r)}for(;f;)v(h[f-1]);return h}(i,t,r,1,e,s,o,n.parentNode,Tt,Yt,n,Wt),Et()},i(t){if(!e){for(var n=0;n<s.length;n+=1)xt(i[n]);e=!0}},o(t){for(a=0;a<i.length;a+=1)Pt(i[a]);e=!1},d(t){for(a=0;a<i.length;a+=1)i[a].d(t);t&&at(n)}}}function tn(t,n,e){let i;!function(t,n,e){t.$$.on_destroy.push(function(t,n){const e=t.subscribe(n);return e.unsubscribe?()=>e.unsubscribe():e}(n,e))}(t,Ht,t=>{e("$appState",i=t)});let{identityOptions:o,ns:s}=n;const r=Vt(s),a=zt(s),c=Gt(s);return t.$set=t=>{"identityOptions"in t&&e("identityOptions",o=t.identityOptions),"ns"in t&&e("ns",s=t.ns)},{identityOptions:o,ns:s,nsOnInstanceMounted:r,nsOnShowInstance:a,nsOnHideInstance:c,$appState:i}}class nn extends Ct{constructor(t){super(),Nt(this,t,tn,Zt,ot,["identityOptions","ns"])}}function en(t){var n,e=new nn({props:{identityOptions:t.identityOptions,ns:t.ns}});return{c(){e.$$.fragment.c()},m(t,i){kt(e,t,i),n=!0},p(t,n){var i={};t.identityOptions&&(i.identityOptions=n.identityOptions),t.ns&&(i.ns=n.ns),e.$set(i)},i(t){n||(xt(e.$$.fragment,t),n=!0)},o(t){Pt(e.$$.fragment,t),n=!1},d(t){At(e,t)}}}function on(t,n,e){let{type:i,ns:o=i.ns,spawn:s,id:r,onMount:a}=n;const c={id:r||i.defaultId,spawn:s||i.defaultSpawn};return pt(()=>{"function"==typeof a&&a()}),t.$set=t=>{"type"in t&&e("type",i=t.type),"ns"in t&&e("ns",o=t.ns),"spawn"in t&&e("spawn",s=t.spawn),"id"in t&&e("id",r=t.id),"onMount"in t&&e("onMount",a=t.onMount)},{type:i,ns:o,spawn:s,id:r,onMount:a,identityOptions:c}}class sn extends Ct{constructor(t){super(),Nt(this,t,on,en,ot,["type","ns","spawn","id","onMount"])}}function rn(t){var n,e=[t.$$props,{type:Jt}];let i={};for(var o=0;o<e.length;o+=1)i=Z(i,e[o]);var s=new sn({props:i});return{c(){s.$$.fragment.c()},m(t,e){kt(s,t,e),n=!0},p(t,n){var i=t.$$props||t.dialog?jt(e,[t.$$props&&n.$$props,t.dialog&&{type:Jt}]):{};s.$set(i)},i(t){n||(xt(s.$$.fragment,t),n=!0)},o(t){Pt(s.$$.fragment,t),n=!1},d(t){At(s,t)}}}function an(t,n,e){return t.$set=t=>{e("$$props",n=Z(Z({},n),t))},{$$props:n,$$props:n=st(n)}}function cn(t){var n,e=[t.$$props,{type:Lt}];let i={};for(var o=0;o<e.length;o+=1)i=Z(i,e[o]);var s=new sn({props:i});return{c(){s.$$.fragment.c()},m(t,e){kt(s,t,e),n=!0},p(t,n){var i=t.$$props||t.notification?jt(e,[t.$$props&&n.$$props,t.notification&&{type:Lt}]):{};s.$set(i)},i(t){n||(xt(s.$$.fragment,t),n=!0)},o(t){Pt(s.$$.fragment,t),n=!1},d(t){At(s,t)}}}function un(t,n,e){return t.$set=t=>{e("$$props",n=Z(Z({},n),t))},{$$props:n,$$props:n=st(n)}}t.Dialog=class extends Ct{constructor(t){super(),Nt(this,t,an,rn,ot,[])}},t.Dialogical=sn,t.Notification=class extends Ct{constructor(t){super(),Nt(this,t,un,cn,ot,[])}},t.dialog=Jt,t.notification=Lt,Object.defineProperty(t,"__esModule",{value:!0})});
//# sourceMappingURL=dialogic-svelte.js.map
