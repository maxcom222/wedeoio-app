import Link from 'next/link';
import { NextPage } from 'next';

const AdminPage: NextPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="m-2 m-auto rounded-lg ">
        <div className="relative p-6 mr-2 bg-white rounded-lg shadow-lg">
          <h1 className="text-lg font-semibold">
            You need to be logged in as an admin
          </h1>
          <Link href="/admin">
            <a className="text-indigo-500">Go back</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
