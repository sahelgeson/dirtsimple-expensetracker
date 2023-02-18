import { ChangeEvent } from 'react';

import { useGlobalState } from 'contexts';
import { ICategory } from 'interfaces';
import { UNCATEGORIZED } from 'lib/constants';

import { OptionsAccordionButton } from 'routes/Options/OptionsAccordionButton';
import { OptionsCategorySelect } from 'routes/Options/OptionsCategorySelect';
import { CategoryFilterListItem } from 'routes/Stats/CategoryFilterListItem';
import { 
  Accordion,
  AccordionItem, 
  AccordionPanel,
  Box,
  Text,
} from '@chakra-ui/react';

export const CategoryFilter = (): JSX.Element => {
  const { allCategories, filteredOutCategories, filteredOutCategoriesIds, filterOutCategory } = useGlobalState();

  const remainingCategories = allCategories.filter(category => {
    return !filteredOutCategoriesIds.includes(category.id);
  })

  const handleFilterCategory = (event: ChangeEvent<HTMLSelectElement>) => {
    filterOutCategory(event.currentTarget.value);
  }   

  return (
    <Accordion 
      allowToggle 
      my={4} 
    >
      <AccordionItem 
        border="none"
        pb={0}
      >
        <OptionsAccordionButton
          border="1px"
          borderColor="gray.200"
          borderRadius="md"
          py={1}
        >
          <Text fontSize="xs">
            Filter out a category {!!filteredOutCategories.length && <span className="gray-777 italic">(filtering is active)</span>}
          </Text>
        </OptionsAccordionButton>         

        <AccordionPanel pb={1}>    
          <Box my={4}> 
            <OptionsCategorySelect
              htmlId="renamecategory-old"
              size="xlg"
              value={''}
              handleOnChange={handleFilterCategory}
              categoryOptions={remainingCategories}
            />
          </Box>

          <div className="status gray-777 font-14">
            <div className="pbs">
              {!filteredOutCategories.length ? (
                  <>Filtering out: <span className="italic">No filter</span></> 
                ) : (
                  <>Filtering out:</>
                )}
            </div>

            {!!filteredOutCategories.length && (
              <ul>
                {filteredOutCategories.map((category: ICategory) => {
                  return <CategoryFilterListItem key={category.id || UNCATEGORIZED} category={category} />;
                })}
              </ul>
            )}
          </div>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
