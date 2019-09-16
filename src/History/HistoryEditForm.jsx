import React, { Component} from "react";
import { PropTypes } from "prop-types";
import ReactModal from 'react-modal';
import ReactModalStyles from "../modals/ReactModalStyles.js";
const { format } = require('date-fns');


ReactModal.defaultStyles.overlay.backgroundColor = 'rgba(80, 80, 80, 0.69)';

ReactModal.setAppElement('#root');

class HistoryEditForm extends Component{
  constructor(props) {
    super(props);
  
    const thisExpense = this.props.thisExpense; 

    this.state = {
      amount: thisExpense.amount,
      category: thisExpense.category,
      datetime: thisExpense.datetime,
      modalIsOpen: false,
    }

    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.deleteExpense = this.deleteExpense.bind(this);
  }
 
  handleAmountChange(event) {
    this.setState({amount: event.target.value});
  }

  handleCategoryChange(event) {
    this.setState({category: event.target.value});
  }

  handleDateChange(event) {
    try {
      const date = new Date(event.target.value).toString();
      this.setState({datetime: date});  
    } catch (e) { /* Chrome's datepicker is buggy and will sometimes have an empty string value */ }
  }

  openModal(event) {
    event.preventDefault();
    this.setState({modalIsOpen: true});
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    //this.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  deleteExpense() {
    let allExpensesUpdated = [...this.props.allExpenses];
    allExpensesUpdated.splice(this.props.isBeingEditedIndex, 1);
    this.props.handleHoistedExpenseChange(allExpensesUpdated);
    this.closeModal();
  }

  handleSubmit(event) {
    event.preventDefault();

    if (!this.state.amount) { return false; }  /* TODO change this to an error message */

    console.log('An expense was edited: ' + this.state.amount);

    const {amount, category, datetime} = this.state;

    const editedExpense = {
      datetime,
      amount,
      category
    }

    /* "Unsorted" because user may edit datetime.
       Not sorting in edit form because we don't want state to update and rerender which could
       yoink stuff around */      
    let allExpensesUnsorted = this.props.allExpenses;
    /* index is still null */
    allExpensesUnsorted[this.props.isBeingEditedIndex] = editedExpense;

    this.setState({
      allExpensesUnsorted
    })

    this.props.handleHoistedExpenseChange(allExpensesUnsorted);
  }  

  render(){
    const { amount, category, datetime } = this.state;
    /* The HTML input type="datetime-local" takes a custom format that is only part of the standard ISO format */
    const formattedDatetime = format(datetime, 'YYYY-MM-DDTHH:mm');

    return( 
      <form  
        className="ftable__row phm pbm pts mbs"
      >
        <legend className="legend pvn pbs mbs">
            Edit
        </legend>
        <div className="full-width pbm">
          <div className="mvm">
            <label 
              htmlFor="amount"   
              className="edit-label pvm"        
            >
              Amount  
            </label>
            <input 
              id="amount"
              className="edit-input gray-border font-16 plm pvs prxs"
              type="number" 
              placeholder={amount} 
              min="0.01" 
              step="0.01"
              pattern="\d*"
              onChange={this.handleAmountChange}
              value={amount}
              data-qa="history-form-amount-input"   
            />
          </div>
          <div className="mvm">
            <label 
              htmlFor="category" 
              className="edit-label pvm"          
            >
              Category  
            </label>
            <select
              id="category"
              className="edit-input select-css gray-border font-16 plm pvs prxs"
              value={category} 
              onChange={this.handleCategoryChange}
            >
              {this.props.categories.map((category, i) =>
                  <option 
                    key={i}
                    value={category}
                  >
                    {category}
                  </option>
              )}
            </select>
          </div>
          <div className="mvm">
            <label 
              htmlFor="datetime"
              className="edit-label pvm"           
            >
              Date   
            </label>
            {/* using datetime-local to avoid issues with manipulating/formatting Dates */}
            <input 
              type="datetime-local" 
              id="datetime"
              className="edit-input select-css gray-border inline-block font-16 plm pvs prxs"
              onChange={this.handleDateChange}
              value={formattedDatetime}
            ></input>
          </div>
        </div>
        <div className="ftable__row ftable__row--between">
          <button
            className="btn btn--red font-14 phm pvm mrxs"
            onClick={this.openModal}                  
          >
            Delete
          </button>
          <ReactModal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={ReactModalStyles}
            contentLabel="Deletion Modal"
          >
            {/*<h2 ref={subtitle => this.subtitle = subtitle}>Hello</h2>*/}
            <div>Are you sure you want to delete this expense entirely? This can't be undone.</div>
            <div className="pvl">
              <button 
                className="btn btn--red capitalize phm pvm mrxs left"
                onClick={this.deleteExpense}
              >
                Yes, Delete
              </button>
              <button 
                className="btn btn--outline capitalize phm pvm mrxs right"
                onClick={this.closeModal}
              >
                No, Cancel
              </button>
            </div>
          </ReactModal>
          <button
              className="btn btn--outline gray-777 font-14 phm pvm mrxs"
              onClick={this.props.handleClick}                  
              value="null"
            >
              Close
            </button>
          <button
            className="btn btn--blue font-14 pvm phm"
            onClick={this.handleSubmit}  
            disabled={!!parseInt(this.state.amount, 10) ? false : true} 
            data-qa="history-form-save-btn"                  
          >
            Save
          </button>
        </div>
      </form>
    );
  }
}

HistoryEditForm.propTypes = {
  thisExpense: PropTypes.object.isRequired,
  categories: PropTypes.array.isRequired,
  allExpenses: PropTypes.array.isRequired,
  isBeingEditedIndex: PropTypes.number.isRequired,
  handleClick: PropTypes.func.isRequired,
  handleHoistedExpenseChange: PropTypes.func.isRequired,
};

export default HistoryEditForm;
