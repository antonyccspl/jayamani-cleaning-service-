import {ImageSourcePropType} from 'react-native';

const serviceImages:Record<string,ImageSourcePropType>={
  home:require('../../assets/services/home-cleaning.jpg'),
  'full-home-cleaning':require('../../assets/services/home-cleaning.jpg'),
  interior:require('../../assets/services/home-cleaning.jpg'),
  'home-interior':require('../../assets/services/home-cleaning.jpg'),
  bath:require('../../assets/services/bathroom-cleaning.jpg'),
  bathroom:require('../../assets/services/bathroom-cleaning.jpg'),
  'bathroom-cleaning':require('../../assets/services/bathroom-cleaning.jpg'),
  kitchen:require('../../assets/services/kitchen-deep-clean.jpg'),
  'kitchen-deep-clean':require('../../assets/services/kitchen-deep-clean.jpg'),
  'kitchen-cleaning':require('../../assets/services/kitchen-deep-clean.jpg'),
  chimney:require('../../assets/services/chimney-cleaning.jpg'),
  'chimney-cleaning':require('../../assets/services/chimney-cleaning.jpg'),
  sofa:require('../../assets/services/sofa-cleaning.jpg'),
  'sofa-upholstery':require('../../assets/services/sofa-cleaning.jpg'),
  carpet:require('../../assets/services/carpet-cleaning.jpg'),
  'carpet-cleaning':require('../../assets/services/carpet-cleaning.jpg'),
  move:require('../../assets/services/move-cleaning.jpg'),
  'move-in-move-out':require('../../assets/services/move-cleaning.jpg'),
  postreno:require('../../assets/services/post-renovation-cleaning.jpg'),
  'post-renovation-cleaning':require('../../assets/services/post-renovation-cleaning.jpg'),
  tank:require('../../assets/services/water-tank.jpg'),
  'water-tank':require('../../assets/services/water-tank.jpg'),
  sump:require('../../assets/services/sump-cleaning.jpg'),
  'sump-cleaning':require('../../assets/services/sump-cleaning.jpg'),
  balcony:require('../../assets/services/balcony-cleaning.jpg'),
  'balcony-refresh':require('../../assets/services/balcony-cleaning.jpg'),
  windows:require('../../assets/services/home-cleaning.jpg'),
  'windows-grills':require('../../assets/services/home-cleaning.jpg'),
  floor:require('../../assets/services/floor-cleaning.jpg'),
  'floor-care':require('../../assets/services/floor-cleaning.jpg'),
  'home-cleaning':require('../../assets/services/home-cleaning.jpg')
};

export const servicePhoto=(id:string)=>{
  const key=(id||'').toLowerCase().trim();
  const normalized=key.replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  return serviceImages[normalized] || serviceImages[key] || serviceImages['home-cleaning'];
};
