import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageWrapperSkeleton from './pages/PageWrapperSkeleton.jsx';
import BlogSkeleton from './pages/BlogSkeleton.jsx';
import AboutSkeleton from './pages/AboutSkeleton.jsx';
import NewPostSkeleton from './pages/NewPostSkeleton.jsx';
import FavoritesSkeleton from './pages/FavoritesSkeleton.jsx';
import LoginSkeleton from './pages/LoginSkeleton.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import ErrorMsg from './components/ErrorMsg.jsx';
import Billy from './pages/Billy.jsx';
import './App.css';

const PageWrapper = lazy(() => import('./pages/PageWrapper.jsx'));
const Blog = lazy(() => import('./pages/Blog.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Favorites = lazy(() => import('./pages/Favorites.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const NewPost = lazy(() => import('./pages/NewPost.jsx'));
const NoPage = lazy(() => import('./pages/NoPage.jsx'));

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/billy" element={<Billy />} />

        <Route
          path="/"
          element={
            <Suspense fallback={<PageWrapperSkeleton />}>
              <ErrorBoundary fallback={<ErrorMsg />}>
                <PageWrapper />
              </ErrorBoundary>
            </Suspense>
          }
        >
          <Route
            index
            element={
              <Suspense fallback={<BlogSkeleton />}>
                <Blog />
              </Suspense>
            }
          />
          <Route
            path="blog"
            element={
              <Suspense fallback={<BlogSkeleton />}>
                <Blog />
              </Suspense>
            }
          />
          <Route
            path="about"
            element={
              <Suspense fallback={<AboutSkeleton />}>
                <About />
              </Suspense>
            }
          />
          <Route
            path="favorites"
            element={
              <Suspense fallback={<FavoritesSkeleton />}>
                <Favorites />
              </Suspense>
            }
          />
          <Route
            path="new-post"
            element={
              <Suspense fallback={<NewPostSkeleton />}>
                <NewPost />
              </Suspense>
            }
          />
          <Route
            path="login"
            element={
              <Suspense fallback={<LoginSkeleton />}>
                <Login key={1} isLogin={true} />
              </Suspense>
            }
          />
          <Route
            path="signup"
            element={
              <Suspense fallback={<LoginSkeleton />}>
                <Login key={2} isLogin={false} />
              </Suspense>
            }
          />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
