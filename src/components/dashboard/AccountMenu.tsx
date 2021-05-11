import Link from 'next/link';
import { useRouter } from 'next/router';

const AccountMenu: React.FC = () => {
  const { pathname } = useRouter();

  return (
    <nav>
      <Link href="/account">
        <a
          href="#"
          className={
            pathname === '/account'
              ? 'group flex items-center px-3 py-2 text-sm leading-5 font-medium text-gray-900 rounded-md bg-gray-200 focus:outline-none  focus:bg-gray-200 transition ease-in-out duration-150'
              : 'group flex items-center px-3 py-2 text-sm leading-5 font-medium text-gray-600 rounded-md hover:bg-gray-200 focus:outline-none  focus:bg-gray-200 transition ease-in-out duration-150'
          }
          aria-current="page"
        >
          <svg
            className={`flex-shrink-0 -ml-1 mr-3 h-6 w-6 transition ease-in-out duration-150 ${
              pathname === '/account'
                ? 'text-gray-900 group-'
                : 'text-gray-500 group-focus:text-gray-500'
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span className="truncate">General</span>
        </a>
      </Link>
      <Link href="/account/teams">
        <a
          href=""
          className={
            pathname === '/account/teams'
              ? 'mt-1 group flex items-center px-3 py-2 text-sm leading-5 font-medium text-gray-900 rounded-md bg-gray-200 focus:outline-none  focus:bg-gray-200 transition ease-in-out duration-150'
              : 'mt-1 group flex items-center px-3 py-2 text-sm leading-5 font-medium text-gray-600 rounded-md hover:bg-gray-200 focus:outline-none  focus:bg-gray-200 transition ease-in-out duration-150'
          }
        >
          <svg
            className={`flex-shrink-0 -ml-1 mr-3 h-6 w-6 transition ease-in-out duration-150 ${
              pathname === '/account/teams'
                ? 'text-gray-900 group-'
                : 'text-gray-500 group-focus:text-gray-500'
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <span className="truncate">Teams</span>
        </a>
      </Link>
      <Link href="/account/billing">
        <a
          href=""
          className={
            pathname === '/account/billing'
              ? 'mt-1 group flex items-center px-3 py-2 text-sm leading-5 font-medium text-gray-900 rounded-md bg-gray-200 focus:outline-none  focus:bg-gray-200 transition ease-in-out duration-150'
              : 'mt-1 group flex items-center px-3 py-2 text-sm leading-5 font-medium text-gray-600 rounded-md hover:bg-gray-200 focus:outline-none  focus:bg-gray-200 transition ease-in-out duration-150'
          }
        >
          <svg
            className={`flex-shrink-0 -ml-1 mr-3 h-6 w-6 transition ease-in-out duration-150 ${
              pathname === '/account/billing'
                ? 'text-gray-900 group-'
                : 'text-gray-500 group-focus:text-gray-500'
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="truncate">Billing</span>
        </a>
      </Link>
    </nav>
  );
};

export default AccountMenu;
