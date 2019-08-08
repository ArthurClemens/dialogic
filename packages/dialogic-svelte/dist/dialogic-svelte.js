!function(n,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((n=n||self)["dialogic-svelte"]={})}(this,function(n){"use strict";const t="show",e="hide",i={className:!0,component:!0,didHide:!0,didShow:!0,hideDelay:!0,hideDuration:!0,hideTimingFunction:!0,showClassName:!0,showDelay:!0,showDuration:!0,showTimingFunction:!0,timeout:!0,transitionClassName:!0,transitions:!0},s=(n,e)=>{const i=n.domElements?n.domElements.domElement:null;if(!i)throw new Error("No DOM element");return new Promise(s=>{const a=i.style,c=window.getComputedStyle(i),u=e===t,p=r({showDuration:n.showDuration,showDelay:n.showDelay,showTimingFunction:n.showTimingFunction,hideDuration:n.hideDuration,hideDelay:n.hideDelay,hideTimingFunction:n.hideTimingFunction,transitions:n.transitions,domElements:n.domElements},u),d=void 0!==p.duration?1e3*p.duration:c?o(c.transitionDuration):0,l=void 0!==p.delay?1e3*p.delay:c?o(c.transitionDelay):0,f=d+l;p.before&&"function"==typeof p.before&&(a.transitionDuration="0ms",a.transitionDelay="0ms",p.before()),(()=>{const t=p.timingFunction||(c?c.transitionTimingFunction:void 0);t&&(a.transitionTimingFunction=t),a.transitionDuration=d+"ms",a.transitionDelay=l+"ms",n.transitionClassName&&i.classList.add(n.transitionClassName),n.showClassName&&(n.showClassElement||i).classList[u?"add":"remove"](n.showClassName);p.transition&&p.transition()})(),setTimeout(()=>{p.after&&"function"==typeof p.after&&p.after(),n.transitionClassName&&i.classList.remove(n.transitionClassName),s()},f)})},o=n=>{const t=parseFloat(n)*(-1===n.indexOf("ms")?1e3:1);return isNaN(t)?0:t},r=(n,t)=>{const[e,i,s,o]=t?[n.showDuration,n.showDelay,n.showTimingFunction,n.transitions?n.transitions.show:void 0]:[n.hideDuration,n.hideDelay,n.hideTimingFunction,n.transitions?n.transitions.hide:void 0];return{duration:e,delay:i,timingFunction:s,...o?o(n.domElements):void 0}};var a=function(n,t){return n(t={exports:{}},t.exports),t.exports}(function(n){!function(){e.SKIP={},e.lift=function(){var n=arguments[0];return s(Array.prototype.slice.call(arguments,1)).map(function(t){return n.apply(void 0,t)})},e.scan=function(n,t,i){var s=i.map(function(i){var s=n(t,i);return s!==e.SKIP&&(t=s),s});return s(t),s},e.merge=s,e.combine=i,e.scanMerge=function(n,t){var e=n.map(function(n){return n[0]}),s=i(function(){var i=arguments[arguments.length-1];return e.forEach(function(e,s){i.indexOf(e)>-1&&(t=n[s][1](t,e()))}),t},e);return s(t),s},e["fantasy-land/of"]=e;var t=!1;function e(n){var t,s=[],r=[];function a(t){return arguments.length&&t!==e.SKIP&&(n=t,o(a)&&(a._changing(),a._state="active",s.forEach(function(t,e){t(r[e](n))}))),n}return a.constructor=e,a._state=arguments.length&&n!==e.SKIP?"active":"pending",a._parents=[],a._changing=function(){o(a)&&(a._state="changing"),s.forEach(function(n){n._changing()})},a._map=function(t,i){var o=i?e():e(t(n));return o._parents.push(a),s.push(o),r.push(t),o},a.map=function(n){return a._map(n,"active"!==a._state)},a.toJSON=function(){return null!=n&&"function"==typeof n.toJSON?n.toJSON():n},a["fantasy-land/map"]=a.map,a["fantasy-land/ap"]=function(n){return i(function(n,t){return n()(t())},[n,a])},a._unregisterChild=function(n){var t=s.indexOf(n);-1!==t&&(s.splice(t,1),r.splice(t,1))},Object.defineProperty(a,"end",{get:function(){return t||((t=e()).map(function(n){return!0===n&&(a._parents.forEach(function(n){n._unregisterChild(a)}),a._state="ended",a._parents.length=s.length=r.length=0),n}),t)}}),a}function i(n,t){var i=t.every(function(n){if(n.constructor!==e)throw new Error("Ensure that each item passed to stream.combine/stream.merge/lift is a stream");return"active"===n._state}),s=i?e(n.apply(null,t.concat([t]))):e(),o=[],r=t.map(function(e){return e._map(function(r){return o.push(e),(i||t.every(function(n){return"pending"!==n._state}))&&(i=!0,s(n.apply(null,t.concat([o]))),o=[]),r},!0)}),a=s.end.map(function(n){!0===n&&(r.forEach(function(n){n.end(!0)}),a.end(!0))});return s}function s(n){return i(function(){return n.map(function(n){return n()})},n)}function o(n){return"pending"===n._state||"active"===n._state||"changing"===n._state}Object.defineProperty(e,"HALT",{get:function(){return t||console.log("HALT is deprecated and has been renamed to SKIP"),t=!0,e.SKIP}}),n.exports=e}()});const c=(n,t)=>{const e=((n,t)=>t.find(t=>t.id===n))(n,t);return t.indexOf(e)},u=(n,t)=>[t,n.id,n.spawn].filter(Boolean).join("-"),p={initialState:{store:{}},actions:n=>({add:(t,e)=>{n(i=>{const s=i.store[t]||[];return i.store[t]=[...s,e],e.timer&&e.timer.states.map(()=>p.actions(n).refresh()),i})},remove:(t,e)=>{n(n=>{const i=n.store[t]||[],s=((n,t)=>{const e=c(n,t);return-1!==e&&t.splice(e,1),t})(e,i);return n.store[t]=s,n})},replace:(t,e,i)=>{n(n=>{const s=n.store[t]||[];if(s){const o=c(e,s);-1!==o&&(s[o]=i,n.store[t]=[...s])}return n})},removeAll:t=>{n(n=>(n.store[t]=[],n))},store:(t,e)=>{n(n=>(n.store[t]=[...e],n))},refresh:()=>{n(n=>({...n}))}}),selectors:n=>{const t={getStore:()=>{return n().store},find:(t,e)=>{const i=n().store[t]||[],s=u(e,t),o=i.find(n=>n.id===s);return o?{just:o}:{nothing:void 0}},getAll:(t,e)=>{const i=n().store[t]||[],s=void 0!==e?e.spawn:void 0;return void 0!==s?i.filter(n=>n.spawnOptions.spawn===s):i},getCount:(n,e)=>t.getAll(n,e).length};return t}},d=a(),l=a.scan((n,t)=>t(n),{...p.initialState},d),f={...p.actions(d)},m={...p.selectors(l)},h={timerId:void 0,isPaused:void 0,remaining:void 0,startTime:void 0,callback:()=>{},timeoutFn:()=>{},promise:void 0,onDone:()=>{},onAbort:()=>{}},w=(n,t,e,i)=>{const s=()=>{t(),n.onDone(),i()};return{timeoutFn:s,promise:new Promise((t,e)=>{n.onDone=()=>t(),n.onAbort=()=>e()}),...n.isPaused?{}:{startTime:(new Date).getTime(),timerId:window.setTimeout(s,e),remaining:e}}},g=n=>(window.clearTimeout(n.timerId),{timerId:h.timerId}),O=n=>({...g(n)}),$=n=>({...g(n),isPaused:!0,remaining:y(n)}),v=(n,t)=>{window.clearTimeout(n.timerId);const e=t?Math.max(n.remaining||0,t):n.remaining;return{startTime:(new Date).getTime(),isPaused:!1,remaining:e,timerId:window.setTimeout(n.timeoutFn,e)}},y=n=>void 0===n.remaining?void 0:n.remaining-((new Date).getTime()-(n.startTime||0)),_=()=>{const n={initialState:h,actions:t=>({start:(e,i)=>{t(s=>({...s,...g(s),...w(s,e,i,()=>n.actions(t).done()),...s.isPaused&&$(s)}))},stop:()=>{t(n=>({...n,...O(n),...h}))},pause:()=>{t(n=>({...n,...$(n)}))},resume:n=>{t(t=>({...t,...t.isPaused&&v(t,n)}))},abort:()=>{t(n=>(n.onAbort(),{...n,...g(n)}))},done:()=>{t(n=>h)},refresh:()=>{t(n=>({...n}))}}),selectors:n=>({isPaused:()=>{return n().isPaused},getRemaining:()=>{const t=n();return t.isPaused?t.remaining:y(t)},getResultPromise:()=>{return n().promise}})},t=a(),e=a.scan((n,t)=>t(n),{...n.initialState},t);return{states:e,actions:{...n.actions(t)},selectors:{...n.selectors(e)}}};let b=0;const S=()=>b===Number.MAX_SAFE_INTEGER?0:b++,P="none",N="hiding",E=(n,t,e)=>{return((n,t)=>n.filter(n=>n.spawnOptions.spawn===t))(((n,t)=>{let e=0;return n.map(n=>({item:n,queueCount:n.spawnOptions.queued?e++:0})).filter(({queueCount:n})=>0===n).map(({item:n})=>n)})(t[n]||[]),e)},T=n=>{return Object.keys(n).reduce((t,e)=>{const s=n[e];return i[e]?t.transitionOptions[e]=s:t.instanceOptions[e]=s,t},{transitionOptions:{},instanceOptions:{}})},x=n=>t=>e=>(i,s)=>new Promise(o=>{const r={...t,...s},a=u(r,n),{transitionOptions:c,instanceOptions:p}=T(i),d={...e,...c};d.didShow=n=>(i.didShow&&i.didShow(n),o(n)),d.didHide=n=>(i.didHide&&i.didHide(n),o(n));const l=S().toString(),h={spawnOptions:r,transitionOptions:d,instanceTransitionOptions:c,instanceOptions:p,id:a,timer:d.timeout?_():void 0,key:l,transitionState:P},w=m.find(n,r);if(w.just&&!r.queued){const t=w.just,e=t.instanceTransitionOptions,i={...h,instanceTransitionOptions:e};f.replace(n,t.id,i),d.didShow(r.id)}else f.add(n,h)}),D=n=>t=>e=>{const i={...t,...e};return m.find(n,i)},I=n=>t=>e=>(i,s)=>{const o=D(t)(e)(i);return o.just?n(t,o.just,s):Promise.resolve()},C=I((n,t)=>t.transitionState!==N?(t.transitionState=N,J(n,t)):Promise.resolve()),j=I((n,t)=>(t&&t.timer&&t.timer.actions.pause(),Promise.resolve())),A=I((n,t,e={})=>(t&&t.timer&&t.timer.actions.resume(e.minimumDuration),Promise.resolve())),F=n=>t=>e=>i=>{const s=D(t)(e)(i);return s.just&&s.just&&s.just.timer?s.just.timer.selectors[n]():void 0},k=F("isPaused"),M=F("getRemaining"),R=n=>()=>(m.getAll(n).forEach(n=>n.timer&&n.timer.actions.abort()),f.removeAll(n),Promise.resolve()),q=(n,t)=>{const{transitionOptions:e}=T(t);return{...n,transitionOptions:{...n.transitionOptions,...e}}},H=n=>t=>(e,i)=>{const s={...t,...i},o=m.getAll(n),r=o.filter(n=>!s.queued&&!n.spawnOptions.queued),a=o.filter(n=>s.queued||n.spawnOptions.queued);if(r.forEach(t=>J(n,q(t,e))),a.length>0){const[t]=a;f.store(n,[t]),J(n,q(t,e)).then(()=>f.removeAll(n))}},K=n=>t=>m.getCount(n,t),L=(n,t)=>{try{return s({...n.instanceTransitionOptions,...n.transitionOptions},t)}catch(n){throw new Error(`Transition error: ${n}`)}},z=async function(n,e){return await L(e,t),e.transitionOptions.didShow&&await e.transitionOptions.didShow(e.spawnOptions.id),e.transitionOptions.timeout&&e.timer&&await async function(n,t,e,i){return e.actions.start(()=>J(n,t),i),F("getResultPromise")}(n,e,e.timer,e.transitionOptions.timeout),e.spawnOptions.id},J=async function(n,t){return t.timer&&t.timer.actions.stop(),await L(t,e),t.transitionOptions.didHide&&await t.transitionOptions.didHide(t.spawnOptions.id),f.remove(n,t.id),t.spawnOptions.id},B="notification",G=`default_${B}`,X=`default_${B}`,Q={id:G,queued:!0,spawn:X},U=x(B)(Q)({timeout:3e3}),V=C(B)(Q),W=j(B)(Q),Y=A(B)(Q),Z=k(B)(Q),nn=D(B)(Q),tn=M(B)(Q),en=H(B)(Q),sn=R(B),on=K(B);var rn=Object.freeze({ns:B,defaultId:G,defaultSpawn:X,defaultSpawnOptions:Q,show:U,hide:V,pause:W,resume:Y,isPaused:Z,getMaybeItem:nn,getRemaining:tn,hideAll:en,resetAll:sn,getCount:on});const an="dialog",cn={id:"default_dialog",spawn:"default_dialog"},un=x(an)(cn)({}),pn=C(an)(cn),dn=j(an)(cn),ln=A(an)(cn),fn=k(an)(cn),mn=D(an)(cn),hn=M(an)(cn),wn=H(an)(cn),gn=R(an),On=K(an);var $n=Object.freeze({ns:an,defaultId:"default_dialog",defaultSpawn:"default_dialog",defaultSpawnOptions:cn,show:un,hide:pn,pause:dn,resume:ln,isPaused:fn,getMaybeItem:mn,getRemaining:hn,hideAll:wn,resetAll:gn,getCount:On});function vn(){}function yn(n,t){for(const e in t)n[e]=t[e];return n}function _n(n){return n()}function bn(){return Object.create(null)}function Sn(n){n.forEach(_n)}function Pn(n){return"function"==typeof n}function Nn(n,t){return n!=n?t==t:n!==t||n&&"object"==typeof n||"function"==typeof n}function En(n,t,e){n.insertBefore(t,e||null)}function Tn(n){n.parentNode.removeChild(n)}function xn(){return n="",document.createTextNode(n);var n}function Dn(n,t,e){null==e?n.removeAttribute(t):n.setAttribute(t,e)}function In(n,t){for(const e in t)"style"===e?n.style.cssText=t[e]:e in n?n[e]=t[e]:Dn(n,e,t[e])}let Cn;function jn(n){Cn=n}function An(n){(function(){if(!Cn)throw new Error("Function called outside component initialization");return Cn})().$$.on_mount.push(n)}function Fn(){const n=Cn;return(t,e)=>{const i=n.$$.callbacks[t];if(i){const s=function(n,t){const e=document.createEvent("CustomEvent");return e.initCustomEvent(n,!1,!1,t),e}(t,e);i.slice().forEach(t=>{t.call(n,s)})}}}const kn=[],Mn=[],Rn=[],qn=[],Hn=Promise.resolve();let Kn=!1;function Ln(n){Rn.push(n)}function zn(){const n=new Set;do{for(;kn.length;){const n=kn.shift();jn(n),Jn(n.$$)}for(;Mn.length;)Mn.pop()();for(let t=0;t<Rn.length;t+=1){const e=Rn[t];n.has(e)||(e(),n.add(e))}Rn.length=0}while(kn.length);for(;qn.length;)qn.pop()();Kn=!1}function Jn(n){n.fragment&&(n.update(n.dirty),Sn(n.before_update),n.fragment.p(n.dirty,n.ctx),n.dirty=null,n.after_update.forEach(Ln))}const Bn=new Set;let Gn;function Xn(){Gn={r:0,c:[],p:Gn}}function Qn(){Gn.r||Sn(Gn.c),Gn=Gn.p}function Un(n,t){n&&n.i&&(Bn.delete(n),n.i(t))}function Vn(n,t,e,i){if(n&&n.o){if(Bn.has(n))return;Bn.add(n),Gn.c.push(()=>{Bn.delete(n),i&&(e&&n.d(1),i())}),n.o(t)}}function Wn(n,t){Vn(n,1,1,()=>{t.delete(n.key)})}function Yn(n,t){const e={},i={},s={$$scope:1};let o=n.length;for(;o--;){const r=n[o],a=t[o];if(a){for(const n in r)n in a||(i[n]=1);for(const n in a)s[n]||(e[n]=a[n],s[n]=1);n[o]=a}else for(const n in r)s[n]=1}for(const n in i)n in e||(e[n]=void 0);return e}function Zn(n,t,e){const{fragment:i,on_mount:s,on_destroy:o,after_update:r}=n.$$;i.m(t,e),Ln(()=>{const t=s.map(_n).filter(Pn);o?o.push(...t):Sn(t),n.$$.on_mount=[]}),r.forEach(Ln)}function nt(n,t){n.$$.fragment&&(Sn(n.$$.on_destroy),n.$$.fragment.d(t),n.$$.on_destroy=n.$$.fragment=null,n.$$.ctx={})}function tt(n,t){n.$$.dirty||(kn.push(n),Kn||(Kn=!0,Hn.then(zn)),n.$$.dirty=bn()),n.$$.dirty[t]=!0}function et(n,t,e,i,s,o){const r=Cn;jn(n);const a=t.props||{},c=n.$$={fragment:null,ctx:null,props:o,update:vn,not_equal:s,bound:bn(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(r?r.$$.context:[]),callbacks:bn(),dirty:null};let u=!1;c.ctx=e?e(n,a,(t,e)=>{c.ctx&&s(c.ctx[t],c.ctx[t]=e)&&(c.bound[t]&&c.bound[t](e),u&&tt(n,t))}):a,c.update(),u=!0,Sn(c.before_update),c.fragment=i(c.ctx),t.target&&(t.hydrate?c.fragment.l(function(n){return Array.from(n.childNodes)}(t.target)):c.fragment.c(),t.intro&&Un(n.$$.fragment),Zn(n,t.target,t.anchor),zn()),jn(r)}class it{$destroy(){nt(this,1),this.$destroy=vn}$on(n,t){const e=this.$$.callbacks[n]||(this.$$.callbacks[n]=[]);return e.push(t),()=>{const n=e.indexOf(t);-1!==n&&e.splice(n,1)}}$set(){}}const st=[];function ot(n,t=vn){let e;const i=[];function s(t){if(Nn(n,t)&&(n=t,e)){const t=!st.length;for(let t=0;t<i.length;t+=1){const e=i[t];e[1](),st.push(e,n)}if(t){for(let n=0;n<st.length;n+=2)st[n][0](st[n+1]);st.length=0}}}return{set:s,update:function(t){s(t(n))},subscribe:function(o,r=vn){const a=[o,r];return i.push(a),1===i.length&&(e=t(s)||vn),o(n),()=>{const n=i.indexOf(a);-1!==n&&i.splice(n,1),0===i.length&&(e(),e=null)}}}}function rt(n,t,e){const i=!Array.isArray(n),s=i?[n]:n,o=t.length<2;return{subscribe:ot(e,n=>{let e=!1;const r=[];let a=0,c=vn;const u=()=>{if(a)return;c();const e=t(i?r[0]:r,n);o?n(e):c=Pn(e)?e:vn},p=s.map((n,t)=>n.subscribe(n=>{r[t]=n,a&=~(1<<t),e&&u()},()=>{a|=1<<t}));return e=!0,u(),function(){Sn(p),c()}}).subscribe}}const at={...ot(l),...m};l.map(n=>at.set({...n,...m}));const ct=n=>t=>rt(at,()=>m.getCount(n,t)),ut=n=>t=>e=>rt(at,()=>F("isPaused")(n)(t)(e)),pt={...$n,getCount:ct($n.ns),isPaused:n=>ut($n.ns)($n.defaultSpawnOptions)(n)},dt={...rn,getCount:ct(rn.ns),isPaused:n=>ut(rn.ns)(rn.defaultSpawnOptions)(n)},lt=n=>(t,e)=>{const i=m.find(n,t.detail.spawnOptions);i.just&&(i.just.instanceTransitionOptions=t.detail.transitionOptions);const s=m.find(n,t.detail.spawnOptions);s.just&&e(n,s.just)},ft=n=>t=>lt(n)(t,z),mt=n=>t=>lt(n)(t,z),ht=n=>t=>lt(n)(t,J);function wt(n){var t,e,i=[{show:n.show},{hide:n.hide},n.instanceOptions],s=n.transitionOptions.component;function o(n){let t={};for(var e=0;e<i.length;e+=1)t=yn(t,i[e]);return{props:t}}if(s)var r=new s(o());for(var a=[{class:n.R_classNames},n.elementProps],c={},u=0;u<a.length;u+=1)c=yn(c,a[u]);return{c(){var n;n="div",t=document.createElement(n),r&&r.$$.fragment.c(),In(t,c)},m(i,s){En(i,t,s),r&&Zn(r,t,null),n.div_binding(t),e=!0},p(n,e){var c=n.show||n.hide||n.instanceOptions?Yn(i,[n.show&&{show:e.show},n.hide&&{hide:e.hide},n.instanceOptions&&e.instanceOptions]):{};if(s!==(s=e.transitionOptions.component)){if(r){Xn();const n=r;Vn(n.$$.fragment,1,0,()=>{nt(n,1)}),Qn()}s?((r=new s(o())).$$.fragment.c(),Un(r.$$.fragment,1),Zn(r,t,null)):r=null}else s&&r.$set(c);In(t,Yn(a,[n.R_classNames&&{class:e.R_classNames},n.elementProps&&e.elementProps]))},i(n){e||(r&&Un(r.$$.fragment,n),e=!0)},o(n){r&&Vn(r.$$.fragment,n),e=!1},d(e){e&&Tn(t),r&&nt(r),n.div_binding(null)}}}function gt(n,t,e){const i=Fn();let s,{spawnOptions:o,instanceOptions:r,transitionOptions:a}=t;const c=n=>i(n,{spawnOptions:o,transitionOptions:{className:a.className,showClassName:a.showClassName,domElements:{domElement:s}}});let u,p;return An(()=>{c("mount")}),n.$set=n=>{"spawnOptions"in n&&e("spawnOptions",o=n.spawnOptions),"instanceOptions"in n&&e("instanceOptions",r=n.instanceOptions),"transitionOptions"in n&&e("transitionOptions",a=n.transitionOptions)},n.$$.update=(n={transitionOptions:1,instanceOptions:1,R_classNames:1})=>{(n.transitionOptions||n.instanceOptions)&&e("R_classNames",u=[,a.className,r.className].join(" ")),n.R_classNames&&e("elementProps",p={class:u})},{domElement:s,spawnOptions:o,instanceOptions:r,transitionOptions:a,show:()=>{c("show")},hide:()=>{c("hide")},R_classNames:u,elementProps:p,div_binding:function(n){Mn[n?"unshift":"push"](()=>{e("domElement",s=n)})}}}class Ot extends it{constructor(n){super(),et(this,n,gt,wt,Nn,["spawnOptions","instanceOptions","transitionOptions"])}}function $t(n,t,e){const i=Object.create(n);return i.spawnOptions=t[e].spawnOptions,i.transitionOptions=t[e].transitionOptions,i.instanceOptions=t[e].instanceOptions,i.key=t[e].key,i.index=e,i}function vt(n,t){var e,i,s=new Ot({props:{spawnOptions:t.spawnOptions,transitionOptions:t.transitionOptions,instanceOptions:t.instanceOptions}});return s.$on("mount",t.nsOnInstanceMounted),s.$on("show",t.nsOnShowInstance),s.$on("hide",t.nsOnHideInstance),{key:n,first:null,c(){e=xn(),s.$$.fragment.c(),this.first=e},m(n,t){En(n,e,t),Zn(s,n,t),i=!0},p(n,t){var e={};(n.filter||n.ns||n.$appState||n.spawnOptions)&&(e.spawnOptions=t.spawnOptions),(n.filter||n.ns||n.$appState||n.spawnOptions)&&(e.transitionOptions=t.transitionOptions),(n.filter||n.ns||n.$appState||n.spawnOptions)&&(e.instanceOptions=t.instanceOptions),s.$set(e)},i(n){i||(Un(s.$$.fragment,n),i=!0)},o(n){Vn(s.$$.fragment,n),i=!1},d(n){n&&Tn(e),nt(s,n)}}}function yt(n){var t,e,i=[],s=new Map,o=E(n.ns,n.$appState.store,n.spawnOptions.spawn);const r=n=>n.key;for(var a=0;a<o.length;a+=1){let t=$t(n,o,a),e=r(t);s.set(e,i[a]=vt(e,t))}return{c(){for(a=0;a<i.length;a+=1)i[a].c();t=xn()},m(n,s){for(a=0;a<i.length;a+=1)i[a].m(n,s);En(n,t,s),e=!0},p(n,e){const o=E(e.ns,e.$appState.store,e.spawnOptions.spawn);Xn(),i=function(n,t,e,i,s,o,r,a,c,u,p,d){let l=n.length,f=o.length,m=l;const h={};for(;m--;)h[n[m].key]=m;const w=[],g=new Map,O=new Map;for(m=f;m--;){const n=d(s,o,m),a=e(n);let c=r.get(a);c?i&&c.p(t,n):(c=u(a,n)).c(),g.set(a,w[m]=c),a in h&&O.set(a,Math.abs(m-h[a]))}const $=new Set,v=new Set;function y(n){Un(n,1),n.m(a,p),r.set(n.key,n),p=n.first,f--}for(;l&&f;){const t=w[f-1],e=n[l-1],i=t.key,s=e.key;t===e?(p=t.first,l--,f--):g.has(s)?!r.has(i)||$.has(i)?y(t):v.has(s)?l--:O.get(i)>O.get(s)?(v.add(i),y(t)):($.add(s),l--):(c(e,r),l--)}for(;l--;){const t=n[l];g.has(t.key)||c(t,r)}for(;f;)y(w[f-1]);return w}(i,n,r,1,e,o,s,t.parentNode,Wn,vt,t,$t),Qn()},i(n){if(!e){for(var t=0;t<o.length;t+=1)Un(i[t]);e=!0}},o(n){for(a=0;a<i.length;a+=1)Vn(i[a]);e=!1},d(n){for(a=0;a<i.length;a+=1)i[a].d(n);n&&Tn(t)}}}function _t(n,t,e){let i;!function(n,t,e){n.$$.on_destroy.push(function(n,t){const e=n.subscribe(t);return e.unsubscribe?()=>e.unsubscribe():e}(t,e))}(n,at,n=>{e("$appState",i=n)});let{spawnOptions:s,ns:o}=t;const r=ft(o),a=mt(o),c=ht(o);return n.$set=n=>{"spawnOptions"in n&&e("spawnOptions",s=n.spawnOptions),"ns"in n&&e("ns",o=n.ns)},{spawnOptions:s,ns:o,nsOnInstanceMounted:r,nsOnShowInstance:a,nsOnHideInstance:c,$appState:i}}class bt extends it{constructor(n){super(),et(this,n,_t,yt,Nn,["spawnOptions","ns"])}}function St(n){var t,e=new bt({props:{spawnOptions:n.spawnOptions,ns:pt.ns}});return{c(){e.$$.fragment.c()},m(n,i){Zn(e,n,i),t=!0},p(n,t){var i={};n.spawnOptions&&(i.spawnOptions=t.spawnOptions),n.dialog&&(i.ns=pt.ns),e.$set(i)},i(n){t||(Un(e.$$.fragment,n),t=!0)},o(n){Vn(e.$$.fragment,n),t=!1},d(n){nt(e,n)}}}function Pt(n,t,e){let{spawn:i=pt.defaultSpawn,id:s=pt.defaultId}=t;const o={id:s,spawn:i};return n.$set=n=>{"spawn"in n&&e("spawn",i=n.spawn),"id"in n&&e("id",s=n.id)},{spawn:i,id:s,spawnOptions:o}}function Nt(n){var t,e=new bt({props:{Instance:Ot,spawnOptions:n.spawnOptions,ns:dt.ns}});return{c(){e.$$.fragment.c()},m(n,i){Zn(e,n,i),t=!0},p(n,t){var i={};n.Instance&&(i.Instance=Ot),n.spawnOptions&&(i.spawnOptions=t.spawnOptions),n.notification&&(i.ns=dt.ns),e.$set(i)},i(n){t||(Un(e.$$.fragment,n),t=!0)},o(n){Vn(e.$$.fragment,n),t=!1},d(n){nt(e,n)}}}function Et(n,t,e){let{spawn:i=dt.defaultSpawn,id:s=dt.defaultId}=t;const o={id:s,spawn:i};return n.$set=n=>{"spawn"in n&&e("spawn",i=n.spawn),"id"in n&&e("id",s=n.id)},{spawn:i,id:s,spawnOptions:o}}n.Dialog=class extends it{constructor(n){super(),et(this,n,Pt,St,Nn,["spawn","id"])}},n.Notification=class extends it{constructor(n){super(),et(this,n,Et,Nt,Nn,["spawn","id"])}},n.dialog=pt,n.notification=dt,Object.defineProperty(n,"__esModule",{value:!0})});
//# sourceMappingURL=dialogic-svelte.js.map
