import { ReactNode } from 'react';

import {
  AccordionButton,
  AccordionButtonProps,
  AccordionIcon,
  Box,
} from '@chakra-ui/react';

interface IProps extends AccordionButtonProps {
  children?: ReactNode;
}

export const OptionsAccordionButton = (props: IProps): JSX.Element => {
  const { 
    children, 
    ...otherProps
  } = props;

  return (
    <AccordionButton {...otherProps}>
      <Box as="span" flex="1" textAlign="left" py={2} px={2}>
        {children}
      </Box>
      <AccordionIcon />
    </AccordionButton>
  );

}
