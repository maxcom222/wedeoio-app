import Button from 'components/elements/Button';
import Modal from 'components/elements/Modal';

interface Props {
  open: boolean;
  closeModal: () => void;
  title: string;
  text: string;
  confirmText?: string;
  confirmAction: () => void;
  cancelText?: string;
  processing?: boolean;
  confirmColor?: 'primary' | 'default' | 'red' | 'green' | 'yellow';
}

const ConfirmModal: React.FC<Props> = ({
  open,
  closeModal,
  title,
  text,
  confirmText,
  confirmAction,
  cancelText,
  processing,
  confirmColor = 'primary',
}) => {
  return (
    <Modal open={open} requestClose={() => !processing && closeModal()}>
      <div className="bg-white rounded-lg px-4 pt-5 pb-4 overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full sm:p-6">
        <div className="flex items-center">
          <div className="flex">
            <div className="mr-3 flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:h-10 sm:w-10">
              <svg
                className="h-6 w-6 text-red-600"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <span className="animate-ping-slow absolute inline-flex w-12 h-12 sm:h-10 sm:w-10 rounded-full bg-red-400 opacity-75" />
          </div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {title}
          </h3>
        </div>
        <div className="">
          <div className="mt-2">
            <p className="text-sm leading-5 text-gray-500">{text}</p>
          </div>
        </div>
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
            <Button
              type="button"
              color={confirmColor}
              onClick={confirmAction}
              isLoading={processing}
              title={confirmText || 'Confirm'}
            />
          </span>
          <span className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
            <Button
              type="button"
              color="unset"
              onClick={() => !processing && closeModal()}
              title={cancelText || 'Cancel'}
            />
          </span>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
