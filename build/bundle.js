var app=function(){"use strict";function t(){}const e=t=>t;function n(t){return t()}function o(){return Object.create(null)}function s(t){t.forEach(n)}function r(t){return"function"==typeof t}function i(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function a(e,n,o){e.$$.on_destroy.push(function(e,...n){if(null==e)return t;const o=e.subscribe(...n);return o.unsubscribe?()=>o.unsubscribe():o}(n,o))}function c(t,e,n,o){return t[1]&&o?function(t,e){for(const n in e)t[n]=e[n];return t}(n.ctx.slice(),t[1](o(e))):n.ctx}function l(t,e,n){return t.set(n),e}const u="undefined"!=typeof window;let d=u?()=>window.performance.now():()=>Date.now(),f=u?t=>requestAnimationFrame(t):t;const p=new Set;function m(t){p.forEach((e=>{e.c(t)||(p.delete(e),e.f())})),0!==p.size&&f(m)}function $(t,e){t.appendChild(e)}function v(t){if(!t)return document;const e=t.getRootNode?t.getRootNode():t.ownerDocument;return e.host?e:document}function g(t){const e=_("style");return function(t,e){$(t.head||t,e)}(v(t),e),e}function h(t,e,n){t.insertBefore(e,n||null)}function y(t){t.parentNode.removeChild(t)}function _(t){return document.createElement(t)}function b(){return t=" ",document.createTextNode(t);var t}function w(t,e,n,o){return t.addEventListener(e,n,o),()=>t.removeEventListener(e,n,o)}function x(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function C(t,e,n,o){t.style.setProperty(e,n,o?"important":"")}const A=new Set;let E,S=0;function k(t,e,n,o,s,r,i,a=0){const c=16.666/o;let l="{\n";for(let t=0;t<=1;t+=c){const o=e+(n-e)*r(t);l+=100*t+`%{${i(o,1-o)}}\n`}const u=l+`100% {${i(n,1-n)}}\n}`,d=`__svelte_${function(t){let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return e>>>0}(u)}_${a}`,f=v(t);A.add(f);const p=f.__svelte_stylesheet||(f.__svelte_stylesheet=g(t).sheet),m=f.__svelte_rules||(f.__svelte_rules={});m[d]||(m[d]=!0,p.insertRule(`@keyframes ${d} ${u}`,p.cssRules.length));const $=t.style.animation||"";return t.style.animation=`${$?`${$}, `:""}${d} ${o}ms linear ${s}ms 1 both`,S+=1,d}function T(t,e){const n=(t.style.animation||"").split(", "),o=n.filter(e?t=>t.indexOf(e)<0:t=>-1===t.indexOf("__svelte")),s=n.length-o.length;s&&(t.style.animation=o.join(", "),S-=s,S||f((()=>{S||(A.forEach((t=>{const e=t.__svelte_stylesheet;let n=e.cssRules.length;for(;n--;)e.deleteRule(n);t.__svelte_rules={}})),A.clear())})))}function M(t){E=t}const R=[],D=[],N=[],I=[],P=Promise.resolve();let j=!1;function O(t){N.push(t)}let L=!1;const W=new Set;function F(){if(!L){L=!0;do{for(let t=0;t<R.length;t+=1){const e=R[t];M(e),z(e.$$)}for(M(null),R.length=0;D.length;)D.pop()();for(let t=0;t<N.length;t+=1){const e=N[t];W.has(e)||(W.add(e),e())}N.length=0}while(R.length);for(;I.length;)I.pop()();j=!1,L=!1,W.clear()}}function z(t){if(null!==t.fragment){t.update(),s(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(O)}}let B;function H(t,e,n){t.dispatchEvent(function(t,e,n=!1){const o=document.createEvent("CustomEvent");return o.initCustomEvent(t,n,!1,e),o}(`${e?"intro":"outro"}${n}`))}const J=new Set;let G;function q(t,e){t&&t.i&&(J.delete(t),t.i(e))}function U(t,e,n,o){if(t&&t.o){if(J.has(t))return;J.add(t),G.c.push((()=>{J.delete(t),o&&(n&&t.d(1),o())})),t.o(e)}}const K={duration:0};function V(n,o,i,a){let c=o(n,i),l=a?0:1,u=null,$=null,v=null;function g(){v&&T(n,v)}function h(t,e){const n=t.b-l;return e*=Math.abs(n),{a:l,b:t.b,d:n,duration:e,start:t.start,end:t.start+e,group:t.group}}function y(o){const{delay:r=0,duration:i=300,easing:a=e,tick:y=t,css:_}=c||K,b={start:d()+r,b:o};o||(b.group=G,G.r+=1),u||$?$=b:(_&&(g(),v=k(n,l,o,i,r,a,_)),o&&y(0,1),u=h(b,i),O((()=>H(n,o,"start"))),function(t){let e;0===p.size&&f(m),new Promise((n=>{p.add(e={c:t,f:n})}))}((t=>{if($&&t>$.start&&(u=h($,i),$=null,H(n,u.b,"start"),_&&(g(),v=k(n,l,u.b,u.duration,0,a,c.css))),u)if(t>=u.end)y(l=u.b,1-l),H(n,u.b,"end"),$||(u.b?g():--u.group.r||s(u.group.c)),u=null;else if(t>=u.start){const e=t-u.start;l=u.a+u.d*a(e/u.duration),y(l,1-l)}return!(!u&&!$)})))}return{run(t){r(c)?(B||(B=Promise.resolve(),B.then((()=>{B=null}))),B).then((()=>{c=c(),y(t)})):y(t)},end(){g(),u=$=null}}}function Q(t){t&&t.c()}function X(t,e,o,i){const{fragment:a,on_mount:c,on_destroy:l,after_update:u}=t.$$;a&&a.m(e,o),i||O((()=>{const e=c.map(n).filter(r);l?l.push(...e):s(e),t.$$.on_mount=[]})),u.forEach(O)}function Y(t,e){const n=t.$$;null!==n.fragment&&(s(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function Z(t,e){-1===t.$$.dirty[0]&&(R.push(t),j||(j=!0,P.then(F)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function tt(e,n,r,i,a,c,l,u=[-1]){const d=E;M(e);const f=e.$$={fragment:null,ctx:null,props:c,update:t,not_equal:a,bound:o(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(d?d.$$.context:n.context||[]),callbacks:o(),dirty:u,skip_bound:!1,root:n.target||d.$$.root};l&&l(f.root);let p=!1;if(f.ctx=r?r(e,n.props||{},((t,n,...o)=>{const s=o.length?o[0]:n;return f.ctx&&a(f.ctx[t],f.ctx[t]=s)&&(!f.skip_bound&&f.bound[t]&&f.bound[t](s),p&&Z(e,t)),n})):[],f.update(),p=!0,s(f.before_update),f.fragment=!!i&&i(f.ctx),n.target){if(n.hydrate){const t=function(t){return Array.from(t.childNodes)}(n.target);f.fragment&&f.fragment.l(t),t.forEach(y)}else f.fragment&&f.fragment.c();n.intro&&q(e.$$.fragment),X(e,n.target,n.anchor,n.customElement),F()}M(d)}class et{$destroy(){Y(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function nt(t,{delay:n=0,duration:o=400,easing:s=e}={}){const r=+getComputedStyle(t).opacity;return{delay:n,duration:o,easing:s,css:t=>"opacity: "+t*r}}const ot={source:"https://commondatastorage.googleapis.com/gtv-videos-bucket/CastVideos/mp4/BigBuckBunny.mp4",mimeType:"video/mp4"},st={source:"https://multiplatform-f.akamaihd.net/i/multi/april11/sintel/sintel-hd_,512x288_450_b,640x360_700_b,768x432_1000_b,1024x576_1400_m,.mp4.csmil/master.m3u8",mimeType:"application/x-mpegurl"},rt={source:"https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd",mimeType:"application/dash+xml"},it=[];let at=function(e,n=t){let o;const s=new Set;function r(t){if(i(e,t)&&(e=t,o)){const t=!it.length;for(const t of s)t[1](),it.push(t,e);if(t){for(let t=0;t<it.length;t+=2)it[t][0](it[t+1]);it.length=0}}}return{set:r,update:function(t){r(t(e))},subscribe:function(i,a=t){const c=[i,a];return s.add(c),1===s.size&&(o=n(r)||t),i(e),()=>{s.delete(c),0===s.size&&(o(),o=null)}}}}({source:ot.source,mimeType:ot.mimeType,receiverApplicationId:"CC1AD845",autoJoinPolicy:"origin_scoped",androidReceiverCompatible:!0,startWithAutoPlay:!0});function ct(e){let n,o,r,i,a;return{c(){var t,e;t="button",e="google-cast-button",n=document.createElement(t,{is:e}),x(n,"is","google-cast-button"),x(n,"class","svelte-1wp3zl3")},m(t,o){h(t,n,o),r=!0,i||(a=[w(n,"mousedown",e[0]),w(n,"touchstart",e[0],{passive:!0})],i=!0)},p:t,i(t){r||(O((()=>{o||(o=V(n,nt,{duration:1e3},!0)),o.run(1)})),r=!0)},o(t){o||(o=V(n,nt,{duration:1e3},!1)),o.run(0),r=!1},d(t){t&&y(n),t&&o&&o.end(),i=!1,s(a)}}}function lt(t,e,n){let o;a(t,at,(t=>n(1,o=t)));const s=t=>{if(cast&&cast.framework&&t.isConnected)return console.log("Receiver connected"),(()=>{console.log(o.receiverApplicationId);let t=new chrome.cast.media.MediaInfo(o.source,o.mimeType);t.streamType=chrome.cast.media.StreamType.BUFFERED,t.metadata=new chrome.cast.media.TvShowMediaMetadata;let e=new chrome.cast.media.LoadRequest(t);e.currentTime=0,e.autoplay=o.startWithAutoPlay,cast.framework.CastContext.getInstance().getCurrentSession().loadMedia(e).then((()=>console.log("Remote media loaded")),(t=>console.log("Remote media load error: ",t)))})();console.log("Receiver not connected")},r=t=>{console.log("MEDIA_INFO_CHANGED event triggered: ",t);let e=cast.framework.CastContext.getInstance().getCurrentSession();if(!e)return;console.log("current session: ",e);let n=e.getMediaSession();if(!n)return;console.log("current mediaStatus: ",n);let o=n.media;console.log("current mediaInfo: ",o)};return[()=>{cast.framework.CastContext.getInstance().setOptions(o);const t=new cast.framework.RemotePlayer;window.receiverController=new cast.framework.RemotePlayerController(t),window.receiverController.addEventListener(cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED,(()=>{s(t)})),window.receiverController.addEventListener(cast.framework.RemotePlayerEventType.MEDIA_INFO_CHANGED,r)}]}class ut extends et{constructor(t){super(),tt(this,t,lt,ct,i,{})}}function dt(t){let e,n,o;return{c(){e=_("span"),e.textContent="Cast Sender SDK is not available",x(e,"class","status-message light-red svelte-rpv21u")},m(t,n){h(t,e,n),o=!0},i(t){o||(O((()=>{n||(n=V(e,nt,{duration:1e3},!0)),n.run(1)})),o=!0)},o(t){n||(n=V(e,nt,{duration:1e3},!1)),n.run(0),o=!1},d(t){t&&y(e),t&&n&&n.end()}}}function ft(t){let e,n;return e=new ut({}),{c(){Q(e.$$.fragment)},m(t,o){X(e,t,o),n=!0},i(t){n||(q(e.$$.fragment,t),n=!0)},o(t){U(e.$$.fragment,t),n=!1},d(t){Y(e,t)}}}function pt(t){let e,n,o,r,i,a;const c=[ft,dt],l=[];function u(t,e){return t[0]?0:1}return r=u(t),i=l[r]=c[r](t),{c(){e=_("div"),n=_("span"),n.textContent="Minimal Cast Sender",o=b(),i.c(),x(n,"class","title"),x(e,"class","header fl w-100 bg-dark-blue helvetica svelte-rpv21u")},m(t,s){h(t,e,s),$(e,n),$(e,o),l[r].m(e,null),a=!0},p(t,[n]){let o=r;r=u(t),r!==o&&(G={r:0,c:[],p:G},U(l[o],1,1,(()=>{l[o]=null})),G.r||s(G.c),G=G.p,i=l[r],i||(i=l[r]=c[r](t),i.c()),q(i,1),i.m(e,null))},i(t){a||(q(i),a=!0)},o(t){U(i),a=!1},d(t){t&&y(e),l[r].d()}}}function mt(t,e,n){let{castAvailabilityStatus:o=!1}=e;return t.$$set=t=>{"castAvailabilityStatus"in t&&n(0,o=t.castAvailabilityStatus)},[o]}class $t extends et{constructor(t){super(),tt(this,t,mt,pt,i,{castAvailabilityStatus:0})}}function vt(t){let e,n;const o=t[1].default,s=function(t,e,n,o){if(t){const s=c(t,e,n,o);return t[0](s)}}(o,t,t[0],null);return{c(){e=_("div"),s&&s.c(),x(e,"class","card b--solid bw1 br3 b--gray svelte-1bcgkri")},m(t,o){h(t,e,o),s&&s.m(e,null),n=!0},p(t,[e]){s&&s.p&&(!n||1&e)&&function(t,e,n,o,s,r){if(s){const i=c(e,n,o,r);t.p(i,s)}}(s,o,t,t[0],n?function(t,e,n,o){if(t[2]&&o){const s=t[2](o(n));if(void 0===e.dirty)return s;if("object"==typeof s){const t=[],n=Math.max(e.dirty.length,s.length);for(let o=0;o<n;o+=1)t[o]=e.dirty[o]|s[o];return t}return e.dirty|s}return e.dirty}(o,t[0],e,null):function(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let t=0;t<n;t++)e[t]=-1;return e}return-1}(t[0]),null)},i(t){n||(q(s,t),n=!0)},o(t){U(s,t),n=!1},d(t){t&&y(e),s&&s.d(t)}}}function gt(t,e,n){let{$$slots:o={},$$scope:s}=e;return t.$$set=t=>{"$$scope"in t&&n(0,s=t.$$scope)},[s,o]}class ht extends et{constructor(t){super(),tt(this,t,gt,vt,i,{})}}function yt(e){let n,o,r,i,a,c,l,u,d,f,p,m,v,g,C,A,E,S,k;return{c(){n=_("h4"),n.textContent="Default Medias",o=b(),r=_("div"),i=_("div"),a=_("input"),c=b(),l=_("label"),l.textContent="MP4 media",u=b(),d=_("div"),f=_("input"),p=b(),m=_("label"),m.textContent="HLS media",v=b(),g=_("div"),C=_("input"),A=b(),E=_("label"),E.textContent="DASH media",x(n,"class","svelte-wjs1hr"),x(a,"type","radio"),x(a,"id","mp4_video"),x(a,"name","option"),a.value=JSON.stringify(ot),a.checked=!0,x(a,"class","svelte-wjs1hr"),x(l,"for","mp4_video"),x(i,"class","videos-list__option svelte-wjs1hr"),x(f,"type","radio"),x(f,"id","m3u8_video"),x(f,"name","option"),f.value=JSON.stringify(st),x(f,"class","svelte-wjs1hr"),x(m,"for","m3u8_video"),x(d,"class","videos-list__option svelte-wjs1hr"),x(C,"type","radio"),x(C,"id","mpd_video"),x(C,"name","option"),C.value=JSON.stringify(rt),x(C,"class","svelte-wjs1hr"),x(E,"for","mpd_video"),x(g,"class","videos-list__option svelte-wjs1hr"),x(r,"class","videos-list svelte-wjs1hr")},m(t,s){h(t,n,s),h(t,o,s),h(t,r,s),$(r,i),$(i,a),$(i,c),$(i,l),$(r,u),$(r,d),$(d,f),$(d,p),$(d,m),$(r,v),$(r,g),$(g,C),$(g,A),$(g,E),S||(k=[w(a,"input",e[1]),w(f,"input",e[2]),w(C,"input",e[3])],S=!0)},p:t,i:t,o:t,d(t){t&&y(n),t&&y(o),t&&y(r),S=!1,s(k)}}}function _t(t,e,n){let o;a(t,at,(t=>n(4,o=t)));const s=t=>{const e=JSON.parse(t),{source:n,mimeType:s}=e;l(at,o={...o,source:n,mimeType:s},o)};return[s,t=>s(t.currentTarget.value),t=>s(t.currentTarget.value),t=>s(t.currentTarget.value)]}class bt extends et{constructor(t){super(),tt(this,t,_t,yt,i,{})}}function wt(e){let n,o,r,i,a,c,l,u,d,f,p,m,v;return{c(){n=_("h4"),n.textContent="Custom Media",o=b(),r=_("div"),i=_("span"),i.textContent="Media URL:",a=b(),c=_("input"),l=b(),u=_("div"),d=_("span"),d.textContent="Mime Type:",f=b(),p=_("input"),x(n,"class","svelte-1v83d4w"),x(i,"class","svelte-1v83d4w"),x(c,"class","svelte-1v83d4w"),x(r,"class","input-container svelte-1v83d4w"),x(d,"class","svelte-1v83d4w"),x(p,"placeholder","'video/mp4' or 'application/x-mpegurl' and etc."),x(p,"class","svelte-1v83d4w"),x(u,"class","input-container svelte-1v83d4w")},m(t,s){h(t,n,s),h(t,o,s),h(t,r,s),$(r,i),$(r,a),$(r,c),h(t,l,s),h(t,u,s),$(u,d),$(u,f),$(u,p),m||(v=[w(c,"input",e[1]),w(p,"input",e[2])],m=!0)},p:t,i:t,o:t,d(t){t&&y(n),t&&y(o),t&&y(r),t&&y(l),t&&y(u),m=!1,s(v)}}}function xt(t,e,n){let o;a(t,at,(t=>n(0,o=t)));return[o,t=>l(at,o={...o,source:t.currentTarget.value},o),t=>l(at,o={...o,mimeType:t.currentTarget.value},o)]}class Ct extends et{constructor(t){super(),tt(this,t,xt,wt,i,{})}}function At(e){let n,o,r,i,a,c,l,u,d,f,p,m,v,g,C,A,E,S,k;return{c(){n=_("h4"),n.textContent="Receiver Config",o=b(),r=_("div"),i=_("span"),i.textContent="App ID:",a=b(),c=_("input"),l=b(),u=_("div"),d=_("span"),d.textContent="AutoPlay:",f=b(),p=_("input"),m=b(),v=_("label"),v.textContent="True",g=b(),C=_("input"),A=b(),E=_("label"),E.textContent="False",x(n,"class","svelte-sn65no"),x(i,"class","svelte-sn65no"),x(c,"type","text"),x(c,"placeholder","Already using App ID 'CC1AD845'"),x(c,"class","svelte-sn65no"),x(r,"class","app-id-input-container svelte-sn65no"),x(d,"class","svelte-sn65no"),x(p,"type","radio"),x(p,"id","autoplay_true"),x(p,"name","autoplay"),p.value=!0,p.checked=!0,x(p,"class","svelte-sn65no"),x(v,"for","autoplay_true"),x(v,"class","svelte-sn65no"),x(C,"type","radio"),x(C,"id","autoplay_false"),x(C,"name","autoplay"),C.value=!1,x(C,"class","svelte-sn65no"),x(E,"for","autoplay_false"),x(E,"class","svelte-sn65no"),x(u,"class","autoplay-input-container svelte-sn65no")},m(t,s){h(t,n,s),h(t,o,s),h(t,r,s),$(r,i),$(r,a),$(r,c),h(t,l,s),h(t,u,s),$(u,d),$(u,f),$(u,p),$(u,m),$(u,v),$(u,g),$(u,C),$(u,A),$(u,E),S||(k=[w(c,"input",e[1]),w(p,"input",e[2]),w(C,"input",e[3])],S=!0)},p:t,i:t,o:t,d(t){t&&y(n),t&&y(o),t&&y(r),t&&y(l),t&&y(u),S=!1,s(k)}}}function Et(t,e,n){let o;a(t,at,(t=>n(0,o=t)));return[o,t=>l(at,o={...o,receiverApplicationId:t.currentTarget.value},o),t=>l(at,o={...o,startWithAutoPlay:!0},o),t=>{l(at,o={...o,startWithAutoPlay:!1},o)}]}class St extends et{constructor(t){super(),tt(this,t,Et,At,i,{})}}function kt(t){let e,n;return e=new St({}),{c(){Q(e.$$.fragment)},m(t,o){X(e,t,o),n=!0},i(t){n||(q(e.$$.fragment,t),n=!0)},o(t){U(e.$$.fragment,t),n=!1},d(t){Y(e,t)}}}function Tt(t){let e,n;return e=new bt({}),{c(){Q(e.$$.fragment)},m(t,o){X(e,t,o),n=!0},i(t){n||(q(e.$$.fragment,t),n=!0)},o(t){U(e.$$.fragment,t),n=!1},d(t){Y(e,t)}}}function Mt(t){let e,n;return e=new Ct({}),{c(){Q(e.$$.fragment)},m(t,o){X(e,t,o),n=!0},i(t){n||(q(e.$$.fragment,t),n=!0)},o(t){U(e.$$.fragment,t),n=!1},d(t){Y(e,t)}}}function Rt(t){let e,n,o,s,r,i,a,c,l,u,d,f;return e=new $t({props:{castAvailabilityStatus:t[0]}}),s=new ht({props:{$$slots:{default:[kt]},$$scope:{ctx:t}}}),a=new ht({props:{$$slots:{default:[Tt]},$$scope:{ctx:t}}}),u=new ht({props:{$$slots:{default:[Mt]},$$scope:{ctx:t}}}),{c(){Q(e.$$.fragment),n=b(),o=_("main"),r=_("div"),Q(s.$$.fragment),i=b(),c=_("div"),Q(a.$$.fragment),l=b(),d=_("div"),Q(u.$$.fragment),C(r,"display","contents"),C(r,"--cardMaxWidth","50%"),C(c,"display","contents"),C(c,"--cardMaxWidth","50%"),C(d,"display","contents"),C(d,"--cardMaxWidth","50%"),x(o,"class","content helvetica")},m(t,p){X(e,t,p),h(t,n,p),h(t,o,p),$(o,r),X(s,r,null),$(o,i),$(o,c),X(a,c,null),$(o,l),$(o,d),X(u,d,null),f=!0},p(t,[n]){const o={};1&n&&(o.castAvailabilityStatus=t[0]),e.$set(o);const r={};2&n&&(r.$$scope={dirty:n,ctx:t}),s.$set(r);const i={};2&n&&(i.$$scope={dirty:n,ctx:t}),a.$set(i);const c={};2&n&&(c.$$scope={dirty:n,ctx:t}),u.$set(c)},i(t){f||(q(e.$$.fragment,t),q(s.$$.fragment,t),q(a.$$.fragment,t),q(u.$$.fragment,t),f=!0)},o(t){U(e.$$.fragment,t),U(s.$$.fragment,t),U(a.$$.fragment,t),U(u.$$.fragment,t),f=!1},d(t){Y(e,t),t&&y(n),t&&y(o),Y(s),Y(a),Y(u)}}}function Dt(t,e,n){let o=!1;return window.__onGCastApiAvailable=t=>{n(0,o=t)},[o]}return new class extends et{constructor(t){super(),tt(this,t,Dt,Rt,i,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
