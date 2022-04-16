import { ChangeEvent } from 'react';

interface IProps {
  amount: string;
  handleAmountChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const HistoryEditFormAmount = (props: IProps): JSX.Element => {
  return ( 
      <div className="mvm">
        <label 
          htmlFor="amount"   
          className="edit-label pvm"        
        >
          Amount  
        </label>
        <input 
          id="amount"
          className="edit-input gray-border font-16 plm pvs prxs"
          type="number" 
          placeholder={props.amount} 
          min="0.01" 
          step="0.01"
          pattern="\d*"
          onChange={props.handleAmountChange}
          value={props.amount}
          data-qa="history-form-amount-input"   
        />
      </div>
  );
}
