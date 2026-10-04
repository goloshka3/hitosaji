import {DEFINITIONS} from './nutrition.js';
export function manualAnalysis(name,values={}){
 const productName=name.trim();
 if(!productName)throw new Error('食事名を入力してください。');
 const estimatedNutrients=DEFINITIONS.filter(d=>values[d.id]!==null&&values[d.id]!==undefined).map(d=>{
  const value=values[d.id];
  if(typeof value!=='number'||!Number.isFinite(value)||value<0)throw new Error(d.label+'は0以上の数値を入力してください。');
  return {id:d.id,value,unit:d.unit};
 });
 return {analysisType:'prepared_dish',productName,manufacturer:'',netAmount:{value:null,unit:'g'},nutritionBasis:{value:1,unit:'package'},declaredNutrients:[],estimatedNutrients,ingredients:[],estimatedComponents:[],consumedAmountCandidate:{value:1,unit:'package'},confidence:0,warnings:['緊急手入力の記録です。未入力の栄養値は不明です。'],needsMoreImages:false,cookingMethod:'',estimationNotes:'利用者が食べた分の合計を手入力。自動解析・補完はしていません。'};
}
