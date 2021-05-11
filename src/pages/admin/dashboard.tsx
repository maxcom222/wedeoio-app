import Link from 'next/link';
import SidebarLayout from 'components/admin/SidebarLayout';
import Spinner from 'components/icons/Spinner';
import withAdmin from 'middlewares/withAdmin';
import { useSelector } from 'react-redux';

const AdminDashboardPage: React.FC<any> = ({ t }) => {
  const user = useSelector((state: any) => state.auth.user);
  const currentHour = new Date().getHours();
  let greeting;

  if (currentHour < 12) {
    greeting = `${t('Good morning')}, ${user?.name}`;
  } else if (currentHour < 18) {
    greeting = `${t('Good afternoon')}, ${user?.name}`;
  } else {
    greeting = `${t('Good evening')}, ${user?.name}`;
  }

  if (!user || !user.isAdmin)
    return <Spinner width="30" className="m-auto mt-20 animate-spin" />;

  return (
    <SidebarLayout>
      <div className="max-w-5xl mx-auto">
        <section className="p-6 mb-6 bg-white rounded-lg shadow-lg">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="sm:flex sm:space-x-5">
              <div className="flex-shrink-0">
                {user?.avatarUrl ? (
                  <img
                    className="object-cover w-16 h-16 mx-auto rounded-full"
                    src={user.avatarUrl}
                    alt={user.name}
                  />
                ) : (
                  <svg
                    className="inline-block w-16 h-16 text-gray-700 rounded-full"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </div>
              <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                <p className="text-xl font-bold text-gray-900 sm:text-2xl">
                  {greeting}
                </p>
                <p className="text-sm font-medium text-gray-600">Admin</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="rounded-lg grid-col-1 sm:grid sm:grid-cols-2 sm:gap-2">
            <Link href="/admin/users">
              <a>
                <div className="relative p-6 mb-4 bg-white rounded-lg shadow-lg sm:mr-2 group focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                  <div>
                    <span className="inline-flex p-3 text-indigo-700 rounded-lg bg-indigo-50 ring-4 ring-white">
                      <svg
                        className="w-6 h-6"
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
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium">
                      <span className="absolute inset-0" aria-hidden="true" />
                      Users
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Show a list of all your users in your database
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

            <Link href="/">
              <a>
                <div className="relative p-6 mb-4 bg-white rounded-lg shadow-lg group focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
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
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium">
                      <span className="absolute inset-0" aria-hidden="true" />
                      App Dashboard
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Go to the dashboard of your application
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

            <Link href="/admin/cms">
              <a>
                <div className="relative p-6 mb-4 bg-white rounded-lg shadow-lg sm:mr-2 group focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                  <div>
                    <span className="inline-flex p-3 text-blue-700 rounded-lg bg-blue-50 ring-4 ring-white">
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
                          d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
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
                      Go to the CMS to manage the content of your landing page
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

            <a
              href="https://dashboard.stripe.com/"
              target="_blank"
              rel="noreferrer"
            >
              <div className="relative p-6 mb-4 bg-white rounded-lg shadow-lg sm:ml-2 group focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                <div>
                  <span className="inline-flex p-3 text-green-700 rounded-lg bg-green-50 ring-4 ring-white">
                    <svg
                      className="w-6 h-6 "
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium">
                    <span className="absolute inset-0" aria-hidden="true" />
                    Stripe Dashboard
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Go to your Stripe Dashboard and see your reports
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

            <a
              href="https://console.firebase.google.com/"
              target="_blank"
              rel="noreferrer"
            >
              <div className="relative p-6 mb-4 bg-white rounded-lg shadow-lg sm:ml-2 group focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                <div>
                  <span className="inline-flex p-3 text-yellow-700 rounded-lg bg-yellow-50 ring-4 ring-white">
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
                        d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
                      />
                    </svg>
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium">
                    <span className="absolute inset-0" aria-hidden="true" />
                    Firebase console
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Go to Firebase and manage your DB and Cloud Functions
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

            <a
              href="https://account.postmarkapp.com/"
              target="_blank"
              rel="noreferrer"
            >
              <div className="relative p-6 mb-4 bg-white rounded-lg shadow-lg sm:ml-2 group focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                <div>
                  <span className="inline-flex p-3 text-red-700 rounded-lg bg-red-50 ring-4 ring-white">
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
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium">
                    <span className="absolute inset-0" aria-hidden="true" />
                    Postmark dashboard
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Go to Postmark and manage your transactional emails
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
          </div>
        </section>
      </div>
    </SidebarLayout>
  );
};

export default withAdmin(AdminDashboardPage);
