import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm, Controller } from 'react-hook-form';
import withAuth from 'middlewares/withAuth';
import { useSelector, useDispatch } from 'react-redux';
import { addToast } from 'redux/slices/toastSlice';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { updateTeam } from 'redux/slices/teamSlice';
import Layout from 'components/dashboard/Layout';
import AccountMenu from 'components/dashboard/AccountMenu';
import { unwrapResult } from '@reduxjs/toolkit';
import { fetchTeam } from 'redux/slices/teamSlice';
import TextInput from 'components/inputs/TextInput';

const schema = yup.object().shape({
  name: yup.string().required(),
});

const EditTeamPage: React.FC = () => {
  const dispatch: any = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { push } = useRouter();
  const teamId = router.query.teamId;
  const team = useSelector((state: any) => state.team.data);
  const { control, errors, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    dispatch(fetchTeam(teamId));
  }, []);

  const onSubmit = (data) => {
    setIsLoading(true);
    setError(null);
    dispatch(updateTeam({ id: team.id, data: { name: data.name } }))
      .then(unwrapResult)
      .then(() => {
        setIsLoading(false);
        push(`/account/teams/${teamId}`);
        dispatch(
          addToast({
            title: 'Team updated',
            description: 'You have successfully updated the Team',
            type: 'success',
          })
        );
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  };

  return (
    <Layout>
      <div className="px-4 py-10 pb-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <header className="pb-4 pl-3 mb-6 border-b-2 border-gray-300 sm:py-6">
          <div className="mt-2 md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-800 sm:text-3xl sm:leading-9 sm:truncate">
                Update your Team
              </h2>
            </div>
          </div>
        </header>
        <div className="flex">
          <div className="w-full sm:w-1/3 sm:pr-16">
            <AccountMenu />
          </div>
          <main className="hidden w-2/3 px-5 py-6 mx-auto overflow-hidden bg-white rounded-lg shadow-lg sm:block sm:px-6">
            {team && (
              <form onSubmit={handleSubmit(onSubmit)}>
                {error && (
                  <div className="p-2 mb-4 text-center text-red-500 border border-red-600 border-dashed rounded">
                    <span>{error}</span>
                  </div>
                )}
                <div>
                  <div>
                    <div>
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Edit team
                      </h3>
                      <p className="max-w-2xl mt-1 text-sm leading-5 text-gray-500">
                        After you have created a team you can start inviting
                        people to your team.
                      </p>
                    </div>
                    <div className="mt-6 sm:mt-5">
                      <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                        >
                          Team name
                        </label>
                        <div className="mt-1 sm:mt-0 sm:col-span-2">
                          <div className="max-w-md rounded-md shadow-sm">
                            <Controller
                              name="name"
                              control={control}
                              defaultValue={team?.name}
                              render={(props) => (
                                <TextInput
                                  value={props.value}
                                  placeholder="Enter a team name"
                                  onChange={(value) => props.onChange(value)}
                                  error={errors.name}
                                  autoFocus
                                />
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-5 mt-8 border-t border-gray-200">
                  <div className="flex justify-end">
                    <span className="inline-flex rounded-md shadow-sm">
                      <Link href={`/account/teams/${teamId}`}>
                        <button
                          type="button"
                          className="px-4 py-2 text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out border border-gray-300 rounded-md hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800"
                        >
                          Cancel
                        </button>
                      </Link>
                    </span>
                    <span className="inline-flex ml-3 rounded-md shadow-sm">
                      <button
                        type="submit"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out border border-transparent rounded-md bg-royal-blue-600 hover:bg-royal-blue-500 focus:outline-none focus:border-royal-blue-700 focus:shadow-outline-royal-blue active:bg-royal-blue-700"
                      >
                        {isLoading ? 'Loading...' : 'Save'}
                      </button>
                    </span>
                  </div>
                </div>
              </form>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default withAuth(EditTeamPage);
