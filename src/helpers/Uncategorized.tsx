import { ICategory } from 'interfaces';
import { UNCATEGORIZED } from 'lib/constants';

const isThereAnUncategorizedCategory = (categories: ICategory[]) => {
  return categories.some((category) => category.id === UNCATEGORIZED);
}

export const addUncategorizedToCategories = (categories: ICategory[]) => {
  // if there is no Uncategorized category, add it, make it last in order
  if (!isThereAnUncategorizedCategory(categories)) {
    const order = Math.max(...categories.map(category => category.order)) + 1;
    categories.push({
      id: UNCATEGORIZED,
      name: UNCATEGORIZED,
      order,
    });
  }
  return categories;
}

export const removeLegacyNullUncategorized = (categories: ICategory[]) => {
  // if there is a legacy category with id === null, remove it
  const filteredCategories = categories.filter((category) => {
    if (category.id === null) { return false; }
    return true;
  });
  return filteredCategories;
}

export const ensureUncategorizedCategoryIsLast = (categories: ICategory[]) => {
  const maxOrder = Math.max(...categories.map(category => category.order));
  let updatedCategories = isThereAnUncategorizedCategory(categories) ? 
    [...categories, ...addUncategorizedToCategories(categories)]
    : categories;

  updatedCategories = categories.map(category => {
    return category.id === UNCATEGORIZED ? { ...category, order: maxOrder + 1 } : category
  });

  return updatedCategories;
}
