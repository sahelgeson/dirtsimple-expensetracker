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

interface IFormatUsdOptions {
  noPrefix?: boolean;
}

// TODO improve this
export const formatUsd = (dollars: number, options?: IFormatUsdOptions): string => {
  const prefix = options?.noPrefix ? '' : '$'
  return dollars ? `${prefix}${dollars.toFixed(2)}` : '---';
}