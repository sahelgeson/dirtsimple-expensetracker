import { useState, useEffect, useRef } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { endOfDay, eachDayOfInterval, isBefore } from 'date-fns';
import { HistoryAccordion } from './HistoryAccordion';
import { DailyTotal } from './DailyTotal';
import { useGlobalState } from 'contexts';
import { NUM_OF_RECENT_EXPENSES } from 'lib/constants';
import { IExpense, Uuid, Dollar, CategoryId } from 'interfaces';

export const History = () => {
  const { recentExpensesUnfiltered } = useGlobalState();

  const [allDays, setAllDays] = useState<Date[]>();
  const [displayExpensesBuffer, setDisplayExpensesBuffer] = useState<IExpense[]>(recentExpensesUnfiltered);
  const today = endOfDay(useGlobalState().getGlobalNow());

  /* 
    displayExpensesBuffer is a local state version of recentExpensesUnfiltered.
    We don't use recentExpensesUnfiltered directly because a user can edit
    the datetime, and when they do that it updates recentExpensesUnfiltered,
    which would rerender after they save date changes, which would end up
    "yoinking" the edited expense around on the page out from under them.
    displayExpensesBuffer is a way to delay that and only show re-sorted 
    expenses on load/reload.
  */
  const calledOnceWithData = useRef(false);
  useEffect(() => {
    if (calledOnceWithData.current) { return; }

    setDisplayExpensesBuffer(recentExpensesUnfiltered);
    if (recentExpensesUnfiltered.length) {
      calledOnceWithData.current = true;
    }
  }, [recentExpensesUnfiltered]);

  const updateBuffer = ({ 
    id, 
    amount, 
    categoryId 
  }: {
    id: Uuid;
    amount?: Dollar;
    categoryId?: CategoryId;
  }) => {
    setDisplayExpensesBuffer((prev: IExpense[]) => {
      const updatedExpenses = prev.map(expense => {
        // don't update datetime to avoid yoinking expenses around
        if (expense.id === id) {
          if (amount) {
            expense.amount = amount;
          }
          if (categoryId) {
            expense.categoryId = categoryId;
          }
        }
        return expense;
      });  
      return updatedExpenses;
    })
  }

  useEffect(() => {
    if (displayExpensesBuffer?.length) {
      // can't rely on it being sorted here since user edits are in-place, so sorting is done here
      const lastExpenseDay = displayExpensesBuffer.reduce((previousValue, currentValue) => {
        const prevDate = new Date(previousValue);
        const currDate = new Date(currentValue.datetime);
        return isBefore(prevDate, currDate) ? prevDate : currDate;
      }, today);
      const lastDayShown = lastExpenseDay ?? today; 
      const interval = { start: lastDayShown, end: today };
      setAllDays(eachDayOfInterval(interval).reverse());
    }
  }, [displayExpensesBuffer]);

  if (typeof displayExpensesBuffer === 'undefined') return null;

  return (
    <div className="container margin-0-auto mtm phs"> 
      {(!displayExpensesBuffer.length) 
        ? (
          <Box mt={8} textAlign="center">No expenses entered yet</Box>
        ) : (
          <div>
            {allDays?.map(day => {
              const thisDaysExpenses = displayExpensesBuffer.filter((expense: IExpense) => {
                const endOfExpenseDay = endOfDay(new Date(expense.datetime)).toString();
                const endOfThisDay = endOfDay(day).toString();
                return (endOfExpenseDay === endOfThisDay) 
              });

              const thisDaysTotal = thisDaysExpenses.reduce((accumulator, expense) => accumulator + expense.amount, 0);

              return (
                <Box key={day.toString()}
                  outline='1px solid' 
                  outlineColor='gray.200'
                  mb={8}   
                >
                  {thisDaysExpenses.length === 0 && (
                    <Box textAlign='center' py={2}>
                      <Text color='gray.500'>
                        No expenses 
                      </Text>
                      
                    </Box>
                  )}
                  {thisDaysExpenses.map((expense) => {
                    /* each item has to have it's own <Accordion> otherwise there are serious performance issues.
                        This means can't limit to only one open at a time without some hacky workaround */                 
                    return (
                      <HistoryAccordion 
                        expense={expense} 
                        key={expense.id} 
                        updateBuffer={updateBuffer} 
                      />
                    );
                  })}
                  <DailyTotal total={thisDaysTotal} thisDay={day} />
                </Box>
              )}
            )}

            <Box 
              my={4}
              color="gray.500"
              textAlign="center"
            >
              {/* TODO think about adding View More functionality */}
              Showing {NUM_OF_RECENT_EXPENSES} most recent expenses.
            </Box>
          </div>
        )}
    </div>
  );
}
