import { UNCATEGORIZED } from 'lib/constants';

export const addUncategorizedToCategories = (categories) => {
  // if there is no Uncategorized category, add it
  const isThereAnUncategorizedCategory = categories.filter((category) => {
    if (category.id === UNCATEGORIZED) { return true; }
    return false;
  });
  if (!isThereAnUncategorizedCategory.length) {
    categories.push({
      id: UNCATEGORIZED,
      name: UNCATEGORIZED
    });
  }
  return categories;
}

export const removeLegacyNullUncategorized = (categories) => {
  // if there is a legacy category with id === null, remove it
  const filteredCategories = categories.filter((category) => {
    if (category.id === null) { return false; }
    return true;
  });
  return filteredCategories;
}
