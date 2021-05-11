interface Props {
  user: {
    name: string;
    avatarUrl?: string;
    email: string;
    id: string;
    isAdmin?: string;
  };
}

const UserCard: React.FC<Props> = ({ user }) => {
  return (
    <li className="col-span-1 bg-white divide-y divide-gray-200 rounded-lg shadow-lg">
      <div className="flex items-center justify-between w-full p-6 space-x-6">
        <div className="flex-1 truncate">
          <div className="flex items-center space-x-3">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {user.name}
            </h3>
            {user?.isAdmin && (
              <span className="flex-shrink-0 inline-block px-2 py-0.5 text-green-800 text-xs font-medium bg-green-100 rounded-full">
                Admin
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500 truncate">{user.email}</p>
        </div>
        {user?.avatarUrl ? (
          <img
            className="flex-shrink-0 object-cover w-10 h-10 bg-gray-300 rounded-full"
            src={user.avatarUrl}
            alt={user.name}
          />
        ) : (
          <svg
            className="flex-shrink-0 w-10 h-10 text-gray-700 rounded-full"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )}
      </div>
    </li>
  );
};

export default UserCard;
