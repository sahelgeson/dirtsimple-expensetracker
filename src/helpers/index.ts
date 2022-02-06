/* TODO import other helpers to make this a proper index file */

/* 0 and '' are considered invalid */
export const isAmountValid = (amount: string): boolean => {
  return !!parseInt(amount, 10);
}
