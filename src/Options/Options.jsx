import React, { Component} from "react";
import { PropTypes } from "prop-types";
import OptionsAddCategory from "./OptionsAddCategory.jsx";
import OptionsDeleteCategory from "./OptionsDeleteCategory.jsx";
import OptionsRenameCategory from "./OptionsRenameCategory.jsx";

class Options extends Component{
  constructor(props) {
    super(props);
  
    this.state = {
      isSaved: false,   /* TODO: one, or separate isSaved for all forms? */
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


        <h3 className="mtl gray-777">Categories:</h3>
        <ul className="mvs gray-777">
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
