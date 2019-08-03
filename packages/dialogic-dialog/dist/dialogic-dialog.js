!function(n,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((n=n||self)["dialogic-dialog"]={})}(this,function(n){"use strict";function t(n,t){return n(t={exports:{}},t.exports),t.exports}for(var e=t(function(n){var t="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof window.msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto);if(t){var e=new Uint8Array(16);n.exports=function(){return t(e),e}}else{var i=new Array(16);n.exports=function(){for(var n,t=0;t<16;t++)0==(3&t)&&(n=4294967296*Math.random()),i[t]=n>>>((3&t)<<3)&255;return i}}}),i=[],o=0;o<256;++o)i[o]=(o+256).toString(16).substr(1);var r=function(n,t){var e=t||0,o=i;return[o[n[e++]],o[n[e++]],o[n[e++]],o[n[e++]],"-",o[n[e++]],o[n[e++]],"-",o[n[e++]],o[n[e++]],"-",o[n[e++]],o[n[e++]],"-",o[n[e++]],o[n[e++]],o[n[e++]],o[n[e++]],o[n[e++]],o[n[e++]]].join("")};var s=function(n,t,i){var o=t&&i||0;"string"==typeof n&&(t="binary"===n?new Array(16):null,n=null);var s=(n=n||{}).random||(n.rng||e)();if(s[6]=15&s[6]|64,s[8]=63&s[8]|128,t)for(var a=0;a<16;++a)t[o+a]=s[a];return t||r(s)};const a="show",u="hide",c={showDuration:!0,showDelay:!0,showTimingFunction:!0,hideDuration:!0,hideDelay:!0,hideTimingFunction:!0,transitions:!0,transitionClass:!0,showClass:!0,didShow:!0,didHide:!0,timeout:!0},d=(n,t)=>{const e=n.domElements?n.domElements.domElement:null;return e?new Promise(i=>{const o=e.style,r=window.getComputedStyle(e),s=t===a,u=f({showDuration:n.showDuration,showDelay:n.showDelay,showTimingFunction:n.showTimingFunction,hideDuration:n.hideDuration,hideDelay:n.hideDelay,hideTimingFunction:n.hideTimingFunction,transitions:n.transitions,domElements:n.domElements},s),c=void 0!==u.duration?1e3*u.duration:r?l(r.transitionDuration):0,d=void 0!==u.delay?1e3*u.delay:r?l(r.transitionDelay):0,p=c+d;u.before&&"function"==typeof u.before&&(o.transitionDuration="0ms",o.transitionDelay="0ms",u.before()),(()=>{const t=u.timingFunction||(r?r.transitionTimingFunction:void 0);t&&(o.transitionTimingFunction=t),o.transitionDuration=c+"ms",o.transitionDelay=d+"ms",n.transitionClass&&e.classList.add(n.transitionClass),n.showClass&&(n.showClassElement||e).classList[s?"add":"remove"](n.showClass);u.transition&&u.transition()})(),setTimeout(()=>{u.after&&"function"==typeof u.after&&u.after(),n.transitionClass&&e.classList.remove(n.transitionClass),i()},p)}):Promise.reject()},l=n=>{const t=parseFloat(n)*(-1===n.indexOf("ms")?1e3:1);return isNaN(t)?0:t},f=(n,t)=>{const[e,i,o,r]=t?[n.showDuration,n.showDelay,n.showTimingFunction,n.transitions?n.transitions.show:void 0]:[n.hideDuration,n.hideDelay,n.hideTimingFunction,n.transitions?n.transitions.hide:void 0];return{duration:e,delay:i,timingFunction:o,...r?r(n.domElements):void 0}};var p=t(function(n){!function(){e.SKIP={},e.lift=function(){var n=arguments[0];return o(Array.prototype.slice.call(arguments,1)).map(function(t){return n.apply(void 0,t)})},e.scan=function(n,t,i){var o=i.map(function(i){var o=n(t,i);return o!==e.SKIP&&(t=o),o});return o(t),o},e.merge=o,e.combine=i,e.scanMerge=function(n,t){var e=n.map(function(n){return n[0]}),o=i(function(){var i=arguments[arguments.length-1];return e.forEach(function(e,o){i.indexOf(e)>-1&&(t=n[o][1](t,e()))}),t},e);return o(t),o},e["fantasy-land/of"]=e;var t=!1;function e(n){var t,o=[],s=[];function a(t){return arguments.length&&t!==e.SKIP&&(n=t,r(a)&&(a._changing(),a._state="active",o.forEach(function(t,e){t(s[e](n))}))),n}return a.constructor=e,a._state=arguments.length&&n!==e.SKIP?"active":"pending",a._parents=[],a._changing=function(){r(a)&&(a._state="changing"),o.forEach(function(n){n._changing()})},a._map=function(t,i){var r=i?e():e(t(n));return r._parents.push(a),o.push(r),s.push(t),r},a.map=function(n){return a._map(n,"active"!==a._state)},a.toJSON=function(){return null!=n&&"function"==typeof n.toJSON?n.toJSON():n},a["fantasy-land/map"]=a.map,a["fantasy-land/ap"]=function(n){return i(function(n,t){return n()(t())},[n,a])},a._unregisterChild=function(n){var t=o.indexOf(n);-1!==t&&(o.splice(t,1),s.splice(t,1))},Object.defineProperty(a,"end",{get:function(){return t||((t=e()).map(function(n){return!0===n&&(a._parents.forEach(function(n){n._unregisterChild(a)}),a._state="ended",a._parents.length=o.length=s.length=0),n}),t)}}),a}function i(n,t){var i=t.every(function(n){if(n.constructor!==e)throw new Error("Ensure that each item passed to stream.combine/stream.merge/lift is a stream");return"active"===n._state}),o=i?e(n.apply(null,t.concat([t]))):e(),r=[],s=t.map(function(e){return e._map(function(s){return r.push(e),(i||t.every(function(n){return"pending"!==n._state}))&&(i=!0,o(n.apply(null,t.concat([r]))),r=[]),s},!0)}),a=o.end.map(function(n){!0===n&&(s.forEach(function(n){n.end(!0)}),a.end(!0))});return o}function o(n){return i(function(){return n.map(function(n){return n()})},n)}function r(n){return"pending"===n._state||"active"===n._state||"changing"===n._state}Object.defineProperty(e,"HALT",{get:function(){return t||console.log("HALT is deprecated and has been renamed to SKIP"),t=!0,e.SKIP}}),n.exports=e}()});const m=(n,t)=>{const e=((n,t)=>t.find(t=>t.id===n))(n,t);return t.indexOf(e)},h=(n,t)=>[t,n.id,n.spawn].filter(Boolean).join("-"),g={store:{}},y=n=>({add:(t,e)=>{n(n=>{const i=n.store[e]||[];return n.store[e]=[...i,t],n})},remove:(t,e)=>{n(n=>{const i=n.store[e]||[],o=((n,t)=>{const e=m(n,t);return-1!==e&&t.splice(e,1),t})(t,i);return n.store[e]=o,n})},replace:(t,e,i)=>{n(n=>{const o=n.store[i]||[];if(o){const r=m(t,o);-1!==r&&(o[r]=e,n.store[i]=[...o])}return n})},removeAll:t=>{n(n=>(n.store[t]=[],n))},store:(t,e)=>{n(n=>(n.store[e]=[...t],n))}}),w=n=>({find:(t,e)=>{const i=n().store[e]||[],o=h(t,e),r=i.find(n=>n.id===o);return r?{just:r}:{nothing:void 0}},getAll:t=>{return n().store[t]||[]},getCount:t=>{return(n().store[t]||[]).length}}),v=p(),O=p.scan((n,t)=>t(n),{...g},v),_={...y(v)},D={...w(O)},T="undefined"!=typeof document,C=()=>{let n,t,e,i,o,r;const s=()=>{T&&(window.clearTimeout(n),n=-1)},a=()=>{T&&(s(),t=(new Date).getTime(),n=window.setTimeout(()=>{i(),o()},e))};return{start:(n,t)=>(i=n,e=t,new Promise((n,t)=>{o=()=>n(),r=()=>n(),a()})),pause:()=>(s(),e-=(new Date).getTime()-t),resume:()=>{if(-1===n)return a()},stop:s,abort:()=>(s(),r&&r())}},b=n=>{return Object.keys(n).reduce((t,e)=>{const i=n[e];return c[e]?t.transitionOptions[e]=i:t.instanceOptions[e]=i,t},{transitionOptions:{},instanceOptions:{}})},P=(n,t,e)=>(i,o)=>new Promise(r=>{const a={...e,...o},u=h(a,n),{transitionOptions:c,instanceOptions:d}=b(i),l={...t,...c};l.didShow=n=>(i.didShow&&i.didShow(n),r(n)),l.didHide=n=>(i.didHide&&i.didHide(n),r(n));const f=s(),p={spawnOptions:a,transitionOptions:l,instanceTransitionOptions:c,instanceOptions:d,id:u,timer:C(),key:a.queued?f:u},m=D.find(a,n);if(m.just&&!a.queued){const t=m.just,e=t.instanceTransitionOptions,i={...p,instanceTransitionOptions:e};_.replace(t.id,i,n),l.didShow(a.id)}else _.add(p,n)}),S=n=>(t,e)=>i=>{const o={...e,...i},r=D.find(o,t);return r.just?n(r.just,t):Promise.resolve()},E=S((n,t)=>F(n,t)),A=S((n,t)=>(n&&n.timer&&n.timer.pause(),Promise.resolve())),j=S((n,t)=>(n&&n.timer&&n.timer.resume(),Promise.resolve())),x=(n,t)=>{const{transitionOptions:e}=b(t);return{...n,transitionOptions:{...n.transitionOptions,...e}}},F=async function(n,t){return n.transitionOptions.timeout&&n.timer.stop(),await((n,t)=>d({...n.transitionOptions,...n.instanceTransitionOptions},t))(n,u),await n.transitionOptions.didHide(n.spawnOptions.id),_.remove(n.id,t),n.spawnOptions.id},H="dialog",I=`default_${H}`,q=`default_${H}`,K={id:I,spawn:q},L=P(H,{},K),N=E(H,K),R=A(H,K),V=j(H,K),J=(n=>()=>(D.getAll(n).forEach(n=>n.timer.abort()),_.removeAll(n),Promise.resolve()))(H),M=((n,t)=>(e,i)=>{const o={...t,...i},r=D.getAll(n),s=r.filter(n=>!o.queued&&!n.spawnOptions.queued),a=r.filter(n=>o.queued||n.spawnOptions.queued);if(s.forEach(t=>F(x(t,e),n)),a.length>0){const[t]=a;_.store([t],n),F(x(t,e),n).then(()=>_.removeAll(n))}})(H,K),k=(n=>(n=>D.getCount(n))(n))(H);n.count=k,n.defaultId=I,n.defaultSpawn=q,n.hide=N,n.hideAll=M,n.ns=H,n.pause=R,n.resetAll=J,n.resume=V,n.show=L,Object.defineProperty(n,"__esModule",{value:!0})});
//# sourceMappingURL=dialogic-dialog.js.map
