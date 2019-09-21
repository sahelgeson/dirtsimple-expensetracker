import React, { Component} from "react";
import { PropTypes } from "prop-types";
import ReactModal from 'react-modal';
import ReactModalStyles from "../modals/ReactModalStyles.js";

class Options extends Component{
  constructor(props) {
    super(props);
  
    this.state = {
      isSaved: false,   /* TODO: one, or separate isSaved for all forms? */
      isRenaming: false,
      newCategory: null,
      openModalName: null,
      deletedCategory: '',
      renamedCategoryOriginal: '',
      renamedCategoryNew: '',
    }

    this.closeModal = this.closeModal.bind(this);
    this.changeCategoriesOfAllExpenses = this.changeCategoriesOfAllExpenses.bind(this);
    this.handleAddCategoryChange = this.handleAddCategoryChange.bind(this);
    this.handleAddFocus = this.handleAddFocus.bind(this);
    this.handleDeleteCategoryChange = this.handleDeleteCategoryChange.bind(this);
    this.handleRenameCategoryChange = this.handleRenameCategoryChange.bind(this);   
    this.handleRenameCategoryNewChange = this.handleRenameCategoryNewChange.bind(this);        
    this.handleAddSubmit = this.handleAddSubmit.bind(this);
    this.handleDeleteSubmit = this.handleDeleteSubmit.bind(this);
    this.handleRenameSubmit = this.handleRenameSubmit.bind(this);
  }

  closeModal() {
    this.setState({openModalName: null});
  }

  changeCategoriesOfAllExpenses(oldValue, newValue) {
    const allExpenses = this.props.allExpenses;

    return allExpenses.map((expense, i) => {
        if (expense.category === oldValue) {
          expense.category = newValue
        }
        return expense;
      }
    )
  }

  handleAddCategoryChange(event) {
    this.setState({newCategory: event.target.value});
  } 

  handleAddFocus() {
    this.setState({
        iSaved: false,
        openModalName: null,
    });
  }  

  handleAddSubmit(event) {
    event.preventDefault();
    
    let categories = [...this.props.categories];
    /* Check if it is a duplicate category name */
    if (categories.indexOf(this.state.newCategory) !== -1) { 
      /* TODO: I don't like how I'm doing this, seems awkward */
      this.setState({openModalName: 'add'})
      return false;
    } else {
      categories.push(this.state.newCategory);
      this.props.handleHoistedCategoriesChange(categories);
      this.setState({iSaved: true});
    }
  }  


  handleDeleteSubmit(event) {
    event.preventDefault();
    console.log('deleting this category: ' + this.state.deletedCategory)

    const updatedCategories = this.props.categories.filter(category => 
      category !== this.state.deletedCategory
    );
    this.props.handleHoistedCategoriesChange(updatedCategories);

    const updatedExpenses = this.changeCategoriesOfAllExpenses(this.state.deletedCategory, 'Uncategorized')
    this.props.handleHoistedExpensesChange(updatedExpenses);
    this.closeModal();
  }  


  handleRenameSubmit({event, dupeOkayedFlag = false}) {
    event.preventDefault();

    debugger;
    /* check for dupes first */
    if (!dupeOkayedFlag && this.props.categories.indexOf(this.state.renamedCategoryNew) !== -1) {
      this.setState({openModalName : 'rename-dupe'})
      return false;
    } else {
      const updatedCategories = this.props.categories.map(category => {
          if (category === this.state.renamedCategoryOriginal) {
            category = this.state.renamedCategoryNew; 
          }
          return category
        }
      );
      this.props.handleHoistedCategoriesChange(updatedCategories);

      const updatedExpenses = this.changeCategoriesOfAllExpenses(this.state.deletedCategory, 'Uncategorized')
      this.props.handleHoistedExpensesChange(updatedExpenses);
    }
  }  
  
  handleDeleteCategoryChange(event) {
    this.setState({
      deletedCategory: event.target.value,
      openModalName: 'delete',
    });
  } 

  handleRenameCategoryChange(event) {
    this.setState({
      isRenaming: true,
      renamedCategoryOriginal: event.target.value,
    });
  } 

  handleRenameCategoryNewChange(event) {
    this.setState({renamedCategoryNew: event.target.value,});
  } 

  render(){
    return(
      <div className="container margin-0-auto phs">
        <h1 className="text-center gray-777 mtm mbs">
          Options
        </h1>

        <h2>Edit Categories:</h2>
        <form
          onSubmit={this.handleAddSubmit}
        >
          {/* Adds visibility hidden to element instead of returning null so the space doesn't
              collapse and have text move a pixel or two 
              
              TODO: check a11y on this */}
          <div className={this.state.iSaved ?
                "status text-center gray-777 font-14"
              : "status text-center gray-777 font-14 visibility-hidden" }
          >
            Saved!
          </div>

          <label 
            htmlFor="addcategory"           
          >
            Add a category  
          </label>
          <input 
            id="addcategory"
            className="input gray-border full-width font-25 mvm"
            type="text" 
            spellCheck="true"
            placeholder="New Category"
            onChange={this.handleAddCategoryChange}
            onFocus={this.handleAddFocus}
            data-qa="options-add-category-input"    
          />         

          <ReactModal
            isOpen={(this.state.openModalName === 'add')}
            onRequestClose={this.closeModal}
            style={ReactModalStyles}
            contentLabel="Duplication Modal"
          >
            <div>
              Warning: There is already a category with this name. No new category will be added.
              <br />
              <button 
                className="btn btn--outline gray-777 capitalize phm pvm mrxs"
                onClick={this.closeModal}>Okay
              </button>
            </div>
          </ReactModal>

          <input 
            className="input btn btn--blue full-width font-25 mvm"
            type="submit" 
            disabled={(this.state.newCategory && this.state.newCategory !== '') ? false : true}
            value="Save" 
            data-qa="options-add-submit-btn"          
          />
        </form>

        <form
          id="deleteform"
          onSubmit={this.handleDeleteSubmit}
        >
          <label
            htmlFor="deletecategory"
          >
            Delete a category
          </label>
          <select
            id="category"
            className="select-css input input-secondary full-width font-25 mbm"
            value="" 
            onChange={this.handleDeleteCategoryChange}
            data-qa="options-delete-category-input"  
          >
            <option value="">Choose a category</option>
            {this.props.categories.map((category, i) =>
                <option 
                  key={i}
                  value={category}
                >
                  {category}
                </option>
            )}
          </select>
          <ReactModal
            isOpen={(this.state.openModalName === 'delete')}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={ReactModalStyles}
            contentLabel="Deletion Modal"
          >
            <div>
              Are you sure you want to delete the category "{this.state.deletedCategory}"? Any expenses with this category
              will still exist and have the category "Uncategorized".
            </div>
            <div className="pvl">
              <button 
                type="submit"
                form="deleteform"
                className="btn btn--red capitalize phm pvm mrxs left"
                data-qa="options-delete-submit-btn"
              >
                Yes, Delete  
              </button>     
              <button 
                className="btn btn--outline capitalize phm pvm mrxs right"
                onClick={this.closeModal}
              >
                No, Cancel
              </button>
            </div>
          </ReactModal>
        </form>

        <form
          onSubmit={this.handleRenameSubmit}
        >
          <label
            htmlFor="renamecategory"
          >
            Rename a category
          </label>
          <select
            id="renamecategory"
            className="select-css input input-secondary full-width font-25 mbm"
            value={this.state.renamedCategoryOriginal} 
            onChange={this.handleRenameCategoryChange}
            data-qa="options-rename-category-old-input"  
          >
            <option value="">Choose a category</option>
            {this.props.categories.map((category, i) =>
                <option 
                  key={i}
                  value={category}
                >
                  {category}
                </option>
            )}
          </select>
          {this.state.isRenaming ?   
            <div>
              <label 
                htmlFor="renamecategory-new"           
                className="sr-only"
              >
                Rename this category to 
              </label>
              <input 
                id="renamecategory-new"
                className="input gray-border full-width font-25 mvm"
                type="text" 
                spellCheck="true"
                placeholder="Rename Category to..."
                onChange={this.handleRenameCategoryNewChange}                 
                data-qa="options-rename-category-new-input"    
              />   

              <button
                className="input btn btn--blue full-width font-25 mvm"
                type="submit" 
                disabled={this.state.renamedCategoryNew === ''}   
                value="Save" 
                data-qa="options-rename-submit-btn"          
              >
                Save
              </button>
            </div>       
    
          : null}
          <ReactModal
            isOpen={(this.state.openModalName === 'rename')}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={ReactModalStyles}
            contentLabel="Renaming Modal"
          >
            <div>Are you sure you want to rename the category "{this.state.renamedCategoryOriginal}" to "{this.state.renamedCategoryNew}"? 
              Any expenses with the category "{this.state.renamedCategoryOriginal}"
              will have their category renamed. This can't be undone.</div>
            <div className="pvl">
              {/* TODO: how will this work with handleRenameSubmit? Look at multiple submit button again */}
              <button 
                className="btn btn--red capitalize phm pvm mrxs left"
                onClick={(event) => this.handleRenameSubmit({event, dupeOkayedFlag: true})}   
              >
                Yes, Rename
              </button>
              <button 
                className="btn btn--outline capitalize phm pvm mrxs right"
                onClick={this.closeModal}
              >
                No, Cancel
              </button>
            </div>
          </ReactModal>
          <ReactModal
            isOpen={(this.state.openModalName === 'rename-dupe')}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={ReactModalStyles}
            contentLabel="Duplication Modal"
          >
            <div>Warning: the new category name already exists. Any expenses with the original category name 
              "{this.state.deletedCategory}" will have their category renamed to "{this.state.renamedCategory}" 
              and combined with that category. This can't be undone.</div>
            <div className="pvl">
              <button 
                className="btn btn--red capitalize phm pvm mrxs left"
                onClick={this.renameCategory}>Yes, Rename
              </button>
              <button 
                className="btn btn--outline capitalize phm pvm mrxs right"
                onClick={this.closeModal}>No, Cancel
              </button>
            </div>
          </ReactModal>
        </form>

        <h3 className="mvn">Categories:</h3>
        <ul className="mvs">
          {this.props.categories.map((category, i) =>
                <li
                  key={i}
                >
                  {category}
                </li>
            )}
        </ul>
      </div>
    );
  }
}

Options.propTypes = {
  allExpenses: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  handleHoistedExpensesChange: PropTypes.func.isRequired,
  handleHoistedCategoriesChange: PropTypes.func.isRequired,
};

export default Options;
