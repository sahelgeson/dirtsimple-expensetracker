import React from 'react';
/* 
interface IProps {
  isOpen: boolean;
  label: string;
  handleAccordionClick: () => void;
}
*/

export const OptionsAccordion = (props) => {
  return (
      <button 
        type="button"
        className="full-width text-left pam"
        onClick={props.handleAccordionClick}
        data-qa={'options-' + props.label + '-accordion'}
      >
        <label
          htmlFor={props.label}
        >
          {props.children}
        </label>
        <div className="right gray-777 bold">
          {props.isOpen ? String.fromCharCode(65293) : String.fromCharCode(65291) }
        </div>
      </button>           
  );
}
