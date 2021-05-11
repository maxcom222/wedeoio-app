import Link from 'next/link';
import { NextPage } from 'next';

const AdminPage: NextPage = () => {
  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      <div className="flex content-center m-2 rounded-lg sm:divide-y-0 sm:grid sm:grid-cols-2 sm:gap-px grid-col-1">
        <Link href="/admin/cms">
          <a>
            <div className="relative p-6 mr-2 bg-white rounded-lg shadow-lg group focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
              <div>
                <span className="inline-flex p-3 text-indigo-700 rounded-lg bg-indigo-50 ring-4 ring-white">
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
                      strokeWidth={2}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  CMS
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Go to the CMS and manage the content of the landing page.
                </p>
              </div>
              <span
                className="absolute text-gray-300 pointer-events-none top-6 right-6 group-hover:text-gray-400"
                aria-hidden="true"
              >
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                </svg>
              </span>
            </div>
          </a>
        </Link>

        <Link href="/admin/dashboard">
          <a>
            <div className="relative p-6 ml-2 bg-white rounded-lg shadow-lg group focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
              <div>
                <span className="inline-flex p-3 text-purple-700 rounded-lg bg-purple-50 ring-4 ring-white">
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
                      strokeWidth={2}
                      d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                    />
                  </svg>
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Dashboard
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Go to the admin dashboard and manage users, data, etc.
                </p>
              </div>
              <span
                className="absolute text-gray-300 pointer-events-none top-6 right-6 group-hover:text-gray-400"
                aria-hidden="true"
              >
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                </svg>
              </span>
            </div>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default AdminPage;
