const USPList: React.FC<{ usps: Array<string> }> = (props) => {
  return (
    <ul className="mt-8 lg:grid lg:grid-cols-1 lg:col-gap-8 lg:row-gap-5">
      {props.usps?.map((usp, i) => {
        return (
          <li className="flex items-start lg:col-span-1" key={i}>
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
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
            <p className="ml-3 text-sm leading-5 text-gray-700">{usp}</p>
          </li>
        );
      })}
    </ul>
  );
};

export default USPList;
