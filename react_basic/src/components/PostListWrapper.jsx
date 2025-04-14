import { useState, useEffect, useMemo, useRef, useContext } from 'react';
import { NotificationContext } from '../pages/PageWrapper.jsx';
import PostList from './PostList.jsx';
import Loader from '../components/Loader.jsx';
import postService from '../services/postService.js';
import windowUtils from '../services/windowUtils.js';

import '../styles/PostListWrapper.css';

function PostListWrapper({ searchParams }) {
  const { setErrorMsg } = useContext(NotificationContext);

  const [page, setPage] = useState(1);
  const [postList, setPostList] = useState([]);
  const [lastPost, setLastPost] = useState();

  const [response, setResponse] = useState({
    pages: null,
    data: null,
    error: null,
    isInProgress: false,
    isDone: false,
  });

  const prevSearchParams = useRef(searchParams);
  const prevObserver = useRef();

  const intersectionObserver = useMemo(() => {
    prevObserver.current?.disconnect();

    if (!lastPost) {
      return null;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((curr) => response?.pages?.next ?? curr);

          observer.disconnect();
        }
      },
      { threshold: 0.9 },
    );

    prevObserver.current = observer;
    return observer;
  }, [lastPost]);

  useEffect(() => {
    return () => {
      intersectionObserver?.disconnect();
      prevObserver.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (prevSearchParams.current !== searchParams) {
      prevSearchParams.current = searchParams;
      setPage(page === 0 ? 1 : 0);
    }
  }, [searchParams]);

  useEffect(() => {
    if (intersectionObserver && lastPost) {
      intersectionObserver.observe(lastPost);
    }
  }, [intersectionObserver]);

  useEffect(() => {
    postService.getPosts(searchParams, page, 5, setResponse);
  }, [page]);

  useEffect(() => {
    if (response.isInProgress) {
      windowUtils.toggleWindowScroll(false);
    } else if (response.isDone) {
      windowUtils.toggleWindowScroll(true);
    }

    if (response.isDone && response.data) {
      if (page <= 1) {
        setPostList(response.data);
      } else {
        setPostList((curr) =>
          [...curr, ...response.data].filter(
            (val, idx, arr) => arr.findIndex((v) => v.id === val.id) === idx,
          ),
        );
      }
    }
  }, [response]);

  useEffect(() => {
    if (response.isInProgress && page > 1) {
      windowUtils.scrollDown();
    }

    if (response.isDone && response.error) {
      setErrorMsg('Error loading posts!');
    }
  }, [response, page]);
  return (
    <>
      {postList.length > 0 && (
        <PostList shouldUpdate={true} posts={postList} ref={setLastPost} />
      )}

      {response.isInProgress && (
        <Loader
          background={page <= 1}
          vpFixedContent={page <= 1}
          text="Loading"
          spinner={1}
        />
      )}

      {response.isDone && response.data && postList.length === 0 && (
        <div className="posts-not-found-msg">Posts were not found.</div>
      )}
    </>
  );
}

export default PostListWrapper;
