export type FieldKey = 'property'|'occupancy'|'bhk'|'area'|'floors'|'bathrooms'|'condition';
export type Service = { id:string; name:string; category:string; description:string; price:number; duration:number; active:boolean; paused?:boolean; leadDays:number; weekdays:number[]; slots:string[]; fields:FieldKey[]; addons:{id:string;name:string;price:number}[]; includes:string[]; excludes:string[]; discount?:number };
export type BookingStatus = 'awaiting_assignment'|'awaiting_employee_acceptance'|'assigned'|'en_route'|'arrived'|'in_progress'|'completed'|'cancelled';
export type Booking = {id:string;serviceId:string;serviceName:string;customerName:string;phone:string;address:string;area:string;date:string;slot:string;requirements:Record<string,string>;addons:string[];breakdown:{label:string;amount:number}[];total:number;status:BookingStatus;employeeId?:string;createdAt:string;timeline:string[]};
export type Application = {id:string;name:string;phone:string;skills:string[];experience:string;area:string;hours:string;status:'Pending'|'Approved'|'Rejected';active:boolean};
export type Activity = {id:string;message:string;time:string};
