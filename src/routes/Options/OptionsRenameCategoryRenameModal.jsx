import React from 'react';
import ReactModal from 'react-modal';
import ReactModalStyles from "../../components/modals/ReactModalStyles.js";
import { Button, Flex, Box, Spacer } from '@chakra-ui/react';

/*
interface {
  isOpen: boolean;
  closeModal: () => void;
  handleRenameSubmit: () => void;
  children: React.ReactNode;
}
*/

export const OptionsRenameCategoryRenameModal = ({
  isOpen,
  closeModal,
  handleRenameSubmit,
  children,
}) => {
  return (
      <ReactModal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={ReactModalStyles}
        contentLabel="Renaming Modal"
      >
        {children}

        <Flex mt={4}>
          <Box>
            <Button 
              colorScheme='red'
              size='lg'
              onClick={(event) => handleRenameSubmit(event, { isOkayFromModal: true })}   
              data-qa="options-rename-modal-yes-button"
            >
              Yes, Rename
            </Button>
          </Box>
          <Spacer />
          <Box>
            <Button 
              colorScheme='gray'
              size='lg'
              onClick={closeModal}
            >
              No, Cancel
            </Button>
          </Box>
        </Flex>
      </ReactModal>
  );
}
