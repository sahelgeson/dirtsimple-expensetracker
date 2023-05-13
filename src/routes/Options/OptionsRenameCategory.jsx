
import React, { useState } from 'react';
import { useGlobalState } from 'contexts';
import { OptionsAccordionButton } from './OptionsAccordionButton';
import { OptionsCategorySelect } from './OptionsCategorySelect';
import { OptionsRenameCategoryFormContents } from './OptionsRenameCategoryFormContents';
import { OptionsRenameCategoryRenameModal } from './OptionsRenameCategoryRenameModal';

const Modal = {
  RENAME: 'rename',
  DUPE: 'rename-dupe',
}
export const OptionsRenameCategory = () => {
  const { allCategories, renameCategory, deleteCategory, dedupeCategories } = useGlobalState();
  const [isSaved, setIsSaved] = useState(false);
  const [renamedCategoryOriginalId, setRenamedCategoryOriginalId] = useState(null);
  const [renamedCategoryOriginalName, setRenamedCategoryOriginalName] = useState('');
  const [renamedCategoryNewName, setRenamedCategoryNewName] = useState('');
  const [openModalName, setOpenModalName] = useState(null);

  const closeModal = () => {
    setOpenModalName(null);
  }

  const getExistingCategory = () => {
    return allCategories.find((category) => category.name === renamedCategoryNewName);
  }

  const handleFocus = () => {
    setIsSaved(false);
  }  

  const handleRenameCategoryChange = (event) => {
    // event gives id, need to set state with corresponding name for modal
    const renamedCategoryOriginalId = event.currentTarget.value;

    // get category from id
    const renamedCategoryOriginal = allCategories.filter((category) => {
      return ( category.id === renamedCategoryOriginalId );
    }).pop(); /* just want the object inside */
    const renamedCategoryOriginalName = renamedCategoryOriginal.name;

    setRenamedCategoryOriginalId(renamedCategoryOriginalId);
    setRenamedCategoryOriginalName(renamedCategoryOriginalName);
  } 

  const handleRenameCategoryNewChange = (event) => {
    setRenamedCategoryNewName(event.currentTarget.value);
  }     
   
  const handleRenameSubmit = (event, isOkayFromModal = false) => {
    event.preventDefault();

    // before we submit, we need to check if the new category name already exists
    const existingCategory = getExistingCategory();
    const isDupe = existingCategory?.id?.length;

    if (isDupe) {      
      // if new name is same as that in Select, do nothing
      if (existingCategory?.name === renamedCategoryNewName) {
        return;
      }

      if (!isOkayFromModal) {
        // if there is a duplicate and the user has not clicked the okay button, warn them about the dupe
        // user has to click okay from this rename dupe warning modal to change the category name
        setOpenModalName(Modal.DUPE);
        return false;
      } else {
        // update expenses with renamedCategoryOriginalName id to use alreadyExisting id
        dedupeCategories(renamedCategoryOriginalId, existingCategory.id);  // TODO: where do we get existingCategoryId?
         
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
      setIsSaved(true);
      setOpenModalName(null);
    }
  }  

  return (
    <form
      onSubmit={handleRenameSubmit}
      className="mvl"
    >     
      <div className="mhm">        
        <OptionsCategorySelect
          htmlId="renamecategory-old"
          size="xlg"
          my={4}
          value={renamedCategoryOriginalId || ''}
          handleFocus={handleFocus}
          handleOnChange={handleRenameCategoryChange}
          categoryOptions={allCategories}
        />

        <OptionsRenameCategoryFormContents
          handleRenameCategoryNewChange={handleRenameCategoryNewChange}
          renamedCategoryNewName={renamedCategoryNewName}
          isSaved={isSaved}
        />   

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

    </form>
  );
}
