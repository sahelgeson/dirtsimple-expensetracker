import React, { Component} from "react";
import { connect } from 'react-redux';

class OptionsViewAllCategories extends Component{
  constructor(props) {
    super(props);
  
    this.state = {
      isOpen: true,  
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
          data-qa="options-view-all-category-accordion"
        >
          <span>
            View all categories
          </span>
          <div className="right gray-777 bold">
            {this.state.isOpen ? String.fromCharCode(65293) : String.fromCharCode(65291) }
          </div>
        </button>

      {this.state.isOpen ? 
        <div 
          className="mhl mbl"
          data-qa="options-view-all-category-container"
        >
          <ul className="gray-777 mvs">
          {this.props.categories.map((category) => {
              if (category.id !== null) {
                return (
                  <li
                    key={category.id}
                  >
                    {category.name}
                  </li>
                )
              } else { return null; }
            }
          )}
          </ul>
        </div>        
      : null }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    categories: state.categories,
  };
}

export default connect(mapStateToProps)(OptionsViewAllCategories);
