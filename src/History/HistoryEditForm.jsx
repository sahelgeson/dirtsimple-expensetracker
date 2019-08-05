import React, { Component} from "react";
import { PropTypes } from "prop-types";
import Modal from 'react-modal';

const customModalStyles = {
  content : {
    position: 'absolute',
    top: '30px',
    left: '30px',
    right: '30px',
    bottom: 'auto',
    border: '1px solid rgb(204, 204, 204)',
    background: 'rgb(255, 255, 255)',
    overflow: 'auto',
    borderRadius: '4px',
    outline: 'none',
    padding: '15px',
  }
};

Modal.setAppElement('#root');

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
  }
 
  handleAmountChange(event) {
    this.setState({amount: event.target.value});
  }

  handleCategoryChange(event) {
    this.setState({category: event.target.value});
  }

  handleDateChange(event) {
    try {
      const ISODate = new Date(event.target.value).toISOString();
      this.setState({datetime: ISODate});  
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


  handleSubmit(event) {
    event.preventDefault();

    if (!this.state.amount) { return false; }  /* TODO change this to an error message */

    console.log('An expense was edited: ' + this.state.amount);

    const {amount, category, datetime} = this.state;

    console.log('datetime: ' + datetime);
    console.log('amount: ' + amount);
    console.log('category: ' + category);

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
    const formattedDatetime = new Date(datetime).toISOString().slice(0,16);

    return( 
      <form  
        className="ftable__row card phm pbm pts mbs"
      >
        <div className="full-width pbm">
          <div>
            <label 
              htmlFor="amount"   
              className="edit-label pvm"        
            >
              Change amount  
            </label>
            <input 
              id="amount"
              className="input edit-input-number inline-block font-16 phxs pvs"
              type="number" 
              placeholder={amount} 
              min="0.01" 
              step="0.01"
              pattern="\d*"
              onChange={this.handleAmountChange}
              value={amount}
            />
          </div>
          <div>
            <label 
              htmlFor="category" 
              className="edit-label pvm"          
            >
              Change category  
            </label>
            <select
              id="category"
              className="input input-secondary inline-block font-16 phxs pvs"
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
          <div>
            <label 
              htmlFor="datetime"
              className="edit-label pvm"           
            >
              Change date   
            </label>
            {/* using datetime-local to avoid issues with manipulating/formatting Dates */}
            <input 
              type="datetime-local" 
              id="datetime"
              className="font-16"
              onChange={this.handleDateChange}
              value={formattedDatetime}
            ></input>
          </div>
        </div>
        <div className="ftable__row ftable__row--between">
          <button
            className="btn btn--red  phxs pvs mrxs"
            onClick={this.openModal}                  
          >
            Delete
          </button>
          <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={customModalStyles}
            contentLabel="Deletion Modal"
          >
            {/*<h2 ref={subtitle => this.subtitle = subtitle}>Hello</h2>*/}
            <div>Are you sure you want to delete this? This can't be undone.</div>
            <button 
              className="btn btn--red phxs pvs mrxs"
              onClick={this.closeModal}>Yes, Delete
            </button>
            <button 
              className="btn btn--outline phxs pvs mrxs"
              onClick={this.closeModal}>No, Cancel
            </button>
          </Modal>
          <button
              className="btn btn--outline phxs pvs mrxs"
              onClick={this.props.handleClick}                  
              value="null"
            >
              Cancel
            </button>
          <button
            className="btn btn--blue pvs phm"
            onClick={this.handleSubmit}                  
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
