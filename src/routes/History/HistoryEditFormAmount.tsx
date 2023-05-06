import { NumberInput, NumberInputField } from '@chakra-ui/react';

interface IProps {
  amount: number;
  handleAmountChange: (valueAsNumber: number) => void;
}

export const HistoryEditFormAmount = (props: IProps): JSX.Element => {
  return ( 
      <div className="mbm">
        <label 
          htmlFor="amount"   
          className="edit-label pvm"        
        >
          Amount  
        </label>

        <NumberInput 
          defaultValue={props.amount}
          onChange={(_, valueAsNumber) => props.handleAmountChange(valueAsNumber)}
          data-qa="history-form-amount-input" 
          size="lg"
          display="inline-block"
          verticalAlign="middle"
          width="75%"
        >
          <NumberInputField width="100%" />
        </NumberInput>
      </div>
  );
}
