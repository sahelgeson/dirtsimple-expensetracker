import React, { Component} from "react";
import { connect } from 'react-redux';
import { deleteCategory } from '../../redux/actions/categories-actions';
import OptionsAccordion from "./OptionsAccordion.jsx";
import OptionsCategorySelect from "./OptionsCategorySelect.jsx";
import OptionsDeleteCategoryModal from "./OptionsDeleteCategoryModal.jsx";

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

    this.closeModal = this.closeModal.bind(this);
    this.handleAccordionClick = this.handleAccordionClick.bind(this);  
    this.handleFocus = this.handleFocus.bind(this);  
    this.handleDeleteCategoryChange = this.handleDeleteCategoryChange.bind(this);
    this.handleDeleteSubmit = this.handleDeleteSubmit.bind(this);
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
       <OptionsAccordion
          isOpen={this.state.isOpen}
          label="deletecategory"
          handleAccordionClick={this.handleAccordionClick}
        >
          Delete a category
        </OptionsAccordion>  

        {this.state.isOpen ? 
          <div className="mhm">
            <OptionsCategorySelect
              htmlId="deletecategory"
              value=""
              handleFocus={this.handleFocus}
              handleOnChange={this.handleDeleteCategoryChange}
            />
            <OptionsDeleteCategoryModal
              isOpen={this.state.isModalOpen}      
              closeModal={this.closeModal}
              handleDeleteSubmit={this.handleDeleteSubmit}
            >
              <div>
                Are you sure you want to delete the category "{this.state.deletedCategoryName}"? Any expenses with this category
                will still exist and have the category "Uncategorized".
              </div>
            </OptionsDeleteCategoryModal>
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
