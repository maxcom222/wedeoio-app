import React, { useEffect, useState } from 'react';
import Transition from 'components/shared/Transition';

import { useSelector, useDispatch } from 'react-redux';
import { removeToast } from 'redux/slices/toastSlice';

import { Toast } from 'interfaces/toast';

interface Props {
  toast: Toast;
}

const ToastComponent: React.FC<Props> = ({ toast }) => {
  const dispatch: any = useDispatch();
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    if (!shouldShow) {
      setShouldShow(true);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldShow(false);
      setTimeout(() => {
        dispatch(removeToast(toast.id));
      }, 1000);
    }, 3500);
    return () => {
      clearTimeout(timer);
    };
  }, [toast.id, removeToast]);

  const icon = () => {
    switch (toast.type) {
      case 'success':
        return (
          <svg
            className="w-6 h-6 text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case 'warning':
        return (
          <svg
            className="w-6 h-6 text-yellow-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case 'error':
        return (
          <svg
            className="w-6 h-6 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-6 h-6 text-indigo-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              d="M13 16H12V12H11M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
    }
  };

  return (
    <div
      className="flex items-end justify-center px-4 pt-6 pb-3 pointer-events-none sm:px-6 sm:items-start sm:justify-end"
      key={toast.id}
    >
      <Transition
        show={shouldShow}
        enter="transform ease-out duration-300 transition"
        enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enterTo="translate-y-0 opacity-100 sm:translate-x-0"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="w-full max-w-sm bg-white rounded-lg shadow-lg pointer-events-auto">
          <div className="overflow-hidden rounded-lg shadow-xs">
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">{icon()}</div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <p className="text-sm font-medium leading-5 text-gray-900">
                    {toast.title}
                  </p>
                  <p className="mt-1 text-sm leading-5 text-gray-500">
                    {toast.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  );
};

export default ToastComponent;
