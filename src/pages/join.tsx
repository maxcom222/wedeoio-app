import DefaultErrorPage from 'next/error';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { auth, db } from 'config/firebase';
import { withTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';

import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { signup, join } from 'redux/slices/authSlice';
import { addToast } from 'redux/slices/toastSlice';
import Button from 'components/elements/Button';
import Link from 'next/link';
import { CgSpinner } from 'react-icons/cg';

const JoinPage: React.FC<any> = ({ teamId, teamName, email, userId, t }) => {
  const { replace } = useRouter();
  const dispatch: any = useDispatch();

  const { register, errors, handleSubmit } = useForm({
    defaultValues: {
      name: '',
      password: '',
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      if (userId) {
        // if invitee's email already exists
        unwrapResult(await dispatch(join({ teamId, teamName, userId, email })));
      } else if (!auth.currentUser) {
        // else if not login
        unwrapResult(await dispatch(signup({ ...data, email, teamId })));
      } else {
        // if self join
        throw new Error('You are trying to join your own team');
      }
      dispatch(
        addToast({
          title: t('Welcome!'),
          description: t(
            'You have successfully registered. Please confirm your email.'
          ),
          type: 'success',
        })
      );
      replace('/');
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(() => {
      setIsPageLoaded(true);
    });

    return () => unsubscribe();
  }, []);

  if (!email) return <DefaultErrorPage statusCode={404} />;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {isPageLoaded && (
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            {!userId && (
              <h2 className="text-3xl font-extrabold leading-9 text-center text-gray-900">
                {t('Sign up')}
              </h2>
            )}
            <h3 className="mt-3 text-2xl font-extrabold leading-9 text-center text-gray-900">
              {`
                ${userId ? 'Join' : t('and join')}
                ${teamName}
              `}
            </h3>
          </div>
          <div className="px-4 py-8 mt-8 bg-white shadow-lg sm:rounded-lg sm:px-10">
            <form onSubmit={handleSubmit(onSubmit)}>
              {error && (
                <div className="p-2 mb-4 text-center text-red-500 border border-red-600 border-dashed rounded">
                  <span>{error}</span>
                </div>
              )}
              {!userId && (
                <>
                  <div className="rounded-md">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium leading-5 text-gray-700"
                    >
                      {t('Name')}
                    </label>
                    <input
                      id="name"
                      className="block w-full px-3 py-2 placeholder-gray-400 transition duration-150 ease-in-out border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
                      type="text"
                      name="name"
                      ref={register({
                        required: t('Please enter an name'),
                        minLength: {
                          value: 3,
                          message: t('Name should have at least 3 characters'),
                        },
                      })}
                    />
                    {errors.name && (
                      <p className="mt-2 text-xs text-red-600">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 mb-10">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium leading-5 text-gray-700"
                    >
                      {t('Password')}
                    </label>
                    <div className="mt-1 rounded-md">
                      <input
                        id="password"
                        className="block w-full px-3 py-2 placeholder-gray-400 transition duration-150 ease-in-out border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
                        type="password"
                        name="password"
                        ref={register({
                          required: t('Please enter a password'),
                          minLength: {
                            value: 6,
                            message: t('Should have at least 6 characters'),
                          },
                        })}
                      />
                      {errors.password && (
                        <div className="mt-2 text-xs text-red-600">
                          {errors.password.message}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              <div>
                <span className="block w-full rounded-md shadow-sm mb-2">
                  <Button
                    title={t(userId ? 'Join' : 'Sign up & Join')}
                    type="submit"
                    full
                    isLoading={isLoading}
                  />
                </span>
                <span className="block w-full rounded-md shadow-sm">
                  <Link href={process.env.NEXT_PUBLIC_WEBSITE_URL}>
                    <button
                      className={`
                        w-full
                        flex justify-center
                        border focus:outline-none text-sm rounded-md
                        transition duration-150 ease-in-out
                        
                        text-gray-700
                        bg-gray-200
                        hover:bg-gray-300
                        focus:border-gray-700
                        focus:shadow-outline-gray
                        active:border-gray-700

                        px-4 py-2 min-w-24
                      `}
                      type="button"
                    >
                      {t('Decline')}
                    </button>
                  </Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      )}
      {!isPageLoaded && <CgSpinner size={30} className="animate-spin" />}
    </div>
  );
};

export const getServerSideProps: any = async (context) => {
  const { teamId, token } = context.query;

  if (teamId && token) {
    const team = (await db.collection('teams').doc(teamId).get()).data();
    const teamUserIndex = team.users.findIndex(
      (teamUser) => teamUser.token === token
    );
    if (teamUserIndex !== -1) {
      team.users[teamUserIndex].token = null;
      try {
        await db.collection('teams').doc(teamId).set(team);
      } catch (error) {
        console.log('error', error);
      }
      const user = (
        await db
          .collection('users')
          .where('email', '==', team.users[teamUserIndex].email)
          .get()
      ).docs;
      const userId = user && user.length ? user[0].id : null;

      const teamName = team.name;
      const email = team.users[teamUserIndex].email;
      return {
        props: {
          teamId,
          teamName,
          email,
          userId,
        },
      };
    }
  }

  return { props: {} };
};

export default withTranslation()(JoinPage);
