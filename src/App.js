import React, { Component} from "react";
import './App.css';

class App extends Component{
  constructor(props) {
    super(props);
  
    this.state = {
      mostRecentCategory: 'Food',
      mostRecentCategoryColor: 'Food'
    }
  }
  
  render(){
    return (
      <div className="App">
        <form>
          <input 
            className="input font-25 mhl mvm"
            type="number" 
            placeholder="$0.00" 
          />
          <label
            className="label mbs"
          >
            Category
          </label>

          {/* TODO This input needs to be styles with the color associated with the category */}
          <input 
            className="input font-25 mhl mbm"
            type="button" 
            value={this.state.mostRecentCategory} 
          />
          <input 
            className="input font-25 mhl mvm"
            type="submit" 
            value="Save" 
          />
        </form>
      </div>
    );
  }
}

export default App;
