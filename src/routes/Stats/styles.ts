import styled, { css } from 'styled-components';

export const ListItemGrid = css`
  display: grid;
  grid-template-columns: 40% 30% 30%;
`;

export const ButtonBox = styled.div`
  display: flex;
  justify-content: space-around;
`;

export const TimeFrameButton = styled.button`
  padding: 0.5rem;
  width: 100%;
  color: #777;
  border-bottom: 2px solid transparent;
  &.active {
    border-bottom: 2px solid #999;
  }
`;

