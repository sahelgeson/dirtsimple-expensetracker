import { UNCATEGORIZED } from 'lib/constants';

export const createUncategorizedCategory = (categories) => {
  // TODO update this
  // if there is no null/Uncategorized category, add it
  const isThereAnUncategorizedCategory = categories.filter((category) => {
    if (category.id === null & category.name === UNCATEGORIZED) { return true; }
    return false;
  });
  if (!isThereAnUncategorizedCategory.length) {
    categories.push({
      id: null,
      name: UNCATEGORIZED
    });
  }
  return categories;
}