import { ReactNode } from 'react';
import { MinusIcon, AddIcon } from '@chakra-ui/icons'

interface IProps {
  children?: ReactNode;
  isOpen: boolean;
  label: string;
  className?: string;
  handleAccordionClick: () => void;
}

export const OptionsAccordion = (props: IProps): JSX.Element => {
  const { children, isOpen, label, className, handleAccordionClick } = props;
  const classNameString = className || "full-width text-left pam";

  return (
      <button 
        type="button"
        className={classNameString}
        onClick={handleAccordionClick}
        data-qa={'options-' + label + '-accordion'}
      >
        <label
          htmlFor={label}
        >
          {children}
        </label>
        <div className="right gray-777 bold">
          {isOpen ? (
            <MinusIcon fontSize='14px' />
          ) : (
            <AddIcon fontSize='14px' />
          )}          
        </div>
      </button>           
  );
}
