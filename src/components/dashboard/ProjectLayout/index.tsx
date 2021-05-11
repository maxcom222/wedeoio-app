import { useSelector } from 'react-redux';
import Header from './Header';
import Sidebar from './Sidebar';
import Link from 'next/link';

const ProjectLayout: React.FC<{ children: any }> = ({ children }) => {
  const user = useSelector((state: any) => state.auth.user);

  return (
    <>
      <div className="md:flex flex-col md:flex-row w-full min-h-screen bg-gray-100">
        <div className="flex-shrink-0 w-60 border-r border-gray-200 bg-white">
          <div className="text-xl text-gray-600 pl-5 py-3">
            <Link href="/">
              <a href="" className="flex">
                <img
                  className="w-auto h-8 sm:h-10"
                  src="/img/logo.svg"
                  alt="Wedeo"
                />
              </a>
            </Link>
          </div>
          <div className="p-2">
            <Sidebar />
          </div>
        </div>
        <div className="flex flex-col w-full">
          <Header />
          {children}
        </div>
      </div>
    </>
  );
};

export default ProjectLayout;
