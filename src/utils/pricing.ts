import { Service } from '../types';
export const customHomeRooms=[
 {id:'living-room',name:'Living room',price:599},
 {id:'bedroom',name:'Bedroom',price:399},
 {id:'bathroom',name:'Bathroom',price:349},
 {id:'kitchen',name:'Kitchen',price:649},
 {id:'balcony',name:'Balcony',price:249}
];
export function quote(service:Service,requirements:Record<string,string>,addonIds:string[]) {
 const lines:{label:string;amount:number}[]=[{label:service.name,amount:service.price}];
 const rooms=(requirements.rooms||'').split(',').map(room=>room.trim()).filter(Boolean);
 rooms.forEach(id=>{const room=customHomeRooms.find(option=>option.id===id);if(room)lines.push({label:`${room.name} clean`,amount:room.price});});
 if (requirements.bhk) { const tier={'Studio / 1 BHK':0,'2 BHK':550,'3 BHK':1050,'4 BHK':1600,'5+ BHK':2200}[requirements.bhk]??0; if(tier) lines.push({label:`${requirements.bhk} package`,amount:tier}); }
 if (requirements.kitchenSize) { const tier={'Compact kitchen':0,'Standard kitchen':250,'Large kitchen':500}[requirements.kitchenSize]??0; if(tier) lines.push({label:`${requirements.kitchenSize} detail`,amount:tier}); }
 if(requirements.occupancy==='Occupied home') lines.push({label:'Occupied home detail',amount:350});
 if(requirements.floors==='2 floors') lines.push({label:'Additional floor',amount:250}); if(requirements.floors==='3 floors'||requirements.floors==='4+ floors') lines.push({label:'Additional floors',amount:500});
 if(requirements.condition==='Heavy dirt / grease') lines.push({label:'Heavy condition',amount:400}); if(requirements.condition==='Post-renovation') lines.push({label:'Post-renovation detail',amount:900});
 const baths=Number(requirements.bathrooms?.[0]); if(baths>1) lines.push({label:'Additional bathrooms',amount:(baths-1)*250});
 addonIds.forEach(id=>{const addon=service.addons.find(a=>a.id===id);if(addon)lines.push({label:addon.name,amount:addon.price});});
 const subtotal=lines.reduce((s,l)=>s+l.amount,0); const discount=service.discount?Math.round(subtotal*service.discount/100):0;
 if(discount)lines.push({label:`Demo offer (${service.discount}%)`,amount:-discount});
 return {lines,total:Math.max(service.price,subtotal-discount)};
}
