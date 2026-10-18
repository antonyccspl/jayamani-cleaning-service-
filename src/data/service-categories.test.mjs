import assert from 'node:assert/strict';
import test from 'node:test';
import {seedServices} from './services.ts';
import {categoryKeyForLabel,getActiveServices,getServicesForCategory,serviceCategories} from './service-categories.ts';

test('Room cleaning contains only the five Room-classified services',()=>{
  const room=getServicesForCategory(seedServices,'room');
  assert.equal(room.length,5);
  assert.deepEqual(room.map(service=>service.id),['balcony','bath','floor','kitchen','windows']);
  assert.ok(room.every(service=>service.categoryId==='room'));
});

test('Home services returns all thirteen active catalogue services',()=>{
  assert.equal(getServicesForCategory(seedServices,'home-services').length,13);
});

test('Fabric care returns its two configured services',()=>{
  assert.deepEqual(getServicesForCategory(seedServices,'fabric').map(service=>service.id),['carpet','sofa']);
});

test('Specialty care returns its three configured services',()=>{
  assert.deepEqual(getServicesForCategory(seedServices,'specialty').map(service=>service.id),['chimney','sump','tank']);
});

test('Invalid category ids safely return an empty list',()=>{
  assert.deepEqual(getServicesForCategory(seedServices,'not-a-category'),[]);
  assert.throws(()=>categoryKeyForLabel('Unknown'),/Unsupported service category label/);
  const invalidService={...seedServices[0],id:'invalid-category',categoryId:'missing'};
  assert.equal(getServicesForCategory([...seedServices,invalidService],'room').some(service=>service.id===invalidService.id),false);
});

test('Empty categories stay empty, and category changes do not retain prior results',()=>{
  const noFabric=seedServices.filter(service=>service.categoryId!=='fabric');
  const room=getServicesForCategory(seedServices,'room');
  const fabric=getServicesForCategory(noFabric,'fabric');
  assert.equal(room.length,5);
  assert.deepEqual(fabric,[]);
});

test('Category counts use the same active and unpaused set as listings',()=>{
  const services=seedServices.map(service=>service.id==='bath'?{...service,paused:true}:service);
  for(const category of serviceCategories){
    const count=getServicesForCategory(services,category.id).length;
    const active=getActiveServices(services);
    const expected=category.serviceGroup==='all'
      ? active
      : active.filter(service=>service.categoryId===category.serviceGroup);
    assert.equal(count,expected.length);
  }
  assert.equal(getServicesForCategory(services,'room').length,4);
});

test('All services includes active admin additions but excludes inactive or paused services',()=>{
  const services=[...seedServices,{...seedServices[0],id:'admin-added',name:'Admin added clean',category:'Home'}];
  assert.equal(getServicesForCategory(services,'home-services').length,14);
  assert.equal(getServicesForCategory(services.map(service=>service.id==='admin-added'?{...service,paused:true}:service),'home-services').length,13);
});

test('Category ids are unique and service ids in the source catalogue are unique',()=>{
  assert.equal(new Set(serviceCategories.map(category=>category.id)).size,serviceCategories.length);
  assert.equal(new Set(seedServices.map(service=>service.id)).size,seedServices.length);
  assert.ok(seedServices.every(service=>service.categoryId===categoryKeyForLabel(service.category)));
});
