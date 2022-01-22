
import React, { useState } from 'react';
import { useGlobalState } from 'contexts';
import { OptionsAccordion } from './OptionsAccordion';
import { OptionsCategorySelect } from './OptionsCategorySelect';
import { OptionsRenameCategoryFormContents } from './OptionsRenameCategoryFormContents';
import { OptionsRenameCategoryRenameModal } from './OptionsRenameCategoryRenameModal';

const Modal = {
  RENAME: 'rename',
  DUPE: 'rename-dupe',
}
export const OptionsRenameCategory = () => {
  const { allCategories, renameCategory, deleteCategory, dedupeCategories } = useGlobalState();
  const [isChanging, setIsChanging] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [renamedCategoryOriginalId, setRenamedCategoryOriginalId] = useState(null);
  const [renamedCategoryOriginalName, setRenamedCategoryOriginalName] = useState('');
  const [renamedCategoryNewName, setRenamedCategoryNewName] = useState('');
  const [openModalName, setOpenModalName] = useState(null);

  const closeModal = () => {
    setOpenModalName(null);
  }

  const getExistingCategoryId = () => {
    const existingCategory = allCategories.find((category) => category.name === renamedCategoryNewName);
    return existingCategory?.id;
  }

  const handleAccordionClick = () => {
    setIsSaved(false);
    setIsOpen((prev) => !prev);
  }   

  const handleFocus = () => {
    setIsSaved(false);
  }  

  const handleRenameCategoryChange = (event) => {
    // event gives id, need to set state with corresponding name for modal
    const renamedCategoryOriginalId = event.target.value;

    // get category from id
    const renamedCategoryOriginal = allCategories.filter((category) => {
      return ( category.id === renamedCategoryOriginalId );
    }).pop(); /* just want the object inside */
    const renamedCategoryOriginalName = renamedCategoryOriginal.name;

    setIsChanging(true);
    setRenamedCategoryOriginalId(renamedCategoryOriginalId);
    setRenamedCategoryOriginalName(renamedCategoryOriginalName);
  } 

  const handleRenameCategoryNewChange = (event) => {
    setRenamedCategoryNewName(event.target.value);
  }   
   
  const handleRenameSubmit = (event, isOkayFromModal = false) => {
    event.preventDefault();

    // before we submit, we need to check if the new category name already exists
    let existingCategoryId = getExistingCategoryId();
    const isDupe = existingCategoryId?.length;

    if (isDupe) {      
      if (!isOkayFromModal) {
        // if there is a duplicate and the user has not clicked the okay button, warn them about the dupe
        // user has to click okay from this rename dupe warning modal to change the category name
        setOpenModalName(Modal.DUPE);
        return false;
      } else {
        // update expenses with renamedCategoryOriginalName id to use alreadyExisting id
        dedupeCategories(renamedCategoryOriginalId, existingCategoryId);  // TODO: where do we get existingCategoryId?
        
        // delete the category that was been selected in the dropdown because we're using 
        // already existing category that already had that name
        deleteCategory(renamedCategoryOriginalId);        
      }
    } else {
      if (!isOkayFromModal) {
          // if no dupes, open rename modal for general warning
          setOpenModalName(Modal.RENAME);
          return false;
      } else {
          // if no dupes just update category name
          renameCategory(renamedCategoryOriginalId, renamedCategoryNewName);
      }
    }
  
    if (isOkayFromModal) {
      setIsChanging(false);
      setIsSaved(true);
      setOpenModalName(null);
    }
  }  

  return (
    <form
      onSubmit={handleRenameSubmit}
      className="card mvl"
    >
      <OptionsAccordion
        isOpen={isOpen}
        label="renamecategory"
        handleAccordionClick={handleAccordionClick}
      >
        Rename a category
      </OptionsAccordion>         

      {isOpen && 
        <div className="mhm">        
          <OptionsCategorySelect
            htmlId="renamecategory-old"
            value={renamedCategoryOriginalId || ''}
            handleFocus={handleFocus}
            handleOnChange={handleRenameCategoryChange}
          />
          {isChanging &&  
            <OptionsRenameCategoryFormContents
              handleRenameCategoryNewChange={handleRenameCategoryNewChange}
              isDisabled={renamedCategoryNewName === ''}
            />   
          }
          <OptionsRenameCategoryRenameModal
            isOpen={openModalName === Modal.RENAME}
            closeModal={closeModal}
            handleRenameSubmit={handleRenameSubmit}
          >
            <div>
              Are you sure you want to rename the category "{renamedCategoryOriginalName}" to "{renamedCategoryNewName}"? 
              Any expenses with the category "{renamedCategoryOriginalName}"
              will have their category renamed. This can't be undone.
            </div>  
          </OptionsRenameCategoryRenameModal>
          <OptionsRenameCategoryRenameModal
            isOpen={openModalName === Modal.DUPE}
            closeModal={closeModal}
            handleRenameSubmit={handleRenameSubmit}
          >
            <div>
              Warning: the new category name already exists. Any expenses with the original category name 
              "{renamedCategoryOriginalName}" will have their category renamed to "{renamedCategoryNewName}" 
              and combined with that category. This can't be undone.
            </div>
          </OptionsRenameCategoryRenameModal>            
        </div>
      }   
      
      {isSaved && isOpen && (
        <div className="status text-center gray-777 font-14 mbm">
          Renamed!
        </div>
      )}   
    </form>
  );
}
