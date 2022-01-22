import React from 'react';

/* 
interface {
  handleRenameCategoryNewChange: () => void;
  isDisabled: string;
}
*/

export const OptionsRenameCategoryFormContents = (props) => {
  return(
    <div>
      <label 
        htmlFor="renamecategory-new"           
        className="sr-only"
      >
        Rename this category to 
      </label>
      <input 
        id="renamecategory-new"
        className="input gray-border full-width font-16 mvm"
        type="text" 
        spellCheck="true"
        placeholder="Rename Category to..."
        onChange={props.handleRenameCategoryNewChange}                 
        data-qa="options-rename-category-new-input"    
      />   
      <button
        className="input btn btn--blue full-width font-16 mvm"
        type="submit" 
        disabled={props.renamedCategoryNewName === ''}   
        value="Save" 
        data-qa="options-rename-save-btn"          
      >
        Save
      </button>
    </div>       
  );
}
