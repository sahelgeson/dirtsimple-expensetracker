import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux';
import { createStore } from 'redux'
import rootReducer from './redux/reducers/reducers';
import * as serviceWorker from './serviceWorker';

/* undefined is used so redux will hydrate with default values if none already present */
const allExpenses = JSON.parse(localStorage.getItem('myExpensesDebug')) || undefined;   
const categories  = JSON.parse(localStorage.getItem('myCategoriesDebug')) || undefined;
const initialState = {
    allExpenses,
    categories,
}

//debugger; 

const store = createStore(rootReducer, initialState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()    // TODO: remove before deploying
);

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
