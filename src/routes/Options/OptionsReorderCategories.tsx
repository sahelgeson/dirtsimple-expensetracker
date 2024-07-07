import React, { useEffect, useState } from 'react';
import { Reorder } from 'framer-motion';
import { useGlobalState } from 'contexts';
import {
  Box,
  Button,
  Flex,
  ListItem,
  UnorderedList,
} from '@chakra-ui/react';
import { DragHandleIcon } from '@chakra-ui/icons';

import { useMotionValue, useDragControls } from "framer-motion";
import { useRaisedShadow } from "./use-raised-shadow";

import { ICategory } from 'interfaces';

const Item = ({ item }: { item: ICategory }) => {
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={item.order}
      id={item.id}
      style={{ boxShadow, y }}
      dragListener={false}
      dragControls={dragControls}
    >
      <Box width="100%" bg="white">
        <Flex 
          p={4}
          my={2} 
          justifyContent={'space-between'}
          alignItems={'center'}
          sx={{ 
            border: '1px',
            borderColor: 'gray.200',
            borderRadius: 8,   
          }}
        >
          <span>{item.name}</span>
          <DragHandleIcon onPointerDown={(event) => dragControls.start(event)} style={{ touchAction: "none" }} />
        </Flex>
      </Box>
    </Reorder.Item>
  );
};

export const OptionsReorderCategories = () => {
  const { allCategories, reorderCategories } = useGlobalState();

  const [wasChanged, setWasChanged] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [items, setItems] = useState(allCategories);
  const [orderedItems, setOrderedItems] = useState(allCategories);
  const itemOrders = items.map(item => {
    return item.order;
  })

  useEffect(() => {
    setItems(allCategories);
  }, [allCategories])

  useEffect(() => {
    const sortedItemsByOrder = items.sort((a, b) => a.order - b.order);
    setOrderedItems(sortedItemsByOrder);
  }, [items])

  const handleReset = () => {
    setIsSaveDisabled(true);
    setWasChanged(false);
    setItems(allCategories);
  }

  const handleSave = () => {
    setIsSaved(true);
    setWasChanged(false);
    reorderCategories(orderedItems);
  }

  const handleReorder = (order: number[]) => {
    setIsSaveDisabled(false);
    setWasChanged(true);
    setIsSaved(false);
 
    const updatedCategories = items.map((item, index) => ({
      ...item,
      order: order[index],
    }));

    setItems(updatedCategories);
  }

  return (  
    <>
      <Flex    
        mb={8}      
        gap={4}
        justifyContent={'space-around'}
      >        
        <Button 
          width={'100%'}
          colorScheme='gray'
          size='lg' 
          onClick={handleReset}     
          isDisabled={!wasChanged}        
        >
          Clear changes
        </Button>

        <Button 
          width={'100%'}
          size="lg"
          onClick={handleSave} 
          variant={isSaved ? 'success' : 'solid'}
          isDisabled={isSaveDisabled}   
          data-qa='history-form-save-btn' 
          colorScheme={isSaved ? '' : 'blue'}
        >
          <>{isSaved ? 'Saved!' : 'Save'}</>
        </Button>
      </Flex>      

      <UnorderedList className="gray-777 mvs" ml={0}>
        {/* allCategories will always have at least the Uncategorized category, which is not shown */}  
        {allCategories.length === 1 ? (
          <ListItem>
            No categories set up
          </ListItem>
        ) : (
          <Reorder.Group 
            axis="y" 
            onReorder={handleReorder} 
            values={itemOrders}
          >
            {orderedItems.map((item) => <Item key={item.id} item={item} />)}
          </Reorder.Group>  
        )}  
      </UnorderedList>
    </>
  );
};

