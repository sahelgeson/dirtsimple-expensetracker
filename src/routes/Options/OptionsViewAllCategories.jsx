import React, { useState } from 'react';
import { useGlobalState } from 'contexts';
import { OptionsAccordion } from './OptionsAccordion';

export const OptionsViewAllCategories = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { allCategories } = useGlobalState();

  const handleAccordionClick = () => {
    setIsOpen((prev) => !prev);
  } 

  return (
    <div className="card mtm mbl">
      <OptionsAccordion
        isOpen={isOpen}
        label="view-all-categories"
        handleAccordionClick={handleAccordionClick}
      >
        View all categories
      </OptionsAccordion>  

    {isOpen && (
      <div 
        className="mhl mbl"
        data-qa="options-view-all-categories-container"
      >
        <ul className="gray-777 mvs">
          {/* allCategories will always have at least the Uncategorized category */}  
          {allCategories.length === 1 ? (
            <li>
              No categories set up
            </li>
          ) : (
            <>
              {/* don't show Uncategorized category if there are any other categories */}
              {allCategories.map((category) => {
                return (
                  (category.id !== null) ? (
                    <li key={category.id}>
                      {category.name}
                    </li>
                  ) : null
                )}
              )}
            </>
          )}  
        </ul>
      </div>        
    )}
    </div>
  );
};

