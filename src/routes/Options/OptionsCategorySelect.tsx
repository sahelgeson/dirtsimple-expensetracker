import { ChangeEvent } from 'react';
import { ICategory, CategoryId } from 'interfaces';

interface IProps {
  htmlId: string;
  value: CategoryId;
  categoryOptions: ICategory[];
  className?: string;
  handleFocus?: () => void;
  handleOnChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export const OptionsCategorySelect = (props: IProps): JSX.Element => {
  const { htmlId, value, handleFocus, handleOnChange, categoryOptions, className } = props;
  const classNameString = className || "select-css input input-secondary full-width font-16 mbm";

  return (  
    <select
      id={htmlId}
      className={classNameString}
      value={value || ''}
      onChange={handleOnChange}
      onFocus={handleFocus}
      data-qa={'options-' + htmlId + '-input'}  
    >
      <option value="">Choose a category</option>
      {categoryOptions.map((category) => {
        return (category.id !== null) ? (
            <option 
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>
          ) : null;
        }
      )}
    </select>
  );
}
