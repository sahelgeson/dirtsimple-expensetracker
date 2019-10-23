import React from "react";
import { PropTypes } from "prop-types";

function HistoryEditFormCategory(props){
  return( 
        <div className="mvm">
          <label 
            htmlFor="category" 
            className="edit-label pvm"          
          >
            Category  
          </label>
          <select
            id="category"
            className="edit-input select-css gray-border font-16 plm pvs prxs"
            value={props.category} 
            onChange={props.handleCategoryChange}
          >
            {props.categories.map((category, i) =>
                <option 
                  key={category}
                  value={category}
                >
                  {category}
                </option>
            )}
          </select>
        </div>  
  );
}

HistoryEditFormCategory.propTypes = {
  category: PropTypes.string.isRequired,
  categories: PropTypes.array.isRequired,
};

export default HistoryEditFormCategory;
