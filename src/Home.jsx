import React from "react";
import { connect } from 'react-redux';
import Form from "./Form/Form.jsx";
import RecentExpenses from "./RecentExpenses/RecentExpenses.jsx";

function Home(props){
  return (
    <div className="container margin-0-auto phl">
      <h1 
        className="font-24 text-center gray-777 mtl pts"
      >
        <span className="logo-dirt">dirt</span>
        <span className="logo-simple">simple</span>
        <br />
        expense tracker          
      </h1>
      <Form/>

      {props.allExpenses.length ? 
        <RecentExpenses recentExpenses={props.allExpenses} /> 
      : null}
    </div>
  );
}

function mapStateToProps(state) {
  return {
    allExpenses: state.allExpenses,
    categories:  state.categories,
  };
}

export default connect(mapStateToProps)(Home);
