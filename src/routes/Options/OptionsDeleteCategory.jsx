import React, { useState } from "react";
import { useGlobalState } from 'contexts';
import { UNCATEGORIZED } from 'lib/constants';
import { OptionsAccordion } from './OptionsAccordion';
import { OptionsCategorySelect } from './OptionsCategorySelect';
import { OptionsDeleteCategoryModal } from './OptionsDeleteCategoryModal';

export const OptionsDeleteCategory = () => {
  const { allCategories, deleteCategory } = useGlobalState();
  const [deletedCategoryId, setDeletedCategoryId] = useState(null); // TODO: s/b Uuid type, see interfaces.ts comment
  const [deletedCategoryName, setDeletedCategoryName] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  }

  const handleAccordionClick = () => {
    setIsOpen((prev) => !prev);
    setIsSaved(false);
  } 

  const handleFocus = () => {
    setIsSaved(false);
    setIsModalOpen(false);
  }  
  
  const handleDeleteCategoryChange = (event) => {
    const deletedCategory = allCategories.filter((category) => {
      return ( category.id === event.target.value );
    }).pop(); /* just want the object inside */

    setDeletedCategoryId(event.target.value);
    setDeletedCategoryName(deletedCategory.name);
    setIsModalOpen(true);
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
      className="card mvl"
    >
      <OptionsAccordion
        isOpen={isOpen}
        label="deletecategory"
        handleAccordionClick={handleAccordionClick}
      >
        Delete a category
      </OptionsAccordion>  

      {isOpen && 
        <div className="mhm">
          <OptionsCategorySelect
            htmlId="deletecategory"
            value={deletedCategoryId || ''}   /* TODO rethink sending this down via props */
            handleFocus={handleFocus}
            handleOnChange={handleDeleteCategoryChange}
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
        </div>
      }      

      {isSaved && isOpen &&
        <div className="status text-center gray-777 font-14 mbm">
          Deleted!
        </div>
      }            
    </form>
  );
}
