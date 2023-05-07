import React, { useState } from 'react';
import { useGlobalState } from 'contexts';
import {
  ListItem,
  UnorderedList,
} from '@chakra-ui/react';
import { UNCATEGORIZED } from 'lib/constants';

export const OptionsViewAllCategories = () => {
  const { allCategories } = useGlobalState();

  return (        
    <UnorderedList className="gray-777 mvs" ml={8}>
      {/* allCategories will always have at least the Uncategorized category */}  
      {allCategories.length === 1 ? (
        <ListItem>
          No categories set up
        </ListItem>
      ) : (
        <>
          {/* don't show Uncategorized category if there are any other categories */}
          {allCategories.map((category) => {
            return (
              (category.id !== UNCATEGORIZED) ? (
                <ListItem key={category.id} mb={2}>
                  {category.name}
                </ListItem>
              ) : null
            )}
          )}
        </>
      )}  
    </UnorderedList>
  );
};

