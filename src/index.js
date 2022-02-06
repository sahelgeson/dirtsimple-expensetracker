import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { DirtSimpleHomePage } from "./routes/DirtSimpleHome/DirtSimpleHome";

ReactDOM.render(
  <>
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
  </>
, document.getElementById('root'));
