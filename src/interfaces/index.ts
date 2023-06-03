/* TODO figure out a way to tie in actual date format DATETIME_FORMAT
   format:
   Wed Jan 19 2022 19:43:32 GMT-0500 (Eastern Standard Time)
   legacy format (on some edited datetimes only)
   2022-03-04T16:04
*/
export type Datetime = string;

export type Uuid = string;

export type CategoryId = Uuid;

export interface ICategory {
  id: CategoryId;
  name: string;
}

// normally you would want to deal with Cents but I'm only ever going to let
// whole dollars be input
export type Dollar = number;

export interface IExpense {
  id: Uuid;
  amount: Dollar;   // TODO look into making NonZeroNumber type
  datetime: Datetime;
  categoryId: CategoryId;
}

// have to set value of NumberInput to '' to get placeholder
export type EmptyString = '';
