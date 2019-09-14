import React, { Component} from "react";
import { PropTypes } from "prop-types";
import ReactModal from 'react-modal';
import ReactModalStyles from "../modals/ReactModalStyles.js";

class Options extends Component{
  constructor(props) {
    super(props);
  
    this.state = {
 
    }

    /* Sort expenses by date by default only for initial load. Setting this up in the constructor so we're
      not sorting in edit form because we don't want state to update and rerender which could
      yoink stuff around */
    const allExpensesSorted = [...this.props.allExpenses];
    allExpensesSorted.sort(function(a, b) {
      var dateA = new Date(a.datetime), dateB = new Date(b.datetime);
      return dateB - dateA;
    });

    this.props.handleHoistedExpenseChange(allExpensesSorted);
    this.addCategory = this.addCategory.bind(this);
    this.deleteCategory = this.deleteCategory.bind(this);
    this.renameCategory = this.renameCategory.bind(this);
    this.handleAddCategoryChange = this.handleAddCategoryChange.bind(this);
    this.handleAddFocus = this.handleAddFocus.bind(this);
    this.handleDeleteCategoryChange = this.handleDeleteCategoryChange.bind(this);
  }
  addCategory() {
    this.closeModal();
  }

  deleteCategory() {
    let allExpensesUpdated = [...this.props.allExpenses];
    allExpensesUpdated.splice(this.props.isBeingEditedIndex, 1);
    this.props.handleHoistedExpenseChange(allExpensesUpdated);
    this.closeModal();
  }

  renameCategory() {
    this.closeModal();
  }  

  handleAddCategoryChange() {
    this.closeModal();
  } 

  handleAddFocus() {
    
  }  

  handleDeleteCategoryChange() {
    this.closeModal();
  } 



  render(){
    const allExpenses = this.props.allExpenses; 
    const categories = this.props.categories; 

    return(
      <div className="container margin-0-auto phs">
        <h1 className="text-center gray-777 mtm mbs">
          Options
        </h1>

        <form>
        <legend>Edit Categories:</legend>

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
            placeholder="New Category"
            onChange={this.handleAddCategoryChange}
            onFocus={this.handleAddFocus}
            data-qa="options-add-category-input"    
          />         


          <ReactModal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={ReactModalStyles}
            contentLabel="Duplication Modal"
          >
            <div>Warning: There is already a category with this name. No new category will be added.</div>
          </ReactModal>

          <label
            htmlFor="deletecategory"
          >
            Delete a category
          </label>
          <select
            id="category"
            className="select-css input input-secondary full-width font-25 mbm"
            value={this.state.category} 
            onChange={this.handleDeleteCategoryChange}
            data-qa="options-delete-category-input"  
          >
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
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={ReactModalStyles}
            contentLabel="Deletion Modal"
          >
            <div>
              Are you sure you want to delete this category? Any expenses with this category
              will still exist and have the category "Uncategorized".
            </div>
            <div className="pvl">
              <button 
                className="btn btn--red capitalize phm pvm mrxs left"
                onClick={this.deleteCategory}>Yes, Delete
              </button>
              <button 
                className="btn btn--outline capitalize phm pvm mrxs right"
                onClick={this.closeModal}>No, Cancel
              </button>
            </div>
          </ReactModal>

          <label
            htmlFor="renamecategory"
          >
            Rename a category
          </label>
          <select
            id="renamecategory"
            className="select-css input input-secondary full-width font-25 mbm"
            value={this.state.category} 
            onChange={this.handleRenameCategoryChange}
            data-qa="options-rename-category-input"  
          >
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
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={ReactModalStyles}
            contentLabel="Renaming Modal"
          >
            <div>Are you sure you want to rename this category? Any expenses with the original category
              will have their category renamed. This can't be undone.</div>
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
          <ReactModal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={ReactModalStyles}
            contentLabel="Duplication Modal"
          >
            <div>Warning: the new category name already exists. Any expenses with the original category
              will have their category renamed and combined with the existing category. This can't be undone.</div>
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

      </div>
    );
  }
}

Options.propTypes = {
  allExpenses: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  handleHoistedExpenseChange: PropTypes.func.isRequired,
};

export default Options;
