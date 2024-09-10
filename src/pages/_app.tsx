import { ReactElement, ReactNode } from 'react';

// scroll bar
import 'simplebar/src/simplebar.css';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';

// apex-chart
import 'styles/apex-chart.css';
import 'styles/react-table.css';

// next
import { NextPage } from 'next';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';

// third party
import { Provider as ReduxProvider } from 'react-redux';

// project import
import Locales from 'components/Locales';
import ScrollTop from 'components/ScrollTop';
import RTLLayout from 'components/RTLLayout';
import Snackbar from 'components/@extended/Snackbar';
import { ConfigProvider } from 'contexts/ConfigContext';
import { store } from 'store';
import ThemeCustomization from 'themes';
import Notistack from 'components/third-party/Notistack';
import { Session } from 'next-auth';

// types
type LayoutProps = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

// Define a default session (mock data)
const defaultSession: Session = {
  user: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    image: '/assets/images/users/avatar-1.png'
  },
  expires: '2024-12-31T23:59:59.999Z',
  id: 'user-id-123', // Mock user id
  provider: 'mock-provider', // Mock provider
  tocken: 'mock-token-xyz' // Mock token
};

interface Props {
  Component: LayoutProps;
  pageProps: any;
}

export default function App({ Component, pageProps }: AppProps & Props) {
  const getLayout = Component.getLayout ?? ((page: any) => page);

  const session = defaultSession;

  return (
    <ReduxProvider store={store}>
      <ConfigProvider>
        <ThemeCustomization>
          <RTLLayout>
            <Locales>
              <ScrollTop>
                <SessionProvider session={session} refetchInterval={0}>
                  <>
                    <Notistack>
                      <Snackbar />
                      {getLayout(<Component {...pageProps} />)}
                    </Notistack>
                  </>
                </SessionProvider>
              </ScrollTop>
            </Locales>
          </RTLLayout>
        </ThemeCustomization>
      </ConfigProvider>
    </ReduxProvider>
  );
}
