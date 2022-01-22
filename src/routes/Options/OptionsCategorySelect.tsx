import React from 'react';
import { useGlobalState } from 'contexts';

interface IProps {
  htmlId: string;
  value: string;
  handleFocus: () => void;
  handleOnChange: () => void;
}

export const OptionsCategorySelect = (props: IProps) => {
  const { allCategories } = useGlobalState();
  const { htmlId, value, handleFocus, handleOnChange } = props;

  return (  
    <select
      id={htmlId}
      className="select-css input input-secondary full-width font-16 mbm"
      value={value}
      onChange={handleOnChange}
      onFocus={handleFocus}
      data-qa={'options-' + htmlId + '-input'}  
    >
      <option value="">Choose a category</option>
      {allCategories.map((category) => {
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
