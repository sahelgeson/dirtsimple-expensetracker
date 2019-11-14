import React, { Component} from "react";
import { connect } from 'react-redux';
import OptionsAccordion from "./OptionsAccordion.jsx";

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
        <OptionsAccordion
          isOpen={this.state.isOpen}
          label="view-all-categories"
          handleAccordionClick={this.handleAccordionClick}
        >
          View all categories
        </OptionsAccordion>  

      {this.state.isOpen ? 
        <div 
          className="mhl mbl"
          data-qa="options-view-all-categories-container"
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
