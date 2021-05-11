import Link from 'next/link';
import withAuth from 'middlewares/withAuth';
import { useSelector } from 'react-redux';
import Layout from 'components/dashboard/Layout';
import AccountMenu from 'components/dashboard/AccountMenu';
import Button from 'components/elements/Button';
import { CgSpinner } from 'react-icons/cg';

const Team: React.FC = () => {
  const user = useSelector((state: any) => state.auth.user);

  return (
    <Layout>
      <div className="px-4 py-10 pb-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <header className="pb-4 pl-3 mb-6 border-b-2 border-gray-300 sm:py-6">
          <div className="mt-2 md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-800 sm:text-3xl sm:leading-9 sm:truncate">
                Your Teams
              </h2>
            </div>
          </div>
        </header>
        <div className="flex">
          <div className="w-full sm:w-1/3 sm:pr-16">
            <AccountMenu />
          </div>
          <main className="hidden w-2/3 mx-auto sm:block">
            {!user.teams && (
              <CgSpinner size={30} className="m-auto mt-6 animate-spin" />
            )}
            {user.teams
              .filter((team) => team.role === 'owner')
              .map((team, key) => (
                <div key={key}>
                  <div className="px-4 py-5 pt-5 mt-10 overflow-hidden bg-white rounded-lg shadow-lg sm:p-6">
                    <hr className="bg-gray-200" />
                    <div className="py-2.5 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                          {team.name}
                        </h3>
                        <span className="rounded-md shadow-sm">
                          <Link href={`/account/teams/${team.id}`}>
                            <a href="">
                              <Button title="Go" />
                            </a>
                          </Link>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default withAuth(Team);
