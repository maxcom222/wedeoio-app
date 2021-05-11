import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { useSelector, useDispatch } from 'react-redux';
import { logout } from 'redux/slices/authSlice';

import { useOnClickOutside } from 'hooks/useClickOutside';
import PlanPill from './PlanPill';
import Dropdown from 'components/elements/Dropdown';

import { withTranslation } from 'react-i18next';

export const DashboardHeader: React.FC<{ children?: any; t?: any }> = ({
  children = null,
  t,
}) => {
  const dispatch: any = useDispatch();

  const router = useRouter();
  const user = useSelector((state: any) => state.auth.user);
  const navbarNode = useRef();
  const hamburgerNode = useRef();
  const [navbarOpen, setNavbarOpen] = useState(false);

  useOnClickOutside(navbarNode, () => setNavbarOpen(false));

  if (!user) return null;

  const signOut = async () => {
    await dispatch(logout());
    router.replace('/login');
  };

  return (
    <nav className="bg-white shadow">
      <div className="flex justify-between">
        <div className="flex items-center flex-shrink-0 w-60 pl-5 lg:border-r border-gray-200 bg-white">
          <Link href="/">
            <a href="" className="flex">
              <img
                className="w-auto h-8 sm:h-10"
                src="/img/logo.svg"
                alt="Wedeo"
              />
            </a>
          </Link>
        </div>
        <div className="w-full mx-auto sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 px-4 sm:px-0">
            <div className="flex items-center">
              <div className="hidden md:block">
                <div className="flex items-baseline">
                  <Link href="/">
                    <a
                      className={
                        router.pathname === '/'
                          ? 'mr-4 px-3 py-2 rounded text-sm font-medium text-gray-900 bg-gray-200 focus:outline-none focus:text-gray-600 focus:bg-gray-100'
                          : 'mr-4 px-3 py-2 rounded text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:bg-gray-100'
                      }
                    >
                      {t('Dashboard')}
                    </a>
                  </Link>
                  <Link href="/myproject">
                    <a
                      className={
                        router.pathname === '/teams'
                          ? 'mr-4 px-3 py-2 rounded text-sm font-medium text-gray-900 bg-gray-200 focus:outline-none focus:text-gray-600 focus:bg-gray-100'
                          : 'mr-4 px-3 py-2 rounded text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:bg-gray-100'
                      }
                    >
                      {t('My Project')}
                    </a>
                  </Link>
                  <Link href="/account">
                    <a
                      className={
                        router.pathname?.includes('/account')
                          ? 'px-3 py-2 rounded text-sm font-medium text-gray-900 bg-gray-200 focus:outline-none focus:text-gray-600 focus:bg-gray-100'
                          : 'px-3 py-2 rounded text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:bg-gray-100'
                      }
                    >
                      {t('Account')}
                    </a>
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex-row items-center hidden md:flex">
              <div>
                <PlanPill />
              </div>
              <div className="flex items-center ml-4 md:ml-6">
                <div className="relative ml-3">
                  <Dropdown
                    position="right"
                    border
                    button={
                      <button className="flex items-center max-w-xs text-sm text-white rounded-full focus:outline-none focus:shadow-solid">
                        <span className="inline-block w-8 h-8 overflow-hidden bg-gray-200 rounded-full">
                          {user?.avatarUrl ? (
                            <img
                              className="object-cover w-full h-full rounded"
                              src={user.avatarUrl}
                              alt={user.name}
                            />
                          ) : (
                            <svg
                              className="w-full h-full text-gray-700"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                          )}
                        </span>
                      </button>
                    }
                  >
                    <Link href="/account">
                      <a
                        href=""
                        className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      >
                        {t('Account')}
                      </a>
                    </Link>
                    <Link href="/account/teams">
                      <a
                        href=""
                        className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      >
                        {t('My Project')}
                      </a>
                    </Link>
                    <Link href="/account/billing">
                      <a
                        href=""
                        className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      >
                        {t('Billing')}
                      </a>
                    </Link>
                    {user?.isAdmin && (
                      <Link href="/admin">
                        <a
                          href=""
                          className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        >
                          {t('Admin')}
                        </a>
                      </Link>
                    )}
                    <a
                      className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
                      onClick={() => signOut()}
                    >
                      {t('Sign out')}
                    </a>
                  </Dropdown>
                </div>
              </div>
            </div>
            <div className="flex -mr-2 md:hidden" ref={hamburgerNode}>
              <button
                onClick={() => setNavbarOpen(!navbarOpen)}
                className="inline-flex items-center justify-center p-2 text-gray-600 rounded hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 focus:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  {navbarOpen ? (
                    <path
                      className="inline-flex"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      className="inline-flex"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      {navbarOpen && (
        <div
          className="block border-b border-gray-200 md:hidden"
          ref={navbarNode}
        >
          <div className="px-2 py-3 sm:px-3">
            <Link href="/">
              <a
                href="#"
                className={
                  router.pathname?.includes('dashboard')
                    ? 'block px-3 py-2 rounded text-base font-medium text-gray-900 bg-gray-200 focus:outline-none focus:text-white focus:bg-gray-100'
                    : 'block px-3 py-2 rounded text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:text-white focus:bg-gray-100'
                }
              >
                {t('Dashboard')}
              </a>
            </Link>
            <Link href="/myproject">
              <a
                href="#"
                className={
                  router.pathname?.includes('teams')
                    ? 'block px-3 py-2 rounded text-base font-medium text-gray-900 bg-gray-200 focus:outline-none focus:text-white focus:bg-gray-100'
                    : 'block px-3 py-2 rounded text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:text-white focus:bg-gray-100'
                }
              >
                My Project
              </a>
            </Link>
            <Link href="/account">
              <a
                href="#"
                className={
                  router.pathname?.includes('account')
                    ? 'mt-1 block px-3 py-2 rounded text-base font-medium text-gray-900 bg-gray-200 focus:outline-none focus:text-white focus:bg-gray-100'
                    : 'mt-1 block px-3 py-2 rounded text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:text-white focus:bg-gray-100'
                }
              >
                {t('Account')}
              </a>
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                {user?.avatarUrl ? (
                  <img
                    className="object-cover w-12 h-12 rounded-full"
                    src={user.avatarUrl}
                    alt={user.name}
                  />
                ) : (
                  <svg
                    className="w-12 h-12 text-gray-300 rounded-full"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <div className="text-base font-medium leading-none text-white">
                  {user.name}
                </div>
                <div className="mt-1 text-sm font-medium leading-none text-gray-600">
                  {user.email}
                </div>
              </div>
            </div>
            <div className="px-2 mt-3">
              <a
                className="block px-3 py-2 mt-1 text-base font-medium text-gray-600 rounded hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:text-white focus:bg-gray-100 cursor-pointer"
                onClick={() => signOut()}
              >
                {t('Sign out')}
              </a>
            </div>
          </div>
        </div>
      )}
      {children}
    </nav>
  );
};

export default withTranslation()(DashboardHeader);
