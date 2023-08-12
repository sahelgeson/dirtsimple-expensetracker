import React from 'react';
import { useGlobalState } from 'contexts';
import { Box, Heading } from '@chakra-ui/react';
import { HomeForm } from './HomeForm';
import { HomeRecentExpenses } from './HomeRecentExpenses';

export const Home = () => {
  const { allExpensesUnfiltered } = useGlobalState();
  return (
    <div className="container margin-0-auto phl">
      <Heading 
        as="h1"
        textAlign="center"
        color="#777"
        fontSize="sm"
        fontWeight="normal"
        mt={12}
        mb={16}
      >
        <span className="logo-dirt">dirt</span>
        <span className="logo-simple">simple</span>
        <br />
        expense tracker          
      </Heading>

      <HomeForm/>

      {!!allExpensesUnfiltered.length && 
        <Box mt={8}>
          <HomeRecentExpenses recentExpenses={allExpensesUnfiltered} />
        </Box>
      }
    </div>
  );
};
