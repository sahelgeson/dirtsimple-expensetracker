import React from "react";
import ReactModal from 'react-modal';
import ReactModalStyles from "../../components/modals/ReactModalStyles.js";
import { Button, Flex, Box, Spacer } from '@chakra-ui/react';

/*
interface IProps {
  isOpen: boolean;
  closeModal: () => void;
  handleDeleteSubmit: () => void;
}
*/
export const OptionsDeleteCategoryModal = (props) => {
  const {
    isOpen,
    closeModal,
    handleDeleteSubmit,
  } = props;

  return (
      <ReactModal
        isOpen={isOpen}
        onRequestClose={closeModal}
        shouldFocusAfterRender={false}
        style={ReactModalStyles}
        contentLabel="Deletion Modal"
      >
        {props.children}
        <div className="pvl">
          {/* doing onClick instead of just button type="submit" because a normal submit will
            make the submit button focussed after submission, and that interferes with the handleFocus 
            handler used to reset the success messaging */}
          <button 
            type="button"
            form="deleteform"
            className="btn btn--red capitalize phm pvm mrxs left"
            onClick={(event) => handleDeleteSubmit(event)}
            data-qa="options-delete-submit-btn"
          >
            Yes, Delete  
          </button>     
          <button 
            type="button"
            className="btn btn--outline capitalize phm pvm mrxs right"
            onClick={closeModal}
          >
            No, Cancel
          </button>
        </div>
      </ReactModal>
  );
}
