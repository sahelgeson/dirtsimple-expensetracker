export const createUncategorizedCategory = (categories) => {
  // if there is no null/Uncategorized category, add it
  const isThereAnUncategorizedCategory = categories.filter((category) => {
    if (category.id === null & category.name === 'Uncategorized') { return true; }
    return false;
  });
  if (!isThereAnUncategorizedCategory.length) {
    categories.push({
      id: null,
      name: 'Uncategorized'
    });
  }
  return categories;
}