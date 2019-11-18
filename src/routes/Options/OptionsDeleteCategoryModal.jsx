import React from "react";
import { PropTypes } from "prop-types";
import ReactModal from 'react-modal';
import ReactModalStyles from "../../components/modals/ReactModalStyles.js";

function OptionsCategoryDeleteModal(props){
  return (
      <ReactModal
        isOpen={props.isOpen}
        onRequestClose={props.closeModal}
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
            onClick={(event) => props.handleDeleteSubmit(event)}
            data-qa="options-delete-submit-btn"
          >
            Yes, Delete  
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

OptionsCategoryDeleteModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  handleDeleteSubmit: PropTypes.func.isRequired,
};

export default OptionsCategoryDeleteModal;
