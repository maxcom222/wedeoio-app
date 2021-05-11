import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';

import { useDispatch } from 'react-redux';
import { sendPasswordResetEmail } from 'redux/slices/authSlice';
import { addToast } from 'redux/slices/toastSlice';
import Button from 'components/elements/Button';
import { unwrapResult } from '@reduxjs/toolkit';

import { withTranslation } from 'react-i18next';

const ResetPasswordPage: React.FC<any> = ({ t }) => {
  const dispatch: any = useDispatch();
  const { register, errors, handleSubmit } = useForm();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = (data: { email: string }) => {
    setIsLoading(true);
    setError(null);
    dispatch(sendPasswordResetEmail(data.email))
      .then(unwrapResult)
      .then(() => {
        setIsLoading(false);
        dispatch(
          addToast({
            title: t('Hi!'),
            description: t(
              "We've just sent an email including password reset link. Please check your email."
            ),
            type: 'info',
          })
        );
        router.push('/login');
      })
      .catch((error) => {
        setIsLoading(false);
        setError(error.message);
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-center text-gray-900">
            {t('Reset password')}
          </h2>
          <p className="mt-2 text-center text-gray-600 text-md">
            {"Didn't forgot? "}
            <Link href="/login">
              <a href="" className="text-indigo-500">
                {t('Login')}
              </a>
            </Link>
          </p>
        </div>
        <div className="px-4 py-8 mt-8 bg-white shadow-lg sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="mb-4 text-red-500 text-center border-dashed border border-red-600 p-2 rounded">
                <span>{error}</span>
              </div>
            )}
            <div className="rounded-md">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-5 text-gray-700"
              >
                {'Email address'}
              </label>
              <div className="mt-1 rounded-md">
                <input
                  id="email"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5 shadow-sm"
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
              <span className="block w-full rounded-md shadow-sm">
                <Button
                  title={t('Send reset link')}
                  type="submit"
                  isLoading={isLoading}
                />
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default withTranslation()(ResetPasswordPage);
