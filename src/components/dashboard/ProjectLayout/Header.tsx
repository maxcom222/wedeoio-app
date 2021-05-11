import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { useSelector, useDispatch } from 'react-redux';
import { logout } from 'redux/slices/authSlice';

import { useOnClickOutside } from 'hooks/useClickOutside';
import PlanPill from '../PlanPill';
import Dropdown from 'components/elements/Dropdown';
import { FiSearch } from 'react-icons/fi';

import { withTranslation } from 'react-i18next';
import { functions } from 'config/firebase';

export const DashboardHeader: React.FC<any> = ({ children = null, t }) => {
  const dispatch: any = useDispatch();

  const { replace, pathname } = useRouter();
  const user = useSelector((state: any) => state.auth.user);
  const teamIds = user.teams.map((team) => team.id);

  const dropdownNode = useRef();
  const navbarNode = useRef();
  const hamburgerNode = useRef();
  const searchRef = useRef();

  const [navbarOpen, setNavbarOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [keywordTyping, setKeywordTyping] = useState(false);
  const [keywordTypingTimeout, setKeywordTypingTimeout] = useState<any>(0);

  useOnClickOutside(navbarNode, () => setNavbarOpen(false));

  if (!user) return null;

  const signOut = async () => {
    await dispatch(logout());
    replace('/login');
  };

  const handleOnKeywordChange = (value) => {
    setSearchText(value);
    setShowSearchResult(value !== '');
    setKeywordTyping(true);
    if (value) {
      if (keywordTypingTimeout) clearTimeout(keywordTypingTimeout);
      setKeywordTypingTimeout(
        setTimeout(() => {
          search(value);
        }, 300)
      );
    }
  };

  useOnClickOutside(searchRef, () => {
    setShowSearchResult(false);
  });

  const search = async (query) => {
    const Search = functions.httpsCallable('search');
    const res = await (await Search({ query, teamIds })).data.results;
    setSearchResult(res);
    setKeywordTyping(false);
  };

  return (
    <nav className="bg-white shadow">
      <div className="mx-auto sm:px-6 lg:px-8">
        <div className="">
          <div className="flex items-center justify-between h-16 px-4 sm:px-0">
            <div className="flex items-center">
              <div className="hidden md:block">
                <div className="relative w-80" ref={searchRef}>
                  <input
                    value={searchText}
                    onChange={(e) => handleOnKeywordChange(e.target.value)}
                    onFocus={() =>
                      searchText ? setShowSearchResult(true) : false
                    }
                    placeholder={t('Jump to project or file...')}
                    className={`
                      w-full bg-gray-100 bg-opacity-50 rounded border 
                      border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 
                      text-base outline-none text-gray-700 py-1 px-3 
                      leading-8 transition-colors duration-200 ease-in-out
                    `}
                    style={{ lineHeight: '1.8rem' }}
                  />
                  {showSearchResult && (
                    <div
                      className={`
                        absolute w-80 max-h-160 left-0 mt-1 bg-white text-gray-600 custom-scrollbar
                        shadow rounded border border-black border-opacity-10 z-10 overflow-y-auto
                      `}
                    >
                      <div className="flex items-center p-3">
                        <span>
                          <FiSearch />
                        </span>
                        <div className="ml-2">
                          {keywordTyping
                            ? 'Searching ...'
                            : `Search for "${searchText}"`}
                        </div>
                      </div>
                      {!keywordTyping && searchResult.length && (
                        <>
                          {searchResult[0].hits.length ||
                          searchResult[1].hits.length ? (
                            <div className="">
                              {searchResult[0].hits.length > 0 && (
                                <div className="mt-2">
                                  <div className="text-xs px-3 py-1">
                                    Projects
                                  </div>
                                  {searchResult[0].hits.map((hit, key) => (
                                    <a
                                      key={key}
                                      onClick={() => {
                                        replace(
                                          `/myproject/${hit.teamId}/${hit.objectID}`
                                        );
                                        setShowSearchResult(false);
                                      }}
                                    >
                                      <div className="px-3 py-2 hover:text-gray-900 hover:bg-gray-100 cursor-pointer">
                                        {hit.name}
                                      </div>
                                    </a>
                                  ))}
                                </div>
                              )}
                              {searchResult[1].hits.length > 0 && (
                                <div className="mt-2">
                                  <div className="text-xs px-3 py-1">
                                    Assets
                                  </div>
                                  {searchResult[1].hits.map((hit, key) => (
                                    <a
                                      key={key}
                                      onClick={() => {
                                        const href =
                                          hit.type === 'folder'
                                            ? `/myproject/${hit.teamId}/${hit.projectId}/${hit.objectID}`
                                            : `/myproject/${hit.teamId}/player/${hit.objectID}`;
                                        replace(href);
                                        setShowSearchResult(false);
                                      }}
                                    >
                                      <div className="px-3 py-2 hover:text-gray-900 hover:bg-gray-100 cursor-pointer">
                                        {hit.name}
                                      </div>
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center px-3 pt-1 pb-3">
                              {`No results found for "${searchText}"`}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex-row items-center hidden md:flex">
              <div>
                <PlanPill />
              </div>
              <div className="flex items-center ml-4 md:ml-6">
                <div className="relative ml-3" ref={dropdownNode}>
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
                  pathname?.includes('dashboard')
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
                  pathname?.includes('teams')
                    ? 'block px-3 py-2 rounded text-base font-medium text-gray-900 bg-gray-200 focus:outline-none focus:text-white focus:bg-gray-100'
                    : 'block px-3 py-2 rounded text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:text-white focus:bg-gray-100'
                }
              >
                {t('My Project')}
              </a>
            </Link>
            <Link href="/account">
              <a
                href="#"
                className={
                  pathname?.includes('account')
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
