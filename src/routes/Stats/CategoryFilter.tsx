import { useState, ChangeEvent } from 'react';

import { useGlobalState } from 'contexts';
import { ICategory } from 'interfaces';
import { UNCATEGORIZED } from 'lib/constants';

import { OptionsAccordion } from 'routes/Options/OptionsAccordion';
import { OptionsCategorySelect } from 'routes/Options/OptionsCategorySelect';
import { CategoryFilterListItem } from 'routes/Stats/CategoryFilterListItem';

export const CategoryFilter = (): JSX.Element => {
  const { allCategories, filteredOutCategories, filteredOutCategoriesIds, filterOutCategory } = useGlobalState();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const remainingCategories = allCategories.filter(category => {
    return !filteredOutCategoriesIds.includes(category.id);
  })

  const handleAccordionClick = () => {
    setIsOpen((prev: boolean) => !prev);
  }   

  const handleFilterCategory = (event: ChangeEvent<HTMLSelectElement>) => {
    filterOutCategory(event.target.value);
  }   

  return (
    <div className="card mvm">
      <OptionsAccordion
        isOpen={isOpen}
        label="filtercategory"
        handleAccordionClick={handleAccordionClick}
        className="font-12 gray-777 full-width text-left pam"
      >
        Filter out a category {!!filteredOutCategories.length && <span className="gray-777 italic">(filtering is active)</span>}
      </OptionsAccordion>         

      {isOpen && (
        <div className="mhm">        
          <OptionsCategorySelect
            htmlId="renamecategory-old"
            value={''}
            handleOnChange={handleFilterCategory}
            categoryOptions={remainingCategories}
          />

            <div className="status gray-777 font-14 mbm">
              {!filteredOutCategories.length ? (
                <>Filtering out: <span className='italic'>No filter</span></> 
              ) : (
                <>
                  <div className="pvs">Filtering out:</div>
                  <ul>
                    {filteredOutCategories.map((category: ICategory) => {
                      return <CategoryFilterListItem key={category.id || UNCATEGORIZED} category={category} />;
                    })}
                  </ul>
                </>
              )}
            </div>
        </div>
      )}
    </div>
  );
}
