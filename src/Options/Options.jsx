import React, { Component} from "react";
import { PropTypes } from "prop-types";
import OptionsAddCategory from "./OptionsAddCategory.jsx";
import OptionsDeleteCategory from "./OptionsDeleteCategory.jsx";
import OptionsRenameCategory from "./OptionsRenameCategory.jsx";
import OptionsViewAllCategories from "./OptionsViewAllCategories.jsx";

class Options extends Component{
  constructor(props) {
    super(props);
  
    this.state = {
      isSaved: false,
      isRenaming: false,
      openModalName: null,
      renamedCategoryOriginal: '',
      renamedCategoryNew: '',
    }
  }

  render(){
    return(
      <div className="container margin-0-auto phl">

        {/* TODO: make this toggle the edit categories options below */}
        <h2 className="mtl">
            Edit Categories:
        </h2>
        <OptionsAddCategory 
            categories={this.props.categories}
            handleHoistedCategoriesChange={this.props.handleHoistedCategoriesChange}
        />

        <OptionsDeleteCategory 
            allExpenses={this.props.allExpenses}
            categories={this.props.categories}
            handleHoistedExpensesChange={this.props.handleHoistedExpensesChange}
            handleHoistedCategoriesChange={this.props.handleHoistedCategoriesChange}
        />

        <OptionsRenameCategory 
            allExpenses={this.props.allExpenses}
            categories={this.props.categories}
            handleHoistedExpensesChange={this.props.handleHoistedExpensesChange}
            handleHoistedCategoriesChange={this.props.handleHoistedCategoriesChange}
        />

        <OptionsViewAllCategories
            categories={this.props.categories}
        />
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
