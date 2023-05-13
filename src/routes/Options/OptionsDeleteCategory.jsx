import React, { useState } from 'react';
import { Button } from '@chakra-ui/react';
import { useGlobalState } from 'contexts';
import { UNCATEGORIZED } from 'lib/constants';
import { OptionsAccordionButton } from './OptionsAccordionButton';
import { OptionsCategorySelect } from './OptionsCategorySelect';
import { OptionsDeleteCategoryModal } from './OptionsDeleteCategoryModal';

export const OptionsDeleteCategory = () => {
  const { allCategories, deleteCategory } = useGlobalState();
  const [deletedCategoryId, setDeletedCategoryId] = useState(UNCATEGORIZED);
  const [deletedCategoryName, setDeletedCategoryName] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  }

  const handleFocus = () => {
    setIsSaved(false);
    setIsModalOpen(false);
  }  
  
  const handleDeleteCategoryChange = (event) => {
    const deletedCategory = allCategories.filter((category) => {
      return ( category.id === event.currentTarget.value );
    }).pop(); /* just want the object inside */

    setDeletedCategoryId(event.currentTarget.value);
    setDeletedCategoryName(deletedCategory.name);
  } 

  const handleOpenModal = (event) => {
    event.preventDefault();
    if (!isSaved) {
      setIsModalOpen(true);
    }
  }  

  const handleDeleteSubmit = (event) => {
    event.preventDefault();
    deleteCategory(deletedCategoryId);
    setIsSaved(true);
    setIsModalOpen(false);
  }  

  return (
    <form
      id="deleteform"
      onSubmit={handleDeleteSubmit}
      className="mvl"
    >
      <div className="mhm">
        <OptionsCategorySelect
          htmlId="deletecategory"
          size="xlg"
          value={deletedCategoryId || ''}   /* TODO rethink sending this down via props */
          handleFocus={handleFocus}
          handleOnChange={handleDeleteCategoryChange}
          categoryOptions={allCategories}
        />
        <OptionsDeleteCategoryModal
          isOpen={isModalOpen}      
          closeModal={closeModal}
          handleDeleteSubmit={handleDeleteSubmit}
        >
          <div>
            Are you sure you want to delete the category "{deletedCategoryName}"? Any expenses with this category
            will still exist and have the category "{UNCATEGORIZED}". 
          </div>
        </OptionsDeleteCategoryModal>
                          
        <Button 
          size="lg"
          width="100%"
          onClick={handleOpenModal}
          variant={isSaved ? 'success' : 'solid'}
          mt={4}
          isDisabled={!deletedCategoryId?.length}             
          colorScheme={isSaved ? '' : 'blue'}
        >
          <>{isSaved ? 'Deleted!' : 'Save'}</>
        </Button>
      </div>


      
    </form>
  );
}
