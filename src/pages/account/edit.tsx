import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';

import { storage } from 'config/firebase';
import withAuth from 'middlewares/withAuth';
import { useSelector, useDispatch } from 'react-redux';
import { logout, updateUser, deleteUser } from 'redux/slices/authSlice';
import { addToast } from 'redux/slices/toastSlice';

import Layout from 'components/dashboard/Layout';
import AccountMenu from 'components/dashboard/AccountMenu';
import ConfirmModal from 'components/dashboard/ConfirmModal';
import { unwrapResult } from '@reduxjs/toolkit';

import { withTranslation } from 'react-i18next';
import { useCookies } from 'react-cookie';

const EditAccount: React.FC<any> = (props) => {
  const [cookie, setCookie] = useCookies(['i18next']);
  const user = useSelector((state: any) => state.auth.user);
  const dispatch: any = useDispatch();
  const { replace } = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { t, i18n } = props;

  const { register, errors, handleSubmit } = useForm({
    defaultValues: {
      name: user.name,
    },
  });

  const onDrop = (acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length) {
      console.log(rejectedFiles);
    }
    const file = acceptedFiles[0];
    if (file.type.includes('image')) {
      handleUpload(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleUpload = (image) => {
    const uploadTask = storage
      .ref(`users/${user.uid}/${image.name}`)
      .put(image);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref(`users/${user.uid}`)
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            setAvatarUrl(url);
          });
      }
    );
  };

  const onSubmit = (values) => {
    setIsLoading(true);
    setError(null);

    const data = { ...values };
    if (avatarUrl) {
      data.avatarUrl = avatarUrl;
    }

    dispatch(updateUser({ id: user.uid, data }))
      .then(unwrapResult)
      .then(() => {
        setIsLoading(false);
        replace('/account');
        dispatch(
          addToast({
            title: 'Profile updated',
            description: 'You have successfully updated your account',
            type: 'success',
          })
        );
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  };

  const deleteAccount = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      unwrapResult(await dispatch(deleteUser()));
      await dispatch(
        addToast({
          title: 'Account deleted',
          description: 'You have successfully deleted your account',
          type: 'success',
        })
      );
      replace('/login');
    } catch (error) {
      console.log('catch error', error.message);
      setError(error.message);
      setIsDeleting(false);
      setShowConfirmModal(false);
    }
  };

  const handleChangeLocale = (value) => {
    i18n.changeLanguage(value);
  };

  useEffect(() => {
    if (cookie.i18next !== i18n.language) {
      setCookie('i18next', i18n.language, { path: '/' });
    }
  }, [i18n.language]);

  return (
    <Layout>
      <div className="px-4 py-10 pb-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <header className="pb-4 sm:py-6">
          <div className="mt-2 md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-800 sm:text-3xl sm:leading-9 sm:truncate">
                {t('Account')}
              </h2>
            </div>
          </div>
        </header>
        <div className="flex">
          <div className="w-full sm:w-1/3 sm:pr-16">
            <AccountMenu />
          </div>
          <main className="hidden w-2/3 px-5 py-6 mx-auto overflow-hidden bg-white rounded-lg shadow-lg sm:block sm:px-6">
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
                      Edit account
                    </h3>
                    <p className="max-w-2xl mt-1 text-sm leading-5 text-gray-500">
                      Update your account information
                    </p>
                  </div>
                  <div className="mt-6 sm:mt-5">
                    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Name
                      </label>
                      <div className="mt-1 sm:mt-0 sm:col-span-2">
                        <div className="max-w-xs rounded-md shadow-sm">
                          <input
                            id="name"
                            name="name"
                            className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                            ref={register({
                              required: 'Please enter a username',
                            })}
                          />
                          {errors.name && (
                            <div className="mt-2 text-xs text-red-600">
                              {errors.name.message}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 sm:mt-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Email address
                      </label>
                      <div className="mt-1 sm:mt-0 sm:col-span-2">
                        <div className="max-w-xs mt-1 text-sm leading-5 text-gray-900 ">
                          {user.email}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 sm:mt-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center sm:border-t sm:border-gray-200 sm:pt-5">
                      <label
                        htmlFor="photo"
                        className="block text-sm font-medium leading-5 text-gray-700"
                      >
                        Photo
                      </label>
                      <div className="mt-2 sm:mt-0 sm:col-span-2">
                        <div className="flex items-center">
                          <span className="w-12 h-12 overflow-hidden bg-gray-100 rounded-full">
                            {avatarUrl || user.avatarUrl ? (
                              <span className="relative inline-block">
                                <img
                                  className="object-cover w-12 h-12 rounded-md"
                                  src={avatarUrl || user.avatarUrl}
                                  alt={user.name}
                                />
                              </span>
                            ) : (
                              <svg
                                className="w-full h-full text-gray-300"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                              </svg>
                            )}
                          </span>
                          <div>
                            <div {...getRootProps()}>
                              <input {...getInputProps()} />
                              {isDragActive ? (
                                <span className="ml-5 rounded-md shadow-sm">
                                  <button
                                    type="button"
                                    className="px-3 py-2 text-sm font-medium leading-4 text-gray-700 transition duration-150 ease-in-out border border-gray-300 rounded-md hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800"
                                  >
                                    Drop here
                                  </button>
                                </span>
                              ) : progress && progress !== 100 ? (
                                <div className="max-w-sm ml-3 rounded-md shadow bg-grey-light m-w-64">
                                  <div
                                    className="py-1 text-xs leading-none text-center text-white rounded-md bg-royal-blue-600"
                                    style={{ width: `${progress}%` }}
                                  >
                                    {`${progress}%`}
                                  </div>
                                </div>
                              ) : (
                                <span className="ml-5 rounded-md shadow-sm">
                                  <button
                                    type="button"
                                    className="px-3 py-2 text-sm font-medium leading-4 text-gray-700 transition duration-150 ease-in-out border border-gray-300 rounded-md hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800"
                                  >
                                    Change
                                  </button>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 sm:mt-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                      <label
                        htmlFor="language"
                        className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Language
                      </label>
                      <div className="mt-1 sm:mt-0 sm:col-span-2">
                        <div className="flex max-w-xs rounded-md shadow-sm">
                          <button
                            type="button"
                            onClick={() => handleChangeLocale('en')}
                            className={`
                            flex justify-center border focus:outline-none
                            text-sm rounded-md transition duration-150 ease-in-out
                            px-4 py-2 min-w-24 ml-2 outline-none
                            ${
                              i18n.language === 'en'
                                ? `
                              cursor-not-allowed
                              text-white transition duration-150 ease-in-out
                              bg-royal-blue-600 hover:bg-royal-blue-500
                              focus:outline-none focus:border-royal-blue-700 
                            `
                                : `
                              text-gray-700 bg-white hover:bg-gray-100
                              focus:border-blue-300 focus:shadow-outline-gray
                            `
                            }
                          `}
                          >
                            English
                          </button>
                          <button
                            type="button"
                            onClick={() => handleChangeLocale('ko')}
                            className={`
                            flex justify-center border focus:outline-none
                            text-sm rounded-md transition duration-150 ease-in-out
                            px-4 py-2 min-w-24 ml-2 outline-none
                            ${
                              i18n.language === 'ko'
                                ? `
                              cursor-not-allowed
                              text-white transition duration-150 ease-in-out
                              bg-royal-blue-600 hover:bg-royal-blue-500
                              focus:outline-none focus:border-royal-blue-700 
                            `
                                : `
                              text-gray-700 bg-white hover:bg-gray-100
                              focus:border-blue-300 focus:shadow-outline-gray
                            `
                            }
                          `}
                          >
                            Korean
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-5 mt-8 border-t border-gray-200">
                <div className="flex justify-between">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium leading-5 text-red-500 transition duration-150 ease-in-out border border-red-500 rounded-md hover:text-red-600 focus:outline-none focus:border-red-300 focus:shadow-outline-blue active:bg-red-50 active:text-red-800"
                    onClick={() => setShowConfirmModal(true)}
                  >
                    Delete account
                  </button>
                  <div className="flex justify-end">
                    <span className="inline-flex rounded-md shadow-sm">
                      <Link href="/account">
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
              </div>
            </form>
          </main>
        </div>
      </div>
      <ConfirmModal
        open={showConfirmModal}
        closeModal={() => setShowConfirmModal(false)}
        title={'Are you sure?'}
        text={
          'Your account and any other related data will be permanently deleted. You can not undo this action.'
        }
        confirmText="Delete account"
        processing={isDeleting}
        confirmColor="red"
        confirmAction={() => deleteAccount()}
      />
    </Layout>
  );
};

export default withAuth(withTranslation()(EditAccount));
