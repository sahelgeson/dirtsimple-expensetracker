import React from 'react';
import { Button, Flex, Box, Spacer } from '@chakra-ui/react';
import ReactModal from 'react-modal';
import ReactModalStyles from "../../components/modals/ReactModalStyles.js";

ReactModal.defaultStyles.overlay.backgroundColor = 'rgba(80, 80, 80, 0.69)';
ReactModal.setAppElement('#root');

/*
interface IProps {
  handleClose: () => void;
  handleSubmit: () => void;
  isSaveDisabled: boolean;
  isSaved: boolean;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  deleteThisExpense: () => void;
}
*/

export const HistoryEditFormButtons = (props) => {
  const { openModal, closeModal, isModalOpen, deleteThisExpense, handleClose, handleSubmit, isSaved, isSaveDisabled } = props;

  return ( 
    <div className="ftable__row ftable__row--between">
      <Button 
        colorScheme='red'
        size='lg'
        onClick={openModal}
      >
        Delete
      </Button>

      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={ReactModalStyles}
        contentLabel="Deletion Modal"
      >
        <div>Are you sure you want to delete this expense entirely? This can't be undone.</div>
        <Flex mt={4}>
          <Box>
            <Button 
              colorScheme='red'
              size='lg'
              onClick={deleteThisExpense}
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

      <Button 
        colorScheme='gray'
        size='lg' 
        onClick={handleClose}  /* TODO also should reset onClose of Accordion, improve state management here */               
      >
        Close
      </Button>

      <Button 
        size="lg"
        onClick={handleSubmit} 
        variant={isSaved ? 'success' : 'solid'}
        isDisabled={isSaveDisabled}   
        data-qa='history-form-save-btn' 
        colorScheme={isSaved ? '' : 'blue'}
      >
        <>{isSaved ? 'Saved!' : 'Save'}</>
      </Button>
    </div>
  );
}
