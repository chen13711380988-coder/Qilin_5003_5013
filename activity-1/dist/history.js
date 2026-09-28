'use strict';
// Local calendar dates, including daylight-saving changes, rather than UTC dates.
const PauseHistory = (() => {
  const key='pause-and-break-history-v1';
  const dateKey=date=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  function splitInterval(start,end,visit){
    while(start<end){const d=new Date(start);const next=new Date(d.getFullYear(),d.getMonth(),d.getDate()+1).getTime();const stop=Math.min(next,end);visit(dateKey(d),stop-start);start=stop}
  }
  function period(mode,offset=0,now=new Date()){
    const start=new Date(now.getFullYear(),now.getMonth(),now.getDate());
    if(mode==='week'){start.setDate(start.getDate()-(start.getDay()+6)%7+offset*7)}
    else if(mode==='month'){start.setDate(1);start.setMonth(start.getMonth()+offset)}
    else start.setDate(start.getDate()+offset);
    const end=new Date(start);
    if(mode==='month')end.setMonth(end.getMonth()+1);else end.setDate(end.getDate()+(mode==='week'?7:1));
    const days=[];for(let d=new Date(start);d<end;d.setDate(d.getDate()+1))days.push(dateKey(d));
    return {start,end,days};
  }
  function clean(value){
    const result={};if(!value||typeof value!=='object'||Array.isArray(value))return result;
    for(const [day,row] of Object.entries(value)){
      if(!/^\d{4}-\d{2}-\d{2}$/.test(day)||!row||typeof row!=='object')continue;
      const focus=Number(row.focus),rest=Number(row.rest);
      if(Number.isFinite(focus)&&Number.isFinite(rest)&&focus>=0&&rest>=0&&focus+rest<=86400000*1.05)result[day]={focus,rest};
    }return result;
  }
  function create(storage,onFailure=()=>{}){
    let records={},available=true;
    function reload(){if(!available)return;try{records=clean(JSON.parse(storage.getItem(key)||'{}'))}catch{available=false;onFailure()}}
    function save(){try{storage.setItem(key,JSON.stringify(records))}catch{available=false;onFailure()}}
    reload();
    return {reload,save,get available(){return available},get records(){return records},
      add(start,end,phase){if(!['focus','rest'].includes(phase)||!Number.isFinite(start)||!Number.isFinite(end)||end<=start)return;splitInterval(start,end,(day,ms)=>{records[day]??={focus:0,rest:0};records[day][phase]+=ms})},
      totals(days){return days.reduce((out,day)=>{const row=records[day];if(row){out.focus+=row.focus;out.rest+=row.rest}return out},{focus:0,rest:0})}
    };
  }
  return {create,dateKey,splitInterval,period,key};
})();
