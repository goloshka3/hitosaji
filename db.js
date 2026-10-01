export const STORES=['settings','products','productVersions','intakeLogs','pendingCaptures'];
let connection;
export function openDB(){if(connection)return connection;connection=new Promise((resolve,reject)=>{const r=indexedDB.open('hitosaji-nutrition',1);r.onupgradeneeded=()=>{for(const s of STORES)r.result.createObjectStore(s,{keyPath:'id'});};r.onsuccess=()=>{r.result.onversionchange=()=>{r.result.close();connection=null;};resolve(r.result);};r.onerror=()=>reject(new Error('端末への保存が使えません。Safariのストレージ設定を確認してください。'));});return connection;}
export async function all(store){const db=await openDB();return new Promise((resolve,reject)=>{const r=db.transaction(store).objectStore(store).getAll();r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(new Error('記録を読み込めませんでした。'));});}
export async function transact(stores,action){const db=await openDB();return new Promise((resolve,reject)=>{const tx=db.transaction(stores,'readwrite');tx.oncomplete=()=>resolve();tx.onerror=tx.onabort=()=>reject(new Error('保存できませんでした。端末の空き容量を確認してください。'));try{action(tx);}catch(e){tx.abort();reject(e);}});}
export const put=(store,value)=>transact([store],tx=>tx.objectStore(store).put(value));
export const remove=(store,id)=>transact([store],tx=>tx.objectStore(store).delete(id));
export async function readState(){const rows=await Promise.all(STORES.map(all));return Object.fromEntries(STORES.map((s,i)=>[s,rows[i]]));}
export function saveIntake(product,version,log,captureId){return transact(['products','productVersions','intakeLogs','pendingCaptures'],tx=>{if(product)tx.objectStore('products').put(product);if(version)tx.objectStore('productVersions').put(version);tx.objectStore('intakeLogs').add(log);if(captureId)tx.objectStore('pendingCaptures').delete(captureId);});}
export function replaceData(data){return transact(STORES,tx=>{for(const s of STORES){const os=tx.objectStore(s);os.clear();const values=s==='pendingCaptures'?[]:s==='settings'?[{...data.settings,id:'preferences'},{id:'goals',value:data.nutrientGoals},{id:'backupStatus',lastExportAt:data.exportedAt}]:data[s];for(const value of values)os.add(value);}});}

