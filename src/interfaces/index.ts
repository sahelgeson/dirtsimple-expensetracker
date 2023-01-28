/* TODO figure out a way to tie in actual date format DATETIME_FORMAT
   format:
   Wed Jan 19 2022 19:43:32 GMT-0500 (Eastern Standard Time)
   legacy format (on some edited datetimes only)
   2022-03-04T16:04
*/
export type Datetime = string;

// TODO: Symbol instead?
export type Uuid = string;

export interface ICategory {
  id: Uuid | null; // TODO make a special uuid instead of null
  name: string;
}

type Dollars = string;

export type CategoryId = number | string | null; // TODO change null to Symbol?

export interface IExpense {
  id: Uuid;
  amount: Dollars;   // TODO migrate to Cents string
  datetime: Datetime;
  categoryId: CategoryId;
}