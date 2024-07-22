import React from 'react';
import ReactModal from 'react-modal';
import ReactModalStyles from "../../components/modals/ReactModalStyles.js";
import { Button, Flex, Box, Spacer } from '@chakra-ui/react';

/*
interface {
  isOpen: boolean;
  closeModal: () => void;
  handleRenameSubmit: () => void;
}
*/

export const OptionsRenameCategoryRenameModal = (props) => {
  return (
      <ReactModal
        isOpen={props.isOpen}
        onRequestClose={props.closeModal}
        style={ReactModalStyles}
        contentLabel="Renaming Modal"
      >
        {props.children}
        <div className="pvl">
          <button 
            type="button"
            className="btn btn--red capitalize phm pvm mrxs left"
            onClick={(event) => props.handleRenameSubmit(event, { isOkayFromModal: true })}   
            data-qa="options-rename-modal-yes-button"
          >
            Yes, Rename
          </button>
          <button 
            type="button"
            className="btn btn--outline capitalize phm pvm mrxs right"
            onClick={props.closeModal}
          >
            No, Cancel
          </button>
        </div>
      </ReactModal>
  );
}
