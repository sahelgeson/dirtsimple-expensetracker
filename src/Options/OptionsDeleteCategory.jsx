import React, { Component} from "react";
import { connect } from 'react-redux';
import { deleteCategory } from '../redux/actions/categories-actions';
import ReactModal from 'react-modal';
import ReactModalStyles from "../modals/ReactModalStyles.js";

class OptionsDeleteCategory extends Component{
  constructor(props) {
    super(props);
  
    this.state = {
      deletedCategoryId: 0,
      deletedCategoryName: '',
      isSaved: false,
      isOpen: false,
      isModalOpen: false,
    }

    //this.changeCategoriesOfAllExpenses = this.changeCategoriesOfAllExpenses.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleAccordionClick = this.handleAccordionClick.bind(this);  
    this.handleFocus = this.handleFocus.bind(this);  
    this.handleDeleteCategoryChange = this.handleDeleteCategoryChange.bind(this);
    this.handleDeleteSubmit = this.handleDeleteSubmit.bind(this);
  }

  /* TODO: move this to reducer 
  
  changeCategoriesOfAllExpenses(oldValue, newValue) {
    const allExpenses = this.props.allExpenses;

    return allExpenses.map((expense, i) => {
        if (expense.categoryId === oldValue) {
          expense.categoryId = newValue
        }
        return expense;
      }
    )
  }*/


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
    const allCategories = [...this.props.categories];
    const deletedCategory = allCategories.filter((category) => {
      return ( category.id === event.target.value );
    }).pop(); /* just want the object inside */

    this.setState({
      deletedCategoryId: event.target.value,
      deletedCategoryName: deletedCategory.name,
      isModalOpen: true,
    });
  } 

  handleDeleteSubmit(event) {
    event.preventDefault();

    /*
    const updatedCategories = this.props.categories.filter(category => 
      category !== this.state.deletedCategory
    );
    */
    //this.props.handleHoistedCategoriesChange(updatedCategories);

    //const updatedExpenses = this.changeCategoriesOfAllExpenses(this.state.deletedCategory, 'Uncategorized')
    //this.props.handleHoistedExpensesChange(updatedExpenses);

    this.props.deleteCategory(this.state.deletedCategoryId);

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
              {this.props.categories.map((category) => {
                  if (category.id !== null) {
                    return (
                      <option 
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </option>
                    )
                  } else { return null; }
                }
              )}
            </select>
            <ReactModal
              isOpen={(this.state.isModalOpen)}      
              onRequestClose={this.closeModal}
              shouldFocusAfterRender={false}
              style={ReactModalStyles}
              contentLabel="Deletion Modal"
            >
              <div>
                Are you sure you want to delete the category "{this.state.deletedCategoryName}"? Any expenses with this category
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


function mapStateToProps(state) {
  return {
    allExpenses: state.allExpenses,
    categories: state.categories,
  };
}

export default connect(mapStateToProps, { deleteCategory })(OptionsDeleteCategory);
