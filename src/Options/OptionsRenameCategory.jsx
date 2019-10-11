import React, { Component} from "react";
import { PropTypes } from "prop-types";
import ReactModal from 'react-modal';
import ReactModalStyles from "../modals/ReactModalStyles.js";

class OptionsRenameCategory extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      isChanging: false,
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
   
  handleRenameSubmit(event, dupeOkayedFlag = false) {
    event.preventDefault();

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
      this.setState({isChanging : false})
      this.props.handleHoistedCategoriesChange(updatedCategories);

      const updatedExpenses = this.changeCategoriesOfAllExpenses(this.state.deletedCategory, 'Uncategorized')
      this.props.handleHoistedExpensesChange(updatedExpenses);
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
              onRequestClose={this.closeModal}
              style={ReactModalStyles}
              contentLabel="Duplication Modal"
            >
              <div>Warning: the new category name already exists. Any expenses with the original category name 
                "{this.state.renamedCategoryOriginal}" will have their category renamed to "{this.state.renamedCategoryNew}" 
                and combined with that category. This can't be undone.</div>
              <div className="pvl">
                <button 
                  className="btn btn--red capitalize phm pvm mrxs left"
                  onClick={this.renameCategory}
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
