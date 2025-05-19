(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(s){if(s.ep)return;s.ep=!0;const n=e(s);fetch(s.href,n)}})();/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const j=globalThis,F=j.ShadowRoot&&(j.ShadyCSS===void 0||j.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,K=Symbol(),Q=new WeakMap;let ht=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==K)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(F&&t===void 0){const i=e!==void 0&&e.length===1;i&&(t=Q.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&Q.set(e,t))}return t}toString(){return this.cssText}};const $t=r=>new ht(typeof r=="string"?r:r+"",void 0,K),lt=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((i,s,n)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+r[n+1],r[0]);return new ht(e,r,K)},_t=(r,t)=>{if(F)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const i=document.createElement("style"),s=j.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=e.cssText,r.appendChild(i)}},X=F?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return $t(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:gt,defineProperty:yt,getOwnPropertyDescriptor:mt,getOwnPropertyNames:vt,getOwnPropertySymbols:At,getPrototypeOf:bt}=Object,_=globalThis,Y=_.trustedTypes,xt=Y?Y.emptyScript:"",q=_.reactiveElementPolyfillSupport,M=(r,t)=>r,k={toAttribute(r,t){switch(t){case Boolean:r=r?xt:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},Z=(r,t)=>!gt(r,t),tt={attribute:!0,type:String,converter:k,reflect:!1,useDefault:!1,hasChanged:Z};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),_.litPropertyMetadata??(_.litPropertyMetadata=new WeakMap);let E=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=tt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);s!==void 0&&yt(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:n}=mt(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:s,set(o){const h=s==null?void 0:s.call(this);n==null||n.call(this,o),this.requestUpdate(t,h,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??tt}static _$Ei(){if(this.hasOwnProperty(M("elementProperties")))return;const t=bt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(M("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(M("properties"))){const e=this.properties,i=[...vt(e),...At(e)];for(const s of i)this.createProperty(s,e[s])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[i,s]of e)this.elementProperties.set(i,s)}this._$Eh=new Map;for(const[e,i]of this.elementProperties){const s=this._$Eu(e,i);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const s of i)e.unshift(X(s))}else t!==void 0&&e.push(X(t));return e}static _$Eu(t,e){const i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return _t(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var i;return(i=e.hostConnected)==null?void 0:i.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var i;return(i=e.hostDisconnected)==null?void 0:i.call(e)})}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){var n;const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(s!==void 0&&i.reflect===!0){const o=(((n=i.converter)==null?void 0:n.toAttribute)!==void 0?i.converter:k).toAttribute(e,i.type);this._$Em=t,o==null?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(t,e){var n,o;const i=this.constructor,s=i._$Eh.get(t);if(s!==void 0&&this._$Em!==s){const h=i.getPropertyOptions(s),a=typeof h.converter=="function"?{fromAttribute:h.converter}:((n=h.converter)==null?void 0:n.fromAttribute)!==void 0?h.converter:k;this._$Em=s,this[s]=a.fromAttribute(e,h.type)??((o=this._$Ej)==null?void 0:o.get(s))??null,this._$Em=null}}requestUpdate(t,e,i){var s;if(t!==void 0){const n=this.constructor,o=this[t];if(i??(i=n.getPropertyOptions(t)),!((i.hasChanged??Z)(o,e)||i.useDefault&&i.reflect&&o===((s=this._$Ej)==null?void 0:s.get(t))&&!this.hasAttribute(n._$Eu(t,i))))return;this.C(t,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:n},o){i&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var i;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[n,o]of s){const{wrapped:h}=o,a=this[n];h!==!0||this._$AL.has(n)||a===void 0||this.C(n,void 0,o,a)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(i=this._$EO)==null||i.forEach(s=>{var n;return(n=s.hostUpdate)==null?void 0:n.call(s)}),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(i=>{var s;return(s=i.hostUpdated)==null?void 0:s.call(i)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};E.elementStyles=[],E.shadowRootOptions={mode:"open"},E[M("elementProperties")]=new Map,E[M("finalized")]=new Map,q==null||q({ReactiveElement:E}),(_.reactiveElementVersions??(_.reactiveElementVersions=[])).push("2.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const N=globalThis,z=N.trustedTypes,et=z?z.createPolicy("lit-html",{createHTML:r=>r}):void 0,ct="$lit$",$=`lit$${Math.random().toFixed(9).slice(2)}$`,dt="?"+$,Et=`<${dt}>`,x=document,T=()=>x.createComment(""),H=r=>r===null||typeof r!="object"&&typeof r!="function",G=Array.isArray,St=r=>G(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",V=`[ 	
\f\r]`,U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,st=/-->/g,it=/>/g,m=RegExp(`>|${V}(?:([^\\s"'>=/]+)(${V}*=${V}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),rt=/'/g,nt=/"/g,pt=/^(?:script|style|textarea|title)$/i,wt=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),v=wt(1),w=Symbol.for("lit-noChange"),d=Symbol.for("lit-nothing"),ot=new WeakMap,A=x.createTreeWalker(x,129);function ut(r,t){if(!G(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return et!==void 0?et.createHTML(t):t}const Pt=(r,t)=>{const e=r.length-1,i=[];let s,n=t===2?"<svg>":t===3?"<math>":"",o=U;for(let h=0;h<e;h++){const a=r[h];let l,p,c=-1,u=0;for(;u<a.length&&(o.lastIndex=u,p=o.exec(a),p!==null);)u=o.lastIndex,o===U?p[1]==="!--"?o=st:p[1]!==void 0?o=it:p[2]!==void 0?(pt.test(p[2])&&(s=RegExp("</"+p[2],"g")),o=m):p[3]!==void 0&&(o=m):o===m?p[0]===">"?(o=s??U,c=-1):p[1]===void 0?c=-2:(c=o.lastIndex-p[2].length,l=p[1],o=p[3]===void 0?m:p[3]==='"'?nt:rt):o===nt||o===rt?o=m:o===st||o===it?o=U:(o=m,s=void 0);const f=o===m&&r[h+1].startsWith("/>")?" ":"";n+=o===U?a+Et:c>=0?(i.push(l),a.slice(0,c)+ct+a.slice(c)+$+f):a+$+(c===-2?h:f)}return[ut(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]};class R{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,o=0;const h=t.length-1,a=this.parts,[l,p]=Pt(t,e);if(this.el=R.createElement(l,i),A.currentNode=this.el.content,e===2||e===3){const c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(s=A.nextNode())!==null&&a.length<h;){if(s.nodeType===1){if(s.hasAttributes())for(const c of s.getAttributeNames())if(c.endsWith(ct)){const u=p[o++],f=s.getAttribute(c).split($),D=/([.?@])?(.*)/.exec(u);a.push({type:1,index:n,name:D[2],strings:f,ctor:D[1]==="."?Ot:D[1]==="?"?Ut:D[1]==="@"?Mt:I}),s.removeAttribute(c)}else c.startsWith($)&&(a.push({type:6,index:n}),s.removeAttribute(c));if(pt.test(s.tagName)){const c=s.textContent.split($),u=c.length-1;if(u>0){s.textContent=z?z.emptyScript:"";for(let f=0;f<u;f++)s.append(c[f],T()),A.nextNode(),a.push({type:2,index:++n});s.append(c[u],T())}}}else if(s.nodeType===8)if(s.data===dt)a.push({type:2,index:n});else{let c=-1;for(;(c=s.data.indexOf($,c+1))!==-1;)a.push({type:7,index:n}),c+=$.length-1}n++}}static createElement(t,e){const i=x.createElement("template");return i.innerHTML=t,i}}function P(r,t,e=r,i){var o,h;if(t===w)return t;let s=i!==void 0?(o=e._$Co)==null?void 0:o[i]:e._$Cl;const n=H(t)?void 0:t._$litDirective$;return(s==null?void 0:s.constructor)!==n&&((h=s==null?void 0:s._$AO)==null||h.call(s,!1),n===void 0?s=void 0:(s=new n(r),s._$AT(r,e,i)),i!==void 0?(e._$Co??(e._$Co=[]))[i]=s:e._$Cl=s),s!==void 0&&(t=P(r,s._$AS(r,t.values),s,i)),t}class Ct{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=((t==null?void 0:t.creationScope)??x).importNode(e,!0);A.currentNode=s;let n=A.nextNode(),o=0,h=0,a=i[0];for(;a!==void 0;){if(o===a.index){let l;a.type===2?l=new L(n,n.nextSibling,this,t):a.type===1?l=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(l=new Nt(n,this,t)),this._$AV.push(l),a=i[++h]}o!==(a==null?void 0:a.index)&&(n=A.nextNode(),o++)}return A.currentNode=x,s}p(t){let e=0;for(const i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class L{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=d,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=(s==null?void 0:s.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=P(this,t,e),H(t)?t===d||t==null||t===""?(this._$AH!==d&&this._$AR(),this._$AH=d):t!==this._$AH&&t!==w&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):St(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==d&&H(this._$AH)?this._$AA.nextSibling.data=t:this.T(x.createTextNode(t)),this._$AH=t}$(t){var n;const{values:e,_$litType$:i}=t,s=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=R.createElement(ut(i.h,i.h[0]),this.options)),i);if(((n=this._$AH)==null?void 0:n._$AD)===s)this._$AH.p(e);else{const o=new Ct(s,this),h=o.u(this.options);o.p(e),this.T(h),this._$AH=o}}_$AC(t){let e=ot.get(t.strings);return e===void 0&&ot.set(t.strings,e=new R(t)),e}k(t){G(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const n of t)s===e.length?e.push(i=new L(this.O(T()),this.O(T()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var i;for((i=this._$AP)==null?void 0:i.call(this,!1,!0,e);t&&t!==this._$AB;){const s=t.nextSibling;t.remove(),t=s}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class I{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,n){this.type=1,this._$AH=d,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=d}_$AI(t,e=this,i,s){const n=this.strings;let o=!1;if(n===void 0)t=P(this,t,e,0),o=!H(t)||t!==this._$AH&&t!==w,o&&(this._$AH=t);else{const h=t;let a,l;for(t=n[0],a=0;a<n.length-1;a++)l=P(this,h[i+a],e,a),l===w&&(l=this._$AH[a]),o||(o=!H(l)||l!==this._$AH[a]),l===d?t=d:t!==d&&(t+=(l??"")+n[a+1]),this._$AH[a]=l}o&&!s&&this.j(t)}j(t){t===d?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Ot extends I{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===d?void 0:t}}class Ut extends I{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==d)}}class Mt extends I{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){if((t=P(this,t,e,0)??d)===w)return;const i=this._$AH,s=t===d&&i!==d||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==d&&(i===d||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Nt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){P(this,t)}}const W=N.litHtmlPolyfillSupport;W==null||W(R,L),(N.litHtmlVersions??(N.litHtmlVersions=[])).push("3.3.0");const Tt=(r,t,e)=>{const i=(e==null?void 0:e.renderBefore)??t;let s=i._$litPart$;if(s===void 0){const n=(e==null?void 0:e.renderBefore)??null;i._$litPart$=s=new L(t.insertBefore(T(),n),n,void 0,e??{})}return s._$AI(r),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const b=globalThis;class S extends E{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Tt(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return w}}var at;S._$litElement$=!0,S.finalized=!0,(at=b.litElementHydrateSupport)==null||at.call(b,{LitElement:S});const J=b.litElementPolyfillSupport;J==null||J({LitElement:S});(b.litElementVersions??(b.litElementVersions=[])).push("4.2.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ft=r=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(r,t)}):customElements.define(r,t)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ht={attribute:!0,type:String,converter:k,reflect:!1,hasChanged:Z},Rt=(r=Ht,t,e)=>{const{kind:i,metadata:s}=e;let n=globalThis.litPropertyMetadata.get(s);if(n===void 0&&globalThis.litPropertyMetadata.set(s,n=new Map),i==="setter"&&((r=Object.create(r)).wrapped=!0),n.set(e.name,r),i==="accessor"){const{name:o}=e;return{set(h){const a=t.get.call(this);t.set.call(this,h),this.requestUpdate(o,a,r)},init(h){return h!==void 0&&this.C(o,void 0,r,h),h}}}if(i==="setter"){const{name:o}=e;return function(h){const a=this[o];t.call(this,h),this.requestUpdate(o,a,r)}}throw Error("Unsupported decorator location: "+i)};function y(r){return(t,e)=>typeof e=="object"?Rt(r,t,e):((i,s,n)=>{const o=s.hasOwnProperty(n);return s.constructor.createProperty(n,i),o?Object.getOwnPropertyDescriptor(s,n):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Lt(r){return y({...r,state:!0,attribute:!1})}var Dt=Object.defineProperty,jt=Object.getOwnPropertyDescriptor,B=(r,t,e,i)=>{for(var s=i>1?void 0:i?jt(t,e):t,n=r.length-1,o;n>=0;n--)(o=r[n])&&(s=(i?o(t,e,s):o(s))||s);return i&&s&&Dt(t,e,s),s};let C=class extends S{constructor(){super(...arguments),this.src="",this.index=0,this.charts=[]}connectedCallback(){super.connectedCallback(),this.src&&fetch(this.src).then(r=>{if(!r.ok)throw new Error(`Fetch failed: ${r.status}`);return r.json()}).then(r=>{this.charts=Array.isArray(r)?r:[r],console.log(this.charts)}).catch(r=>console.error("Error loading chart data:",r))}render(){const r=this.charts[this.index];return r?v`
      <div class="wrapper">
        <bar-chart
          .data=${r.data}
          unit=${r.unit}
          variant=${r.variant}
        ></bar-chart>
      </div>
    `:v`<div>Loading chart #${this.index+1}...</div>`}};C.styles=lt`
  :host {
    display: block;
    width: 100%;
    height: 100%;
  }
  .wrapper {
    display: flex;
    justify-content: center;

    /* These are new: */
    width: 100%;
    height: 100%;
  }
`;B([y({type:String})],C.prototype,"src",2);B([y({type:Number})],C.prototype,"index",2);B([Lt()],C.prototype,"charts",2);C=B([ft("chart-list")],C);var kt=Object.defineProperty,zt=Object.getOwnPropertyDescriptor,O=(r,t,e,i)=>{for(var s=i>1?void 0:i?zt(t,e):t,n=r.length-1,o;n>=0;n--)(o=r[n])&&(s=(i?o(t,e,s):o(s))||s);return i&&s&&kt(t,e,s),s};let g=class extends S{constructor(){super(...arguments),this.data=[],this.unit="",this.variant="day",this.labels=[]}connectedCallback(){super.connectedCallback(),this.hasAttribute("variant")&&(this.variant=this.getAttribute("variant"));const r=this.getAttribute("data");if(r)try{const e=JSON.parse(r);Array.isArray(e)&&(this.data=e)}catch{}if(this.hasAttribute("max")){const e=Number(this.getAttribute("max"));isNaN(e)||(this.max=e)}this.hasAttribute("unit")&&(this.unit=this.getAttribute("unit"));const t=this.getAttribute("labels");if(t)try{const e=JSON.parse(t);Array.isArray(e)&&e.length===this.data.length&&(this.labels=e)}catch{}this.labels.length||(this.variant==="week"&&this.data.length===7?this.labels=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]:this.data.length===24?this.labels=Array.from({length:24},(e,i)=>{const s=i%12===0?12:i%12,n=i<12?"am":"pm";return`${s} ${n}`}):this.variant==="month"&&this.data.length===31?this.labels=Array.from({length:31},(e,i)=>String(i+1)):this.variant==="year"&&this.data.length===12?this.labels=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]:this.labels=this.data.map((e,i)=>String(i)))}render(){const r=Math.max(...this.data,0),t=this.max??r,e=Math.ceil(t/4/5)*5,i=e*4,s=[0,1,2,3,4].map(a=>({pct:100-a*e/i*100,val:a*e})),o=`grid-template-columns: repeat(${this.data.length}, 1fr)`;let h;return this.data.length===24?h=[0,6,12,18]:this.variant==="month"?h=[4,9,14,19,24,29]:this.variant==="year"?h=this.labels.map((a,l)=>l):h=this.data.map((a,l)=>l),v`
      <div class="chart">
        <svg class="grid">
          ${s.map(a=>v`<line x1="0%" y1="${a.pct}%" x2="100%" y2="${a.pct}%"></line>`)}
        </svg>

        <div class="bars" style="${o}">
          ${this.data.map(a=>v`<div class="bar" style="height:${a/i*100}%"></div>`)}
        </div>

        <div class="x-axis" style="${o}">
          ${this.labels.map((a,l)=>v`<div>${h.includes(l)?a:""}</div>`)}
        </div>

        <div class="y-axis">
          ${[...s].reverse().map(a=>v`<span>${a.val}</span>`)}
        </div>
        <div class="y-unit">${this.unit}</div>
      </div>
    `}};g.styles=lt`
    :host {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
    }
    .chart {
      position: absolute; inset: 0;
      padding: 16px 48px 32px 16px;
      box-sizing: border-box;
      background: var(--color-box, #fff);
      border-radius: var(--box-radius, 20px);
      overflow: hidden;
    }
    svg.grid {
      position: absolute;
      top: 16px; bottom: 32px;
      left: 16px; right: 48px;
      width: 100%;
      height: 100%;
    }
    line {
      stroke: var(--axis-color, #ddd);
      stroke-width: 1;
    }
    .bars {
      display: grid;
      position: absolute; top: 16px; bottom: 32px;
      left: 16px; right: 48px;
      align-items: end;
      gap: 2px;
    }
    :host([variant="week"]) .bars { gap: 10px; }
    .bar {
      background: var(--bar-color, #3481eb);
      border-radius: 3px 3px 0 0;
    }
    :host([variant="week"]) .bar {
      border-radius: 6px 6px 0 0;
    }
    .x-axis {
      position: absolute; bottom: 8px;
      left: 16px; right: 48px;
      display: grid;
      font-size: 12px;
      color: var(--label-color, #888);
      pointer-events: none;
    }
    .x-axis div {
      text-align: center;
      white-space: nowrap;
    }
    .y-axis {
      position: absolute;
      top: 16px; bottom: 32px;
      right: 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-end;
      font-size: 12px;
      color: var(--label-color, #888);
      pointer-events: none;
    }
    .y-unit {
      position: absolute; top: 4px; right: 16px;
      font-size: 14px;
      font-weight: bold;
      color: var(--label-color, #888);
    }
  `;O([y({type:Array})],g.prototype,"data",2);O([y({type:String})],g.prototype,"unit",2);O([y({type:String})],g.prototype,"variant",2);O([y({type:Number})],g.prototype,"max",2);O([y({type:Array})],g.prototype,"labels",2);g=O([ft("bar-chart")],g);
