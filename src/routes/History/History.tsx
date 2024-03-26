import { useState, useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';
import { endOfDay, eachDayOfInterval, isBefore } from 'date-fns';
import { HistoryAccordion } from './HistoryAccordion';
import { DailyTotal } from './DailyTotal';
import { useGlobalState } from 'contexts';
import { NUM_OF_RECENT_EXPENSES } from 'lib/constants';
import { IExpense } from 'interfaces';

export const History = () => {
  const { recentExpensesUnfiltered } = useGlobalState();

  const [allDays, setAllDays] = useState<Date[]>();
  const [displayExpenses, setDisplayExpenses] = useState<IExpense[]>([]);

  const today = endOfDay(useGlobalState().getGlobalNow());
  const calledOnceWithData = useRef(false);

  /* 
    displayExpenses is a local state version of recentExpensesUnfiltered.
    We don't use recentExpensesUnfiltered directly because a user can edit
    the datetime, and when they do that it updates recentExpensesUnfiltered,
    which would rerender after they save date changes, which would end up
    "yoinking" the edited expense around on the page out from under them.
    displayExpenses is a way to delay that and only show re-sorted 
    expenses on load/reload.
  */
  useEffect(() => {
    if (calledOnceWithData.current) { return; }

    setDisplayExpenses(recentExpensesUnfiltered);
    if (recentExpensesUnfiltered.length) {
      calledOnceWithData.current = true;
    }
  }, [recentExpensesUnfiltered]);

  useEffect(() => {
    if (displayExpenses.length) {
      // can't rely on it being sorted here since user edits are in-place
      const lastExpenseDay = displayExpenses.reduce((previousValue, currentValue) => {
        const prevDate = new Date(previousValue);
        const currDate = new Date(currentValue.datetime);
        return isBefore(prevDate, currDate) ? prevDate : currDate;
      }, today);
      const lastDayShown = lastExpenseDay ?? today; 
      const interval = { start: lastDayShown, end: today };
      setAllDays(eachDayOfInterval(interval).reverse());
    }
  }, [displayExpenses]);

  return (
    <div className="container margin-0-auto mtm phs"> 
      {(!displayExpenses.length) 
        ? (
          <Box mt={8} textAlign="center">No expenses entered yet</Box>
        ) : (
          <div>
            {allDays?.map(day => {
              const thisDaysExpenses = displayExpenses.filter((expense: IExpense) => {
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
                  {thisDaysExpenses.map((expense) => {
                    /* each item has to have it's own <Accordion> otherwise there are serious performance issues.
                        This means can't limit to only one open at a time without some hacky workaround */
                    return (
                      <HistoryAccordion expense={expense} key={expense.id} />
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
