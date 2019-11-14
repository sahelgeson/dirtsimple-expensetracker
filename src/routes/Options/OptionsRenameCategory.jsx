import React, { Component} from "react";
import { connect } from 'react-redux';
import { updateCategory, deleteCategory } from '../../redux/actions/categories-actions';
import { renameExpensesCategory } from '../../redux/actions/expenses-actions';
import OptionsAccordion from "./OptionsAccordion.jsx";
import OptionsCategorySelect from "./OptionsCategorySelect.jsx";
import OptionsRenameCategoryRenameModal from "./OptionsRenameCategoryRenameModal.jsx";

class OptionsRenameCategory extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      isChanging: false,
      isSaved: false,
      isOpen: false,
      renamedCategoryOriginalId: null,
      renamedCategoryOriginalName: '',
      renamedCategoryNewName: '',
      openModalName: null,
    }

    this.closeModal = this.closeModal.bind(this);
    this.getExistingCategoryId = this.getExistingCategoryId.bind(this);
    this.handleAccordionClick = this.handleAccordionClick.bind(this);  
    this.handleFocus = this.handleFocus.bind(this);  
    this.handleRenameCategoryChange = this.handleRenameCategoryChange.bind(this);
    this.handleRenameCategoryNewChange = this.handleRenameCategoryNewChange.bind(this);
    this.handleRenameSubmit = this.handleRenameSubmit.bind(this);
  }

  closeModal() {
    this.setState({openModalName: null});
  }

  getExistingCategoryId() {
    let existingCategoryId = '';
    this.props.categories.forEach((category) => {
      if (category.name === this.state.renamedCategoryNewName) {
        existingCategoryId = category.id;
      }
    });
    return existingCategoryId;
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

  handleRenameCategoryChange(event) {
    // event gives id, need to set state with corresponding name for modal
    const renamedCategoryOriginalId = event.target.value;

    // get category name from id
    const renamedCategoryOriginal = this.props.categories.filter((category) => {
      return ( category.id === renamedCategoryOriginalId );
    }).pop(); /* just want the object inside */

    const renamedCategoryOriginalName = renamedCategoryOriginal.name;

    this.setState({
      isChanging: true,
      renamedCategoryOriginalId,
      renamedCategoryOriginalName
    });
  } 

  handleRenameCategoryNewChange(event) {
    this.setState({renamedCategoryNewName: event.target.value});
  }   
   
  handleRenameSubmit(event, isOkayFromModal = false) {
    event.preventDefault();

    // before we submit, we need to check if the new category name already exists
    let existingCategoryId = this.getExistingCategoryId();

    if (existingCategoryId.length) {      
      if (!isOkayFromModal) {
        // if there is a duplicate and the user has not clicked the okay button, warn them about the dupe
        this.setState({openModalName : 'rename-dupe'});
        return false;
      } else {
        // update expenses with renamedCategoryOriginalName id to use alreadyExisting id
        this.props.renameExpensesCategory(this.state.renamedCategoryOriginalId, existingCategoryId);  // TODO: where do we get existingCategoryId?
        
        // delete the category that was been selected in the dropdown because we're using 
        // already existing category that already had that name
        this.props.deleteCategory(this.state.renamedCategoryOriginalId);        
      }
    } else {
      if (!isOkayFromModal) {
          // if no dupes, open rename modal for general warning
          this.setState({openModalName : 'rename'});
          return false;
      } else {
          // if no dupes just update category name
          this.props.updateCategory(this.state.renamedCategoryOriginalId, this.state.renamedCategoryNewName);
      }
    }
  
    if (isOkayFromModal) {
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
        <OptionsAccordion
          isOpen={this.state.isOpen}
          label="renamecategory"
          handleAccordionClick={this.handleAccordionClick}
        >
          Rename a category
        </OptionsAccordion>         

        {this.state.isOpen ? 
          <div className="mhm">        
            <OptionsCategorySelect
              htmlId="renamecategory-old"
              value={this.state.renamedCategoryOriginalId || ''}
              handleFocus={this.handleFocus}
              handleOnChange={this.handleRenameCategoryChange}
            />
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
                  disabled={this.state.renamedCategoryNewName === ''}   
                  value="Save" 
                  data-qa="options-rename-save-btn"          
                >
                  Save
                </button>
              </div>       

            : null}
            <OptionsRenameCategoryRenameModal
              isOpen={(this.state.openModalName === 'rename')}
              closeModal={this.closeModal}
              handleRenameSubmit={this.handleRenameSubmit}
            >
              <div>
                Are you sure you want to rename the category "{this.state.renamedCategoryOriginalName}" to "{this.state.renamedCategoryNewName}"? 
                Any expenses with the category "{this.state.renamedCategoryOriginalName}"
                will have their category renamed. This can't be undone.
              </div>  
            </OptionsRenameCategoryRenameModal>
            <OptionsRenameCategoryRenameModal
              isOpen={(this.state.openModalName === 'rename-dupe')}
              closeModal={this.closeModal}
              handleRenameSubmit={this.handleRenameSubmit}
            >
              <div>
                Warning: the new category name already exists. Any expenses with the original category name 
                "{this.state.renamedCategoryOriginalName}" will have their category renamed to "{this.state.renamedCategoryNewName}" 
                and combined with that category. This can't be undone.
              </div>
            </OptionsRenameCategoryRenameModal>            
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

function mapStateToProps(state) {
  return {
    allExpenses: state.allExpenses,
    categories: state.categories,
  };
}

export default connect(mapStateToProps, { updateCategory, deleteCategory, renameExpensesCategory })(OptionsRenameCategory);
