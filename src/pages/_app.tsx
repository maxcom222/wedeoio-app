import { AppProps } from 'next/app';

import store from 'redux/store';
import { Provider } from 'react-redux';

import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';

import { MainWrapper } from 'wrappers/MainWrapper';

import 'css/tailwind.css';
import 'css/main.css';

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <MainWrapper>
          <Component {...pageProps} />
        </MainWrapper>
      </I18nextProvider>
    </Provider>
  );
};

export default App;
