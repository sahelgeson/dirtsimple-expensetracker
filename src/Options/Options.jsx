import React, { Component} from "react";
import { PropTypes } from "prop-types";
import ReactModal from 'react-modal';
import ReactModalStyles from "../modals/ReactModalStyles.js";

class Options extends Component{
  constructor(props) {
    super(props);
  
    this.state = {
 
    }

    /* Sort expenses by date by default only for initial load. Setting this up in the constructor so we're
      not sorting in edit form because we don't want state to update and rerender which could
      yoink stuff around */
    const allExpensesSorted = [...this.props.allExpenses];
    allExpensesSorted.sort(function(a, b) {
      var dateA = new Date(a.datetime), dateB = new Date(b.datetime);
      return dateB - dateA;
    });

    this.props.handleHoistedExpenseChange(allExpensesSorted);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    /* In case user deletes an expense, close the edit form. */
    if (prevProps.allExpenses.length !== this.props.allExpenses.length) {
      this.setState({isBeingEditedIndex: null});
    }
  }

  handleClick(event) {
    const indexNumber = parseInt(event.target.value, 10);
    (this.state.isBeingEditedIndex === indexNumber)
      ? this.setState({isBeingEditedIndex: null})
      : this.setState({isBeingEditedIndex: indexNumber})
  }

  render(){
    const allExpenses = this.props.allExpenses; 
    const categories = this.props.categories; 

    return(
      <div className="container margin-0-auto phs">
        <h1 className="text-center gray-777 mtm mbs">
          Options
        </h1>
        <div>
          <h2>Edit Categories:</h2>
          <ul>
            <li>Add a category</li>
            <li>Delete a category</li>
            <li>Rename a category</li>
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
                  onClick={this.deleteExpense}>Yes, Delete
                </button>
                <button 
                  className="btn btn--outline capitalize phm pvm mrxs right"
                  onClick={this.closeModal}>No, Cancel
                </button>
              </div>
            </ReactModal>
          </ul>
        </div>
      </div>
    );
  }
}

Options.propTypes = {
  allExpenses: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  handleHoistedExpenseChange: PropTypes.func.isRequired,
};

export default Options;
