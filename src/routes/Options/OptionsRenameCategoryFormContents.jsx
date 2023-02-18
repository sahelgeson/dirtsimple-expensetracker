import React, { useState } from 'react';
import { Input, Button } from '@chakra-ui/react';
/* 
interface {
  handleRenameCategoryNewChange: () => void;
  isDisabled: string;
}
*/

export const OptionsRenameCategoryFormContents = (props) => {
  const { isSaved, isDisabled, handleRenameCategoryNewChange, handleOpenModal } = props;

  return(
    <div>
      <label 
        htmlFor="renamecategory-new"           
        className="sr-only"
      >
        Rename this category to 
      </label>
      <Input 
        id="renamecategory-new"
        size="xlg"
        mb={4}
        type="text" 
        spellCheck="true"
        placeholder="Rename Category to..."
        onChange={handleRenameCategoryNewChange}      // TODO xkcd move this to button, what should onChange do here?s             
        data-qa="options-rename-category-new-input"    
      />   

      <Button 
        type="submit"
        size="lg"
        width="100%"
        variant={isSaved ? 'success' : 'solid'}
        isDisabled={isDisabled}              
        colorScheme={isSaved ? '' : 'blue'}
        data-qa="options-rename-save-btn" 
      >
        <>{isSaved ? 'Renamed!' : 'Save'}</>
      </Button>
         
    </div>       
  );
}
