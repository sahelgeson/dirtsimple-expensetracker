import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux';
import { createStore } from 'redux'
import rootReducer from './redux/reducers/reducers';
import { loadState, saveState } from './helpers/LocalStorage';
import { dataMigration } from './helpers/DataMigration';

import { DirtSimpleHomePage } from "./routes/DirtSimpleHome/DirtSimpleHome";

let initialState = loadState();

if (initialState === undefined) {
    try {
        initialState = dataMigration();
    } catch(err) {}
}

const store = createStore(rootReducer, initialState);

store.subscribe(() => {
    saveState(store.getState());
});

  
    /* Format for expenses (used in allExpenses): 
      {
        id,
        datetime,
        amount,
        categoryId
      }

      Format for a category: 
      {
        id,
        name
      }

      For datetime, value is stored in localStorage, which means it has to go through JSON.stringify.
      JSON.stringify converts Date objects to an ISO format ( Date.toISOString => YYYY-MM-DDTHH:mm:ss.sssZ)
      We don't want timezones/GMT, just the local datetime, so we use Date.toString and just save the
      String. Formatting should be done in child components where needed.

      Amount is valid to 2 decimal places, native HTML5 attributes on the input validate that. The
      expectation/hope is that users will just use dollar amounts without cents.

      Categories only allow for one unique value per category name. If that is changed you will need to also
      change any keys associated with categories since those need unique values. Categories are case-sensitive,
      so "Food" and "food" are different categories. 

      !!! the expenses in allExpenses are not sorted, either by index or datetime. Sorting is the responsibility
      of child components. This is necessary because the expenses on the History page must remain unsorted, 
      otherwise a datetime change will be updated and sorted in the store, then filter back down to
      History causing a rerender (and the expense whose datetime was changed will suddenly move, possibly out
      of view)
    */

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <Routes>
                <Route
                    exact path="/"
                    element={<DirtSimpleHomePage />}
                />
                <Route
                    path="/app/expensetracker/*"
                    element={<App />}
                />
            </Routes>
        </BrowserRouter>
    </Provider>
, document.getElementById('root'));
