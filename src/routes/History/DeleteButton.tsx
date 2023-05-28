import { Button, Flex, Box, Spacer } from '@chakra-ui/react';
import ReactModal from 'react-modal';
import ReactModalStyles from "../../components/modals/ReactModalStyles.js";
// @ts-ignore
ReactModal.defaultStyles.overlay.backgroundColor = 'rgba(80, 80, 80, 0.69)';
ReactModal.setAppElement('#root');


interface IProps {
  isModalOpen: boolean;
  openModal: (e: React.MouseEvent<HTMLButtonElement>) => void;
  closeModal: () => void;
  deleteThisExpense: () => void;
}


export const DeleteButton = (props: IProps) => {
  const { openModal, closeModal, isModalOpen, deleteThisExpense } = props;

  return ( 
    <>
      <Button 
        colorScheme='red'
        size='lg'
        onClick={openModal}
      >
        Delete
      </Button>

      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        // @ts-ignore
        style={ReactModalStyles}
        contentLabel="Deletion Modal"
      >
        <div>Are you sure you want to delete this expense entirely? This can't be undone.</div>
        <Flex mt={4}>
          <Box>
            <Button 
              colorScheme='red'
              size='lg'
              onClick={deleteThisExpense}
            >
              Yes, Delete
            </Button>
          </Box>
          <Spacer />
          <Box>
            <Button 
              colorScheme='gray'
              size='lg'
              onClick={closeModal}
            >
              No, Cancel
            </Button>
          </Box>
        </Flex>
      </ReactModal>
    </>
  );
}
