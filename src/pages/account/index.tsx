import Link from 'next/link';

import { useSelector } from 'react-redux';
import withAuth from 'middlewares/withAuth';
import Layout from 'components/dashboard/Layout';
import Button from 'components/elements/Button';
import AccountMenu from 'components/dashboard/AccountMenu';

import { getPlan } from 'utils/getPlan';
import { useState, useEffect } from 'react';
import PlanPill from 'components/dashboard/PlanPill';

import { withTranslation } from 'react-i18next';
import { auth } from 'config/firebase';

const Account: React.FC = () => {
  const [plan, setPlan] = useState(null);
  const user = useSelector((state: any) => state.auth.user);

  useEffect(() => {
    if (!plan) {
      getPlan(user).then((plan) => setPlan(plan));
    }
  }, []);

  if (!user) return null;

  return (
    <Layout>
      <div className="max-w-7xl px-4 py-10 pb-12 mx-auto sm:px-6 lg:px-8">
        <header className="pb-4 pl-3 mb-6 border-b-2 border-gray-300 sm:py-6">
          <div className="mt-2 md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-800 sm:text-3xl sm:leading-9 sm:truncate">
                General
              </h2>
            </div>
          </div>
        </header>
        <div className="flex">
          <div className="w-full sm:w-1/3 sm:pr-16">
            <AccountMenu />
          </div>
          <main className="hidden w-2/3 mx-auto overflow-hidden bg-white rounded-lg shadow-lg sm:block">
            <div className="px-4 py-5 pt-5 mt-5 sm:p-6">
              <dl>
                <div className=" sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium leading-5 text-gray-600">
                    Name
                  </dt>
                  <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                    {user.name}
                  </dd>
                </div>
                <div className="mt-8 sm:grid sm:mt-5 sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                  <dt className="text-sm font-medium leading-5 text-gray-600">
                    Email address
                  </dt>
                  <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                    {user.email}
                  </dd>
                </div>
                <div className="mt-8 sm:grid sm:mt-5 sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                  <dt className="text-sm font-medium leading-5 text-gray-600">
                    Email verified
                  </dt>
                  <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                    {auth.currentUser.emailVerified ? 'Yes' : 'No'}
                  </dd>
                </div>
                <div className="mt-8 sm:grid sm:mt-5 sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                  <dt className="text-sm font-medium leading-5 text-gray-600">
                    Plan
                  </dt>
                  <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                    <PlanPill />
                  </dd>
                </div>
                <div className="mt-8 sm:grid sm:mt-5 sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                  <dt className="text-sm font-medium leading-5 text-gray-600">
                    Photo
                  </dt>
                  <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                    <span className="w-12 h-12 overflow-hidden bg-gray-100 rounded-full">
                      {user.avatarUrl ? (
                        <span className="relative inline-block">
                          <img
                            className="object-cover w-12 h-12 rounded-full"
                            src={user.avatarUrl}
                            alt={user.name}
                          />
                        </span>
                      ) : (
                        <svg
                          className="w-12 h-12 text-gray-300"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      )}
                    </span>
                  </dd>
                </div>
              </dl>
              <div className="pt-5 mt-8 border-t border-gray-200">
                <div className="flex justify-end">
                  <span className="rounded-md shadow-sm">
                    <Link href="/account/edit">
                      <a href="">
                        <Button title="Edit" />
                      </a>
                    </Link>
                  </span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default withAuth(withTranslation()(Account));
