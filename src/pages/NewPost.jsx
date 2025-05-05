import { useRef, useState, useContext, useEffect } from 'react';
import { NotificationContext } from '../pages/PageWrapper.jsx';
import Loader from '../components/Loader.jsx';
import validationService from '../services/validationService.js';
import postService from '../services/postService.js';
import windowUtils from '../services/windowUtils.js';
import '../styles/NewPost.css';

function NewPost() {
  const { setErrorMsg, setSuccessMsg } = useContext(NotificationContext);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const newPostFormRef = useRef();

  useEffect(() => {
    windowUtils.toggleWindowScroll(!isLoading);
  }, [isLoading]);

  function setTextareaHeight(e) {
    const textarea = e.currentTarget;

    const borderWidth = parseFloat(
      getComputedStyle(textarea).getPropertyValue('border-width'),
    );

    textarea.style.height = '';
    textarea.style.height = textarea.scrollHeight + borderWidth * 2 + 'px';
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    setIsLoading(true);

    try {
      await validationService.validateNewPostForm(
        newPostFormRef.current,
        setErrors,
      );
    } catch {
      setErrorMsg('Error validating new post form!');
      return;
    } finally {
      setIsLoading(false);
    }

    if (!newPostFormRef.current.checkValidity()) return;

    setIsLoading(true);

    try {
      const post = {
        title: newPostFormRef.current['post-title'].value,
        text: newPostFormRef.current['post-text'].value,
        statistics: {
          likes: 0,
          dislikes: 0,
          views: 0,
        },
      };

      const createdPost = await postService.createPost(post);

      validationService.resetFormErrors(newPostFormRef.current, setErrors);
      newPostFormRef.current['post-title'].value = '';
      newPostFormRef.current['post-text'].value = '';

      setSuccessMsg(
        `You've successfully created post with id ${createdPost.id}!`,
      );
    } catch {
      setErrorMsg('Error creating new post!');
      return;
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="new-post-page">
      {isLoading && (
        <Loader
          text="Creating new post"
          spinner={1}
          background={true}
          vpFixedContent={true}
        />
      )}

      <div className="new-post-wrapper">
        <div className="new-post-title">Create New Post</div>
        <form
          ref={newPostFormRef}
          className="new-post-form"
          noValidate
          onSubmit={handleFormSubmit}
        >
          <div className="new-post-fields">
            <div className="new-post-field">
              <label htmlFor="post-title">Post Title</label>
              <input
                placeholder="Title"
                type="text"
                id="post-title"
                name="post-title"
                required
                minLength="5"
                maxLength="100"
              />
              {errors['post-title'] && (
                <div className="err">{errors['post-title']}</div>
              )}
            </div>
            <div className="new-post-field">
              <label htmlFor="post-text">Post Text</label>
              <textarea
                placeholder="Text"
                id="post-text"
                name="post-text"
                required
                minLength="10"
                maxLength="700"
                onInput={setTextareaHeight}
              />
              {errors['post-text'] && (
                <div className="err">{errors['post-text']}</div>
              )}
            </div>
          </div>
          <button type="submit">Create</button>
        </form>
      </div>
    </section>
  );
}

export default NewPost;
