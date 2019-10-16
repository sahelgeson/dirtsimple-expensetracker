import React, { Component} from "react";
import { PropTypes } from "prop-types";
import ReactModal from 'react-modal';
import ReactModalStyles from "../modals/ReactModalStyles.js";

class OptionsDeleteCategory extends Component{
  constructor(props) {
    super(props);
  
    this.state = {
      deletedCategory: '',
      isSaved: false,
      isOpen: false,
      isModalOpen: false,
    }

    this.changeCategoriesOfAllExpenses = this.changeCategoriesOfAllExpenses.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleAccordionClick = this.handleAccordionClick.bind(this);  
    this.handleFocus = this.handleFocus.bind(this);  
    this.handleDeleteCategoryChange = this.handleDeleteCategoryChange.bind(this);
    this.handleDeleteSubmit = this.handleDeleteSubmit.bind(this);
  }

  /* TODO: this is also used in OptionsRenameCategory */
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
    this.setState({isModalOpen: false});
  }

  handleAccordionClick() {
    this.setState({
      isOpen: !this.state.isOpen,
      isSaved: false,
    });
  } 

  handleFocus() {
    this.setState({
        isSaved: false,
        isModalOpen: false,
    });
  }  
  
  handleDeleteCategoryChange(event) {
    this.setState({
      deletedCategory: event.target.value,
      isModalOpen: true,
    });
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
    this.setState({
        isModalOpen: false,
        isSaved: true,
    });
  }  

 
  render(){
    return(
      <form
        id="deleteform"
        onSubmit={this.handleDeleteSubmit}
        className="card mvl"
      >
        <button 
          type="button"
          className="full-width text-left pam"
          onClick={this.handleAccordionClick}
          data-qa="options-delete-category-accordion"
        >
          <label
            htmlFor="deletecategory"
          >
            Delete a category
          </label>
          <div className="right gray-777 bold">
            {this.state.isOpen ? String.fromCharCode(65293) : String.fromCharCode(65291) }
          </div>
        </button>        

        {this.state.isOpen ? 
          <div className="mhm">
            <select
              id="category"
              className="select-css input input-secondary full-width font-16 mbm"
              value="" 
              onChange={this.handleDeleteCategoryChange}
              onFocus={this.handleFocus}
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
              isOpen={(this.state.isModalOpen)}      
              onRequestClose={this.closeModal}
              style={ReactModalStyles}
              contentLabel="Deletion Modal"
            >
              <div>
                Are you sure you want to delete the category "{this.state.deletedCategory}"? Any expenses with this category
                will still exist and have the category "Uncategorized".
              </div>
              <div className="pvl">
                {/* doing onClick instead of just button type="submit" because a normal submit will
                  make the submit button focussed after submission, and that interferes with the handleFocus 
                  handler used to reset the success messaging */}
                <button 
                  type="button"
                  form="deleteform"
                  className="btn btn--red capitalize phm pvm mrxs left"
                  onClick={(event) => this.handleDeleteSubmit(event)}
                  data-qa="options-delete-submit-btn"
                >
                  Yes, Delete  
                </button>     
                <button 
                  type="button"
                  className="btn btn--outline capitalize phm pvm mrxs right"
                  onClick={this.closeModal}
                >
                  {/* TODO: blur the focus on the select after this happens  */}
                  No, Cancel
                </button>
              </div>
            </ReactModal>
          </div>
        : null }      

        {this.state.isSaved && this.state.isOpen ?
          <div className="status text-center gray-777 font-14 mbm">
            Deleted!
          </div>
        : null }            
      </form>

    );
  }
}

OptionsDeleteCategory.propTypes = {
  allExpenses: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  handleHoistedExpensesChange: PropTypes.func.isRequired,
  handleHoistedCategoriesChange: PropTypes.func.isRequired,
};

export default OptionsDeleteCategory;
