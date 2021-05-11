import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { useSelector, useDispatch } from 'react-redux';
import { logout } from 'redux/slices/authSlice';

import { useOnClickOutside } from 'hooks/useClickOutside';
import PlanPill from '../PlanPill';
import Dropdown from 'components/elements/Dropdown';
import { IoIosArrowBack } from 'react-icons/io';

import { withTranslation } from 'react-i18next';

export const PlayerHeader: React.FC<any> = ({ children = null, t }) => {
  const router = useRouter();
  const dispatch: any = useDispatch();

  const teamId = router.query.teamId;
  const user = useSelector((state: any) => state.auth.user);
  const file = useSelector((state: any) => state.player.data);

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
    <nav className="absolute w-full z-10 bg-white shadow">
      <div className="flex justify-between">
        <div className="w-full mx-auto sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 px-4 sm:px-0">
            <div className="flex items-center">
              <Link
                href={`/myproject/${teamId}/${file?.projectId}/${file?.parentId}`}
              >
                <span className="p-1 rounded-sm hover:bg-gray-100 transition-all cursor-pointer">
                  <IoIosArrowBack size={20} />
                </span>
              </Link>
              <div className="text-base text-gray-700 ml-2">{file?.name}</div>
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
      {children}
    </nav>
  );
};

export default withTranslation()(PlayerHeader);
