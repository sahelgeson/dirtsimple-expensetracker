import React, { Component} from "react";
import { PropTypes } from "prop-types";
import { Route, Link } from "react-router-dom";

/* TODO: make this a function -- stateless */
class History extends Component{
  constructor(props) {
    super(props);
  }

  render(){
    const recentExpenses = this.props.recentExpenses;

    return(
      <div className="card">
        <div className="center gray-777 mbs">
          Howdy
        </div>
      </div>
    );
  }
}

History.propTypes = {
  recentExpenses: PropTypes.object
};

export default History;
