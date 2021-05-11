import Link from 'next/link';
import { useEffect, useState } from 'react';
import { auth } from 'config/firebase';
import { CgSpinner } from 'react-icons/cg';
import { useRouter } from 'next/router';
import { withTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { login, loginWithGoogle } from 'redux/slices/authSlice';
import { addToast } from 'redux/slices/toastSlice';

import Button from 'components/elements/Button';
import { FcGoogle } from 'react-icons/fc';
import { unwrapResult } from '@reduxjs/toolkit';

const LoginPage: React.FC<any> = ({ t }) => {
  const { replace } = useRouter();
  const dispatch: any = useDispatch();

  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const { register, errors, handleSubmit } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = (data) => {
    setIsLoading(true);
    setError(null);
    dispatch(login(data))
      .then(unwrapResult)
      .then(() => {
        dispatch(
          addToast({
            title: t('Welcome back!'),
            description: t('You are successfully signed in.'),
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
    dispatch(loginWithGoogle({ teamId: null, email: null }))
      .then(unwrapResult)
      .then(() => {
        dispatch(
          addToast({
            title: t('Welcome back!'),
            description: t('You are successfully signed in.'),
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
        <div className="mx-4 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-center text-gray-900">
              {t('Log in')}
            </h2>
            <p className="mt-2 text-center text-gray-600 text-md">
              {t("Don't have an account? ")}
              <Link href="/signup">
                <a href="" className="text-royal-blue-500">
                  {t('Sign up')}
                </a>
              </Link>
            </p>
          </div>
          <div className="px-4 py-8 mt-8 bg-white rounded-lg shadow-lg sm:px-10">
            <form onSubmit={handleSubmit(onSubmit)}>
              {error && (
                <div className="p-2 mb-4 text-center text-red-500 border border-red-600 border-dashed rounded">
                  <span>{error}</span>
                </div>
              )}
              <div className="rounded-md">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-5 text-gray-700"
                >
                  {t('Email address')}
                </label>
                <div className="mt-1 rounded-md">
                  <input
                    id="email"
                    className="block w-full px-3 py-2 placeholder-gray-400 transition duration-150 ease-in-out border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
                    type="email"
                    name="email"
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

              <div className="flex items-end mt-4">
                <div className="text-sm leading-5">
                  <Link href="/reset-password">
                    <a
                      href="#"
                      className="font-medium transition duration-150 ease-in-out text-royal-blue-600 hover:text-royal-blue-500 focus:outline-none focus:underline"
                    >
                      {t('Forgot your password?')}
                    </a>
                  </Link>
                </div>
              </div>

              <div className="mt-4">
                <span className="block w-full rounded-md shadow-sm mb-4">
                  <Button
                    title="Login"
                    type="submit"
                    isLoading={isLoading}
                    full
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
                      <span>{t('Login with Google')}</span>
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

export default withTranslation()(LoginPage);
