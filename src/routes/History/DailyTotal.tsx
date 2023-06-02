import { format } from 'date-fns';
import { Alert, Badge, Flex, Grid, GridItem, Text } from '@chakra-ui/react'
import { endOfDay } from 'date-fns';
import { useGlobalState } from 'contexts';

// 88px is approximately half of the width of the typical text
const clampedCentering = `clamp(30%, calc(50% - 88px), calc(50% - 88px))`;

export const DailyTotal = ({ total, thisDay }: { total: number, thisDay: Date }): JSX.Element => {
  const today = useGlobalState().getGlobalNow();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  let thisDayName = `${format(thisDay, 'EEE')}, ${thisDay.getMonth() + 1}/${thisDay.getDate()}`;

  let verb = 'was';

  // can do toString since they are both set to endOfDay
  if (endOfDay(today).toString() === endOfDay(thisDay).toString()) {
    thisDayName = 'today';
    verb = 'is';
  }

  if (endOfDay(yesterday).toString() === endOfDay(thisDay).toString()) {
    thisDayName = 'yesterday';
  }

  return (        
    <Alert 
      status='success' 
      variant='subtle' 
      sx={{
        p: 2,
        m: 2, 
        width: 'auto',
        display: 'block',
      }}
    >
      <Grid 
        alignItems={'center'}
        templateColumns={`${clampedCentering} 1fr`}
      >
        <GridItem textAlign="right">
          <Badge colorScheme='green' fontSize={18} borderRadius={8} px={1}>
            <Flex alignItems={'center'}>
              <Text as="span" className="dollar">$</Text>
              <Text as="span" sx={{ fontWeight: 'bold' }}>{total}</Text>
            </Flex>
          </Badge>
        </GridItem>
        <GridItem>
          <Text as="span" fontSize={14} color={'gray.600'}>{verb} the total for {thisDayName}</Text>
        </GridItem>
      </Grid>
    </Alert>
  );
};

