// TODO figure out a way to tie in actual date format DATETIME_FORMAT
export type Datetime = string;

// TODO: Symbol instead?
export type Uuid = string;

export interface ICategory {
  id: Uuid | null; // TODO make a special uuid instead of null
  name: string;
}

export interface IExpense {
  id: Uuid;
  amount: number;
  datetime: Datetime;
  categoryId: number | string | null; // TODO change null to Symbol?
}