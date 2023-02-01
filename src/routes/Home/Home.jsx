import React from "react";
import { useGlobalState } from 'contexts';
import { HomeForm } from './HomeForm';
import { HomeRecentExpenses } from './HomeRecentExpenses';

export const Home = () => {
  const { allExpensesUnfiltered } = useGlobalState();
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
      <HomeForm/>

      {!!allExpensesUnfiltered.length && 
        <HomeRecentExpenses recentExpenses={allExpensesUnfiltered} />
      }
    </div>
  );
};
