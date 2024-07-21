import React from "react";
import ReactModal from 'react-modal';
import ReactModalStyles from "../../components/modals/ReactModalStyles.js";
import { Button, Flex, Box, Spacer } from '@chakra-ui/react';

/*
interface IProps {
  isOpen: boolean;
  closeModal: () => void;
  handleDeleteSubmit: () => void;
  children: React.ReactNode;
}
*/
export const OptionsDeleteCategoryModal = ({
  isOpen,
  closeModal,
  handleDeleteSubmit,
  children,
}) => {
  return (
      <ReactModal
        isOpen={isOpen}
        onRequestClose={closeModal}
        shouldFocusAfterRender={false}
        style={ReactModalStyles}
        contentLabel="Deletion Modal"
      >
        {children}

        <Flex mt={4}>
          {/* doing onClick instead of just button type="submit" because a normal submit will
            make the submit button focussed after submission, and that interferes with the handleFocus 
            handler used to reset the success messaging */}
          <Box>
            <Button 
              colorScheme='red'
              size='lg'
              form="deleteform"
              onClick={(event) => handleDeleteSubmit(event)}
              data-qa="options-delete-submit-btn"
            >
              Yes, Delete
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
