import { useState, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { endOfDay, eachDayOfInterval } from 'date-fns';
import { HistoryAccordion } from './HistoryAccordion';
import { DailyTotal } from './DailyTotal';
import { useGlobalState } from 'contexts';
import { NUM_OF_RECENT_EXPENSES } from 'lib/constants';
import { IExpense } from 'interfaces';

export const History = () => {
  const { recentExpensesUnfiltered, sortExpenses } = useGlobalState();

  const [allDays, setAllDays] = useState<Date[]>();

  const today = endOfDay(useGlobalState().getGlobalNow());

  /* Sort expenses by date by default only for initial load. Setting this up only onmount so we're
    not sorting in edit form because we don't want state to update and rerender which could
    yoink stuff around -- in other words we save any edits made by HistoryEditForm,
    but we don't re-sort the expenses except on load/reload */
  useEffect(() => {
    sortExpenses();
  }, []);

  useEffect(() => {
    if (recentExpensesUnfiltered.length) {
      const lastExpenseDay = recentExpensesUnfiltered.at(-1)?.datetime;
      const lastDayShown = new Date(lastExpenseDay ?? today); 
      const interval = { start: lastDayShown, end: today };
      setAllDays(eachDayOfInterval(interval).reverse());
    }
  }, [recentExpensesUnfiltered]);

  return (
    <div className="container margin-0-auto phs">
      {(!recentExpensesUnfiltered.length) 
        ? (
          <div className="text-center">No expenses entered yet</div>
        ) : (
          <div>
            {allDays?.map(day => {
              const thisDaysExpenses = recentExpensesUnfiltered.filter((expense: IExpense) => {
                const endOfExpenseDay = endOfDay(new Date(expense.datetime)).toString();
                const endOfThisDay = endOfDay(day).toString();
                return (endOfExpenseDay === endOfThisDay) 
              });

              const thisDaysTotal = thisDaysExpenses.reduce((accumulator, expense) => accumulator + expense.amount, 0);

              return (
                <>
                  {thisDaysExpenses.map((expense) => {
                    /* each item has to have it's own <Accordion> otherwise there are serious performance issues.
                        This means can't limit to only one open at a time without some hacky workaround */
                    return (
                      <HistoryAccordion expense={expense} key={expense.id} />
                    );
                  })}
                  <DailyTotal total={thisDaysTotal} thisDay={day} />
                </>
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
