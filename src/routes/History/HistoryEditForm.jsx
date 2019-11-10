import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from 'react-redux';
import { updateExpense, deleteExpense } from '../../redux/actions/expenses-actions';
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
      categoryId: thisExpense.categoryId,
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
    this.setState({categoryId: event.target.value});
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
    this.props.deleteExpense(this.props.thisExpense.id);
    this.closeModal();
  }

  handleSubmit(event) {
    event.preventDefault();
    if (!this.state.amount) { return false; } 
    const id = this.props.thisExpense.id;
    const {amount, categoryId, datetime} = this.state;

    const editedExpense = {
      id,     
      datetime,
      amount,
      categoryId,
    }

    this.setState({
      isSaved: true,
    })

    this.props.updateExpense(editedExpense);
  }  

  render(){
    const { amount, categoryId, datetime } = this.state;

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
            category={categoryId} 
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
  isBeingEditedId: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    allExpenses: state.allExpenses,
    categories:  state.categories,
  };
}

export default connect(mapStateToProps, { deleteExpense, updateExpense })(HistoryEditForm);
