import React, { useState } from "react";
import cuid from 'cuid';
import { useGlobalState } from 'contexts';
import { OptionsAccordion } from './OptionsAccordion';
import ReactModal from 'react-modal';
import ReactModalStyles from "../../components/modals/ReactModalStyles.js";

export const OptionsAddCategory = () => {
  const { allCategories, addCategory } = useGlobalState();
  const [newCategoryName, setNewCategoryName] = useState(null); // TODO: review usage of null
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

  const handleAddCategoryChange = (event) => {
    setNewCategoryName(event.target.value);
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
      className="card mtm mbl"
    >
      <OptionsAccordion
        isOpen={isOpen}
        label="addcategory"
        handleAccordionClick={handleAccordionClick}
      >
        Add a category
      </OptionsAccordion>          

    {isOpen && 
      <div className="mhm">
        <input 
          id="addcategory"
          className="input gray-border full-width font-16 mvm"
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
  
        <input 
          className="input btn btn--blue full-width font-16 mvm"
          type="submit" 
          disabled={!newCategoryName?.length}
          value="Save" 
          data-qa="options-add-submit-btn"          
        />
      </div>        
    }
    
    {isSaved && isOpen &&
      <div className="status text-center gray-777 font-14 mbm">
        Saved!
      </div>
    }
    </form>
  );
}
