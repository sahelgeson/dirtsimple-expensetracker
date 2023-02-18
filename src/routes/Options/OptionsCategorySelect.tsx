import { ChangeEvent } from 'react';
import { ICategory, CategoryId } from 'interfaces';
import { Select } from '@chakra-ui/react';


interface IProps {
  htmlId: string;
  size?: string;  // TODO make this use type from chakra
  value: CategoryId;
  categoryOptions: ICategory[];
  className?: string;
  handleFocus?: () => void;
  handleOnChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export const OptionsCategorySelect = (props: IProps): JSX.Element => {
  const { 
    htmlId, 
    value, 
    handleFocus, 
    handleOnChange, 
    categoryOptions, 
    size, 
    ...otherProps
  } = props;

  return (  
    <Select
      id={htmlId}
      size={size}
      value={value || ''}
      onChange={handleOnChange}
      onFocus={handleFocus}
      data-qa={'options-' + htmlId + '-input'} 
      {...otherProps} 
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
    </Select>
  );
}
