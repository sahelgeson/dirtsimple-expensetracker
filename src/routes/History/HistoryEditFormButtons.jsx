import React from 'react';
import ReactModal from 'react-modal';
import ReactModalStyles from "../../components/modals/ReactModalStyles.js";

ReactModal.defaultStyles.overlay.backgroundColor = 'rgba(80, 80, 80, 0.69)';
ReactModal.setAppElement('#root');

/*
interface IProps {
  handleClick: () => void;
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
  const { openModal, closeModal, isModalOpen, deleteThisExpense, handleClick, handleSubmit, isSaved, isSaveDisabled } = props;

  return ( 
    <div className="ftable__row ftable__row--between">
      <button
        className="btn btn--red font-14 phm pvm mrxs"
        onClick={openModal}                  
      >
        Delete
      </button>
      
      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={ReactModalStyles}
        contentLabel="Deletion Modal"
      >
        <div>Are you sure you want to delete this expense entirely? This can't be undone.</div>
        <div className="pvl">
          <button 
            className="btn btn--red capitalize phm pvm mrxs left"
            onClick={deleteThisExpense}
          >
            Yes, Delete
          </button>
          <button 
            className="btn btn--outline capitalize phm pvm mrxs right"
            onClick={closeModal}
          >
            No, Cancel
          </button>
        </div>
      </ReactModal>

      <button
        className="btn btn--outline gray-777 font-14 phm pvm mrxs"
        onClick={handleClick}                  
        value="null"
      >
        Close
      </button>

      {!isSaved ?
        <button
          className="btn btn--blue font-14 pvm phm"
          onClick={handleSubmit}  
          disabled={isSaveDisabled} 
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
