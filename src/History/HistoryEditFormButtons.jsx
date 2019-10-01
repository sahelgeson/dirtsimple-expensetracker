import React from "react";
import { PropTypes } from "prop-types";
import ReactModal from 'react-modal';
import ReactModalStyles from "../modals/ReactModalStyles.js";

ReactModal.defaultStyles.overlay.backgroundColor = 'rgba(80, 80, 80, 0.69)';
ReactModal.setAppElement('#root');

function HistoryEditFormButtons(props){
  return( 
    <div className="ftable__row ftable__row--between">
      <button
        className="btn btn--red font-14 phm pvm mrxs"
        onClick={props.openModal}                  
      >
        Delete
      </button>
      <ReactModal
        isOpen={props.isModalOpen}
        onRequestClose={props.closeModal}
        style={ReactModalStyles}
        contentLabel="Deletion Modal"
      >
        <div>Are you sure you want to delete this expense entirely? This can't be undone.</div>
        <div className="pvl">
          <button 
            className="btn btn--red capitalize phm pvm mrxs left"
            onClick={props.deleteExpense}
          >
            Yes, Delete
          </button>
          <button 
            className="btn btn--outline capitalize phm pvm mrxs right"
            onClick={props.closeModal}
          >
            No, Cancel
          </button>
        </div>
      </ReactModal>
      <button
          className="btn btn--outline gray-777 font-14 phm pvm mrxs"
          onClick={props.handleClick}                  
          value="null"
        >
          Close
        </button>
      {!props.isSaved ?
        <button
          className="btn btn--blue font-14 pvm phm"
          onClick={props.handleSubmit}  
          disabled={props.isSaveDisabled ? true : false } 
          data-qa="history-form-save-btn"                  
        >
          Save
        </button>
        :
        <div 
          className="gray-777 font-14 pvm phm"
          data-qa="history-form-saved-message"   
        >
          Saved!
        </div>
      }
    </div>
  );
}

HistoryEditFormButtons.propTypes = {
  amount: PropTypes.string.isRequired,    
  handleClick: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isSaveDisabled: PropTypes.bool.isRequired,
  isSaved: PropTypes.bool.isRequired,
  isModalOpen: PropTypes.bool.isRequired,
  openModal: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  deleteExpense: PropTypes.func.isRequired,
};

export default HistoryEditFormButtons;
