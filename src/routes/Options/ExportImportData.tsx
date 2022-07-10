import { useState } from 'react';
import { OptionsAccordion } from './OptionsAccordion';
import { ExportData } from './ExportData';
import { ImportData } from './ImportData';

export const ExportImportData = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleAccordionClick = () => {
    setIsOpen((prev) => !prev);
  } 

  return (
    <div className="card mtm mbl">
      <OptionsAccordion
        isOpen={isOpen}
        label="import-export"
        handleAccordionClick={handleAccordionClick}
      >
        Export or Import data
      </OptionsAccordion>  

    {isOpen && (
      <div 
        className="mhm mbl"
        data-qa="options-import-export-container"
      >
        <ExportData />
        <ImportData />
      </div>        
    )}
    </div>
  );
};

