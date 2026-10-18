export type ServiceCategoryId=
  |'bathroom'
  |'kitchen'
  |'full-home'
  |'room-partial'
  |'fabric'
  |'specialty';

export type ServiceCategoryDefinition={
  id:ServiceCategoryId;
  title:string;
  description:string;
  imageId:string;
  serviceIds:string[];
};

export const serviceCategories:ServiceCategoryDefinition[]=[
  {id:'bathroom',title:'Bathroom cleaning',description:'Bathroom deep cleaning and detailing',imageId:'bath',serviceIds:['bath']},
  {id:'kitchen',title:'Kitchen cleaning',description:'Kitchen deep clean and chimney care',imageId:'kitchen',serviceIds:['kitchen','chimney']},
  {id:'full-home',title:'Full home cleaning',description:'Apartment, house and move-in cleans',imageId:'home',serviceIds:['home','move','postreno']},
  {id:'room-partial',title:'Room & partial home',description:'Floors, windows, balconies and selected rooms',imageId:'balcony',serviceIds:['balcony','windows','floor']},
  {id:'fabric',title:'Sofa & fabric care',description:'Refresh sofas and carpeted spaces',imageId:'sofa',serviceIds:['sofa','carpet']},
  {id:'specialty',title:'Specialty cleaning',description:'Water tank and sump cleaning',imageId:'tank',serviceIds:['tank','sump']}
];
