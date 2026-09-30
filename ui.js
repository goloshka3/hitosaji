export const h=(tag,props={},...children)=>{const el=document.createElement(tag);for(const [k,v] of Object.entries(props)){if(k.startsWith('on'))el.addEventListener(k.slice(2).toLowerCase(),v);else if(k==='class')el.className=v;else if(k==='value')el.value=v;else if(k==='checked')el.checked=v;else if(v!==false&&v!==null&&v!==undefined)el.setAttribute(k,v===true?'':v);}for(const c of children.flat(Infinity))if(c!==null&&c!==undefined&&c!==false)el.append(c instanceof Node?c:document.createTextNode(String(c)));return el;};
export const safe=fn=>async(...args)=>{try{return await fn(...args);}catch(e){toast(e.message||'処理できませんでした。');}};
export const btn=(text,fn,cls='secondary',props={})=>h('button',{type:'button',class:cls,onClick:safe(fn),...props},text);
export const link=(text,href,cls='text-btn')=>h('a',{href,class:cls},text);
export const card=(...children)=>h('section',{class:'card'},children);
export const note=(text,kind='')=>h('div',{class:'notice '+kind},text);
export const label=(text,input)=>h('label',{class:'field'},text,input);
export const number=(value,props={})=>h('input',{type:'number',min:0,step:'any',inputmode:'decimal',value:value??'',...props});
export const inputValue=el=>el.value.trim()===''?null:Number(el.value);
export const title=(name,caption='',extra=null)=>h('section',{class:'page-heading'},h('div',{},h('p',{class:'eyebrow'},caption),h('h1',{},name)),extra);
export const empty=text=>h('div',{class:'empty'},h('span',{class:'empty-icon'},'◌'),text);
export const pill=(text,kind='')=>h('span',{class:'pill '+kind},text);
export const dialog=document.querySelector('#dialog'),dialogBody=document.querySelector('#dialog-body');
let timer;
export function toast(text,action){const el=document.querySelector('#toast');clearTimeout(timer);el.replaceChildren(h('span',{},text));if(action)el.append(btn(action.label,action.run,''));el.hidden=false;timer=setTimeout(()=>el.hidden=true,action?9000:6500);}
export function ask(titleText,message,choices=[['キャンセル',false],['続ける',true]]){return new Promise(resolve=>{const finish=value=>{dialog.close();resolve(value);};dialogBody.replaceChildren(h('h2',{},titleText),h('p',{},message),h('div',{class:'row'},choices.map(([text,value],i)=>btn(text,()=>finish(value),i===choices.length-1?'primary':'secondary'))));dialog.oncancel=()=>resolve(false);dialog.showModal();});}
