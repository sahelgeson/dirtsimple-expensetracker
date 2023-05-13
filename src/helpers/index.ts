/* TODO import other helpers to make this a proper index file */

export const parseStoredAmount = (amount: number | string): number => {
  const parsedAmount = (typeof amount === 'number') ? amount : parseInt(amount);

  if (Number.isNaN(parsedAmount) || parsedAmount === 0) {
    throw new Error('Not a valid number');
  }
  return parsedAmount;
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