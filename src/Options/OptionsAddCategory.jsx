import React, { Component} from "react";
import { PropTypes } from "prop-types";
import ReactModal from 'react-modal';
import ReactModalStyles from "../modals/ReactModalStyles.js";

class OptionsAddCategory extends Component{
  constructor(props) {
    super(props);
  
    this.state = {
      isSaved: false,   
      isOpen: false,   
      newCategory: null,
      isModalOpen: false,
    }

    this.closeModal = this.closeModal.bind(this);
    this.handleAccordionClick = this.handleAccordionClick.bind(this);    
    this.handleAddCategoryChange = this.handleAddCategoryChange.bind(this);
    this.handleAddFocus = this.handleAddFocus.bind(this);    
    this.handleAddSubmit = this.handleAddSubmit.bind(this);
  }

  closeModal() {
    this.setState({isModalOpen: null});
  }

  handleAccordionClick() {
    this.setState({
      isOpen: !this.state.isOpen,
      isSaved: false,
    });
  } 

  handleAddCategoryChange(event) {
    this.setState({newCategory: event.target.value});
  } 

  handleAddFocus() {
    this.setState({
        isSaved: false,
        isModalOpen: false,
    });
  }  

  handleAddSubmit(event) {
    event.preventDefault();
    console.log('handleaddsubmit being fired')
    let categories = [...this.props.categories];
    /* Check if it is a duplicate category name */
    if (categories.indexOf(this.state.newCategory) !== -1) { 
      /* TODO: I don't like how I'm doing this, seems awkward */
      this.setState({isModalOpen: true})
      return false;
    } else {
      categories.push(this.state.newCategory);
      this.props.handleHoistedCategoriesChange(categories);
      this.setState({isSaved: true});
    }
  }  

  render(){
    return(
      <form
        onSubmit={this.handleAddSubmit}
        className="card mtm mbl"
      >
        <button 
          type="button"
          className="full-width text-left pam"
          onClick={this.handleAccordionClick}
        >
          <label 
            htmlFor="addcategory"         
          >
            Add a category
          </label>
          <div className="right gray-777 bold">
            {this.state.isOpen ? String.fromCharCode(65293) : String.fromCharCode(65291) }
          </div>
        </button>

      {this.state.isOpen ? 
        <div className="mhm">
          <input 
            id="addcategory"
            className="input gray-border full-width font-16 mvm"
            type="text" 
            spellCheck="true"
            placeholder="New Category"
            onChange={this.handleAddCategoryChange}
            onFocus={this.handleAddFocus}
            data-qa="options-add-category-input"    
          />          
          <ReactModal
            isOpen={(this.state.isModalOpen)}
            onRequestClose={this.closeModal}
            style={ReactModalStyles}
            contentLabel="Duplication Modal"
          >
            <div>
              Warning: There is already a category with this name. No new category will be added.
              <br />
              <button 
                className="btn btn--outline gray-777 block capitalize phm pvm mtm margin-0-auto"
                onClick={this.closeModal}>Okay
              </button>
            </div>
          </ReactModal>
    
          <input 
            className="input btn btn--blue full-width font-16 mvm"
            type="submit" 
            disabled={(this.state.newCategory && this.state.newCategory !== '') ? false : true}
            value="Save" 
            data-qa="options-add-submit-btn"          
          />
        </div>        
      : null }

      
      {this.state.isSaved && this.state.isOpen ?
        <div className="status text-center gray-777 font-14 mbm">
          Saved!
        </div>
        : null }
      </form>
    );
  }
}

OptionsAddCategory.propTypes = {
  categories: PropTypes.array.isRequired,
  handleHoistedCategoriesChange: PropTypes.func.isRequired,
};

export default OptionsAddCategory;
