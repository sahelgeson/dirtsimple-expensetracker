import React from "react";
import { Card, CardHeader } from "@chakra-ui/react";
import { OptionsAccordionButton } from './OptionsAccordionButton';
import { 
  Accordion,
  AccordionItem,
  AccordionPanel,
} from '@chakra-ui/react';
import { OptionsAddCategory } from './OptionsAddCategory';
import { OptionsDeleteCategory } from './OptionsDeleteCategory';
import { OptionsRenameCategory } from './OptionsRenameCategory.jsx';
import { OptionsReorderCategories } from './OptionsReorderCategories';
import { OptionsSavingsRate } from './OptionsSavingsRate';
import { ExportData } from './ExportData';
import { ImportData } from './ImportData';

export const Options = () => {
  return(
    <Card m={4} mb={8}>
      <CardHeader textAlign={'center'} p={4}>
        Options
      </CardHeader>

      <Accordion allowToggle>
        <AccordionItem>
          <OptionsAccordionButton data-qa="options-addcategory-accordion">
            Add a category 
          </OptionsAccordionButton>  

          <AccordionPanel>
            <OptionsAddCategory />
          </AccordionPanel>
        </AccordionItem>
  

        <AccordionItem>
          <OptionsAccordionButton data-qa="options-deletecategory-accordion">
            Delete a category 
          </OptionsAccordionButton>  

          <AccordionPanel>
            <OptionsDeleteCategory />
          </AccordionPanel>
        </AccordionItem>


        <AccordionItem>
          <OptionsAccordionButton data-qa="options-renamecategory-accordion">
            Rename a category 
          </OptionsAccordionButton>  

          <AccordionPanel>
            <OptionsRenameCategory />
          </AccordionPanel>
        </AccordionItem>


        <AccordionItem>
          <OptionsAccordionButton>
            Reorder categories
          </OptionsAccordionButton>  

          <AccordionPanel>
            <OptionsReorderCategories />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <OptionsAccordionButton>
            Set a Savings Rate
          </OptionsAccordionButton>  

          <AccordionPanel>
            <OptionsSavingsRate />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <OptionsAccordionButton>
            Export or Import data
          </OptionsAccordionButton>  

          <AccordionPanel 
            pb={4}
            data-qa="options-import-export-container"
          >
            <ExportData />
            <ImportData />
          </AccordionPanel>  
        </AccordionItem>
      </Accordion>

    </Card>
  );
}
