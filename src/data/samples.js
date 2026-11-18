export const SAMPLE_ORDERS = [
  { id: 'ORD-1A2B3', customer: 'Riya Sharma', date: '10 Nov 2026, 8:15 PM', status: 'Served',
    items: [{ name: 'Royal Dum Biryani', qty: 2, price: 799 }, { name: 'Saffron Citrus Spritz', qty: 2, price: 349 }], total: 2411 },
  { id: 'ORD-4C5D6', customer: 'Arjun Mehta', date: '11 Nov 2026, 7:40 PM', status: 'Preparing',
    items: [{ name: 'Wood-Fired Margherita', qty: 1, price: 599 }, { name: 'Molten Gold Lava Cake', qty: 1, price: 449 }], total: 1100 },
  { id: 'ORD-7E8F9', customer: 'Sana Khan', date: '11 Nov 2026, 9:05 PM', status: 'New',
    items: [{ name: 'Smoked Truffle Burger', qty: 2, price: 649 }, { name: 'Smoked Berry Cooler', qty: 1, price: 329 }], total: 1708 },
]

export const SAMPLE_RESERVATIONS = [
  { id: 'AUR-K9X2M', name: 'Neha Verma', phone: '', date: '2026-11-15', time: '8:00 PM', guests: 4, occasion: 'Birthday', status: 'Confirmed' },
  { id: 'AUR-P3Q7R', name: 'Rohan Das', phone: '', date: '2026-11-16', time: '7:30 PM', guests: 2, occasion: 'Anniversary', status: 'Pending' },
  { id: 'AUR-T5V1W', name: 'Ishita Rao', phone: '', date: '2026-11-18', time: '9:00 PM', guests: 6, occasion: 'Business', status: 'Pending' },
]

export const SAMPLE_MESSAGES = [
  { id: 'MSG-1', name: 'Karan Patel', email: 'karan@example.com', date: '9 Nov 2026', message: 'Do you offer a private dining room for 12 people?' },
  { id: 'MSG-2', name: 'Meera Nair', email: 'meera@example.com', date: '10 Nov 2026', message: 'Loved the biryani! Is there a vegetarian version?' },
]