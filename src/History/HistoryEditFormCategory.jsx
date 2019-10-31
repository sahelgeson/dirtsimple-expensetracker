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
        className={(props.category !== null) ?
            "edit-input select-css gray-border font-16 plm pvs prxs"
          : "edit-input select-css gray-border font-16 plm pvs prxs italic gray-777" }
        value={props.category || 'Uncategorized'} 
        onChange={props.handleCategoryChange}
      >
        {/* filter out Uncategorized like normal, unless this expense's category
            is already 'Uncategorized'. In that case Uncategorized should show 
            up in the select */}
        {(props.category === null) ?
            props.categories.map((category) =>
                <option 
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
            )
          :
            props.categories.map((category) => {
                if (category.id !== null) {
                  return (
                    <option 
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  );
                } else { return null; }
              }
            )
        }
      </select>
    </div>  
  );
}

HistoryEditFormCategory.propTypes = {
  category: PropTypes.string,
  categories: PropTypes.array.isRequired,
};

export default HistoryEditFormCategory;
