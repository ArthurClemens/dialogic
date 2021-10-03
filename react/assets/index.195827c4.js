var ye=Object.defineProperty,be=Object.defineProperties;var Ee=Object.getOwnPropertyDescriptors;var O=Object.getOwnPropertySymbols;var q=Object.prototype.hasOwnProperty,L=Object.prototype.propertyIsEnumerable;var B=(e,t,n)=>t in e?ye(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,r=(e,t)=>{for(var n in t||(t={}))q.call(t,n)&&B(e,n,t[n]);if(O)for(var n of O(t))L.call(t,n)&&B(e,n,t[n]);return e},h=(e,t)=>be(e,Ee(t));var $=(e,t)=>{var n={};for(var i in e)q.call(e,i)&&t.indexOf(i)<0&&(n[i]=e[i]);if(e!=null&&O)for(var i of O(e))t.indexOf(i)<0&&L.call(e,i)&&(n[i]=e[i]);return n};import{e as _,R as c,r as E,a as Se}from"./vendor.94b4d969.js";const ve=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function n(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerpolicy&&(s.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?s.credentials="include":o.crossorigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(o){if(o.ep)return;o.ep=!0;const s=n(o);fetch(o.href,s)}};ve();const Oe=(e,t)=>t.find(n=>n.id===e),W=(e,t)=>{const n=Oe(e,t);return n?t.indexOf(n):-1},_e=(e,t)=>{const n=W(e,t);return n!==-1&&t.splice(n,1),t},U=(e,t)=>[t,e.id,e.spawn].filter(Boolean).join("-"),I={initialState:{store:{}},actions:e=>({add:(t,n)=>{e(i=>{const o=i.store[t]||[];return i.store[t]=[...o,n],n.timer&&n.timer.states.map(()=>I.actions(e).refresh()),i})},remove:(t,n)=>{e(i=>{const o=i.store[t]||[],s=_e(n,o);return i.store[t]=s,i})},replace:(t,n,i)=>{e(o=>{const s=o.store[t]||[];if(s){const a=W(n,s);a!==-1&&(s[a]=i,o.store[t]=[...s])}return o})},removeAll:t=>{e(n=>(n.store[t]=[],n))},store:(t,n)=>{e(i=>(i.store[t]=[...n],i))},refresh:()=>{e(t=>r({},t))}}),selectors:e=>{const t={getStore:()=>e().store,find:(n,i)=>{const s=e().store[n]||[],a=U(i,n),d=s.find(l=>l.id===a);return d?{just:d}:{nothing:void 0}},getAll:(n,i)=>{const s=e().store[n]||[],a=i!==void 0?i.spawn:void 0,d=i!==void 0?i.id:void 0,l=a!==void 0?s.filter(u=>u.identityOptions.spawn===a):s;return d!==void 0?l.filter(u=>u.identityOptions.id===d):l},getCount:(n,i)=>t.getAll(n,i).length};return t}},G=_(),K=_.scan((e,t)=>t(e),r({},I.initialState),G),y=r({},I.actions(G)),w=r({},I.selectors(K)),N={callback:()=>{},isPaused:!1,onAbort:()=>{},onDone:()=>{},promise:void 0,remaining:void 0,startTime:void 0,timeoutFn:()=>{},timerId:void 0},Ie=(e,t,n,i)=>{const o=()=>{t(),e.onDone(),i()};return r({timeoutFn:o,promise:new Promise(s=>{e.onDone=()=>s(),e.onAbort=()=>s()})},e.isPaused?{}:{startTime:new Date().getTime(),timerId:window.setTimeout(o,n),remaining:n})},T=e=>(window.clearTimeout(e.timerId),{timerId:N.timerId}),Ne=e=>r({},T(e)),Q=e=>h(r({},T(e)),{isPaused:!0,remaining:X(e)}),Te=(e,t)=>{window.clearTimeout(e.timerId);const n=t?Math.max(e.remaining||0,t):e.remaining;return{startTime:new Date().getTime(),isPaused:!1,remaining:n,timerId:window.setTimeout(e.timeoutFn,n)}},X=e=>e.remaining===0||e.remaining===void 0?e.remaining:e.remaining-(new Date().getTime()-(e.startTime||0)),Pe=()=>{const e={initialState:N,actions:s=>({start:(a,d)=>{s(l=>r(r(r(r({},l),T(l)),Ie(l,a,d,()=>e.actions(s).done())),l.isPaused&&Q(l)))},stop:()=>{s(a=>r(r(r({},a),Ne(a)),N))},pause:()=>{s(a=>r(r({},a),!a.isPaused&&Q(a)))},resume:a=>{s(d=>r(r({},d),d.isPaused&&Te(d,a)))},abort:()=>{s(a=>(a.onAbort(),r(r({},a),T(a))))},refresh:()=>{s(a=>r({},a))},done:()=>{s(()=>N)}}),selectors:s=>({isPaused:()=>s().isPaused,getRemaining:()=>{const a=s();return a.isPaused?a.remaining:X(a)},getResultPromise:()=>s().promise})},t=_(),n=_.scan((s,a)=>a(s),r({},e.initialState),t),i=r({},e.actions(t)),o=r({},e.selectors(n));return{states:n,actions:i,selectors:o}},z=(...e)=>t=>e.filter(Boolean).reduce((n,i)=>i(n),t),J=({domElement:e,prop:t})=>{const n=document.defaultView;if(n){const i=n.getComputedStyle(e);if(i)return i.getPropertyValue(t)}},A={SHOW:"show",HIDE:"hide"},ke=(e,t)=>e.classList.remove(...t.showStart,...t.showEnd,...t.hideStart,...t.hideEnd),Y=(e,t,n)=>{const i=n[t];i&&Object.keys(i).forEach(o=>{const s=i[o];e.style[o]=s})},De=e=>{e.style.transitionDuration="0ms"},xe=(e,t)=>(typeof t=="function"?t(e):t)||{},P=(e,t)=>e.split(/ /).map(n=>`${n}-${t}`),Z=(e,t,n,i)=>{if(t.styles){const o=xe(e,t.styles);Y(e,"default",o),i&&De(e),Y(e,n,o)}if(t.className){const o={showStart:P(t.className,"show-start"),showEnd:P(t.className,"show-end"),hideStart:P(t.className,"hide-start"),hideEnd:P(t.className,"hide-end")};ke(e,o),o&&e.classList.add(...o[n])}e.scrollTop},ee=e=>{const t=parseFloat(e)*(e.indexOf("ms")===-1?1e3:1);return Number.isNaN(t)?0:t},Me=e=>{const t=J({domElement:e,prop:"transition-duration"}),n=t!==void 0?ee(t):0,i=J({domElement:e,prop:"transition-delay"}),o=i!==void 0?ee(i):0;return n+o},Re={showStart:{nextStep:"showEnd"},showEnd:{nextStep:void 0},hideStart:{nextStep:"hideEnd"},hideEnd:{nextStep:void 0}},Ae=(e,t)=>{const{domElement:n}=e;if(!n)return Promise.resolve("no domElement");clearTimeout(e.__transitionTimeoutId__);let i=t===A.SHOW?"showStart":"hideStart";return new Promise(o=>{Z(n,e,i,i==="showStart"),setTimeout(()=>{const{nextStep:s}=Re[i];if(s){i=s,Z(n,e,i);const a=Me(n);e.__transitionTimeoutId__=window.setTimeout(o,a)}},0)})},k={uid:0},Ce=()=>(k.uid===Number.MAX_VALUE?k.uid=0:k.uid+=1,k.uid);var te;(function(e){e[e.Default=0]="Default",e[e.Displaying=1]="Displaying",e[e.Hiding=2]="Hiding"})(te||(te={}));const ne=e=>t=>n=>w.find(e,oe(t,n)),ie=e=>t=>e.spawn!==void 0?t.filter(n=>n.identityOptions.spawn===e.spawn):t,He=e=>t=>e.id!==void 0?t.filter(n=>n.identityOptions.id===e.id):t,je=e=>{let t=0;return e.map(n=>({item:n,queueCount:n.dialogicOptions.queued?t++:0})).filter(({queueCount:n})=>n===0).map(({item:n})=>n)},Fe=(e,t,n)=>{const i=t[e]||[];return i.length===0?[]:z(ie(n),je)(i)},Ve=e=>{const t=r({},e);return delete t.dialogic,t},oe=(e,t={})=>({id:t.id||e.id,spawn:t.spawn||e.spawn}),se=(e,t={})=>{const n={id:t.dialogic?t.dialogic.id:void 0,spawn:t.dialogic?t.dialogic.spawn:void 0},i=oe(e||{},n),o=h(r(r({},e),t.dialogic),{__transitionTimeoutId__:0}),s=Ve(t);return{identityOptions:i,dialogicOptions:o,passThroughOptions:s}},qe=e=>t=>n=>{const{identityOptions:i,dialogicOptions:o,passThroughOptions:s}=se(t,n);return new Promise(a=>{const l={ns:e,identityOptions:i,dialogicOptions:o,callbacks:{willShow:m=>(o.willShow&&o.willShow(m),a(m)),willHide:m=>(o.willHide&&o.willHide(m),a(m)),didShow:m=>(o.didShow&&o.didShow(m),a(m)),didHide:m=>(o.didHide&&o.didHide(m),a(m))},passThroughOptions:s,id:U(i,e),timer:o.timeout?Pe():void 0,key:Ce().toString(),transitionState:0},u=w.find(e,i).just;if(u&&o.toggle)return ae(e)(t)(n),a(u);if(u&&!o.queued){const m=h(r({},l),{key:u.key,transitionState:u.transitionState,dialogicOptions:u.dialogicOptions});y.replace(e,u.id,m)}else y.add(e,l);a(l)})},Le=qe,ae=e=>t=>n=>{const{identityOptions:i,dialogicOptions:o,passThroughOptions:s}=se(t,n),d=w.find(e,i).just;if(d){const l=h(r({},d),{dialogicOptions:r(r({},d.dialogicOptions),o),passThroughOptions:h(r({},d.passThroughOptions),{passThroughOptions:s})});return y.replace(e,d.id,l),l.transitionState!==2?v(l):Promise.resolve(l)}return Promise.resolve({ns:e,id:i.id})},Be=e=>t=>n=>{const i=S(e,n).filter(o=>!!o.timer);return i.forEach(o=>{o.timer&&o.timer.actions.pause()}),Promise.all(i)},$e=e=>t=>n=>{const i=n||{},o={id:i.id,spawn:i.spawn},s=S(e,o).filter(a=>!!a.timer);return s.forEach(a=>{a.timer&&a.timer.actions.resume(i.minimumDuration)}),Promise.all(s)},ce=(e,t,n)=>{var o,s;const i=ne(e)(t)(n);return(s=(o=i==null?void 0:i.just)==null?void 0:o.timer)==null?void 0:s.selectors},We=e=>t=>n=>{var i;return((i=ce(e,t,n))==null?void 0:i.isPaused())||!1},Ue=e=>t=>n=>{var i;return((i=ce(e,t,n))==null?void 0:i.getRemaining())||void 0},Ge=e=>t=>n=>!!S(e,n).length,S=(e,t)=>{const n=w.getAll(e);let i;return t?i=z(ie(t),He(t))(n):i=n,i},Ke=e=>t=>n=>{const i=S(e,n),o=[];return i.forEach(s=>{s.timer&&s.timer.actions.abort(),o.push(s)}),n?o.forEach(s=>{y.remove(e,s.id)}):y.removeAll(e),Promise.resolve(o)},re=(e,t)=>h(r({},e),{dialogicOptions:r(r({},e.dialogicOptions),t)}),Qe=e=>t=>n=>{const i=n||{},o={id:i.id,spawn:i.spawn},s=S(e,o),a=s.filter(f=>!i.queued&&!f.dialogicOptions.queued),d=s.filter(f=>i.queued||f.dialogicOptions.queued),l=[];if(a.forEach(f=>l.push(v(re(f,i)))),d.length>0){const[f]=d;y.store(e,[f]),l.push(v(re(f,i)))}return Promise.all(l)},Xe=e=>t=>w.getCount(e,t),le=(e,t)=>Ae(e.dialogicOptions,t),ze=()=>e=>t=>n=>{const i=ne(e)(t)(n);if(i.just)return i.just&&i.just.timer?i.just.timer.selectors.getResultPromise():void 0},Je=async(e,t,n)=>(t.actions.start(()=>v(e),n),ze()),de=async e=>(e.callbacks.willShow&&e.callbacks.willShow(e),e.transitionState!==1&&(e.transitionState=1,await le(e,A.SHOW)),e.callbacks.didShow&&e.callbacks.didShow(e),e.dialogicOptions.timeout&&e.timer&&await Je(e,e.timer,e.dialogicOptions.timeout),Promise.resolve(e)),v=async e=>{e.transitionState=2,e.timer&&e.timer.actions.stop(),e.callbacks.willHide&&e.callbacks.willHide(e),await le(e,A.HIDE),e.callbacks.didHide&&e.callbacks.didHide(e);const t=r({},e);return y.remove(e.ns,e.id),Promise.resolve(t)},Ye=(e,t)=>{t.dialogicOptions.domElement=e},ue=({ns:e,queued:t,timeout:n})=>{const i=`default_${e}`,o=`default_${e}`,s=r(r({id:i,spawn:o},t&&{queued:t}),n!==void 0&&{timeout:n});return{ns:e,defaultId:i,defaultSpawn:o,defaultDialogicOptions:s,show:Le(e)(s),hide:ae(e)(s),hideAll:Qe(e)(s),resetAll:Ke(e)(s),pause:Be(e)(s),resume:$e(e)(s),exists:Ge(e)(s),getCount:Xe(e),isPaused:We(e)(s),getRemaining:Ue(e)(s)}},D=ue({ns:"dialog"}),g=ue({ns:"notification",queued:!0,timeout:3e3}),Ze=e=>{let t,n,i=!1;const o={id:e.id,spawn:e.spawn},s=()=>{const a=e.instance.getRemaining(o);t!==a&&(t=a===void 0?a:e.roundToSeconds?Math.round(Math.max(a,0)/1e3):Math.max(a,0)),e.callback(t),e.instance.exists(o)?i||(n=window.requestAnimationFrame(s)):(window.cancelAnimationFrame(n),i=!0)};n=window.requestAnimationFrame(s)},et=({model:e,onMount:t,onDestroy:n,onUpdate:i,deps:o=[],defer:s,debug:a})=>{const[d,l]=c.useState({}),f=c.useRef(!1),u=c.useRef([]),m=p=>{a&&a("Subscribe"),u.current=Object.keys(p).map(b=>{const R=p[b];return R.map&&typeof R.map=="function"?R.map(we=>(a&&a("Will update %s",b),l(h(r({},d),{[b]:we})),null)):!1}).filter(Boolean)},F=()=>{u.current.length&&(a&&a("Unsubscribe"),u.current.forEach(p=>p.end(!0)),u.current=[])},x=()=>{a&&a("createMemo"),F();const b=(typeof e=="function"?e:()=>e)();return m(b),b},[M,V]=c.useState(s?h(r({},e),{isDeferred:!0}):x);return c.useEffect(()=>{if(!!f.current&&(a&&a("Updating"),i)){const p=x();V(p),i(p)}},o),c.useEffect(()=>{a&&a("Mounting");let p=M;return s&&(p=x(),V(p)),t&&p&&t(p),f.current=!0,()=>{a&&a("Unmounting"),F(),n&&n(M)}},[]),M},me=()=>{et({model:()=>({_:K}),defer:!0})},tt=e=>{const t=E.exports.useRef(),{className:n}=e.dialogicOptions,i=e.dialogicOptions.component;if(!i)throw new Error("Component missing in dialogic options.");const o=u=>{const m=t.current;m!==void 0&&u({detail:{identityOptions:e.identityOptions,domElement:m}})},s=()=>{o(e.onMount)},a=()=>{o(e.onShow)},d=()=>{o(e.onHide)},l=E.exports.useCallback(u=>{u!==null&&(t.current=u,s())},[]),f=e.passThroughOptions||{};return c.createElement("div",{ref:l,className:n},c.createElement(i,h(r({},f),{show:a,hide:d})))},C=e=>(t,n)=>{const i=w.find(e,t.detail.identityOptions);i.just&&Ye(t.detail.domElement,i.just);const o=w.find(e,t.detail.identityOptions);o.just&&n(o.just)},nt=e=>t=>C(e)(t,de),it=e=>t=>C(e)(t,de),ot=e=>t=>C(e)(t,v),st=e=>{const t=nt(e.ns),n=it(e.ns),i=ot(e.ns),o=e.identityOptions||{},s=Fe(e.ns,w.getStore(),o);return c.createElement(c.Fragment,null,s.map(a=>c.createElement(tt,{key:a.key,identityOptions:a.identityOptions,dialogicOptions:a.dialogicOptions,passThroughOptions:a.passThroughOptions,onMount:t,onShow:n,onHide:i})))},fe=n=>{var i=n,{instance:e}=i,t=$(i,["instance"]);me();const o={id:t.id||e.defaultId,spawn:t.spawn||e.defaultSpawn};return E.exports.useEffect(()=>{typeof t.onMount=="function"&&t.onMount()},[]),c.createElement(st,{identityOptions:o,ns:e.ns})};var ge=typeof globalThis!="undefined"?globalThis:typeof window!="undefined"?window:typeof global!="undefined"?global:typeof self!="undefined"?self:{},pe={},H={};Object.defineProperty(H,"__esModule",{value:!0});var j=c;function at(){var e=j.useRef(!1);return j.useEffect(function(){return e.current=!0,function(){e.current=!1}},[]),j.useCallback(function(){return e.current},[e])}H.default=at;var ct=ge&&ge.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(pe,"__esModule",{value:!0});var rt=ct(H),lt=pe.default=rt.default;const he=({instance:e,id:t,spawn:n,roundToSeconds:i})=>{const o=lt(),[s,a]=E.exports.useState(void 0),d={id:t,spawn:n},l=!!e.exists(d),f=u=>{o()&&a(u)};return E.exports.useMemo(()=>{l&&Ze(h(r({},d),{instance:e,roundToSeconds:i,callback:u=>{f(u)}}))},[l]),[s]},dt=e=>c.createElement(fe,h(r({},e),{instance:D})),ut=e=>c.createElement(fe,h(r({},e),{instance:g})),mt=e=>c.createElement("div",{className:"mdc-dialog__container"},c.createElement("div",{className:"mdc-dialog__surface"},c.createElement(c.Fragment,null,c.createElement("h2",{className:"h2 mdc-dialog__title"},e.title),c.createElement("div",{className:"mdc-dialog__content"},e.body),c.createElement("footer",{className:"mdc-dialog__actions"},c.createElement(c.Fragment,null,c.createElement("button",{type:"button",className:"mdc-button mdc-dialog__button",onClick:()=>{D.hide(),e.onReject()}},c.createElement("span",{className:"mdc-button__label"},"Resume")),c.createElement("button",{type:"button",className:"mdc-button mdc-dialog__button",onClick:()=>{D.hide(),e.onAccept()}},c.createElement("span",{className:"mdc-button__label"},"Hide all"))))))),ft=e=>c.createElement("div",{className:"mdc-dialog mdc-dialog--open",role:"alertdialog","aria-modal":"true","aria-labelledby":"my-dialog-title","aria-describedby":"my-dialog-content"},c.createElement(mt,r({},e)),c.createElement("div",{className:"mdc-dialog__scrim"})," "),gt=e=>{const[t]=he({instance:g,roundToSeconds:e.roundToSeconds});return c.createElement(c.Fragment,null,c.createElement("div",{className:"mdc-snackbar__label"},t!==void 0?`Some async process message. Retrying in ${t} seconds.`:"Some async process message."),c.createElement("div",{className:"mdc-snackbar__actions"},c.createElement("button",{type:"button",className:"button mdc-button mdc-snackbar__action",onClick:()=>{g.pause(),D.show({dialogic:{component:ft,className:"dialog"},title:"About this dialog",body:"The notification is paused, so you can take your time to read this message.",onAccept:()=>{g.hide(),g.resume()},onReject:()=>{g.resume({minimumDuration:2e3})}})}},"Show options")))},pt=e=>c.createElement("div",{className:"mdc-snackbar mdc-snackbar--open"},c.createElement("div",{className:"mdc-snackbar__surface"},c.createElement(gt,r({},e)))),ht=()=>{const[e]=he({instance:g,roundToSeconds:!1});return c.createElement("span",{style:{minWidth:"3em",textAlign:"left"}},e===void 0?"0":e.toString())},wt=()=>(me(),c.createElement(c.Fragment,null,c.createElement("div",{className:"page"},c.createElement("main",null,c.createElement("h1",null,"Dialogic for React demo"),c.createElement("div",{className:"message"},"Add one or more notifications, then click on the Retry button in the message."),c.createElement("div",{className:"ui message"},c.createElement("button",{type:"button",className:"ui button primary",onClick:()=>{g.show({dialogic:{component:pt,className:"notification",timeout:4e3},roundToSeconds:!0})}},"Add notification"),c.createElement("button",{type:"button",className:"ui button",onClick:()=>{g.pause()}},"Pause"),c.createElement("button",{type:"button",className:"ui button",onClick:()=>{g.resume()}},"Resume"),c.createElement("button",{type:"button",className:"ui button",onClick:()=>{g.hideAll()}},"Hide all"),c.createElement("button",{type:"button",className:"ui button",onClick:()=>{g.resetAll()}},"Reset all")),c.createElement("div",{className:"ui message"},c.createElement("div",{className:"ui label"},"Notifications",c.createElement("span",{className:"detail"},g.getCount())),c.createElement("div",{className:"ui label"},"Is paused",c.createElement("span",{className:"detail"},g.isPaused().toString())),g.exists()&&c.createElement("div",{className:"ui label"},"Remaining",c.createElement("span",{className:"detail"},c.createElement(ht,null))))),c.createElement("footer",null,"Dialogic: manage dialogs and notifications."," ",c.createElement("a",{href:"https://github.com/ArthurClemens/dialogic"},"Main documentation on GitHub"))),c.createElement(dt,null),c.createElement(ut,null))),yt=document.querySelector("#app");Se.render(c.createElement(wt,null),yt);
