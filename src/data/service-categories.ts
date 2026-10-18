import type {Service,ServiceCategoryKey} from '../types';

export type ServiceCategoryId='home-services'|'room'|'fabric'|'specialty';
type ServiceGroup='all'|ServiceCategoryKey;

export type ServiceCategoryDefinition={
  id:ServiceCategoryId;
  title:string;
  description:string;
  imageId:string;
  serviceGroup:ServiceGroup;
};

export const serviceCategories:ServiceCategoryDefinition[]=[
  {id:'home-services',title:'Home services',description:'Browse all available home-cleaning services',imageId:'home',serviceGroup:'all'},
  {id:'room',title:'Room cleaning',description:'Bathroom, kitchen and other room-specific cleaning',imageId:'floor',serviceGroup:'room'},
  {id:'fabric',title:'Fabric care',description:'Refresh sofas and carpeted spaces',imageId:'sofa',serviceGroup:'fabric'},
  {id:'specialty',title:'Specialty care',description:'Water tank, sump and chimney cleaning',imageId:'tank',serviceGroup:'specialty'}
];

export function categoryKeyForLabel(label:string):ServiceCategoryKey{
  switch(label){
    case 'Room':return 'room';
    case 'Fabric':return 'fabric';
    case 'Specialty':return 'specialty';
    case 'Home':return 'home';
    default:throw new Error(`Unsupported service category label: ${label}`);
  }
}

export function getActiveServices(services:Service[]):Service[]{
  return services
    .filter(service=>service.active&&!service.paused)
    .sort((left,right)=>left.name.localeCompare(right.name)||left.id.localeCompare(right.id));
}

export function getServicesForCategory(services:Service[],categoryId:string):Service[]{
  const category=serviceCategories.find(item=>item.id===categoryId);
  if(!category)return [];

  const activeServices=getActiveServices(services);
  if(category.serviceGroup==='all')return activeServices;
  return activeServices.filter(service=>service.categoryId===category.serviceGroup);
}
