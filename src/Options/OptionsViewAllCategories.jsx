import React, { Component} from "react";
import { PropTypes } from "prop-types";


class OptionsViewAllCategories extends Component{
  constructor(props) {
    super(props);
  
    this.state = {
      isOpen: false,  
    }

    this.handleAccordionClick = this.handleAccordionClick.bind(this);    
  }

  handleAccordionClick() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  } 

  render(){
    return(
      <div
        className="card mtm mbl"
      >
        <button 
          type="button"
          className="full-width text-left pam"
          onClick={this.handleAccordionClick}
        >
          <span>
            View all categories
          </span>
          <div className="right gray-777 bold">
            {this.state.isOpen ? String.fromCharCode(65293) : String.fromCharCode(65291) }
          </div>
        </button>

      {this.state.isOpen ? 
        <div className="mhl mbl">
          <ul className="gray-777 mvs">
            {this.props.categories.map((category, i) =>
                  <li
                    key={i}
                  >
                    {category}
                  </li>
              )}
          </ul>
        </div>        
      : null }
      </div>
    );
  }
}

OptionsViewAllCategories.propTypes = {
  categories: PropTypes.array.isRequired,
};

export default OptionsViewAllCategories;