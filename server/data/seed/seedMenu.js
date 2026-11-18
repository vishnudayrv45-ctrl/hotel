import { pathToFileURL } from 'node:url'
import { read, write } from '../db/store.js'

const IMG = {
  burger: '/images/menu/burger.jpg',
  pizza: '/images/menu/pizza.jpg',
  biryani: '/images/menu/biryani.jpg',
  cake: '/images/menu/cake.jpg',
  pasta: '',
  drink: '',
}

export const MENU = [
  { id: 'truffle-burger', name: 'Smoked Truffle Burger', cat: 'Burgers', kind: 'burger', tone: '#f2b53d', accent: '#f2b53d', emoji: '🍔', price: 649, veg: false, spice: 1, cal: 780, time: '14 min', image: IMG.burger,
    tagline: 'Black garlic aioli, aged cheddar',
    desc: 'A dry-aged wagyu blend patty seared over embers, draped in molten cheddar and finished with whipped truffle mayo on a butter-toasted brioche.',
    ingredients: ['Brioche bun', 'Wagyu-blend patty', 'Aged cheddar', 'Truffle mayo', 'Pickled shallots', 'Butter lettuce'] },
  { id: 'ember-stack', name: 'Ember Double Stack', cat: 'Burgers', kind: 'burger', tone: '#f08a24', accent: '#f08a24', emoji: '🍔', price: 749, veg: false, spice: 2, cal: 1020, time: '16 min', image: IMG.burger,
    tagline: 'Two patties, smoked chilli jam',
    desc: 'Two flame-kissed patties, charred jalapeño, smoked chilli jam and double cheese — stacked tall and built to be messy.',
    ingredients: ['Potato bun', 'Double patty', 'Smoked chilli jam', 'Jalapeño', 'Cheddar', 'Crispy onions'] },
  { id: 'margherita', name: 'Wood-Fired Margherita', cat: 'Pizzas', kind: 'pizza', tone: '#c0392b', accent: '#e0553f', emoji: '🍕', price: 599, veg: true, spice: 0, cal: 640, time: '12 min', image: IMG.pizza,
    tagline: '72-hour dough, San Marzano tomato',
    desc: 'Naples-style dough fermented for three days, blistered at 450°C in our oak-fired oven with buffalo mozzarella and fresh basil.',
    ingredients: ['72h sourdough', 'San Marzano tomato', 'Buffalo mozzarella', 'Basil', 'Olive oil', 'Sea salt'] },
  { id: 'diavola', name: 'Diavola Inferno', cat: 'Pizzas', kind: 'pizza', tone: '#8e1b10', accent: '#d9381e', emoji: '🍕', price: 699, veg: false, spice: 3, cal: 760, time: '12 min', image: IMG.pizza,
    tagline: 'Spicy salami, hot honey',
    desc: 'Cupping pepperoni, Calabrian chilli, mozzarella and a finishing drizzle of hot honey. Not for the faint-hearted.',
    ingredients: ['Sourdough', 'Spicy salami', 'Calabrian chilli', 'Mozzarella', 'Hot honey', 'Oregano'] },
  { id: 'royal-biryani', name: 'Royal Dum Biryani', cat: 'Biryani', kind: 'biryani', tone: '#f3dfa6', accent: '#e3a93b', emoji: '🍛', price: 799, veg: false, spice: 2, cal: 890, time: '25 min', image: IMG.biryani,
    tagline: 'Sealed handi, saffron & rose',
    desc: 'Aged basmati and slow-marinated chicken, sealed in dough and steamed for hours with saffron, mint, fried onions and kewra.',
    ingredients: ['Aged basmati', 'Marinated chicken', 'Saffron', 'Mint', 'Fried onions', 'Kewra water'] },
  { id: 'saffron-lamb', name: 'Saffron Lamb Biryani', cat: 'Biryani', kind: 'biryani', tone: '#f0c15a', accent: '#f0c15a', emoji: '🍛', price: 899, veg: false, spice: 2, cal: 960, time: '28 min', image: IMG.biryani,
    tagline: 'Slow-braised lamb shank',
    desc: 'Fall-apart lamb layered with golden saffron rice, caramelised onions and a boiled egg, served in a brass handi.',
    ingredients: ['Lamb shank', 'Basmati', 'Saffron milk', 'Brown onions', 'Boiled egg', 'Whole spices'] },
  { id: 'truffle-tagliatelle', name: 'Truffle Cream Tagliatelle', cat: 'Pasta', kind: 'pasta', tone: '#f1d27a', accent: '#f1d27a', emoji: '🍝', price: 679, veg: false, spice: 0, cal: 710, time: '15 min', image: IMG.pasta,
    tagline: 'Hand-rolled, parmesan snow',
    desc: 'Silky egg tagliatelle rolled each morning, tossed in a black truffle cream with slow-cooked meatballs and aged parmesan.',
    ingredients: ['Egg tagliatelle', 'Black truffle', 'Cream', 'Parmesan', 'Meatballs', 'Basil'] },
  { id: 'arrabbiata-nido', name: 'Arrabbiata Nido', cat: 'Pasta', kind: 'pasta', tone: '#e9b94c', accent: '#e0553f', emoji: '🍝', price: 579, veg: true, spice: 2, cal: 590, time: '14 min', image: IMG.pasta,
    tagline: 'Chilli, garlic, tomato fire',
    desc: 'A twirled nest of bronze-cut pasta in a bright, garlicky arrabbiata with chilli oil and shaved pecorino.',
    ingredients: ['Bronze-cut pasta', 'Tomato', 'Garlic', 'Chilli oil', 'Pecorino', 'Basil'] },
  { id: 'molten-lava', name: 'Molten Gold Lava Cake', cat: 'Desserts', kind: 'dessert', tone: '#2a140c', accent: '#d9a548', emoji: '🍰', price: 449, veg: true, spice: 0, cal: 520, time: '10 min', image: IMG.cake,
    tagline: 'Dark chocolate, 24k gold leaf',
    desc: 'A warm 70% cocoa cake with a liquid heart, served with vanilla bean ice cream, fresh raspberries and edible gold.',
    ingredients: ['70% dark chocolate', 'Butter', 'Raspberries', 'Vanilla ice cream', 'Gold leaf', 'Mint'] },
  { id: 'berry-fondant', name: 'Berry Noir Fondant', cat: 'Desserts', kind: 'dessert', tone: '#4a0f1f', accent: '#c2185b', emoji: '🍰', price: 469, veg: true, spice: 0, cal: 490, time: '10 min', image: IMG.cake,
    tagline: 'Black cherry, vanilla cream',
    desc: 'A deep berry-chocolate fondant with a black cherry glaze, vanilla cream and a crown of fresh berries.',
    ingredients: ['Dark chocolate', 'Black cherry', 'Mixed berries', 'Vanilla cream', 'Mint'] },
  { id: 'saffron-spritz', name: 'Saffron Citrus Spritz', cat: 'Beverages', kind: 'beverage', tone: '#f4a640', accent: '#f4a640', emoji: '🍹', price: 349, veg: true, spice: 0, cal: 140, time: '4 min', image: IMG.drink,
    tagline: 'Orange blossom, sparkling',
    desc: 'Sparkling saffron-infused citrus over crystal ice with orange blossom water and a sprig of fresh mint.',
    ingredients: ['Saffron syrup', 'Blood orange', 'Sparkling water', 'Orange blossom', 'Mint'] },
  { id: 'smoked-berry', name: 'Smoked Berry Cooler', cat: 'Beverages', kind: 'beverage', tone: '#a3204a', accent: '#d63a6a', emoji: '🍹', price: 329, veg: true, spice: 0, cal: 160, time: '4 min', image: IMG.drink,
    tagline: 'Hibiscus, berries, cedar smoke',
    desc: 'A hibiscus and mixed-berry cooler finished under a cloche of cedar smoke, served over clear ice and a lemon wheel.',
    ingredients: ['Hibiscus', 'Strawberry', 'Blackberry', 'Lemon', 'Cedar smoke', 'Tonic'] },
]

// used by server.js on every start: fills the menu only if it is empty
export function seedMenuIfEmpty() {
  if (read('menu').length === 0) {
    write('menu', MENU)
    console.log('Menu was empty: loaded', MENU.length, 'sample dishes')
  }
}

// used by "npm run seed": resets the menu to the starting 12 dishes
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  write('menu', MENU)
  console.log('Menu reset to', MENU.length, 'dishes')
}