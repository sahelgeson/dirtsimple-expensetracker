import React from "react";
import { PropTypes } from "prop-types";
import { connect } from 'react-redux';

function OptionsCategorySelect(props){
  return (  
    <select
      id={props.htmlId}
      className="select-css input input-secondary full-width font-16 mbm"
      value={props.value} 
      onChange={props.handleOnChange}
      onFocus={props.handleFocus}
      data-qa={'options-' + props.htmlId + '-input'}  
    >
      <option value="">Choose a category</option>
      {props.categories.map((category) => {
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
  );
}

OptionsCategorySelect.propTypes = {
  htmlId: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  handleFocus: PropTypes.func.isRequired,
  handleOnChange: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    categories: state.categories,
  };
}

export default connect(mapStateToProps)(OptionsCategorySelect);
