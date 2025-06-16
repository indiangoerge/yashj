import { Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'basmati-rice',
    name: 'Basmati Rice',
    category: 'Grains'
  },
  {
    id: 'foxtail-millet',
    name: 'Foxtail Millet',
    category: 'Millets'
  },
  {
    id: 'chickpeas',
    name: 'Chickpeas',
    category: 'Pulses'
  },
  {
    id: 'mustard-oil',
    name: 'Mustard Oil',
    category: 'Oils'
  },
  {
    id: 'groundnut',
    name: 'Groundnut',
    category: 'Nuts'
  }
];

export const EXPORT_DUTY_RATE = 0.05; // 5% of invoice value