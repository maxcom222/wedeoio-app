import { ReactNode } from 'react';
import { NextPage } from 'next';

import Header from 'components/dashboard/Header';

interface Props {
  children: ReactNode;
}

const Layout: NextPage<Props> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      {children}
    </div>
  );
};

export default Layout;
