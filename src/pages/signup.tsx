import Link from 'next/link';
import { useRouter } from 'next/router';
import { getTeamName } from 'services/team';
import { useEffect, useState } from 'react';
import { CgSpinner } from 'react-icons/cg';
import { auth } from 'config/firebase';
import { withTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';

import { useDispatch } from 'react-redux';
import { loginWithGoogle, signup } from 'redux/slices/authSlice';
import { addToast } from 'redux/slices/toastSlice';
import { unwrapResult } from '@reduxjs/toolkit';

import Button from 'components/elements/Button';
import { FcGoogle } from 'react-icons/fc';

const SignUpPage: React.FC<any> = ({ teamId, teamName, email, t }) => {
  const { replace } = useRouter();
  const dispatch: any = useDispatch();

  const { register, errors, handleSubmit } = useForm({
    defaultValues: {
      name: '',
      email,
      password: '',
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [error, setError] = useState(null);

  teamId = typeof teamId === 'undefined' ? null : teamId;
  email = typeof email === 'undefined' ? null : email;

  const onSubmit = (data) => {
    setIsLoading(true);
    setError(null);
    dispatch(signup({ ...data, teamId: teamId }))
      .then(unwrapResult)
      .then(() => {
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
      })
      .catch((error) => {
        setIsLoading(false);
        setError(error.message);
      });
  };

  const handleLoginWithGoogle = () => {
    setIsGoogleLoading(true);
    dispatch(loginWithGoogle({ teamId, email }))
      .then(unwrapResult)
      .then(() => {
        dispatch(
          addToast({
            title: t('Welcome!'),
            description: t('You have successfully registered.'),
            type: 'success',
          })
        );
        replace('/');
      })
      .catch((error) => {
        setError(error.message);
        setIsGoogleLoading(false);
      });
  };

  useEffect(() => {
    let flagIsPageLoaded = false;
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user?.uid) {
        if (!flagIsPageLoaded) {
          replace('/');
        }
      } else {
        setIsPageLoaded(true);
        flagIsPageLoaded = true;
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {isPageLoaded && (
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold leading-9 text-center text-gray-900">
              {t('Sign up')}
            </h2>
            {teamName ? (
              <h3 className="mt-3 text-2xl font-extrabold leading-9 text-center text-gray-900">{`${t(
                'and join'
              )} ${teamName}`}</h3>
            ) : (
              <p className="mt-2 text-center text-gray-600 text-md">
                {t('Already have an account? ')}
                <Link href="/login">
                  <a href="" className="text-royal-blue-500">
                    {t('Log in')}
                  </a>
                </Link>
              </p>
            )}
          </div>
          <div className="px-4 py-8 mt-8 bg-white shadow-lg sm:rounded-lg sm:px-10">
            <form onSubmit={handleSubmit(onSubmit)}>
              {error && (
                <div className="p-2 mb-4 text-center text-red-500 border border-red-600 border-dashed rounded">
                  <span>{error}</span>
                </div>
              )}
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
              <div className="mt-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-5 text-gray-700"
                >
                  {t('Email address')}
                </label>
                <div className="mt-1 rounded-md">
                  <input
                    id="email"
                    className={`appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5 shadow-sm ${
                      !!email && 'cursor-not-allowed'
                    }`}
                    type="email"
                    name="email"
                    readOnly={!!email}
                    ref={register({
                      required: t('Please enter an email'),
                      pattern: {
                        value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                        message: t('Not a valid email'),
                      },
                    })}
                  />
                  {errors.email && (
                    <div className="mt-2 text-xs text-red-600">
                      {errors.email.message}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4">
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

              <div className="mt-10">
                <span className="block w-full rounded-md shadow-sm mb-4">
                  <Button
                    title={t('Create an account')}
                    type="submit"
                    full
                    isLoading={isLoading}
                  />
                </span>
                <span className="block w-full shadow-sm">
                  <Button
                    type="button"
                    color="unset"
                    onClick={() => handleLoginWithGoogle()}
                    isLoading={isGoogleLoading}
                    full
                  >
                    <div className="flex items-center">
                      <FcGoogle className="w-5 h-5 mr-2" />
                      <span>{t('Signup with Google')}</span>
                    </div>
                  </Button>
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
  const { teamId, email } = context.query;
  let teamName;

  if (!teamId) {
    return { props: {} };
  }

  if (teamId) {
    teamName = await getTeamName(teamId as string);
  }

  return {
    props: {
      teamId,
      teamName,
      email: email || '',
    },
  };
};

export default withTranslation()(SignUpPage);
