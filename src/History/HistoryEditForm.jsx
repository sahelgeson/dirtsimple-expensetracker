import React, { Component } from "react";
import { PropTypes } from "prop-types";
import HistoryEditFormAmount from "./HistoryEditFormAmount.jsx";
import HistoryEditFormCategory from "./HistoryEditFormCategory.jsx";
import HistoryEditFormDatetime from "./HistoryEditFormDatetime.jsx";
import HistoryEditFormButtons from "./HistoryEditFormButtons.jsx";

/* if the amount entered is 0 or '' or invalid, save button will be disabled (isSaveDisabled) */
function isAmountValid(amount) {
  return !!parseInt(amount, 10);
}

class HistoryEditForm extends Component{
  constructor(props) {
    super(props);
  
    const thisExpense = this.props.thisExpense; 

    this.state = {
      amount: thisExpense.amount,
      category: thisExpense.category,
      datetime: thisExpense.datetime,
      isSaveDisabled: true,
      isSaved: false,
      isModalOpen: false,
    }

    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.setButtonStates = this.setButtonStates.bind(this);
    this.deleteExpense = this.deleteExpense.bind(this);
  }

  setButtonStates(isAmountValid) {
    /* isSaveDisabled is in here and called by all change handlers because the initial state is disabled
        so when a user opens the form, the save button is disabled, but as soon as any of the inputs are changed
        the save button should be enabled (as long as the amount is valid) 
    */
    this.setState({
      isSaveDisabled: !isAmountValid, 
      isSaved: false,    
    });
  }


  handleAmountChange(event) {
    const amount = event.target.value;
    this.setState({amount: amount});
    this.setButtonStates(isAmountValid(amount));
  }

  handleCategoryChange(event) {
    this.setState({category: event.target.value});
    this.setButtonStates(isAmountValid(this.state.amount));     /* TODO: review this for possible async setState problems */
  }

  handleDateChange(event) {
    try {
      const date = new Date(event.target.value).toString();
      this.setState({datetime: date});  
      this.setButtonStates(isAmountValid(this.state.amount));   /* TODO: review this for possible async setState problems */
    } catch (e) { /* Chrome's datepicker is buggy and will sometimes have an empty string value */ }
  }

  openModal(event) {
    event.preventDefault();
    this.setState({isModalOpen: true});
  }

  closeModal() {
    this.setState({isModalOpen: false});
  }

  deleteExpense() {
    let allExpensesUpdated = [...this.props.allExpenses];
    allExpensesUpdated.splice(this.props.isBeingEditedIndex, 1);
    this.props.handleHoistedExpensesChange(allExpensesUpdated);
    this.closeModal();
  }

  handleSubmit(event) {
    event.preventDefault();
    if (!this.state.amount) { return false; } 

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
      allExpensesUnsorted,
      isSaved: true,
    })

    this.props.handleHoistedExpensesChange(allExpensesUnsorted);
  }  

  render(){
    const { amount, category, datetime } = this.state;

    return( 
      <form  
        className="ftable__row phm pbm pts mbs"
      >
        <legend className="legend pvn pbs mbs">
            Edit
        </legend>
        <div className="full-width pbm">
          <HistoryEditFormAmount  
            amount={amount} 
            handleAmountChange={this.handleAmountChange} 
          />
          <HistoryEditFormCategory 
            category={category} 
            categories={this.props.categories} 
            handleCategoryChange={this.handleCategoryChange} 
          />
          <HistoryEditFormDatetime 
            datetime={datetime} 
            handleDateChange={this.handleDateChange} 
          />
        </div>

        <HistoryEditFormButtons 
          amount={amount}
          handleClick={this.props.handleClick}
          handleSubmit={this.handleSubmit}
          isSaveDisabled={this.state.isSaveDisabled}
          isSaved={this.state.isSaved}
          isModalOpen={this.state.isModalOpen}          
          openModal={this.openModal}
          closeModal={this.closeModal}
          deleteExpense={this.deleteExpense}
        />
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
  handleHoistedExpensesChange: PropTypes.func.isRequired,
};

export default HistoryEditForm;
