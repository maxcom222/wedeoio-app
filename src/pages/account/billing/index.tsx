import withAuth from 'middlewares/withAuth';
import { useSelector } from 'react-redux';
import Layout from 'components/dashboard/Layout';
import AccountMenu from 'components/dashboard/AccountMenu';
import PricingCard from 'components/dashboard/PricingCard';
import StripeBillingButton from 'components/dashboard/BillingButton';
import { PRO_PLAN, HOBBY_PLAN } from 'config/stripe';

const Billing: React.FC = () => {
  const user = useSelector((state: any) => state.auth.user);

  return (
    <Layout>
      <div className="px-4 py-10 pb-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <header className="pb-4 pl-3 mb-6 border-b-2 border-gray-300 sm:py-6">
          <div className="mt-2 md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-800 sm:text-3xl sm:leading-9 sm:truncate">
                Billing
              </h2>
            </div>
          </div>
        </header>
        <div className="flex">
          <div className="w-full sm:w-1/3 sm:pr-16">
            <AccountMenu />
          </div>
          <main className="hidden w-2/3 mx-auto sm:block">
            {!user?.isPro && !user?.isHobby && (
              <div className="grid grid-cols-2 gap-4">
                <PricingCard plan={HOBBY_PLAN} />
                <PricingCard plan={PRO_PLAN} />
              </div>
            )}
            {(user.isPro || user.isHobby) && (
              <div>
                <div className="p-4 bg-green-100 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-green-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium leading-5 text-green-800">
                        Your
                        <span className="font-bold">
                          {user.isPro ? ' Pro ' : ' Hobby '}
                        </span>
                        plan is currently active
                      </h3>
                      <div className="mt-2 text-sm leading-5 text-green-700">
                        <p>
                          You have full access to all feature and
                          functionalities. If you which to update your
                          subscription or payment method, visit the billing
                          portal.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-5 pt-5 mt-10 overflow-hidden bg-white rounded-lg shadow-lg sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Manage your subscription
                  </h3>
                  <div className="mt-2 sm:flex sm:items-start sm:justify-between">
                    <div className="text-sm leading-5 text-gray-500">
                      <p>
                        {`You can update or cancel your subscription any time. Click
                    the "Manage subscription" button to go to the customer
                    portal where you can update your subscription or change your
                    preferred payment method.`}
                      </p>
                    </div>
                  </div>
                  <div className="pt-5 mt-8 border-t border-gray-200">
                    <div className="flex justify-end">
                      <StripeBillingButton />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default withAuth(Billing);
