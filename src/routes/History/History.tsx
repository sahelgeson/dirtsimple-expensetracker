import { useState, useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';
import { endOfDay, eachDayOfInterval, isBefore } from 'date-fns';
import { HistoryAccordion } from './HistoryAccordion';
import { DailyTotal } from './DailyTotal';
import { useGlobalState } from 'contexts';
import { NUM_OF_RECENT_EXPENSES } from 'lib/constants';
import { IExpense } from 'interfaces';
import { Fragment } from 'react';

export const History = () => {
  const { recentExpensesUnfiltered, sortExpenses } = useGlobalState();

  const [allDays, setAllDays] = useState<Date[]>();
  const [displayExpenses, setDisplayExpenses] = useState<IExpense[]>([]);

  const today = endOfDay(useGlobalState().getGlobalNow());

  /* Sort expenses by date by default only for initial load. Setting this up only onmount so we're
    not sorting in edit form because we don't want state to update and rerender which could
    yoink stuff around -- in other words we save any edits made by HistoryEditForm,
    but we don't re-sort the expenses except on load/reload */
  useEffect(() => {
    sortExpenses();
  }, []);

  const calledOnce = useRef(false);

  useEffect(() => {
    /* See above, users edit expenses in-place and we don't want to rerender until they reload 
       displayExpenses is used as local state to delay that sort of rerender
    */
    if (calledOnce.current) {
      return;
    }

    setDisplayExpenses(recentExpensesUnfiltered);
    if (recentExpensesUnfiltered.length) {
      calledOnce.current = true;
    }
  }, [recentExpensesUnfiltered]);

  useEffect(() => {
    if (displayExpenses.length) {
      // can't rely on it being sorted since user edits are in-place
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
    <div className="container margin-0-auto phs">
      {(!displayExpenses.length) 
        ? (
          <div className="text-center">No expenses entered yet</div>
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
                <Fragment key={day.toString()}>
                  {thisDaysExpenses.map((expense) => {
                    /* each item has to have it's own <Accordion> otherwise there are serious performance issues.
                        This means can't limit to only one open at a time without some hacky workaround */
                    return (
                      <HistoryAccordion expense={expense} key={expense.id} />
                    );
                  })}
                  <DailyTotal total={thisDaysTotal} thisDay={day} />
                </Fragment>
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
