import {  IExpense } from 'interfaces';

export const calculateTotal = (expenses: IExpense[]): number => {
  const total = expenses.reduce((sum, total) => {
    return sum + Number(total.amount);
  }, 0);

  return total;
}
