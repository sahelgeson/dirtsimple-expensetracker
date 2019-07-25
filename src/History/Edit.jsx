import React from "react";
import { PropTypes } from "prop-types";

/* TODO: make this a function -- stateless */
function Edit(props) {
    const recentExpenses = props.recentExpenses; 
    
    return(
      <div>hey <button>Edit this expense</button></div>
    );
}

Edit.propTypes = {
  recentExpenses: PropTypes.object
};

export default Edit;
