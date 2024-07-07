import { ICategory } from 'interfaces';
import cuid from 'cuid';

export const DefaultCategoriesNames = [
  'Grocery',
  'Bars/Restaurants',
  'Alcohol',
  'Home',
  'Medicine/Health',
  'Clothes',
  'Charity',
  'Entertainment',
  'Books',
  'Transportation',
  'Other',
];

export const DefaultCategories: ICategory[] = DefaultCategoriesNames.map((name: string, i: number) => {
  return {
    id: cuid(),
    name,
    order: i,
  };
});
