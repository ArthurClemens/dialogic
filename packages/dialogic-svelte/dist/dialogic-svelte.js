!function(t,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n((t=t||self)["dialogic-svelte"]={})}(this,(function(t){"use strict";const n=(...t)=>n=>t.filter(Boolean).reduce((t,n)=>n(t),n),e=({domElement:t,prop:n})=>{if(window.getComputedStyle){const e=document.defaultView;if(e){const i=e.getComputedStyle(t);if(i)return i.getPropertyValue(n)}}},i="show",o="hide",s=(t,n,e)=>{const i=e[n]||{};Object.keys(i).forEach(n=>{const e=i[n].toString();t.style[n]=e})},r=(t,n)=>t.split(/ /).map(t=>`${t}-${n}`),a=(t,n,e,i)=>{if(n.styles){const o=((t,n)=>("function"==typeof n?n(t):n)||{})(t,n.styles);s(t,"default",o),i&&(t=>t.style.transitionDuration="0ms")(t),s(t,e,o)}if(n.className){const i={showStart:r(n.className,"show-start"),showEnd:r(n.className,"show-end"),hideStart:r(n.className,"hide-start"),hideEnd:r(n.className,"hide-end")};((t,n)=>t.classList.remove(...n.showStart,...n.showEnd,...n.hideStart,...n.hideEnd))(t,i),i&&t.classList.add(...i[e])}t.scrollTop},c={showStart:{nextStep:"showEnd"},showEnd:{nextStep:void 0},hideStart:{nextStep:"hideEnd"},hideEnd:{nextStep:void 0}},u=(t,n)=>{const o=t.domElement;if(!o)return Promise.resolve("no domElement");let s=n===i?"showStart":"hideStart";return new Promise(n=>{a(o,t,s,"showStart"===s),setTimeout(()=>{const i=c[s].nextStep;if(i){a(o,t,s=i);const r=(t=>{const n=e({domElement:t,prop:"transition-duration"}),i=void 0!==n?d(n):0,o=e({domElement:t,prop:"transition-delay"});return i+(void 0!==o?d(o):0)})(o);setTimeout(n,r)}},0)})},d=t=>{const n=parseFloat(t)*(-1===t.indexOf("ms")?1e3:1);return isNaN(n)?0:n};var p=function(t,n){return t(n={exports:{}},n.exports),n.exports}((function(t){!function(){e.SKIP={},e.lift=function(){var t=arguments[0];return o(Array.prototype.slice.call(arguments,1)).map((function(n){return t.apply(void 0,n)}))},e.scan=function(t,n,i){var o=i.map((function(i){var o=t(n,i);return o!==e.SKIP&&(n=o),o}));return o(n),o},e.merge=o,e.combine=i,e.scanMerge=function(t,n){var e=t.map((function(t){return t[0]})),o=i((function(){var i=arguments[arguments.length-1];return e.forEach((function(e,o){i.indexOf(e)>-1&&(n=t[o][1](n,e()))})),n}),e);return o(n),o},e["fantasy-land/of"]=e;var n=!1;function e(t){var n,o=[],r=[];function a(n){return arguments.length&&n!==e.SKIP&&(t=n,s(a)&&(a._changing(),a._state="active",o.forEach((function(n,e){n(r[e](t))})))),t}return a.constructor=e,a._state=arguments.length&&t!==e.SKIP?"active":"pending",a._parents=[],a._changing=function(){s(a)&&(a._state="changing"),o.forEach((function(t){t._changing()}))},a._map=function(n,i){var s=i?e():e(n(t));return s._parents.push(a),o.push(s),r.push(n),s},a.map=function(t){return a._map(t,"active"!==a._state)},a.toJSON=function(){return null!=t&&"function"==typeof t.toJSON?t.toJSON():t},a["fantasy-land/map"]=a.map,a["fantasy-land/ap"]=function(t){return i((function(t,n){return t()(n())}),[t,a])},a._unregisterChild=function(t){var n=o.indexOf(t);-1!==n&&(o.splice(n,1),r.splice(n,1))},Object.defineProperty(a,"end",{get:function(){return n||((n=e()).map((function(t){return!0===t&&(a._parents.forEach((function(t){t._unregisterChild(a)})),a._state="ended",a._parents.length=o.length=r.length=0),t})),n)}}),a}function i(t,n){var i=n.every((function(t){if(t.constructor!==e)throw new Error("Ensure that each item passed to stream.combine/stream.merge/lift is a stream");return"active"===t._state})),o=i?e(t.apply(null,n.concat([n]))):e(),s=[],r=n.map((function(e){return e._map((function(r){return s.push(e),(i||n.every((function(t){return"pending"!==t._state})))&&(i=!0,o(t.apply(null,n.concat([s]))),s=[]),r}),!0)})),a=o.end.map((function(t){!0===t&&(r.forEach((function(t){t.end(!0)})),a.end(!0))}));return o}function o(t){return i((function(){return t.map((function(t){return t()}))}),t)}function s(t){return"pending"===t._state||"active"===t._state||"changing"===t._state}Object.defineProperty(e,"HALT",{get:function(){return n||console.log("HALT is deprecated and has been renamed to SKIP"),n=!0,e.SKIP}}),t.exports=e}()}));const l=(t,n)=>{const e=((t,n)=>n.find(n=>n.id===t))(t,n);return n.indexOf(e)},f=(t,n)=>[n,t.id,t.spawn].filter(Boolean).join("-"),m={initialState:{store:{}},actions:t=>({add:(n,e)=>{t(i=>{const o=i.store[n]||[];return i.store[n]=[...o,e],e.timer&&e.timer.states.map(()=>m.actions(t).refresh()),i})},remove:(n,e)=>{t(t=>{const i=t.store[n]||[],o=((t,n)=>{const e=l(t,n);return-1!==e&&n.splice(e,1),n})(e,i);return t.store[n]=o,t})},replace:(n,e,i)=>{t(t=>{const o=t.store[n]||[];if(o){const s=l(e,o);-1!==s&&(o[s]=i,t.store[n]=[...o])}return t})},removeAll:n=>{t(t=>(t.store[n]=[],t))},store:(n,e)=>{t(t=>(t.store[n]=[...e],t))},refresh:()=>{t(t=>({...t}))}}),selectors:t=>{const n={getStore:()=>{return t().store},find:(n,e)=>{const i=t().store[n]||[],o=f(e,n),s=i.find(t=>t.id===o);return s?{just:s}:{nothing:void 0}},getAll:(n,e)=>{const i=t().store[n]||[],o=void 0!==e?e.spawn:void 0,s=void 0!==e?e.id:void 0,r=void 0!==o?i.filter(t=>t.identityOptions.spawn===o):i;return void 0!==s?r.filter(t=>t.identityOptions.id===s):r},getCount:(t,e)=>n.getAll(t,e).length};return n}},h=p(),g=p.scan((t,n)=>n(t),{...m.initialState},h),$={...m.actions(h)},O={...m.selectors(g)},y={callback:()=>{},isPaused:!1,onAbort:()=>{},onDone:()=>{},promise:void 0,remaining:0,startTime:void 0,timeoutFn:()=>{},timerId:void 0},w=(t,n,e,i)=>{const o=()=>{n(),t.onDone(),i()};return{timeoutFn:o,promise:new Promise((n,e)=>{t.onDone=()=>n(),t.onAbort=()=>n()}),...t.isPaused?{}:{startTime:(new Date).getTime(),timerId:window.setTimeout(o,e),remaining:e}}},v=t=>(window.clearTimeout(t.timerId),{timerId:y.timerId}),S=t=>({...v(t)}),b=t=>({...v(t),isPaused:!0,remaining:E(t)}),_=(t,n)=>{window.clearTimeout(t.timerId);const e=n?Math.max(t.remaining||0,n):t.remaining;return{startTime:(new Date).getTime(),isPaused:!1,remaining:e,timerId:window.setTimeout(t.timeoutFn,e)}},E=t=>0===t.remaining?0:t.remaining-((new Date).getTime()-(t.startTime||0)),T=()=>{const t={initialState:y,actions:n=>({start:(e,i)=>{n(o=>({...o,...v(o),...w(o,e,i,()=>t.actions(n).done()),...o.isPaused&&b(o)}))},stop:()=>{n(t=>({...t,...S(t),...y}))},pause:()=>{n(t=>({...t,...!t.isPaused&&b(t)}))},resume:t=>{n(n=>({...n,...n.isPaused&&_(n,t)}))},abort:()=>{n(t=>(t.onAbort(),{...t,...v(t)}))},done:()=>{n(t=>y)},refresh:()=>{n(t=>({...t}))}}),selectors:t=>({isPaused:()=>{return t().isPaused},getRemaining:()=>{const n=t();return n.isPaused?n.remaining:E(n)},getResultPromise:()=>{return t().promise}})},n=p(),e=p.scan((t,n)=>n(t),{...t.initialState},n);return{states:e,actions:{...t.actions(n)},selectors:{...t.selectors(e)}}};let P=0;const x=()=>P===Number.MAX_SAFE_INTEGER?0:P++,j=0,k=1,I=2,A=t=>n=>void 0!==t.spawn?n.filter(n=>n.identityOptions.spawn===t.spawn):n,N=t=>{let n=0;return t.map(t=>({item:t,queueCount:t.dialogicOptions.queued?n++:0})).filter(({queueCount:t})=>0===t).map(({item:t})=>t)},M=(t,e,i)=>{const o=e[t]||[];return 0==o.length?[]:n(A(i),N)(o)},C=(t,n={})=>({id:n.id||t.id,spawn:n.spawn||t.spawn}),D=(t,n={})=>{const e={id:n.dialogic?n.dialogic.id:void 0,spawn:n.dialogic?n.dialogic.spawn:void 0};return{identityOptions:C(t||{},e),dialogicOptions:{...t,...n.dialogic},passThroughOptions:(t=>{const n={...t};return delete n.dialogic,n})(n)}},q=t=>n=>(e={})=>{const{identityOptions:i,dialogicOptions:o,passThroughOptions:s}=D(n,e);return new Promise(r=>{const a={didShow:t=>(o.didShow&&o.didShow(t),r(t)),didHide:t=>(o.didHide&&o.didHide(t),r(t))},c={ns:t,identityOptions:i,dialogicOptions:o,callbacks:a,passThroughOptions:s,id:f(i,t),timer:o.timeout?T():void 0,key:x().toString(),transitionState:j},u=O.find(t,i);if(u.just&&o.toggle){const i=H(t)(n)(e);return r(i)}if(u.just&&!o.queued){const n=u.just,e=n.dialogicOptions,i={...c,transitionState:n.transitionState,dialogicOptions:e};$.replace(t,n.id,i)}else $.add(t,c);r(c)})},H=t=>n=>e=>{const{identityOptions:i,dialogicOptions:o,passThroughOptions:s}=D(n,e),r=O.find(t,i);if(r.just){const n=r.just,e={...n,dialogicOptions:{...n.dialogicOptions,...o},passThroughOptions:{...n.passThroughOptions,passThroughOptions:s}};return $.replace(t,n.id,e),e.transitionState!==I?Y(e):Promise.resolve(e)}return Promise.resolve()},F=t=>n=>n=>{const e=V(t,n).filter(t=>!!t.timer);return e.forEach(t=>t.timer&&t.timer.actions.pause()),Promise.all(e)},K=t=>n=>n=>{const e=n||{},i={id:e.id,spawn:e.spawn},o=V(t,i).filter(t=>!!t.timer);return o.forEach(t=>t.timer&&t.timer.actions.resume(e.minimumDuration)),Promise.all(o)},R=(t,n)=>e=>i=>o=>{const s=(t=>n=>e=>O.find(t,C(n,e)))(e)(i)(o);return s.just&&s.just&&s.just.timer?s.just.timer.selectors[t]():n},L=R("isPaused",!1),B=R("getRemaining",0),J=t=>n=>n=>!!V(t,n).length,V=(t,e)=>{const i=O.getAll(t);let o;return o=e?n(A(e),(t=>n=>void 0!==t.id?n.filter(n=>n.identityOptions.id===t.id):n)(e))(i):i},z=t=>n=>n=>{const e=V(t,n),i=[];return e.forEach(t=>{t.timer&&t.timer.actions.abort(),i.push(t)}),n?i.forEach(n=>{$.remove(t,n.id)}):$.removeAll(t),Promise.resolve(i)},G=(t,n)=>({...t,dialogicOptions:{...t.dialogicOptions,...n}}),X=t=>n=>n=>{const e=n||{},i={id:e.id,spawn:e.spawn},o=V(t,i),s=o.filter(t=>!e.queued&&!t.dialogicOptions.queued),r=o.filter(t=>e.queued||t.dialogicOptions.queued),a=[];if(s.forEach(t=>a.push(Y(G(t,e)))),r.length>0){const[n]=r;$.store(t,[n]),a.push(Y(G(n,e)))}return Promise.all(a)},Q=t=>n=>O.getCount(t,n),U=(t,n)=>u(t.dialogicOptions,n),W=async function(t){return t.transitionState!==k&&(t.transitionState=k,await U(t,i)),t.callbacks.didShow&&await t.callbacks.didShow(t),t.dialogicOptions.timeout&&t.timer&&await async function(t,n,e){return n.actions.start(()=>Y(t),e),R("getResultPromise",void 0)}(t,t.timer,t.dialogicOptions.timeout),Promise.resolve(t)},Y=async function(t){t.transitionState=I,t.timer&&t.timer.actions.stop(),await U(t,o),t.callbacks.didHide&&await t.callbacks.didHide(t);const n={...t};return $.remove(t.ns,t.id),Promise.resolve(n)},Z=({ns:t,queued:n,timeout:e})=>{const i=`default_${t}`,o=`default_${t}`,s={id:i,spawn:o,...n&&{queued:n},...void 0!==e&&{timeout:e}};return{ns:t,defaultId:i,defaultSpawn:o,defaultDialogicOptions:s,show:q(t)(s),hide:H(t)(s),hideAll:X(t)(s),resetAll:z(t)(s),pause:F(t)(s),resume:K(t)(s),exists:J(t)(s),getCount:Q(t),isPaused:L(t)(s),getRemaining:B(t)(s)}},tt=Z({ns:"dialog"}),nt=Z({ns:"notification",queued:!0,timeout:3e3});function et(){}function it(t,n){for(const e in n)t[e]=n[e];return t}function ot(t){return t()}function st(){return Object.create(null)}function rt(t){t.forEach(ot)}function at(t){return"function"==typeof t}function ct(t,n){return t!=t?n==n:t!==n||t&&"object"==typeof t||"function"==typeof t}function ut(t){const n={};for(const e in t)"$"!==e[0]&&(n[e]=t[e]);return n}function dt(t,n,e){t.insertBefore(n,e||null)}function pt(t){t.parentNode.removeChild(t)}function lt(){return t="",document.createTextNode(t);var t}let ft;function mt(t){ft=t}function ht(t){(function(){if(!ft)throw new Error("Function called outside component initialization");return ft})().$$.on_mount.push(t)}function gt(){const t=ft;return(n,e)=>{const i=t.$$.callbacks[n];if(i){const o=function(t,n){const e=document.createEvent("CustomEvent");return e.initCustomEvent(t,!1,!1,n),e}(n,e);i.slice().forEach(n=>{n.call(t,o)})}}}const $t=[],Ot=[],yt=[],wt=[],vt=Promise.resolve();let St=!1;function bt(t){yt.push(t)}function _t(){const t=new Set;do{for(;$t.length;){const t=$t.shift();mt(t),Et(t.$$)}for(;Ot.length;)Ot.pop()();for(let n=0;n<yt.length;n+=1){const e=yt[n];t.has(e)||(e(),t.add(e))}yt.length=0}while($t.length);for(;wt.length;)wt.pop()();St=!1}function Et(t){t.fragment&&(t.update(t.dirty),rt(t.before_update),t.fragment.p(t.dirty,t.ctx),t.dirty=null,t.after_update.forEach(bt))}const Tt=new Set;let Pt;function xt(){Pt={r:0,c:[],p:Pt}}function jt(){Pt.r||rt(Pt.c),Pt=Pt.p}function kt(t,n){t&&t.i&&(Tt.delete(t),t.i(n))}function It(t,n,e,i){if(t&&t.o){if(Tt.has(t))return;Tt.add(t),Pt.c.push(()=>{Tt.delete(t),i&&(e&&t.d(1),i())}),t.o(n)}}function At(t,n){It(t,1,1,()=>{n.delete(t.key)})}function Nt(t,n){const e={},i={},o={$$scope:1};let s=t.length;for(;s--;){const r=t[s],a=n[s];if(a){for(const t in r)t in a||(i[t]=1);for(const t in a)o[t]||(e[t]=a[t],o[t]=1);t[s]=a}else for(const t in r)o[t]=1}for(const t in i)t in e||(e[t]=void 0);return e}function Mt(t){return"object"==typeof t&&null!==t?t:{}}function Ct(t,n,e){const{fragment:i,on_mount:o,on_destroy:s,after_update:r}=t.$$;i.m(n,e),bt(()=>{const n=o.map(ot).filter(at);s?s.push(...n):rt(n),t.$$.on_mount=[]}),r.forEach(bt)}function Dt(t,n){t.$$.fragment&&(rt(t.$$.on_destroy),t.$$.fragment.d(n),t.$$.on_destroy=t.$$.fragment=null,t.$$.ctx={})}function qt(t,n){t.$$.dirty||($t.push(t),St||(St=!0,vt.then(_t)),t.$$.dirty=st()),t.$$.dirty[n]=!0}function Ht(t,n,e,i,o,s){const r=ft;mt(t);const a=n.props||{},c=t.$$={fragment:null,ctx:null,props:s,update:et,not_equal:o,bound:st(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(r?r.$$.context:[]),callbacks:st(),dirty:null};let u=!1;c.ctx=e?e(t,a,(n,e,i=e)=>(c.ctx&&o(c.ctx[n],c.ctx[n]=i)&&(c.bound[n]&&c.bound[n](i),u&&qt(t,n)),e)):a,c.update(),u=!0,rt(c.before_update),c.fragment=i(c.ctx),n.target&&(n.hydrate?c.fragment.l(function(t){return Array.from(t.childNodes)}(n.target)):c.fragment.c(),n.intro&&kt(t.$$.fragment),Ct(t,n.target,n.anchor),_t()),mt(r)}class Ft{$destroy(){Dt(this,1),this.$destroy=et}$on(t,n){const e=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return e.push(n),()=>{const t=e.indexOf(n);-1!==t&&e.splice(t,1)}}$set(){}}const Kt=[];function Rt(t,n=et){let e;const i=[];function o(n){if(ct(t,n)&&(t=n,e)){const n=!Kt.length;for(let n=0;n<i.length;n+=1){const e=i[n];e[1](),Kt.push(e,t)}if(n){for(let t=0;t<Kt.length;t+=2)Kt[t][0](Kt[t+1]);Kt.length=0}}}return{set:o,update:function(n){o(n(t))},subscribe:function(s,r=et){const a=[s,r];return i.push(a),1===i.length&&(e=n(o)||et),s(t),()=>{const t=i.indexOf(a);-1!==t&&i.splice(t,1),0===i.length&&(e(),e=null)}}}}function Lt(t,n,e){const i=!Array.isArray(t),o=i?[t]:t,s=n.length<2;return{subscribe:Rt(e,t=>{let e=!1;const r=[];let a=0,c=et;const u=()=>{if(a)return;c();const e=n(i?r[0]:r,t);s?t(e):c=at(e)?e:et},d=o.map((t,n)=>t.subscribe(t=>{r[n]=t,a&=~(1<<n),e&&u()},()=>{a|=1<<n}));return e=!0,u(),function(){rt(d),c()}}).subscribe}}const Bt={...Rt(g),...O};g.map(t=>Bt.set({...t,...O}));const Jt=t=>n=>Lt(Bt,()=>O.getCount(t,n)),Vt=t=>n=>e=>Lt(Bt,()=>R("isPaused")(t)(n)(e)),zt=t=>n=>e=>Lt(Bt,()=>J(t)(n)(e)),Gt={...tt,getCount:t=>Jt(tt.ns)(t),isPaused:t=>Vt(tt.ns)(tt.defaultDialogicOptions)(t),exists:t=>zt(tt.ns)(tt.defaultDialogicOptions)(t)},Xt={...nt,getCount:t=>Jt(nt.ns)(t),isPaused:t=>Vt(nt.ns)(nt.defaultDialogicOptions)(t),exists:t=>zt(nt.ns)(nt.defaultDialogicOptions)(t)},Qt=t=>(n,e)=>{const i=O.find(t,n.detail.identityOptions);i.just&&((t,n)=>{n.dialogicOptions.domElement=t})(n.detail.domElement,i.just);const o=O.find(t,n.detail.identityOptions);o.just&&e(o.just)},Ut=t=>n=>Qt(t)(n,W),Wt=t=>n=>Qt(t)(n,W),Yt=t=>n=>Qt(t)(n,Y);function Zt(t){var n,e,i=[{show:t.show},{hide:t.hide},t.passThroughOptions],o=t.dialogicOptions.component;function s(t){let n={};for(var e=0;e<i.length;e+=1)n=it(n,i[e]);return{props:n}}if(o)var r=new o(s());return{c(){var e,i,o,s;e="div",n=document.createElement(e),r&&r.$$.fragment.c(),i=n,o="class",null==(s=t.className)?i.removeAttribute(o):i.setAttribute(o,s)},m(i,o){dt(i,n,o),r&&Ct(r,n,null),t.div_binding(n),e=!0},p(t,e){var a=t.show||t.hide||t.passThroughOptions?Nt(i,[t.show&&{show:e.show},t.hide&&{hide:e.hide},t.passThroughOptions&&Mt(e.passThroughOptions)]):{};if(o!==(o=e.dialogicOptions.component)){if(r){xt();const t=r;It(t.$$.fragment,1,0,()=>{Dt(t,1)}),jt()}o?((r=new o(s())).$$.fragment.c(),kt(r.$$.fragment,1),Ct(r,n,null)):r=null}else o&&r.$set(a)},i(t){e||(r&&kt(r.$$.fragment,t),e=!0)},o(t){r&&It(r.$$.fragment,t),e=!1},d(e){e&&pt(n),r&&Dt(r),t.div_binding(null)}}}function tn(t,n,e){const i=gt();let o,{identityOptions:s,passThroughOptions:r,dialogicOptions:a}=n;const c=a?a.className:"",u=t=>i(t,{identityOptions:s,domElement:o});return ht(()=>{u("mount")}),t.$set=t=>{"identityOptions"in t&&e("identityOptions",s=t.identityOptions),"passThroughOptions"in t&&e("passThroughOptions",r=t.passThroughOptions),"dialogicOptions"in t&&e("dialogicOptions",a=t.dialogicOptions)},{domElement:o,identityOptions:s,passThroughOptions:r,dialogicOptions:a,className:c,show:()=>{u("show")},hide:()=>{u("hide")},div_binding:function(t){Ot[t?"unshift":"push"](()=>{e("domElement",o=t)})}}}class nn extends Ft{constructor(t){super(),Ht(this,t,tn,Zt,ct,["identityOptions","passThroughOptions","dialogicOptions"])}}function en(t,n,e){const i=Object.create(t);return i.identityOptions=n[e].identityOptions,i.dialogicOptions=n[e].dialogicOptions,i.passThroughOptions=n[e].passThroughOptions,i.key=n[e].key,i.index=e,i}function on(t,n){var e,i,o=new nn({props:{identityOptions:n.identityOptions,dialogicOptions:n.dialogicOptions,passThroughOptions:n.passThroughOptions}});return o.$on("mount",n.nsOnInstanceMounted),o.$on("show",n.nsOnShowInstance),o.$on("hide",n.nsOnHideInstance),{key:t,first:null,c(){e=lt(),o.$$.fragment.c(),this.first=e},m(t,n){dt(t,e,n),Ct(o,t,n),i=!0},p(t,n){var e={};(t.ns||t.$appState||t.identityOptions)&&(e.identityOptions=n.identityOptions),(t.ns||t.$appState||t.identityOptions)&&(e.dialogicOptions=n.dialogicOptions),(t.ns||t.$appState||t.identityOptions)&&(e.passThroughOptions=n.passThroughOptions),o.$set(e)},i(t){i||(kt(o.$$.fragment,t),i=!0)},o(t){It(o.$$.fragment,t),i=!1},d(t){t&&pt(e),Dt(o,t)}}}function sn(t){var n,e,i=[],o=new Map;let s=M(t.ns,t.$appState.store,t.identityOptions);const r=t=>t.key;for(let n=0;n<s.length;n+=1){let e=en(t,s,n),a=r(e);o.set(a,i[n]=on(a,e))}return{c(){for(let t=0;t<i.length;t+=1)i[t].c();n=lt()},m(t,o){for(let n=0;n<i.length;n+=1)i[n].m(t,o);dt(t,n,o),e=!0},p(t,e){const s=M(e.ns,e.$appState.store,e.identityOptions);xt(),i=function(t,n,e,i,o,s,r,a,c,u,d,p){let l=t.length,f=s.length,m=l;const h={};for(;m--;)h[t[m].key]=m;const g=[],$=new Map,O=new Map;for(m=f;m--;){const t=p(o,s,m),a=e(t);let c=r.get(a);c?i&&c.p(n,t):(c=u(a,t)).c(),$.set(a,g[m]=c),a in h&&O.set(a,Math.abs(m-h[a]))}const y=new Set,w=new Set;function v(t){kt(t,1),t.m(a,d),r.set(t.key,t),d=t.first,f--}for(;l&&f;){const n=g[f-1],e=t[l-1],i=n.key,o=e.key;n===e?(d=n.first,l--,f--):$.has(o)?!r.has(i)||y.has(i)?v(n):w.has(o)?l--:O.get(i)>O.get(o)?(w.add(i),v(n)):(y.add(o),l--):(c(e,r),l--)}for(;l--;){const n=t[l];$.has(n.key)||c(n,r)}for(;f;)v(g[f-1]);return g}(i,t,r,1,e,s,o,n.parentNode,At,on,n,en),jt()},i(t){if(!e){for(let t=0;t<s.length;t+=1)kt(i[t]);e=!0}},o(t){for(let t=0;t<i.length;t+=1)It(i[t]);e=!1},d(t){for(let n=0;n<i.length;n+=1)i[n].d(t);t&&pt(n)}}}function rn(t,n,e){let i;!function(t,n,e){t.$$.on_destroy.push(function(t,n){const e=t.subscribe(n);return e.unsubscribe?()=>e.unsubscribe():e}(n,e))}(t,Bt,t=>{e("$appState",i=t)});let{identityOptions:o,ns:s}=n;const r=Ut(s),a=Wt(s),c=Yt(s);return t.$set=t=>{"identityOptions"in t&&e("identityOptions",o=t.identityOptions),"ns"in t&&e("ns",s=t.ns)},{identityOptions:o,ns:s,nsOnInstanceMounted:r,nsOnShowInstance:a,nsOnHideInstance:c,$appState:i}}class an extends Ft{constructor(t){super(),Ht(this,t,rn,sn,ct,["identityOptions","ns"])}}function cn(t){var n,e=new an({props:{identityOptions:t.identityOptions,ns:t.ns}});return{c(){e.$$.fragment.c()},m(t,i){Ct(e,t,i),n=!0},p(t,n){var i={};t.ns&&(i.ns=n.ns),e.$set(i)},i(t){n||(kt(e.$$.fragment,t),n=!0)},o(t){It(e.$$.fragment,t),n=!1},d(t){Dt(e,t)}}}function un(t,n,e){let{type:i,ns:o=i.ns,spawn:s,id:r,onMount:a}=n;const c={id:r||i.defaultId,spawn:s||i.defaultSpawn};return ht(()=>{"function"==typeof a&&a()}),t.$set=t=>{"type"in t&&e("type",i=t.type),"ns"in t&&e("ns",o=t.ns),"spawn"in t&&e("spawn",s=t.spawn),"id"in t&&e("id",r=t.id),"onMount"in t&&e("onMount",a=t.onMount)},{type:i,ns:o,spawn:s,id:r,onMount:a,identityOptions:c}}class dn extends Ft{constructor(t){super(),Ht(this,t,un,cn,ct,["type","ns","spawn","id","onMount"])}}function pn(t){var n,e=[t.$$props,{type:Gt}];let i={};for(var o=0;o<e.length;o+=1)i=it(i,e[o]);var s=new dn({props:i});return{c(){s.$$.fragment.c()},m(t,e){Ct(s,t,e),n=!0},p(t,n){var i=t.$$props||t.dialog?Nt(e,[t.$$props&&Mt(n.$$props),t.dialog&&{type:Gt}]):{};s.$set(i)},i(t){n||(kt(s.$$.fragment,t),n=!0)},o(t){It(s.$$.fragment,t),n=!1},d(t){Dt(s,t)}}}function ln(t,n,e){return t.$set=t=>{e("$$props",n=it(it({},n),t))},{$$props:n,$$props:n=ut(n)}}function fn(t){var n,e=[t.$$props,{type:Xt}];let i={};for(var o=0;o<e.length;o+=1)i=it(i,e[o]);var s=new dn({props:i});return{c(){s.$$.fragment.c()},m(t,e){Ct(s,t,e),n=!0},p(t,n){var i=t.$$props||t.notification?Nt(e,[t.$$props&&Mt(n.$$props),t.notification&&{type:Xt}]):{};s.$set(i)},i(t){n||(kt(s.$$.fragment,t),n=!0)},o(t){It(s.$$.fragment,t),n=!1},d(t){Dt(s,t)}}}function mn(t,n,e){return t.$set=t=>{e("$$props",n=it(it({},n),t))},{$$props:n,$$props:n=ut(n)}}t.Dialog=class extends Ft{constructor(t){super(),Ht(this,t,ln,pn,ct,[])}},t.Dialogical=dn,t.Notification=class extends Ft{constructor(t){super(),Ht(this,t,mn,fn,ct,[])}},t.dialog=Gt,t.notification=Xt,Object.defineProperty(t,"__esModule",{value:!0})}));
//# sourceMappingURL=dialogic-svelte.js.map
