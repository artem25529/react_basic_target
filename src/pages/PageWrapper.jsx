import { createContext, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import Advert from '../components/Advert.jsx';
import NotificationManager from '../components/NotificationManager.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';
import ErrorMsg from '../components/ErrorMsg.jsx';
import themeService from '../services/themeService.js';
import localStorageService from '../services/localStorageService.js';
import urlUtils from '../utils/urlUtils.js';
import '../styles/PageWrapper.css';

const PageWrapperContext = createContext();
const NotificationContext = createContext();

function PageWrapper() {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(localStorageService.getLoggedInUser());
  const [theme, setTheme] = useState();
  const [favorites, setFavorites] = useState([]);

  const [successMsg, setSuccessMsg] = useState();
  const [successMsgMillis, setSuccessMsgMillis] = useState();
  const [successMsgCallback, setSuccessMsgCallback] = useState();

  const [errorMsg, setErrorMsg] = useState();
  const [errorMsgMillis, setErrorMsgMillis] = useState();
  const [errorMsgCallback, setErrorMsgCallback] = useState();

  const [fullscreenPopupContent, setFullscreenPopupContent] = useState();

  useEffect(() => {
    document.body.addEventListener('keydown', (e) => {
      if (e.key === 'B' && e.shiftKey && e.ctrlKey && e.altKey) {
        e.stopImmediatePropagation();

        navigate('/billy');
      }
    });
  }, []);

  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/blog');
    } else if (location.pathname === '/blog') {
      const query = localStorageService.getItemForUser(user, 'query');
      const sort = localStorageService.getItemForUser(user, 'sort');
      const order = localStorageService.getItemForUser(user, 'order');

      urlUtils.changeQuery({
        query: {
          operation: query ? 'set' : 'delete',
          value: query,
        },
        sort: {
          operation: sort ? 'set' : 'delete',
          value: sort,
        },
        order: {
          operation: order ? 'set' : 'delete',
          value: order,
        },
      });
    }
  }, [location]);

  useEffect(() => {
    localStorageService.setLoggedInUser(user);
    setTheme(themeService.getThemeForUser(user));
    setFavorites(user?.favorites ? user.favorites : []);
  }, [user]);

  useEffect(() => {
    themeService.applyTheme(user, theme);
  }, [theme]);

  const userContextObj = {
    user,
    setUser,

    theme,
    setTheme,

    favorites,
    setFavorites,
  };

  const notificationContextObj = {
    successMsg,
    setSuccessMsg,
    successMsgCallback,
    setSuccessMsgCallback,
    successMsgMillis,
    setSuccessMsgMillis,

    errorMsg,
    setErrorMsg,
    errorMsgCallback,
    setErrorMsgCallback,
    errorMsgMillis,
    setErrorMsgMillis,

    fullscreenPopupContent,
    setFullscreenPopupContent,
  };

  return (
    <PageWrapperContext.Provider value={userContextObj}>
      <NotificationContext.Provider value={notificationContextObj}>
        <NotificationManager />
        <section className="page-wrapper">
          <Header />
          <div className="page-content-wrapper">
            <Advert />
            <main className="page-main">
              <ErrorBoundary fallback={<ErrorMsg />}>
                <Outlet />
              </ErrorBoundary>
            </main>
            <Footer />
          </div>
        </section>
      </NotificationContext.Provider>
    </PageWrapperContext.Provider>
  );
}

export default PageWrapper;
export { PageWrapperContext, NotificationContext };
