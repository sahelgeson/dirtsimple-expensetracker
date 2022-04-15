/* TODO import other helpers to make this a proper index file */

/* 0 and '' are considered invalid */
export const isAmountValid = (amount: string): boolean => {
  return !!parseInt(amount, 10);
}

export const formatDatetime = (datetime?: string): string => {
  // TODO add better validation/error handling
  if (!datetime) {  // 'now'
    return new Date().toString();
  }
  return new Date(datetime).toString();
}