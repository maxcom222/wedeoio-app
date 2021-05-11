import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { CgSpinner } from 'react-icons/cg';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from 'config/firebase';
import { setUser } from 'redux/slices/authSlice';

const withAuth: any = (Page: any) => {
  const Auth = (props) => {
    const { replace } = useRouter();
    const dispatch: any = useDispatch();
    const user = useSelector((state: any) => state.auth.user);

    useEffect(() => {
      let flagIsPageLoaded = false;
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user?.uid) {
          console.log('auth state logged in');
          await dispatch(setUser(user));
          flagIsPageLoaded = true;
        } else {
          console.log('auth state logged out');
          if (!flagIsPageLoaded) {
            replace('/login');
          }
        }
      });

      return () => unsubscribe();
    }, []);

    return user ? (
      <Page {...props} />
    ) : (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <CgSpinner size={30} className="animate-spin" />
      </div>
    );
  };

  return Auth;
};

export default withAuth;
