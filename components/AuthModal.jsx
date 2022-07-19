import { Fragment, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';
import { Formik, Form } from 'formik';
import { Dialog, Transition } from '@headlessui/react';
import { UserGroupIcon, MailOpenIcon, XIcon } from '@heroicons/react/outline';
import { signIn } from 'next-auth/react';

import Input from './Input';

const SignInSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .email('Invalid email')
    .required('This field is required'),
});

const Confirm = ({ show = false, email = '' }) => (
  <Transition appear show={show} as={Fragment}>
    <div className="fixed inset-0 z-50">
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-white" />
      </Transition.Child>

      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div className="flex items-center justify-center h-full p-8">
          <div className="overflow-hidden transition-all transform">
            <h3 className="text-center text-lg font-medium leading-6">
              <div className="flex flex-col justify-center items-center space-y-4">
                <MailOpenIcon className="w-12 h-12 shrink-0 text-blue-500" />
              </div>
              <p className="text-2xl font-semibold mt-2">Confirm your email</p>
            </h3>

            <p className="text-lg text-center mt-4">
              We emailed a magic link to <strong>{email ?? ''}</strong>.
              <br />
              Check your inbox and click the link in the email to login or sign
              up.
            </p>
          </div>
        </div>
      </Transition.Child>
    </div>
  </Transition>
);

const AuthModal = ({ show = false, onClose = () => null }) => {
  const [disabled, setDisabled] = useState(false);
  const [showConfirm, setConfirm] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  const signInWithEmail = async ({ email }) => {
    let toastId;
    try {
      toastId = toast.loading('Loading...');
      setDisabled(true);
      const { error } = await signIn('email', {
        redirect: false,
        callbackUrl: window.location.href,
        email,
      });
      if (error) {
        throw new Error(error);
      }
      setConfirm(true);
      toast.dismiss(toastId);
    } catch (err) {
      toast.error('Unable to sign in', { id: toastId });
    } finally {
      setDisabled(false);
    }
  };

  const signInWithGoogle = () => {
    toast.loading('Redirecting...');
    setDisabled(true);
    signIn('google', {
      callbackUrl: window.location.href,
    });
  };

  const closeModal = () => {
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  useEffect(() => {
    if (!show) {
      setTimeout(() => {
        setDisabled(false);
        setConfirm(false);
        setShowSignIn(false);
      }, 200);
    }
  }, [show]);

  useEffect(() => {
    toast.dismiss();
  }, []);

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={closeModal}
      >
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-75" />

        <div className="min-h-screen text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0" />
          </Transition.Child>

          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl sm:rounded-md max-w-md relative">
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 shrink-0 p-1 rounded-md hover:bg-gray-100 transition focus:outline-none"
              >
                <XIcon className="w-5 h-5" />
              </button>

              <div className="py-12">
                <div className="px-4 sm:px-12">
                  <div className="flex justify-center">
                    <Link href="/">
                      <a className="flex items-center space-x-1">
                        <UserGroupIcon className="shrink-0 w-8 h-8 text-blue-500" />
                        <span className="text-xl font-semibold tracking-wide">
                          Vacation<span className="text-blue-500">Homes</span>
                        </span>
                      </a>
                    </Link>
                  </div>

                  <Dialog.Title
                    as="h3"
                    className="mt-6 font-bold text-lg sm:text-2xl text-center"
                  >
                    {showSignIn ? 'Welcome back!' : 'Create your account'}
                  </Dialog.Title>

                  {!showSignIn ? (
                    <Dialog.Description className="mt-2 text-gray-500 text-base text-center">
                      Please create an account to list your homes and bookmark
                      your favorite ones.
                    </Dialog.Description>
                  ) : null}

                  <div className="mt-10">
                    <button
                      disabled={disabled}
                      onClick={() => signInWithGoogle()}
                      className="h-[46px] w-full mx-auto border rounded-md p-2 flex justify-center items-center space-x-2 text-gray-500 hover:text-gray-600 hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-400 focus:ring-opacity-25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-gray-500 disabled:hover:bg-transparent disabled:hover:border-gray-200 transition-colors"
                    >
                      <Image
                        src="/google.svg"
                        alt="Google"
                        width={32}
                        height={32}
                      />
                      <span>Sign {showSignIn ? 'in' : 'up'} with Google</span>
                    </button>

                    <Formik
                      initialValues={{ email: '' }}
                      validationSchema={SignInSchema}
                      validateOnBlur={false}
                      onSubmit={signInWithEmail}
                    >
                      {({ isSubmitting, isValid, values, resetForm }) => (
                        <Form className="mt-4">
                          <Input
                            name="email"
                            type="email"
                            placeholder="deviouslab@gmail.com"
                            disabled={disabled}
                            spellCheck={false}
                          />

                          <button
                            type="submit"
                            disabled={disabled || !isValid}
                            className="mt-6 w-full bg-blue-600 text-white py-2 px-8 rounded-md focus:outline-none focus:ring-4 focus:ring-blue-600 focus:ring-opacity-50 hover:bg-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
                          >
                            {isSubmitting
                              ? 'Loading...'
                              : `Sign ${showSignIn ? 'in' : 'up'}`}
                          </button>

                          <p className="mt-2 text-center text-sm text-gray-500">
                            {showSignIn ? (
                              <>
                                Don&apos;t have an account yet?{' '}
                                <button
                                  type="button"
                                  disabled={disabled}
                                  onClick={() => {
                                    setShowSignIn(false);
                                    resetForm();
                                  }}
                                  className="underline underline-offset-1 font-semibold text-blue-500 hover:text-blue-600 disabled:hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Sign up
                                </button>
                                .
                              </>
                            ) : (
                              <>
                                Already have an account?{' '}
                                <button
                                  type="button"
                                  disabled={disabled}
                                  onClick={() => {
                                    setShowSignIn(true);
                                    resetForm();
                                  }}
                                  className="underline underline-offset-1 font-semibold text-blue-500 hover:text-blue-600 disabled:hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Log in
                                </button>
                                .
                              </>
                            )}
                          </p>

                          <Confirm
                            show={showConfirm}
                            email={values?.email ?? ''}
                          />
                        </Form>
                      )}
                    </Formik>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

AuthModal.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
};

export default AuthModal;
