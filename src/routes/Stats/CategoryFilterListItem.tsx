//import { useState } from 'react';
import styled from 'styled-components';
import { IconButton } from '@chakra-ui/react'
import { SmallCloseIcon } from '@chakra-ui/icons'
import { useGlobalState } from 'contexts';

import { ICategory, CategoryId } from 'interfaces';
import { UNCATEGORIZED } from 'lib/constants';

const ItemStyled = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  &:last-of-type {
    border-bottom: none;
  }
`;

interface IProps {
  category: ICategory;
}
export const CategoryFilterListItem = (props: IProps): JSX.Element => {
  const { category } = props;
  const { clearFilterOutCategory } = useGlobalState();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    clearFilterOutCategory(event?.currentTarget?.value as CategoryId);
  } 

  return (
    <ItemStyled className="pvs">
      {category.name}
      <IconButton 
        aria-label='Clear this filter' 
        icon={<SmallCloseIcon />} 
        onClick={handleClick}                  
        value={category.id || UNCATEGORIZED} 
        data-qa="category-filter-clear-btn"   
      />
    </ItemStyled>
  );
}
