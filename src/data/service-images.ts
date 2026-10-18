import {ImageSourcePropType} from 'react-native';

const serviceImages:Record<string,ImageSourcePropType>={
  home:require('../../assets/services/home-interior.jpg'),
  interior:require('../../assets/services/home-interior.jpg'),
  bath:require('../../assets/services/bathroom-cleaning.jpg'),
  kitchen:require('../../assets/services/kitchen-deep-clean.jpg'),
  chimney:require('../../assets/services/chimney-cleaning.jpg'),
  sofa:require('../../assets/services/sofa-cleaning.jpg'),
  carpet:require('../../assets/services/carpet-cleaning.jpg'),
  move:require('../../assets/services/move-cleaning.jpg'),
  postreno:require('../../assets/services/post-renovation-cleaning.jpg'),
  tank:require('../../assets/services/water-tank.jpg'),
  sump:require('../../assets/services/sump-cleaning.jpg'),
  balcony:require('../../assets/services/balcony-cleaning.jpg'),
  windows:require('../../assets/services/home-cleaning.jpg'),
  floor:require('../../assets/services/floor-cleaning.jpg')
};

export const servicePhoto=(id:string)=>serviceImages[id]||serviceImages.home;
