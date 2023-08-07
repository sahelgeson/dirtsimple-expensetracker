import React from "react";
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from "theme/theme";
import './css/App.scss';
import { Home } from 'routes/Home/Home';
import { History } from 'routes/History/History';
import ScrollToTop from "./helpers/ScrollToTop.jsx";
import { Stats } from 'routes/Stats/Stats';
import { Options } from 'routes/Options/Options';
import { Route, Routes, NavLink } from "react-router-dom";
import { AppProvider } from 'contexts';
import { StatsProvider } from 'routes/Stats/context';

export const App = () => {
  return (
    <AppProvider>
      <ChakraProvider theme={theme}>
        <div>    
          <nav className="main-nav">
            <ul className="flex">
              <li className="flex__1 main-nav__item">
                <NavLink end to="/app/expensetracker"
                  className="main-nav__link pvm"
                  data-qa="app-home-link"
                >
                  <svg viewBox="0 0 32 32" className="home-svg-icon" aria-hidden="true">
                    <path d="M27 18.039L16 9.501 5 18.039V14.56l11-8.54 11 8.538v3.481zm-2.75-.31v8.251h-5.5v-5.5h-5.5v5.5h-5.5v-8.25L16 11.543l8.25 6.186z"/>
                  </svg>
                    Home
                </NavLink>
              </li>
              <li className="flex__1 main-nav__item">
                <NavLink end to="/app/expensetracker/stats"
                  className="main-nav__link pvm"
                  data-qa="app-stats-link"
                >
                  Stats
                </NavLink> 
              </li>
              <li className="flex__1 main-nav__item">
                <NavLink end to="/app/expensetracker/history"
                  className="main-nav__link pvm"
                  data-qa="app-history-link"
                >
                  Expenses
                </NavLink> 
              </li>
              <li className="flex__1 main-nav__item">
                <NavLink end to="/app/expensetracker/options"
                  className="main-nav__link pvm"
                  data-qa="app-options-link"
                >
                  Options
                </NavLink> 
              </li>
            </ul>
          </nav>  
          <Routes>
            <Route
              path="/history"
              element={
                <div className="history">
                  <ScrollToTop />  
                  <History />            
                </div>}
            />
            <Route
              path="/options"
              element={
                <div className="options-page">        
                  <Options />
                </div>}
            />       
            <Route
              path="/stats"
              element={
                <div className="stats-page"> 
                  <StatsProvider>
                    <Stats />
                  </StatsProvider>       
                </div>}
            />
            <Route
              path="/*"
              element={
                <div className="home-page">
                  <Home />
                </div>}
            />
          </Routes>   
        </div>
      </ChakraProvider>
    </AppProvider>
  );
}
