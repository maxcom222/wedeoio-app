import { ReactNode, useRef, useState } from 'react';

import Link from 'next/link';
import { NextPage } from 'next';
import Transition from 'components/shared/Transition';
import { useSelector } from 'react-redux';
import { useOnClickOutside } from 'hooks/useClickOutside';
import { useRouter } from 'next/router';

interface Props {
  children: ReactNode;
}

const SidebarLayout: NextPage<Props> = ({ children }) => {
  const { pathname } = useRouter();
  const user = useSelector((state: any) => state.auth.user);
  const ref = useRef();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  useOnClickOutside(ref, () => setSidebarOpen(false));

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar for mobile. */}
      <div className="md:hidden">
        <div className={`fixed flex inset-0 ${sidebarOpen && 'z-40 '}`}>
          <Transition
            show={sidebarOpen}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0">
              <div className="absolute inset-0 bg-gray-600 opacity-75" />
            </div>
          </Transition>
          <Transition
            show={sidebarOpen}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative flex flex-col flex-1 w-full max-w-xs bg-white">
              <div className="absolute top-0 right-0 pt-2 -mr-12">
                <button
                  className="flex items-center justify-center w-10 h-10 ml-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <svg
                    className="w-6 h-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto" ref={ref}>
                <div className="flex items-center flex-shrink-0 px-4">
                  <span className="ml-2 text-xl font-bold text-gray-700 title-font">
                    Admin
                  </span>
                </div>
                <nav className="px-2 mt-5 space-y-1">
                  <Link href="/admin/dashboard">
                    <a
                      className={`flex items-center px-2 py-2 text-base font-medium  rounded-md group ${
                        pathname === '/admin/dashboard' &&
                        'bg-gray-100 text-gray-900'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <svg
                        className={`w-6 h-6 mr-4 text-gray-400 group-hover:text-gray-500 ${
                          pathname === '/admin/dashboard' && 'text-gray-500'
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                      Dashboard
                    </a>
                  </Link>
                  <Link href="/admin/users">
                    <a
                      className={`flex items-center px-2 py-2 text-base font-medium rounded-md group ${
                        pathname === '/admin/users' &&
                        'bg-gray-100 text-gray-900'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <svg
                        className={`w-6 h-6 mr-4 text-gray-400 group-hover:text-gray-500 ${
                          pathname === '/admin/users' && 'text-gray-500'
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                      Users
                    </a>
                  </Link>
                </nav>
              </div>
              <div className="flex flex-shrink-0 p-4 border-t border-gray-200">
                <a className="flex-shrink-0 block group">
                  <div className="flex items-center">
                    <div>
                      {user?.avatarUrl ? (
                        <img
                          className="inline-block object-cover w-10 h-10 rounded-full"
                          src={user.avatarUrl}
                          alt={user.name}
                        />
                      ) : (
                        <svg
                          className="inline-block w-10 h-10 text-gray-700 rounded-full"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-base font-medium text-gray-700 group-hover:text-gray-900">
                        {user?.name}
                      </p>
                      <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
                        Admin
                      </p>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-1 h-0 bg-white border-r border-gray-200">
            <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <span className="ml-2 text-xl font-bold text-gray-700 title-font">
                  Admin
                </span>
              </div>
              <nav className="flex-1 px-2 mt-5 space-y-1 bg-white">
                <Link href="/admin/dashboard">
                  <a
                    className={`flex items-center px-2 py-2 text-sm font-medium rounded-md group hover:text-gray-900 hover:bg-gray-100 ${
                      pathname === '/admin/dashboard' &&
                      'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <svg
                      className={`w-6 h-6 mr-3 text-gray-400 group-hover:text-gray-500 ${
                        pathname === '/admin/dashboard' && 'text-gray-500'
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    Dashboard
                  </a>
                </Link>

                <Link href="/admin/users">
                  <a
                    className={`flex items-center px-2 py-2 text-sm font-medium rounded-md group hover:text-gray-900 hover:bg-gray-100 ${
                      pathname === '/admin/users' && 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <svg
                      className={`w-6 h-6 mr-3 text-gray-400 group-hover:text-gray-500 ${
                        pathname === '/admin/users' && 'text-gray-500'
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    Users
                  </a>
                </Link>
              </nav>
            </div>
            <Link href="/account">
              <div className="flex flex-shrink-0 p-4 border-t border-gray-200 cursor-pointer hover:border-gray-300">
                <div className="flex-shrink-0 block w-full group">
                  <div className="flex items-center">
                    <div>
                      {user?.avatarUrl ? (
                        <img
                          className="inline-block object-cover rounded-full h-9 w-9"
                          src={user.avatarUrl}
                          alt={user.name}
                        />
                      ) : (
                        <svg
                          className="inline-block text-gray-700 rounded-full h-9 w-9"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                        {user.name}
                      </p>
                      <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                        Admin
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <div className="sticky flex flex-col flex-1 w-0 overflow-hidden">
        <div className="absolute z-20 pt-1 pl-1 md:hidden sm:pl-3 sm:pt-3 top-1 left-1">
          <button
            className={`-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-700 hover:text-indigo-900 focus:outline-none focus:bg-indigo-200 transition ease-in-out duration-150`}
            aria-label="Open sidebar"
            onClick={() => setSidebarOpen(true)}
          >
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
        <main className="relative z-0 flex-1 px-4 py-12 overflow-y-auto sm:px-6 md:px-8 sm:py-14">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;
