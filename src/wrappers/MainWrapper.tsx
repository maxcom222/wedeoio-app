import { useSelector } from 'react-redux';
import Toast from 'components/shared/Toast';

export const MainWrapper = ({ children }) => {
  const toasts = useSelector((state: any) => state.toast.toasts);
  const uploads = useSelector((state: any) => state.file.uploads);

  return (
    <>
      <div className="fixed top-0 right-0 z-50 w-full max-w-sm">
        {toasts.map((toast, i) => (
          <Toast toast={toast} key={i} />
        ))}
      </div>

      <div className="fixed bottom-0 right-0 w-72 m-4">
        {uploads?.map((el, key) => (
          <div
            key={key}
            className="bg-white p-2 w-full border border-gray-300 shadow mt-2"
          >
            <div className="flex text-sm text-gray-600 mb-2">
              <div className="truncate">{el.name}</div>
              <div className="flex-shrink-0">&nbsp;&nbsp;- {el.progress}%</div>
            </div>
            <div className="h-1 bg-gray-300">
              <div
                className="bg-green-600 h-full animate-pulse"
                style={{ width: `${el.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      {children}
    </>
  );
};
