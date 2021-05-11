import { useSelector } from 'react-redux';
import Layout from 'components/dashboard/Layout';
import withAuth from 'middlewares/withAuth';

import { withTranslation } from 'react-i18next';

const DashboardPage: React.FC<any> = ({ t }) => {
  const user = useSelector((state: any) => state.auth.user);
  const activeProjects = user.teams.reduce(
    (acc, ele) => acc + ele.projects.length,
    0
  );

  const currentHour = new Date().getHours();
  let greeting;

  if (currentHour < 12) {
    greeting = `${t('Good morning')}, ${user?.name}`;
  } else if (currentHour < 18) {
    greeting = `${t('Good afternoon')}, ${user?.name}`;
  } else {
    greeting = `${t('Good evening')}, ${user?.name}`;
  }

  return (
    <Layout>
      <div className="px-4 py-10 pb-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <header className="pb-4 pl-3 mb-6 border-b-2 border-gray-300 sm:py-6">
          <div className="mt-2 md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-800 sm:text-3xl sm:leading-9 sm:truncate">
                {greeting}
              </h2>
            </div>
          </div>
        </header>

        <div className="mx-auto">
          <div className="grid grid-cols-1 gap-5 mt-2 sm:grid-cols-2 lg:grid-cols-3">
            <div className="overflow-hidden bg-white rounded-lg shadow-md">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-blue-400"
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
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 w-0 ml-5">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {t('Active Projects')}
                      </dt>
                      <dd>
                        <div className="text-lg font-bold text-gray-900">
                          {activeProjects}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-hidden bg-white rounded-lg shadow-md">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-yellow-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 w-0 ml-5">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {t('In Review')}
                      </dt>
                      <dd>
                        <div className="text-lg font-bold text-gray-900">0</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-hidden bg-white rounded-lg shadow-md">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-green-400"
                      xmlns="http://www.w3.org/2000/svg"
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
                  </div>
                  <div className="flex-1 w-0 ml-5">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {t('Done')}
                      </dt>
                      <dd>
                        <div className="text-lg font-bold text-gray-900">0</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex content-center justify-center h-48 mt-8 overflow-hidden bg-white rounded-lg shadow-md">
          <div className="mt-20 text-lg font-semibold text-gray-900">
            {t('Your dashboard page')}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default withAuth(withTranslation()(DashboardPage));
