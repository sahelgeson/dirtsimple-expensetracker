import React from "react";
import styled from 'styled-components';
import { Link } from "react-router-dom";

const Main = styled.div`
  padding: 2rem;
  text-align: center;
`

const RightTriangle = styled.span`
  font-size: 1.5rem;
  margin-left: .025rem;
`

export const DirtSimpleHomePage = () => {
  return (
    <div className="container margin-0-auto phl">
      <h1 
        className="font-24 text-center gray-777 mtl pts"
      >
        <span className="logo-dirt">dirt</span>
        <span className="logo-simple">simple</span>    
      </h1>

      <Main>
        <Link to="/app/expensetracker">expense tracker <RightTriangle>&#x25B8;</RightTriangle></Link>
      </Main>
    </div>
  );
}

