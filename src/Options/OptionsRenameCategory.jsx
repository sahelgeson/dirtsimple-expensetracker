import React, { Component} from "react";
import { PropTypes } from "prop-types";
import ReactModal from 'react-modal';
import ReactModalStyles from "../modals/ReactModalStyles.js";

class OptionsRenameCategory extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      isChanging: false,
      isSaved: false,
      isOpen: false,
      renamedCategoryOriginal: '',
      renamedCategoryNew: '',
      openModalName: null,
    }

    this.changeCategoriesOfAllExpenses = this.changeCategoriesOfAllExpenses.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleAccordionClick = this.handleAccordionClick.bind(this);  
    this.handleRenameCategoryChange = this.handleRenameCategoryChange.bind(this);
    this.handleRenameCategoryNewChange = this.handleRenameCategoryNewChange.bind(this);
    this.handleRenameSubmit = this.handleRenameSubmit.bind(this);
  }

  /* TODO: this is also used in OptionsDeleteCategory */
  changeCategoriesOfAllExpenses(originalValue, newValue) {
    const allExpenses = this.props.allExpenses;

    return allExpenses.map((expense, i) => {
        if (expense.category === originalValue) {
          expense.category = newValue;
        }
        return expense;
      }
    )
  }

  closeModal() {
    this.setState({openModalName: null});
  }

  handleAccordionClick() {
    this.setState({
      isOpen: !this.state.isOpen,
      isSaved: false,
    });
  }   

  handleRenameCategoryChange(event) {
    this.setState({
      isChanging: true,
      renamedCategoryOriginal: event.target.value,
    });
  } 

  handleRenameCategoryNewChange(event) {
    this.setState({renamedCategoryNew: event.target.value});
  }   
   
  handleRenameSubmit(event, isOkayFromModal = false) {
    event.preventDefault();

    /* check for dupes first */
    const hasDupes = this.props.categories.includes(this.state.renamedCategoryNew);
    if (!isOkayFromModal && hasDupes) {
      this.setState({openModalName : 'rename-dupe'});
      return false;
    } else if (!isOkayFromModal && !hasDupes) {
      // if no dupes, open rename modal for warning
      this.setState({openModalName : 'rename'});
      return false;
    } else if (isOkayFromModal) {
      // update the categories array
      let updatedCategories = [...this.props.categories];
      if (hasDupes) {
        /* just delete the old category from category array, we will update the expenses with new category (which
            already exists in the category array because they are identical) */
        updatedCategories = updatedCategories.filter((category) => category !== this.state.renamedCategoryOriginal)
      } else {
        updatedCategories = updatedCategories.map(category => {
          if (category === this.state.renamedCategoryOriginal) {
              category = this.state.renamedCategoryNew; 
          }
          return category;
        });
      }

      // update the expenses and hoist both the expenses array and categories array
      const updatedExpenses = this.changeCategoriesOfAllExpenses(this.state.renamedCategoryOriginal, this.state.renamedCategoryNew);
      this.props.handleHoistedExpensesChange(updatedExpenses);
      this.props.handleHoistedCategoriesChange(updatedCategories);

      this.setState({
          isChanging : false,
          isSaved : true,
          openModalName: null,
      });
    }
  }  

  render(){
    return(
      <form
        onSubmit={this.handleRenameSubmit}
        className="card mvl"
      >
        <button 
          type="button"
          className="full-width text-left pam"
          onClick={this.handleAccordionClick}
          data-qa="options-rename-category-accordion"
        >
          <label
            htmlFor="renamecategory"
          >
            Rename a category
          </label>
          <div className="right gray-777 bold">
            {this.state.isOpen ? String.fromCharCode(65293) : String.fromCharCode(65291) }
          </div>
        </button>           

        {this.state.isOpen ? 
          <div className="mhm">        
            <select
              id="renamecategory"
              className="select-css input input-secondary full-width font-16 mbm"
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
            {this.state.isChanging ?   
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
                  onChange={this.handleRenameCategoryNewChange}                 
                  data-qa="options-rename-category-new-input"    
                />   

                <button
                  className="input btn btn--blue full-width font-16 mvm"
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
                  type="button"
                  className="btn btn--red capitalize phm pvm mrxs left"
                  onClick={(event) => this.handleRenameSubmit(event, {isOkayFromModal: true})}   
                >
                  Yes, Rename
                </button>
                <button 
                  type="button"
                  className="btn btn--outline capitalize phm pvm mrxs right"
                  onClick={this.closeModal}
                >
                  No, Cancel
                </button>
              </div>
            </ReactModal>
            <ReactModal
              isOpen={(this.state.openModalName === 'rename-dupe')}
              onRequestClose={this.closeModal}
              style={ReactModalStyles}
              contentLabel="Duplication Modal"
            >
              <div>Warning: the new category name already exists. Any expenses with the original category name 
                "{this.state.renamedCategoryOriginal}" will have their category renamed to "{this.state.renamedCategoryNew}" 
                and combined with that category. This can't be undone.</div>
              <div className="pvl">
                <button 
                  type="button"
                  className="btn btn--red capitalize phm pvm mrxs left"
                  onClick={(event) => this.handleRenameSubmit(event, {isOkayFromModal: true})} 
                >
                  Yes, Rename
                </button>
                <button 
                  type="button"
                  className="btn btn--outline capitalize phm pvm mrxs right"
                  onClick={this.closeModal}
                >
                  No, Cancel
                </button>
              </div>
            </ReactModal>
          </div>
        : null }   
        
        {this.state.isSaved && this.state.isOpen ?
          <div className="status text-center gray-777 font-14 mbm">
            Renamed!
          </div>
        : null }   
      </form>

    );
  }
}

OptionsRenameCategory.propTypes = {
  allExpenses: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  handleHoistedExpensesChange: PropTypes.func.isRequired,
  handleHoistedCategoriesChange: PropTypes.func.isRequired,
};

export default OptionsRenameCategory;
