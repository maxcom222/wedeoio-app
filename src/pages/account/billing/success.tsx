import Link from 'next/link';
import withAuth from 'middlewares/withAuth';
import Layout from 'components/dashboard/Layout';
import Button from 'components/elements/Button';
import AccountMenu from 'components/dashboard/AccountMenu';

const Success: React.FC = () => {
  return (
    <Layout>
      <div className="px-4 py-10 pb-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <header className="pb-4 sm:py-6">
          <div className="mt-2 md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-800 sm:text-3xl sm:leading-9 sm:truncate">
                Account
              </h2>
            </div>
          </div>
        </header>
        <div className="flex">
          <div className="w-full sm:w-1/3 sm:pr-16">
            <AccountMenu />
          </div>
          <main className="hidden w-2/3 mx-auto overflow-hidden bg-white rounded-lg shadow sm:block">
            <div className="px-4 py-5 pt-5 mt-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                You successfully upgraded your plan!
              </h3>
              <div className="pt-5 mt-8 border-t border-gray-200">
                <div className="flex justify-end">
                  <span className="rounded-md shadow-sm">
                    <Link href="/account/billing">
                      <Button title="Back" />
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

export default withAuth(Success);
