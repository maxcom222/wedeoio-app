import USPList from './USPList';
import StripeCheckoutButton from './CheckoutButton';

const PricingCard: React.FC<{ plan: any }> = ({ plan }) => {
  return (
    <div className="relative">
      <div className="absolute inset-0 h-1/2" />
      <div className="relative">
        <div className="rounded-lg shadow-lg overflow-hidden">
          <div className="bg-white px-6 py-8 lg:flex-shrink-1 lg:p-12">
            <h3 className="text-2xl leading-8 font-extrabold text-gray-900 sm:text-3xl sm:leading-9">
              {plan.title}
            </h3>
            <p className="mt-6 text-base leading-6 text-gray-600">
              {plan.description}
            </p>
            <div className="mt-8">
              <div className="flex items-center">
                <h4 className="flex-shrink-0 pr-4 bg-white text-sm leading-5 tracking-wider font-semibold uppercase text-royal-blue-600">
                  {`What's included`}
                </h4>
                <div className="flex-1 border-t-2 border-gray-200" />
              </div>
              <USPList usps={plan.usps} />
            </div>
          </div>
          <div className="pb-8 px-6 text-center bg-white lg:flex-shrink-0 lg:flex lg:flex-col lg:justify-center lg:px-12 lg:pb-12">
            <p className="text-lg leading-6 font-medium text-gray-900">
              Price per month
            </p>
            <div className="mt-4 flex items-center justify-center text-5xl leading-none font-extrabold text-gray-900">
              <span>{plan.price}</span>
              <span className="ml-3 text-xl leading-7 font-medium text-gray-500">
                USD
              </span>
            </div>
            <div className="mt-6">
              <StripeCheckoutButton plan={plan} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingCard;
