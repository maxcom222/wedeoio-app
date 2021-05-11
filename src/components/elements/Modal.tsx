import ReactModal from 'react-modal';

const modalStyle = {
  overlay: {
    display: 'flex',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(2px)',
  },
  content: {
    position: 'relative',
    minWidth: 500,
    marginBottom: 100,
    borderRadius: 8,
    border: 'unset',
    padding: 'unset',
  },
};

ReactModal.setAppElement('#__next');

const Modal: React.FC<ModalProps> = ({
  open = false,
  children,
  requestClose = () => false,
}) => {
  return (
    <ReactModal isOpen={open} onRequestClose={requestClose} style={modalStyle}>
      {children}
    </ReactModal>
  );
};

type ModalProps = {
  open?: boolean;
  children: any;
  requestClose?: any;
};

export default Modal;
