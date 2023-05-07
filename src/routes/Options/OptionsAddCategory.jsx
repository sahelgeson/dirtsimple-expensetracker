import React, { useState } from "react";
import { Input, Button } from '@chakra-ui/react';
import cuid from 'cuid';
import { useGlobalState } from 'contexts';
import { UNCATEGORIZED } from 'lib/constants';
import ReactModal from 'react-modal';
import ReactModalStyles from "../../components/modals/ReactModalStyles.js";

export const OptionsAddCategory = () => {
  const { allCategories, addCategory } = useGlobalState();
  const [newCategoryName, setNewCategoryName] = useState(UNCATEGORIZED);
  const [isSaved, setIsSaved] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  }

  const handleAddCategoryChange = (event) => {
    setNewCategoryName(event.currentTarget.value);
  } 

  const handleFocus = () => {
    setIsSaved(false);
    setIsModalOpen(false);
  }  

  const handleAddSubmit = (event) => {
    event.preventDefault();

    /* Check if it is a duplicate category name */
    const isAlreadyACategory = allCategories.some((category) => (category.name === newCategoryName));

    if (isAlreadyACategory) { 
      setIsModalOpen(true);
      return false;
    } else {
      let newCategory = {
        id: cuid(),
        name: newCategoryName,
      }
      addCategory(newCategory);
      setIsSaved(true);
    }
  }  

  return(
    <form
      onSubmit={handleAddSubmit}
      className="mvm"
    >
      <div className="mhm">
        <Input 
          id="addcategory"
          size="xlg"
          type="text" 
          spellCheck="true"
          placeholder="New Category"
          onChange={handleAddCategoryChange}                 
          onFocus={handleFocus}
          data-qa="options-add-category-input"     
        />   

        <ReactModal
          isOpen={(isModalOpen)}
          onRequestClose={closeModal}
          style={ReactModalStyles}
          contentLabel="Duplication Modal"
        >
          <div>
            Warning: There is already a category with this name. No new category will be added.
            <br />
            <button 
              className="btn btn--outline gray-777 block capitalize phm pvm mtm margin-0-auto"
              onClick={closeModal}>Okay
            </button>
          </div>
        </ReactModal>
  
        <Button 
          size="lg"
          width="100%"
          type="submit" 
          variant={isSaved ? 'success' : 'solid'}
          mt={4}
          isDisabled={!newCategoryName?.length}   
          data-qa="options-add-submit-btn"    
          colorScheme={isSaved ? '' : 'blue'}
        >
          <>{isSaved ? 'Saved!' : 'Save'}</>
        </Button>
        
      </div>        

    </form>
  );
}
