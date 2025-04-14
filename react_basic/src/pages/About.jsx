import { useEffect, useState, useContext, useRef } from 'react';
import { PageWrapperContext, NotificationContext } from './PageWrapper.jsx';
import PostList from '../components/PostList.jsx';
import Loader from '../components/Loader.jsx';
import postService from '../services/postService.js';
import '../styles/About.css';
import windowUtils from '../services/windowUtils.js';

const INTERVAL = 3000;

function About() {
  const { user } = useContext(PageWrapperContext);
  const { setErrorMsg } = useContext(NotificationContext);

  const [response, setResponse] = useState({
    pages: null,
    data: null,
    error: null,
    isInProgress: false,
    isDone: false,
  });

  const [postList, setPostList] = useState([]);

  const nextBtnRef = useRef();
  const interval = useRef();

  useEffect(() => {
    postService.getPosts({ sort: 'views', order: 'desc' }, 1, 3, setResponse);

    return () => {
      clearInterval(interval.current);
    };
  }, []);

  useEffect(() => {
    if (response.isDone) {
      if (response.error) {
        setErrorMsg('Error loading posts');
      } else if (response.data) {
        setPostList(response.data);
      }
    }

    if (response.isInProgress) {
      windowUtils.toggleWindowScroll(false);
    } else {
      windowUtils.toggleWindowScroll(true);
    }
  }, [response]);

  useEffect(() => {
    if (postList.length > 1) {
      interval.current = setInterval(intervalFunc, INTERVAL);
    }
  }, [postList]);

  function intervalFunc() {
    nextBtnRef.current.click();
  }

  function handleButtonClick(e) {
    if (e.clientX && e.clientY) {
      if (interval.current) {
        clearInterval(interval.current);
      }

      interval.current = setInterval(intervalFunc, INTERVAL);
    }

    const btn = e.currentTarget;
    const isNextBtn = btn.classList.contains('next');

    const postList = btn.parentElement.querySelector('.post-list');
    const posts = [...postList.children];

    const activePost = postList.firstElementChild;
    const targetPost = isNextBtn
      ? activePost.nextElementSibling
      : postList.lastElementChild;

    if (isNextBtn) {
      posts.forEach((post) => post.classList.add('move-left'));
    } else {
      postList.prepend(targetPost);
      posts.forEach((post) => post.classList.add('move-right'));
    }

    targetPost.onanimationend = handleAnimationEnd;

    function handleAnimationEnd() {
      posts.forEach((post) => {
        post.classList.remove('move-right');
        post.classList.remove('move-left');
      });

      if (isNextBtn) {
        postList.append(activePost);
        postList.prepend(targetPost);
      }

      targetPost.onanimationend = null;
    }
  }

  return (
    <div className="about-page">
      {response.isInProgress && (
        <Loader
          text="Loading"
          background={true}
          vpFixedContent={true}
          spinner={1}
        />
      )}

      <div className="about-wrapper">
        <div className="title">{'About ' + (user?.email ?? '')}</div>
        <div className="text">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro
          possimus expedita suscipit illum at consectetur facilis facere
          doloremque similique id? Vero, vel iste provident impedit quod
          doloribus sunt commodi? Similique dolorem quasi vitae odit autem vel
          earum consequuntur repellendus tempore ipsum sapiente cumque obcaecati
          laborum voluptatibus culpa, eveniet, voluptatem provident debitis
          blanditiis fugit nobis illum? Perspiciatis, at dignissimos voluptas
          earum delectus numquam eum et ex iusto nulla expedita natus ipsa
          necessitatibus iure fugiat veritatis sapiente beatae rem voluptate
          deserunt adipisci facere assumenda? Odio nobis, minima optio eligendi
          vero dignissimos eos deleniti nesciunt earum a perspiciatis ducimus
          recusandae, id quo beatae?
        </div>
      </div>

      {postList.length > 0 && (
        <div className="about-top-posts">
          <div className="title">
            {postList.length === 1
              ? 'Most populat post'
              : `Top ${postList.length} popular posts`}
          </div>
          <div className={`content${postList.length > 1 ? ' slider' : ''}`}>
            <button
              type="button"
              className="material-symbols-outlined btn prev"
              onClick={handleButtonClick}
            >
              arrow_back_2
            </button>
            <PostList posts={postList} />
            <button
              ref={nextBtnRef}
              type="button"
              className="material-symbols-outlined btn next"
              onClick={handleButtonClick}
            >
              play_arrow
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default About;
