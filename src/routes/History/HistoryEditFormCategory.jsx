import React from 'react';
import { UNCATEGORIZED } from 'lib/constants';

import { Select } from '@chakra-ui/react';

/*
interface IProps {
  category: ICategory;
  allCategories: ICategory[];
}
*/
export const HistoryEditFormCategory = (props) => {

  const { category, allCategories, handleCategoryChange } = props;

  /* filter out Uncategorized like normal, unless this expense's category
    is already 'Uncategorized' (null). In that case Uncategorized should show 
    up in the select */
  const categoriesForOptions = (category.name === UNCATEGORIZED) ? 
    allCategories : allCategories.filter((category) => category.id !== null);

  return ( 
    <div className="mvm">
      <label 
        htmlFor="category" 
        className="edit-label pvm"          
      >
        Category  
      </label>
      
      <Select 
        placeholder="Change category"
        value={category || UNCATEGORIZED} 
        onChange={handleCategoryChange}
        size="lg"
        width="75%"
        display="inline-block"
      >           
        {categoriesForOptions.map((category) =>
          <option 
            key={category.id}
            value={category.id}
          >
            {category.name}
          </option>
        )}
      </Select>
    </div>  
  );
}
