export const cleaningFAQs = [
  {
    question: 'What is included in a full-home clean?',
    answer: 'The team works through reachable surfaces, floors, kitchen and bathrooms according to the selected package. Check the service checklist before booking for the exact scope.',
  },
  {
    question: 'Do I need to provide cleaning equipment?',
    answer: 'The demo package assumes the cleaner brings standard tools and products. Special requests and product sensitivities can be added to your booking notes.',
  },
  {
    question: 'Should someone be at home during the visit?',
    answer: 'We recommend having a contact person available at arrival so they can share access instructions and point out priority areas.',
  },
  {
    question: 'Can I book only selected rooms?',
    answer: 'Yes. Choose “Build a room-by-room clean” and select the rooms you want included. The displayed total updates as you customize.',
  },
  {
    question: 'Can I change or cancel after booking?',
    answer: 'The demo lets you request a cancellation or another time from booking details. In a live service, change windows and fees would be shown before confirming.',
  },
];

export const sampleReviews = [
  {
    name: 'Meena R.',
    area: 'Adyar',
    rating: 5,
    text: 'The team paid attention to the kitchen corners and left the rooms feeling fresh.',
  },
  {
    name: 'Arun K.',
    area: 'Velachery',
    rating: 5,
    text: 'Booking was straightforward and the cleaner arrived within the selected window.',
  },
  {
    name: 'Divya S.',
    area: 'Anna Nagar',
    rating: 4,
    text: 'Helpful service and a clear checklist. I liked being able to add the balcony.',
  },
];

export const mockPromotions = [
  {code:'TIDY10',title:'10% off your cleaning',description:'Demo offer · save up to ₹500',kind:'percent' as const,value:10,maximum:500},
  {code:'FIRST200',title:'₹200 off your first clean',description:'Demo offer · minimum cart ₹1,500',kind:'flat' as const,value:200,minimum:1500},
];
