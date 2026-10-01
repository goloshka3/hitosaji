export async function storageStatus(request=false){
  const api=globalThis.navigator?.storage;
  if(!api?.persisted)return {state:'unsupported',label:'このブラウザでは保存保護の状態を確認できません'};
  try{
    const granted=request&&api.persist?await api.persist():await api.persisted();
    return {state:granted?'granted':'not-granted',label:granted?'保存保護が許可されています':'保存保護は許可されていません'};
  }catch{return {state:'error',label:'保存保護の状態を確認できませんでした'};}
}
export function backupDue(logs,lastExportAt,now=Date.now()){
  if(!logs.length)return false;
  const date=Date.parse(lastExportAt);
  return !Number.isFinite(date)||date>now||now-date>=7*86400000;
}
