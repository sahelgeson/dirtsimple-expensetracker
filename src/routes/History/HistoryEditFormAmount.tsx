import { NumberInput, NumberInputField } from '@chakra-ui/react';

interface IProps {
  amount: string;
  handleAmountChange: (valueString: string) => void;
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
          onChange={(valueString) => props.handleAmountChange(valueString)}
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
